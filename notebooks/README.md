# FallEnterprise · Fine-Tuning Notebooks

Notebook: `lora-finetune.ipynb`

## What it does

Train Llama 3.1 8B on your business data using LoRA (Low-Rank Adaptation).
Output: a merged model in GGUF format ready to load into Ollama.

## Requirements

| | |
|---|---|
| GPU | ≥16GB VRAM (A100 40GB / A6000 48GB / RTX 4090 24GB) |
| Disk | 50GB free |
| HF account | Llama 3.1 access granted (approve on HF model page) |
| Env | Python 3.11 · CUDA 12.1+ · Jupyter |

## Data format

`data/train.jsonl` and `data/eval.jsonl` — one JSON object per line:

```json
{"messages": [
  {"role": "system",    "content": "You are the customer service AI for <BUSINESS>."},
  {"role": "user",      "content": "<past customer question>"},
  {"role": "assistant", "content": "<your best actual response>"}
]}
```

**Split:** ~85% train · ~15% eval.

## Data quantity vs quality

| Examples | Result |
|---|---|
| 500 | Model learns your tone |
| 5,000 | Model learns your process |
| 50,000 | Model learns your business |

Quality > quantity. 500 excellent examples beat 5,000 mediocre ones.

## Runtime

| GPU | 10k examples · 3 epochs |
|---|---|
| RTX 4090 24GB | ~4 hours |
| A100 40GB | ~2 hours |
| A6000 48GB | ~2.5 hours |

## Where to source training data

- Past customer emails (curate: pick the ones where you responded well)
- Sales call transcripts (annotate: what worked, what didn't)
- Support ticket resolutions
- Internal SOPs converted to Q&A format
- FAQ docs
- Written playbooks and onboarding materials

## After training

The notebook writes a `Modelfile` in the last cell. Load into Ollama:

```bash
docker exec fe_ollama ollama create fe-yourbiz -f /path/Modelfile
```

Then update `docker/litellm.config.yaml` to expose it as an endpoint.

## Retraining cadence

Recommended: quarterly, using the last 3 months of accumulated conversations
as new training data. Trained tier engagement includes 1 retraining.
