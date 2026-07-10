# FallEnterprise · Sovereign LLM Stack

One-command deployment of your own AI infrastructure. No API calls leave the box.

## Quickstart

```bash
cd docker/
export LITELLM_MASTER_KEY=$(openssl rand -hex 32)
docker compose up -d
docker compose logs -f ollama_bootstrap    # watch model download
```

After ~5-10 min (depending on connection speed for the first model pull):

```bash
# health checks
curl http://localhost:11434/api/tags                       # Ollama
curl http://localhost:4000/health/liveliness               # LiteLLM
curl http://localhost:8080/health                          # Compressor

# smoke test the LiteLLM OpenAI-compatible endpoint
curl http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"fe-primary","messages":[{"role":"user","content":"Hello"}]}'

# smoke test the compressor
curl http://localhost:8080/compress \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Your long prompt here...","ratio":0.5}'
```

## What you get

| Service | Port (loopback) | Purpose |
|---|---|---|
| `ollama` | 11434 | LLM runtime · Llama 3.1 8B + nomic-embed-text pre-pulled |
| `litellm` | 4000 | OpenAI-compatible proxy · drop-in for any code using OpenAI SDK |
| `compressor` | 8080 | LLMLingua-2 prompt compression · 2-5× shrink at same accuracy |

All services bind to `127.0.0.1` — expose externally only via a reverse proxy with auth.

## Hardware guidance

| Setup | Llama 3.1 8B | 70B | Compressor |
|---|---|---|---|
| CPU-only (16 vCPU · 32GB RAM) | ~8 tok/s · usable for internal ops | Too slow | Fine, CPU-bound |
| GPU RTX 4060 Ti 16GB (~TBA) | ~60 tok/s · production-grade | No | Fine |
| GPU RTX 3090 24GB (~TBA used) | ~85 tok/s | Not really | Fine |
| GPU 2×A100 40GB (~TBAk) | Trivial | ~40 tok/s | Fine |

For GPU support: install `nvidia-container-toolkit` on the host and uncomment the `deploy.resources` block in `docker-compose.yml`.

## Adding your fine-tuned model

After running `notebooks/lora-finetune.ipynb`:

1. Export the LoRA-merged model to GGUF format (notebook has the export cell)
2. Copy the GGUF file to a folder on this host
3. Create an Ollama model:
   ```bash
   docker exec fe_ollama ollama create fe-yourbiz -f /path/Modelfile
   ```
4. Add its entry to `litellm.config.yaml`:
   ```yaml
   - model_name: fe-yourbiz
     litellm_params:
       model: ollama/fe-yourbiz:latest
       api_base: http://ollama:11434
   ```
5. `docker compose restart litellm`

## Integration with smbaios / any OpenAI-SDK client

Point your smbaios instance at the LiteLLM URL. Use `adapters/smbaios-adapter.js` (drop-in replacement for the `claude()` function).

```javascript
const FE_URL   = "http://localhost:4000/v1/chat/completions";
const FE_KEY   = "<your LITELLM_MASTER_KEY>";
const FE_MODEL = "fe-yourbiz";     // or fe-primary
```

## Sovereignty checklist

- ✅ Runs on your host, your VPC, or your on-prem
- ✅ No telemetry (LiteLLM `telemetry: false` set in config)
- ✅ Master key is your own random string, not shared
- ✅ Loopback-only ports by default
- ✅ All model weights local (Ollama volume)
- ✅ Prompt compression local (compressor container)
- ✅ MIT licence · no vendor lock-in

## Backup

The stack's state lives in two named volumes:
- `ollama_models` (LLM weights + your fine-tuned variants)
- `litellm_config` (spend logs)

```bash
docker run --rm -v ollama_models:/data -v $(pwd):/backup alpine \
  tar czf /backup/ollama-backup-$(date +%F).tar.gz -C /data .
```

Restore = reverse. Migration between hosts = tar the volumes, scp, untar.

## Uninstall

```bash
docker compose down -v          # -v also removes named volumes (model weights)
```
