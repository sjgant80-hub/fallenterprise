// Convert the 4 SoW markdown files to signable DOCX documents
// Uses docx-js · corporate letterhead styling · A4 · UK layout
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, TabStopType, TabStopPosition, PageBreak,
} = require('docx');

const SOW_DIR = path.join(__dirname, '..', 'sow');
const FILES = [
  'tier-1-starter.md',
  'tier-2-sovereign.md',
  'tier-3-trained.md',
  'tier-4-ai-native-enterprise.md',
];

const OX = '8B1A1A';
const BRASS = 'B8974A';
const INK = '222222';
const SOFT = '666666';
const HAIR = 'CCCCCC';
const PALE = 'F2EEE3';

const border = { style: BorderStyle.SINGLE, size: 4, color: HAIR };

function textRun(text, opts = {}) {
  return new TextRun({
    text,
    font: 'Georgia',
    size: opts.size || 22,
    bold: opts.bold,
    italics: opts.italic,
    color: opts.color || INK,
  });
}

function P(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    spacing: { before: opts.before || 0, after: opts.after || 100 },
    alignment: opts.align,
    heading: opts.heading,
  });
}

// tiny inline-md → runs (bold, italic only · no nested tables)
function inlineParse(text) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith('**') && p.endsWith('**')) {
      runs.push(textRun(p.slice(2, -2), { bold: true }));
    } else if (p.startsWith('_') && p.endsWith('_')) {
      runs.push(textRun(p.slice(1, -1), { italic: true }));
    } else if (p.startsWith('`') && p.endsWith('`')) {
      runs.push(new TextRun({ text: p.slice(1, -1), font: 'Consolas', size: 20, color: OX }));
    } else if (p.startsWith('[')) {
      // link · render text only, URL in gray
      const m = p.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (m) {
        runs.push(textRun(m[1], { color: OX }));
      } else {
        runs.push(textRun(p));
      }
    } else {
      runs.push(textRun(p));
    }
  }
  return runs;
}

function buildDocFromMarkdown(md, filename) {
  const lines = md.split('\n');
  const children = [];
  let inTable = false;
  let tableRows = [];
  let sepConsumed = false;

  function flushTable() {
    if (!inTable || tableRows.length === 0) return;
    const cols = tableRows[0].length;
    const rows = tableRows.map((cells, ri) => new TableRow({
      tableHeader: ri === 0,
      children: cells.map(cell => new TableCell({
        borders: { top: border, bottom: border, left: border, right: border },
        shading: ri === 0 ? { fill: PALE, type: ShadingType.CLEAR } : undefined,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: inlineParse(cell),
          spacing: { after: 20 },
        })],
      })),
    }));
    const tw = 9000;
    const cw = Array(cols).fill(Math.floor(tw / cols));
    children.push(new Table({
      width: { size: tw, type: WidthType.DXA },
      columnWidths: cw,
      rows,
    }));
    children.push(new Paragraph({ children: [new TextRun('')], spacing: { after: 100 } }));
    tableRows = [];
    inTable = false;
    sepConsumed = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // separator row like |---|---|
      if (cells.every(c => /^-+:?$/.test(c) || /^:?-+:?$/.test(c))) {
        sepConsumed = true;
        continue;
      }
      inTable = true;
      tableRows.push(cells);
      continue;
    }
    if (inTable) flushTable();

    // horizontal rule
    if (line.trim() === '---') {
      children.push(new Paragraph({
        children: [new TextRun('')],
        border: { bottom: { color: BRASS, space: 8, style: BorderStyle.SINGLE, size: 8 } },
        spacing: { before: 100, after: 200 },
      }));
      continue;
    }

    // headings
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2), font: 'Georgia', size: 32, bold: true, color: INK })],
        spacing: { before: 0, after: 200 },
      }));
      continue;
    }
    if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(3), font: 'Georgia', size: 26, bold: true, color: OX })],
        spacing: { before: 240, after: 120 },
      }));
      continue;
    }
    if (line.startsWith('### ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(4), font: 'Georgia', size: 22, bold: true, color: INK })],
        spacing: { before: 180, after: 80 },
      }));
      continue;
    }

    // bullet
    if (line.startsWith('- ')) {
      children.push(new Paragraph({
        numbering: { reference: 'sow-bullets', level: 0 },
        children: inlineParse(line.slice(2)),
        spacing: { after: 40 },
      }));
      continue;
    }

    // blank
    if (line.trim() === '') {
      children.push(new Paragraph({ children: [new TextRun('')], spacing: { after: 80 } }));
      continue;
    }

    // paragraph
    children.push(P(inlineParse(line), { after: 80 }));
  }

  if (inTable) flushTable();

  return new Document({
    creator: 'Simon Gant · AI Native Solutions',
    title: 'FallEnterprise · Statement of Work',
    description: 'Statement of Work · FallEnterprise engagement',
    styles: {
      default: { document: { run: { font: 'Georgia', size: 22 } } },
    },
    numbering: {
      config: [{
        reference: 'sow-bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 220 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },  // A4
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children,
    }],
  });
}

(async () => {
  for (const f of FILES) {
    const src = path.join(SOW_DIR, f);
    const md = fs.readFileSync(src, 'utf-8');
    const doc = buildDocFromMarkdown(md, f);
    const outPath = path.join(SOW_DIR, f.replace(/\.md$/, '.docx'));
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(outPath, buf);
    console.log(`  ✓ ${path.basename(outPath)} · ${(buf.length / 1024).toFixed(1)}KB`);
  }
})();
