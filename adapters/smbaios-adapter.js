// FallEnterprise · smbaios integration adapter
// ─────────────────────────────────────────────────────────────────
// Drop-in replacement for the `claude()` function in smb_ai_os.jsx
// (see: https://github.com/sjgant80-hub/smbaios/blob/main/smb_ai_os.jsx)
//
// Swap ONE function, gain sovereignty. Everything else stays.
//
// Before (smbaios/smb_ai_os.jsx line ~14):
//   async function claude(messages, system, maxTokens = 700) {
//     const res = await fetch("https://api.anthropic.com/v1/messages", ...);
//   }
//
// After: import { llm as claude } from './fallenterprise-adapter.js';
// (or edit the smbaios source and paste the llm() body directly)
//
// The adapter presents the SAME contract as smbaios's claude():
//   input:  (messages, system, maxTokens?)
//   output: string (concatenated assistant reply)
// ─────────────────────────────────────────────────────────────────

// ─── Config · edit for your deployment ────────────────────────────
const FE_CONFIG = {
  // LiteLLM proxy URL · use loopback for on-box, or your reverse-proxied URL
  url: window.FE_URL || 'http://localhost:4000/v1/chat/completions',

  // Master key you set in docker/.env (LITELLM_MASTER_KEY)
  key: window.FE_KEY || 'sk-fallenterprise-change-me',

  // Which model to route to · matches a `model_name` in litellm.config.yaml
  // Options: 'fe-primary' (base Llama 3.1) · 'fe-yourbiz' (your fine-tune)
  model: window.FE_MODEL || 'fe-primary',

  // Prompt compressor (optional · set to null to disable)
  compressorUrl: window.FE_COMPRESSOR_URL || 'http://localhost:8080/compress',
  compressRatio: 0.5,           // keep 50% of tokens after compression
  compressAboveTokens: 800,     // only compress prompts longer than this
};

// ─── Optional prompt compression via LLMLingua-2 ──────────────────
async function maybeCompress(text) {
  if (!FE_CONFIG.compressorUrl) return text;
  const approxTokens = Math.ceil(text.length / 4);
  if (approxTokens < FE_CONFIG.compressAboveTokens) return text;
  try {
    const r = await fetch(FE_CONFIG.compressorUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, ratio: FE_CONFIG.compressRatio }),
    });
    if (!r.ok) return text;
    const j = await r.json();
    return j.compressed_prompt || text;
  } catch (e) {
    console.warn('[fallenterprise] compressor unavailable, sending uncompressed', e);
    return text;
  }
}

// ─── Drop-in replacement for smbaios claude() ─────────────────────
export async function llm(messages, system, maxTokens = 700) {
  // Optionally compress a very long system prompt (typical for smbaios buildBotPrompt)
  const compressedSystem = system ? await maybeCompress(system) : system;

  const body = {
    model: FE_CONFIG.model,
    messages: [
      ...(compressedSystem ? [{ role: 'system', content: compressedSystem }] : []),
      ...messages,
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
    stream: false,
  };

  const res = await fetch(FE_CONFIG.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FE_CONFIG.key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`FallEnterprise LLM error [${res.status}]: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  // LiteLLM returns OpenAI-shape · content is at choices[0].message.content
  return data.choices?.[0]?.message?.content ?? '';
}

// ─── Streaming variant (for chat UIs) ─────────────────────────────
export async function* llmStream(messages, system, maxTokens = 700) {
  const compressedSystem = system ? await maybeCompress(system) : system;

  const body = {
    model: FE_CONFIG.model,
    messages: [
      ...(compressedSystem ? [{ role: 'system', content: compressedSystem }] : []),
      ...messages,
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
    stream: true,
  };

  const res = await fetch(FE_CONFIG.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FE_CONFIG.key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    throw new Error(`FallEnterprise LLM stream error [${res.status}]`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return;
      try {
        const chunk = JSON.parse(payload);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch { /* incomplete json chunk */ }
    }
  }
}

// ─── Health check · call on smbaios boot to verify sovereign stack ─
export async function health() {
  const checks = { litellm: false, ollama: false, compressor: false };
  try {
    const r = await fetch(FE_CONFIG.url.replace('/v1/chat/completions', '/health/liveliness'));
    checks.litellm = r.ok;
  } catch {}
  try {
    const r = await fetch(FE_CONFIG.url.replace(/:4000.*/, ':11434/api/tags'));
    checks.ollama = r.ok;
  } catch {}
  if (FE_CONFIG.compressorUrl) {
    try {
      const r = await fetch(FE_CONFIG.compressorUrl.replace('/compress', '/health'));
      checks.compressor = r.ok;
    } catch {}
  }
  return checks;
}

// ─── Convenience export matching smbaios's `claude` symbol ────────
export { llm as claude };
