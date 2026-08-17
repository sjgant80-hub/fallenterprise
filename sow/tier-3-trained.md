# Statement of Work · FallEnterprise Tier 3 · Trained

**Engagement value:** £100,000 (fixed) · **Timeline:** 10–12 weeks · **Payment:** 30% signature · 40% mid · 30% delivery

**Between:**
- **Supplier:** AI Native Solutions (Simon Gant, sole practitioner) · United Kingdom
- **Client:** _________________________________ ("Client")

**Effective date:** _____________ **Contract ref:** FE-TRN-YYYY-NNN

---

## 1 · Objective

Deliver everything in Tier 2 (Sovereign), plus a fully fine-tuned language model trained on the Client's own business data. The AI stops sounding like a generic assistant and starts sounding like the Client's best operators. Includes eval harness, retraining pipeline, and data governance framework.

## 2 · Scope of work

### 2.1 · All of Tier 1 (Starter) + Tier 2 (Sovereign)

Everything in [Tier 1 SoW](tier-1-starter.md) and [Tier 2 SoW](tier-2-sovereign.md). Not repeated.

### 2.2 · Training Data Curation (Week 4–6)

- **Data audit** — inventory what conversational/textual data the Client has
- **Sourcing** — identify best sources: emails, transcripts, tickets, SOPs, playbooks
- **Cleaning** — remove PII, standardize format, resolve inconsistencies
- **Formatting** — convert to standard chat format (`messages: [system, user, assistant]`)
- **Quality gating** — human review of a sample; exclude weak examples
- **Split** — 85% train / 15% eval, stratified by category

Target volume:
- Minimum: 500 high-quality examples
- Recommended: 5,000–10,000 examples
- Ideal: 20,000+ examples

**Client must have at least 500 usable examples.** If corpus is thinner, Supplier provides guidance on synthetic augmentation (adds ~£8,000 to scope).

### 2.3 · Base Model Selection & Fine-Tune (Week 6–8)

- **Base model:** Llama 3.1 8B (default) or 70B (if Client hardware supports it)
- **Method:** LoRA (Low-Rank Adaptation) — trainable, exportable, reversible
- **Configuration:** rank/alpha tuned to Client's data volume
- **Training run:** on GPU hardware (Supplier's cluster OR Client's if provided)
- **Iterations:** minimum 2 training runs, more if metrics not met

### 2.4 · Business-Specific Eval Harness (Week 8–9)

- **Held-out eval set** — 15% of Client's data never seen during training
- **LLM-as-judge** — automated quality scoring on 5–8 dimensions (accuracy, tone, compliance, brevity, action-completeness, empathy, precision, brand voice)
- **Human review protocol** — 50-sample random review by Client team
- **Regression testing** — compare fine-tuned model to base Llama on 20 tasks
- **Publication:** eval report with per-dimension scores + confidence intervals

**Ship criterion:** fine-tuned model beats base model on ≥3 of 5 core dimensions and is not worse on any dimension.

### 2.5 · Model Deployment (Week 9)

- Merge LoRA into base weights
- Export to GGUF format (Q4_K_M quantization)
- Load into Client's Ollama instance
- Add LiteLLM config entry for the new model
- Update integration adapter to route to fine-tuned model

### 2.6 · Retraining Pipeline (Week 10)

- Automated data collection: new conversations flow into a retraining pool
- Quarterly retraining playbook: how to select, clean, and add new data
- One retraining run included at Month 3 (using accumulated data)
- Supplier provides retraining service beyond this at £8,000/run

### 2.7 · Data Governance Framework (Week 10)

- Data lineage: every training example logged with source
- Sensitivity classifier: PII / secrets / medical / financial auto-flagged
- Audit trail: who added what to the training set, when
- GDPR right-to-erasure: procedure to remove an individual's data from the training corpus
- ICO-compliant record of processing activities (ROPA) drafted

### 2.8 · Extended Support (Week 12 → 12+60 days)

- 60 days of email support (24h response)
- 6× 45-minute check-in calls
- 1 retraining run at Month 3
- Slack channel with 8h response during UK business hours

## 3 · Deliverables checklist

| # | Deliverable | Format | Week |
|---|---|---|---|
| 1–13 | All Tier 1 + Tier 2 deliverables | (see above SoWs) | 1–8 |
| 14 | Training data corpus (curated) | JSONL + inventory | 6 |
| 15 | Fine-tuned model | GGUF · loaded into Ollama | 9 |
| 16 | Eval harness | Scripts + report | 9 |
| 17 | Retraining pipeline | Runbook + automation scripts | 10 |
| 18 | Data governance framework | PDF + ROPA template | 10 |
| 19 | Extended support | Email + 6 calls + 1 retrain | 12+60 |

## 4 · Client responsibilities

In addition to Tier 1 & 2:

- Provide access to training data sources (emails, docs, transcripts, tickets)
- Nominate a data steward for governance sign-off
- Human review of 50 eval samples during Week 8–9
- Confirm ship-criterion met before Week 9 deployment
- Ongoing: contribute to quarterly retraining data pool

## 5 · Out of scope for Tier 3

- Full org rollout beyond training-team stakeholders (Tier 4)
- 24/7 SLA (Tier 4)
- Custodianship / managed operation (Tier 4)
- Multi-site deployment (Tier 4)
- More than one fine-tuning during initial engagement

## 6 · Timeline

| Week | Milestone |
|---|---|
| 1–2 | Discovery + blueprint (Tier 1) |
| 3–5 | Ops suite + sovereign stack (Tier 2) |
| 4–6 | Training data curation (parallel with 2.2) |
| 6–8 | Fine-tuning runs |
| 8–9 | Eval + human review |
| 9 | Model deployment |
| 10 | Retraining pipeline · data governance |
| 11 | Team training on fine-tuned system |
| 12 | Final handover |
| 12+60 | Support period ends |
| Month 3 | Included retraining run |

## 7 · Payment

- **30% (£30,000) · on signature.**
- **40% (£40,000) · on sovereign stack live (end Week 5).**
- **30% (£30,000) · on final handover (Week 12).**

Terms: 14 days. Late: 4% above BoE base. Prices exclude VAT.

## 8 · Intellectual property

Same as Tier 2, upgraded:

- **The fine-tuned model weights are the Client's exclusive property.** No shared license.
- Training data remains Client's exclusive property; Supplier deletes copies at project close
- Supplier retains no derivative rights to the fine-tuned model
- Eval harness scripts delivered MIT-licensed to Client

## 9 · Data & confidentiality

Same as Tier 2, upgraded:

- Training data processing under signed DPA
- Supplier's access to training data time-boxed (weeks 4–8)
- Post-training, Supplier deletes all copies
- Client retains model weights, training corpus, and lineage records

## 10 · Warranties

- 90-day warranty on fine-tuned model
- Warranty covers: model failing eval criteria under identical inputs
- Excludes: Client-added data, Client retraining without Supplier involvement, hardware changes

## 11 · Exit & continuity

Same as Tier 2, plus:

- Fine-tuned model weights are Client-owned and reside on Client hardware
- LoRA adapter (separately, before merge) also delivered — Client can revert or retrain from base
- Full documentation on how to run future training rounds without Supplier

## 12 · Termination

Same as Tier 2 §12, extended:

- After Week 8 (fine-tuning complete), no fee refund on the trained-model portion
- Client keeps all model weights and training data regardless of termination cause

## 13 · Upgrade path

If Client upgrades to Tier 4 (AI-Native Enterprise) within 90 days of Tier 3 delivery, the £100,000 Tier 3 fee is credited against the £200,000 Tier 4 fee (net £100,000 additional).

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

**Contract ref:** FE-TRN-YYYY-NNN  ·  **Version:** 1.0  ·  **© 2026 AI Native Solutions**
