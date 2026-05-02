---
title: Efficient Inference
order: 3
---

# Efficient Inference

Frontier LLMs are dominated by **inference cost**, not training cost. A model trained once is decoded billions of times. This page collects the family of techniques that decode faster without changing the underlying model — primarily *speculative decoding* and its descendants.

## The decoding bottleneck

Autoregressive decoding is sequential: token $t+1$ depends on token $t$, so each step needs one full forward pass through the model. On a 70B model that's tens of milliseconds per token — a hard latency floor that no amount of GPU memory bandwidth can overcome at the per-step level.

The only way to break the floor is to **decode multiple tokens per forward pass** and verify them.

## Speculative decoding

*Fast Inference from Transformers via Speculative Decoding* (Leviathan, Kalman, Matias, 2023) is the foundational idea:

1. A small **draft model** (e.g., a 7B distillation of a 70B target) cheaply proposes a sequence of $k$ candidate tokens.
2. The big **target model** runs *one* forward pass on the prompt + drafts, scoring all $k$ candidates in parallel.
3. Tokens are accepted greedily until the first disagreement; on disagreement, fall back to the target's distribution.

A clever rejection-sampling argument shows the resulting distribution is *exactly* the target's distribution — speculative decoding is **lossless**. Speedups of 2–3× are typical when the draft model is well-aligned to the target.

## Medusa

*Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads* (Cai et al., 2024) drops the separate draft model entirely. Instead, it bolts $k$ small "Medusa heads" onto the target model itself; each head predicts the token at offset $t+i$ using the same hidden state. One forward pass produces $k$ candidates; tree attention scores them in parallel. No draft model means no alignment problem and no extra serving infrastructure.

## EAGLE

*EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty* (Li et al., 2024) digs into why speculative decoding fails: the draft model often makes confident-but-wrong predictions because it lacks access to the target's hidden state. EAGLE's draft model is itself **conditioned on the target's penultimate-layer features**, dramatically improving acceptance rates. EAGLE-2 / EAGLE-3 push further with dynamic draft trees and exact-distribution matching.

## Harmonized representations

*Learning Harmonized Representations for Speculative Sampling* (paper details vary by venue, 2024–2025) proposes a joint training objective that pushes the draft model and the target model to share hidden representations on the *first few layers*, so the draft can re-use cached target features. This pushes speedups past 4× while preserving lossless decoding.

## Where the gains stop

Speculative decoding is bounded by the draft acceptance rate. As soon as outputs diverge — long-tail vocabulary, novel reasoning, code with rare APIs — acceptance drops and you pay the full target cost. The 2025 frontier is *adaptive* speculation: switch draft length or model based on observed acceptance.

## Reading list

- *Fast Inference from Transformers via Speculative Decoding* — Leviathan, Kalman, Matias, ICML 2023.
- *Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads* — Cai, Li, Peng, et al., ICML 2024.
- *EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty* — Li et al., ICML 2024.
- *Learning Harmonized Representations for Speculative Sampling* — 2024.

## What to read next

- [Long-Context Models](./long-context) — orthogonal: extending context length, not decoding speed.
- [PEFT](./peft) — efficient training; this page is its inference-time companion.
