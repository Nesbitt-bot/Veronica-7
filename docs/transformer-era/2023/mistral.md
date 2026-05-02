---
title: Mistral & Mixtral (MoE)
order: 5
---

# Mistral & Mixtral (MoE)

Mistral AI, founded in early 2023 by ex-Meta and ex-DeepMind researchers, released **Mistral 7B** (Sept 2023) and **Mixtral 8x7B** (Dec 2023) under permissive open-source licences, instantly becoming the strongest open-weights models at their respective scales. Mistral 7B beat LLaMA-13B; Mixtral 8x7B matched LLaMA-2-70B at far lower inference cost. Mistral demonstrated that **a small focused team can produce frontier-competitive open models** and popularised Mixture-of-Experts at the open-source scale.

## Mistral 7B (September 2023)

Mistral 7B is a tight, optimised dense Transformer at 7B parameters. The architectural choices that mattered:

- **Sliding window attention.** Each token attends only to the previous 4096 tokens. Effective context grows by stacking layers — at 32 layers with window 4096, attention ranges across $32 \times 4096$ tokens.
- **Grouped-Query Attention (GQA).** Multi-head attention with shared K/V projections across groups of heads — slightly worse quality than Multi-Head, much cheaper inference (smaller KV cache).
- **Byte-fallback BPE tokenizer.** Handles arbitrary unicode without tokenization gaps.

The benchmark headline: **Mistral 7B outperforms LLaMA 2 13B** on most reasoning, math, and code benchmarks. It approached LLaMA 2 34B on several. The gap was attributed primarily to data quality and training-token count — Mistral's training corpus was rumoured to be more carefully curated than Meta's.

Released under Apache 2.0. The Hugging Face downloads passed 1M within weeks.

## Mixtral 8x7B (December 2023)

*Mixtral of Experts* (Jiang, Sablayrolles, Roux et al., Mistral AI, 2024) released **Mixtral 8x7B**, the first open-weights Mixture-of-Experts LLM at frontier-competitive quality.

Architecture:

- **8 experts** per Feed-Forward layer.
- **Top-2 routing** — each token's FFN is computed by 2 of the 8 experts.
- **Total parameters: ~47B**, but **active per token: ~13B**.
- 32 layers, sliding-window attention as in Mistral 7B.

The headline result: Mixtral 8x7B **matches or beats LLaMA-2-70B** on most benchmarks while costing ~13B-active to run — a 5× inference-cost reduction at comparable quality. This was the demonstration that MoE at open-source scale was a viable choice for cost-effective frontier-competitive serving.

See [MoE](../2023-2024/moe) for the architecture in more detail.

## Why MoE works for open-source

Open-source models live and die on inference cost. A user running locally cares about VRAM (loaded parameters), throughput (active parameters), and quality (effective parameters). MoE wins because:

- **Quality scales with total parameters** — 47B equivalent quality from a network with 8x7B experts.
- **Inference compute scales with active parameters** — 13B compute means consumer-GPU friendly.
- **VRAM is the limiting factor** — the full 47B must be loaded, requiring 90GB+ VRAM at fp16. Quantisation (Q4) brings this to 24GB, runnable on a single high-end consumer GPU.

The trade — high VRAM, low compute, high quality — is a different sweet spot than dense, and Mixtral popularised it.

## Mistral's continuing line

After 8x7B, Mistral released:

- **Mistral 8x22B** (April 2024) — the same MoE recipe at 8x22B scale, ~141B total / ~39B active.
- **Mistral Medium / Large / Large 2** — closed proprietary models, available via API.
- **Mistral NeMo** (12B) and **Mistral Small 3** — improved dense models.
- **Codestral** — code-specialised variants.
- **Pixtral** (Sept 2024) — vision-language extension of Mistral.

Mistral has a hybrid open + commercial strategy: open the smaller models, keep the largest as proprietary API products. This split is now standard among open-source-aligned labs.

## What Mistral established

Three contributions that lasted:

- **Sliding-window attention + GQA** as a default open-LLM architecture for the 2023–24 generation. Many later models adopted both.
- **MoE at open-source scale.** Mixtral 8x7B was the model that proved MoE was practical for the community, not just frontier labs.
- **Small-team frontier-competitive open models.** Mistral was a 30-person team competing with Meta, Google, OpenAI on output quality at the small-model end.

By 2024, the open-source ecosystem had three primary lineages: Meta's LLaMA, Mistral, and Alibaba's Qwen. Mistral occupied the "tight, optimised, EU-based, MoE-curious" niche.

## What to read next

- [LLaMA](./llama) — the contemporary open-source baseline.
- [MoE (Architectures)](../2023-2024/moe) — the Mixture-of-Experts mechanism in detail.
- [Open Models](./open-models) — the broader open-LLM ecosystem.
