# FallEnterprise · Integration Adapters

## `smbaios-adapter.js` · drop-in for smbaios

Swaps the `claude()` function in smbaios (`smb_ai_os.jsx`) with a call
to your on-box LiteLLM proxy. One line of change gives you sovereignty.

### Usage

**Option A · ES module import** (recommended for the React artifact version)

```javascript
import { llm as claude } from './smbaios-adapter.js';
// then delete the original claude() function definition
// all downstream code (buildBotPrompt, etc.) continues to work
```

**Option B · inline replacement** (edit smb_ai_os.jsx directly)

Find this in `smb_ai_os.jsx` (line ~14):

```javascript
async function claude(messages, system, maxTokens = 700) {
  const res = await fetch("https://api.anthropic.com/v1/messages", { ... });
  ...
}
```

Replace the entire body with a call to your LiteLLM proxy — copy the `llm()` implementation
from `smbaios-adapter.js`.

### Config

Set these globals BEFORE loading smbaios (in your host page):

```javascript
window.FE_URL   = "http://localhost:4000/v1/chat/completions";
window.FE_KEY   = "sk-yourrandomhex";        // matches LITELLM_MASTER_KEY in docker/.env
window.FE_MODEL = "fe-yourbiz";              // or "fe-primary" for base Llama
window.FE_COMPRESSOR_URL = "http://localhost:8080/compress";  // set to null to disable
```

### Health check

```javascript
import { health } from './smbaios-adapter.js';
const state = await health();
// { litellm: true, ollama: true, compressor: true }
```

Call on smbaios boot. If any check fails, fall back gracefully to a "sovereign stack offline"
message or auto-switch to a hosted fallback (up to your policy).

### What you gain

| Before adapter | After adapter |
|---|---|
| Every prompt sent to Anthropic | Every prompt stays on your box |
| Per-token API cost | Fixed monthly hardware cost |
| Latency: 500-2000ms | Latency: 50-500ms (depending on GPU) |
| Data governance = trust | Data governance = mathematical (no wire) |
| Vendor lock-in | MIT + your weights |

### What breaks

Nothing. The adapter preserves the exact function signature.

If you need to switch back mid-flight (e.g. sovereign stack down, hosted fallback), keep both
imports and swap by feature flag.
