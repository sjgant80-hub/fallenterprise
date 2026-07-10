# Statement of Work · FallEnterprise Tier 2 · Sovereign

**Engagement value:** TBA (fixed) · **Timeline:** 6–8 weeks · **Payment:** 40% signature · 40% mid-project · 20% delivery

**Between:**
- **Supplier:** AI Native Solutions (Simon Gant, sole practitioner) · United Kingdom
- **Client:** _________________________________ ("Client")

**Effective date:** _____________ **Contract ref:** FE-SOV-YYYY-NNN

---

## 1 · Objective

Deliver everything in Tier 1 (Starter), plus a fully self-hosted LLM stack running on the Client's own hardware or private cloud. The Client's AI will operate without any data leaving their infrastructure. No API bills, no vendor dependency on hosted LLM providers.

## 2 · Scope of work

### 2.1 · All of Tier 1 (Starter)

Everything in [Tier 1 SoW](tier-1-starter.md) §2.1–§2.5. Not repeated here.

### 2.2 · Sovereign LLM Stack Deployment (Week 4–5)

Deploy the FallEnterprise Docker stack on Client's chosen host:

- **Ollama** — open-source LLM runtime, pre-configured with Llama 3.1 8B (and 70B on eligible hardware)
- **LiteLLM** — OpenAI-compatible proxy layer
- **LLMLingua-2 compressor** — prompt compression service (2–5× shrink, accuracy preserved)
- Health monitoring, logging, and admin dashboard
- Reverse proxy (Caddy or nginx) with TLS
- Backup/restore procedures documented

**Deployment options** (Client chooses):
- On-premises server (Client-owned hardware)
- Private cloud (AWS/Azure/GCP VPC)
- Hybrid (on-prem for sensitive workloads, cloud for burst)

### 2.3 · Hardware Advisory (Week 3)

- GPU/CPU sizing recommendation based on Client's expected query volume
- Access list with UK suppliers and pricing (typical range TBA–TBA)
- Configuration guide for the chosen hardware
- Alternative: managed VPS recommendation if Client prefers rented over owned

**Hardware itself is NOT included in engagement fee** — Client procures directly or Supplier procures on Client's behalf at cost + 5% handling.

### 2.4 · Integration Adapter (Week 5)

- Point the Tier 1 operational suite at the sovereign stack
- All prompts routed through LiteLLM instead of hosted API
- Prompt compression enabled for prompts >800 tokens
- Fall-back logic: automatic degradation to hosted API if sovereign stack is down (Client's policy choice)

### 2.5 · Prompt Compression Optimization (Week 6)

- Benchmark: 20 representative prompts run through both raw and compressed paths
- Tuning: compression ratio adjusted per prompt category
- Documented cost/latency/quality trade-offs

### 2.6 · Runbooks & Operations Documentation (Week 7)

- Deployment runbook (spin up from cold)
- Backup and restore runbook
- Model update runbook (pull new Llama versions safely)
- Incident response runbook
- Capacity planning worksheet

### 2.7 · Post-delivery Support (Weeks 8 → 8+30 days)

- 30 days of email support (24h response SLA — upgraded from Tier 1)
- 4× 45-minute check-in calls
- 1 minor revision round
- Optional: on-call Slack channel for emergencies

## 3 · Deliverables checklist

| # | Deliverable | Format | Week |
|---|---|---|---|
| 1–7 | All Tier 1 deliverables | (See Tier 1 SoW) | 1–5 |
| 8 | Hardware advisory + Access list | PDF | 3 |
| 9 | Docker stack (Ollama + LiteLLM + Compressor) | Live + source | 5 |
| 10 | Integration adapter | Deployed + source | 5 |
| 11 | Prompt compression benchmark | Report + data | 6 |
| 12 | Runbook set (5 documents) | PDF + Markdown source | 7 |
| 13 | 30-day support | Email + 4 calls | 8+30 |

## 4 · Client responsibilities

In addition to Tier 1 responsibilities:

- Procure hardware (or authorize Supplier procurement at cost + handling)
- Provide network/firewall access for the sovereign stack
- Nominate an infrastructure lead who can execute Client-side deployment steps
- Allocate storage (~200GB for models + logs + backups)

## 5 · Out of scope for Tier 2

- Fine-tuning the model on Client's data (Tier 3 Trained)
- Full org rollout across all departments (Tier 4)
- 24/7 SLA (Tier 4)
- Custom hardware procurement beyond a single node/box

## 6 · Timeline

| Week | Milestone |
|---|---|
| 1–2 | Discovery + blueprint (as Tier 1) |
| 3 | Hardware advisory + sourcing |
| 3–4 | Operational suite build (as Tier 1) |
| 4–5 | Sovereign stack deployment |
| 5 | Integration adapter · UAT |
| 6 | Prompt compression tuning · benchmark |
| 7 | Runbooks · team training · playbook delivery |
| 8 | Final handover · project close-out |
| 8+30 | Support period ends |

## 7 · Payment

- **40% (TBA) · on signature.** Kick-off begins on receipt.
- **40% (TBA) · on sovereign stack deployment completion (end Week 5).**
- **20% (TBA) · on final handover (Week 8).**

Terms: 14 days. Late payment: 4% above BoE base rate. Prices exclude VAT.

## 8 · Intellectual property

Same as Tier 1 §8, plus:

- Sovereign stack containers use only MIT / Apache 2.0 / permissive-license components
- Client's fine-tuned models (if any produced under this SoW) are Client's exclusive property
- Client's inference logs remain on Client's infrastructure and are Client's property

## 9 · Data & confidentiality

Same as Tier 1 §9, upgraded:

- Post-deployment, ZERO Client business data reaches any external service
- Supplier access to Client stack requires case-by-case authorization
- Data Processing Agreement (DPA) provided as standard, not optional

## 10 · Warranties

- 60-day warranty on sovereign stack deployment (upgraded from Tier 1's 30 days)
- Warranty covers: bugs, deployment errors, documented behavior deviations
- Excludes: Client-induced changes to Docker configs, model weights, or infrastructure

## 11 · Exit & continuity

If the Supplier ceases operations, the Client retains:

- Full source (all Docker configs, Dockerfiles, runbooks, adapters)
- Local model weights (already on Client's hardware)
- Deployment can continue indefinitely without Supplier
- Any competent DevOps engineer can operate the stack from the runbooks provided

## 12 · Termination

Same as Tier 1 §12, with the addition that if terminated after Week 5 (sovereign stack live), Client keeps the stack and no fee is refunded for that portion.

## 13 · Upgrade path

If the Client upgrades to Tier 3 (Trained) within 90 days of Tier 2 delivery, the TBA Tier 2 fee is credited against the TBA Tier 3 fee (net TBA additional).

## 14 · Governing law

England & Wales.

---

## Signatures

**For the Supplier**

Signed: _______________________________  Simon Gant · AI Native Solutions  ·  Date: _______

**For the Client**

Signed: _______________________________  Print name: _______________________________
Title: _______________________________  ·  Date: _______

---

**Contract ref:** FE-SOV-YYYY-NNN  ·  **Version:** 1.0  ·  **© 2026 AI Native Solutions**
