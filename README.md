# FallEnterprise · AI-Native Transformation for SMBs

**Sovereign self-hosted LLMs · fine-tuned on your business data · prompt-compressed for modest hardware · full org rollout · MIT-licensed · owned forever.**

Live: **https://sjgant80-hub.github.io/fallenterprise/**

Four tiers between TBA and TBA. Each tier is a productised engagement with a signed SoW, defined deliverables, and a fixed timeline. You get real infrastructure you keep even if we disappear tomorrow — because it's MIT-licensed source, delivered as running code and running weights, on your hardware or your cloud.

---

## For SMB / mid-market decision-makers

Read the [landing page](https://sjgant80-hub.github.io/fallenterprise/) or download the SoW that matches your situation:

| Tier | Access | Time | For you if... |
|---|---|---|---|
| [**Starter**](sow/tier-1-starter.md) | TBA | 4-6 weeks | You want to prove AI ROI without committing to sovereign infra yet |
| [**Sovereign**](sow/tier-2-sovereign.md) | TBA | 6-8 weeks | Your data is sensitive; no data can leave your box |
| [**Trained**](sow/tier-3-trained.md) | TBA | 10-12 weeks | Your voice / process / expertise IS the product |
| [**AI-Native Enterprise**](sow/tier-4-ai-native-enterprise.md) | TBA+ | 16-20 weeks | AI is becoming operational infrastructure across your org |

Book a discovery call: [sjgant80@gmail.com](mailto:sjgant80@gmail.com) · usually reply within 24 hours.

---

## For developers / evaluators

This repo contains everything shipped in a Sovereign-tier engagement, as reference:

```
fallenterprise/
├── index.html                    ← the landing page (single HTML, MIT)
├── ai.html                       ← AI agent dossier
├── llms.txt                      ← llms.txt manifest for AI crawlers
├── docker/                       ← sovereign LLM stack
│   ├── docker-compose.yml        ← Ollama + LiteLLM + LLMLingua compressor
│   ├── litellm.config.yaml       ← model routing config
│   ├── compressor/               ← Python microservice for LLMLingua-2
│   └── README.md                 ← deployment guide
├── notebooks/                    ← fine-tuning
│   ├── lora-finetune.ipynb       ← LoRA training on Llama 3.1 8B
│   ├── data/                     ← example JSONL format
│   └── README.md                 ← training guide
├── adapters/                     ← integrations
│   ├── smbaios-adapter.js        ← drop-in claude() replacement
│   └── README.md
└── sow/                          ← 4 Statement of Work templates
    ├── tier-1-starter.{md,docx}
    ├── tier-2-sovereign.{md,docx}
    ├── tier-3-trained.{md,docx}
    └── tier-4-ai-native-enterprise.{md,docx}
```

## Quick starts

### Deploy the sovereign stack

```bash
cd docker/
cp .env.example .env
# edit .env · set LITELLM_MASTER_KEY to a random hex string
docker compose up -d
docker compose logs -f ollama_bootstrap   # watch model download
```

Then hit `http://localhost:4000/v1/chat/completions` with OpenAI-shape requests.

### Fine-tune on your business data

1. Prepare `notebooks/data/train.jsonl` and `eval.jsonl` (~500-50k examples in chat-message format)
2. Open `notebooks/lora-finetune.ipynb` on a GPU box
3. Edit config in Cell 2 (set your business slug, data paths)
4. Run all cells — outputs a merged GGUF for Ollama

### Point smbaios at your sovereign stack

Copy `adapters/smbaios-adapter.js` into your smbaios instance, replace the `claude()` function. Set `FE_URL`, `FE_KEY`, `FE_MODEL` in the host page. Done.

## What makes this "sovereign"

Every deliverable is:

- **MIT-licensed** — you own the code, forever, no matter what
- **Single-container-deployable** — no external services required at runtime
- **On-box weights** — the model is a file on your hardware
- **No telemetry** — nothing phones home
- **Documented for handover** — any competent engineer can operate it from the runbooks
- **Reversible** — you can revert to a hosted LLM at any time by changing one URL

## Design philosophy

The FallEnterprise pattern is built on three principles refined across the [ai-nativesolutions.com](https://www.ai-nativesolutions.com/) estate (150+ live tools):

1. **Sovereignty is structural, not marketing** — "free from SaaS" means MIT + on-box + install-forever, not "TBAnth"
2. **Single practitioner delivery** — no layered agency, no juniors. Simon Gant delivers every engagement personally.
3. **Every layer is optional but coherent** — you can start at Starter and stop, or graduate to any tier with fee-credit

## Related repos

- **[smbaios](https://github.com/sjgant80-hub/smbaios)** — SMB AI Operations platform (the ops layer this seed integrates with)
- **[wishwood](https://sjgant80-hub.github.io/wishwood/)** — live case study of the pattern applied to a hospitality operator
- **[ai-nativesolutions.com](https://www.ai-nativesolutions.com/)** — the parent estate marketplace

## License

MIT · © 2026 AI Native Solutions · Simon Gant

**◊·κ=1**
