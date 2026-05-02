---
title: LLaMA 3
order: 4
---

# LLaMA 3

Meta released **LLaMA 3** on April 18, 2024, in 8B and 70B sizes; the **LLaMA 3.1** family (July 2024) added the headline 405B model and brought all sizes to 128K context. The 405B was the first widely-available open-weights model that genuinely competed with frontier closed models on most benchmarks. LLaMA 3 confirmed that **frontier-quality open-weights LLMs were a sustainable category**, not a one-off LLaMA-1 phenomenon.

## LLaMA 3 (April 2024)

The April release was 8B and 70B models, both strong. Recipe:

- **15 trillion training tokens** — 7-15× more than LLaMA 2's 2T. Followed Chinchilla-data-heavy scaling.
- **Same architecture** as LLaMA 2 — RoPE, RMSNorm, SwiGLU, GQA — with no major changes.
- **Improved tokenizer** — 128K vocabulary (up from LLaMA 2's 32K).
- **8K context** at base (extended later).
- **Both base and instruct** versions released.

The benchmark headline: LLaMA 3 70B-Instruct beat GPT-3.5 across the board and approached GPT-4 / Claude 3 Sonnet on many tasks. LLaMA 3 8B beat LLaMA 2 70B on most tasks — small models, trained on more data, were now genuinely strong.

## LLaMA 3.1 — the 405B and 128K context (July 2024)

The July 2024 release brought:

- **LLaMA 3.1 405B** — 405-billion-parameter dense Transformer, the largest publicly-released open-weights LLM at that time.
- **128K context** across all three sizes (8B, 70B, 405B).
- **Improved instruction-tuning, function calling, multilingual** support.

The 405B was the headline. On most reasoning, math, and coding benchmarks, it matched GPT-4 and Claude 3 Opus — closing the gap between open and closed frontiers on text capabilities. The training recipe (per the technical report, *The Llama 3 Herd of Models*, Meta 2024) was:

- 405B parameters, 16K hidden, 128 layers, 128 heads.
- Trained on a **15.6 trillion token** mostly-English corpus, with custom data filtering and deduplication.
- Trained on 24,000 H100 GPUs over multiple months, with detailed reporting of failures, recoveries, and infrastructure.

The technical report is unusually detailed for a 2024 frontier model. The data pipeline, training instabilities, and post-training procedures are documented at a level that benefits the broader open-source ecosystem.

## Architecture

The base architecture is dense Transformer, *not* MoE. This was a deliberate choice — Meta wanted broad open-source compatibility, and dense models are easier for the community to fine-tune, quantize, and deploy. The LLaMA 3 family:

- 8B: 32 layers, 4096 hidden, 32 heads.
- 70B: 80 layers, 8192 hidden, 64 heads.
- 405B: 126 layers, 16384 hidden, 128 heads.

All use GQA (8 KV heads), RoPE, RMSNorm, SwiGLU. The only architectural change vs LLaMA 2 was scaling.

## Multimodal: LLaMA 3.2

**LLaMA 3.2** (Sept 2024) added vision input — 11B and 90B sizes — using a frozen vision adapter on top of the LLaMA 3 backbone, similar to the [Flamingo](../2022/flamingo)-style design. Smaller text-only models (1B, 3B) targeted on-device inference.

**LLaMA 3.3** (Dec 2024) released a refreshed 70B-Instruct that matched the 405B on many benchmarks at much lower inference cost, ending the line.

## Open-source impact

LLaMA 3 / 3.1 had outsized open-source impact:

- **Hundreds of derivative fine-tunes** — code-focused, domain-specific, instruction-following variants.
- **The 405B as a teacher model** for distillation into smaller open models.
- **Reference data pipelines** — Meta documented its data-filtering recipes; many open-source projects adopted them.
- **Industry adoption** — IBM Granite, Databricks DBRX, NVIDIA Nemotron all built on LLaMA 3 or LLaMA-architecture lineages.

By late 2024, the open-source ecosystem had mature LLaMA 3-based models, fine-tuning pipelines, deployment infrastructure (vLLM, SGLang, llama.cpp), and quantization tools. The "open-source LLM" was no longer a hobbyist phenomenon.

## What LLaMA 3 confirmed

- **Open-source can match closed at frontier capability** for general text tasks.
- **Dense Transformers remain viable at 100B-500B scale** — LLaMA 3 405B was competitive with MoE frontier models from OpenAI / Anthropic / Google.
- **Data, not architecture, drives quality at this scale.** LLaMA 3 changed essentially nothing architecturally vs LLaMA 2; the 15T-token training corpus did the work.
- **Detailed technical reporting from Meta** raised the bar for open-model documentation.

## Successors

- **LLaMA 4** (April 2025) — Meta's first MoE frontier release, with multiple variants up to ~400B active.
- **LLaMA 4.1** later in 2025 with reasoning modes.

LLaMA 3 remained widely deployed through 2025 even after LLaMA 4 — its dense architecture, broad ecosystem support, and proven reliability made it the default for many production systems.

## What to read next

- [LLaMA 1 & 2](../2023/llama) — the predecessors.
- [Mixtral / Mistral](../2023/mistral) — the contemporary open MoE alternative.
- [Frontier Models](../2025-2026/frontier-models) — the post-LLaMA-3 frontier landscape.
