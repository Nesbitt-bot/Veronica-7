---
title: State Space Models — S4, Mamba
order: 1
---

# State Space Models — S4, Mamba

State-space models (SSMs) returned to ML in 2021 with **S4** (Gu, Goel, Ré) and reached competitive frontier scale in 2024 with **Mamba** (Gu, Dao). They are the strongest non-Transformer architectural challenger of the 2020s — linear-time-in-sequence-length, content-aware recurrence, and increasingly competitive with attention at meaningful scale.

## The state-space view

A continuous-time linear state-space model is

$$
\dot{\mathbf{h}}(t) = A \mathbf{h}(t) + B \mathbf{x}(t), \qquad \mathbf{y}(t) = C \mathbf{h}(t) + D \mathbf{x}(t).
$$

Discretised, this becomes a linear recurrence

$$
\mathbf{h}_t = \bar{A} \mathbf{h}_{t-1} + \bar{B} \mathbf{x}_t, \qquad \mathbf{y}_t = C \mathbf{h}_t.
$$

Two facts make this useful:

- **Linear recurrence.** Like an [RNN](../../dnn/rnn/vanilla), but linear, so it can be unrolled in parallel via convolutional kernels at training time and sequentially at inference time.
- **Long-range memory.** With careful initialisation of $A$ — *HiPPO* — the recurrence preserves long-range information.

## S4 — long-range memory done right

*Efficiently Modeling Long Sequences with Structured State Spaces* (Gu, Goel, Ré, ICLR 2022) made SSMs trainable at deep-learning scale. The key contributions:

- **HiPPO initialisation** of $A$ — a structured matrix that approximates Legendre-polynomial decomposition of the input history. Each state component captures a different time scale.
- **Diagonal+low-rank structure** for $A$ — efficient enough to compute the convolutional kernel in $O(N \log N)$ via FFT.
- **Path Independence** training — same parameters give both convolutional (parallel) and recurrent (sequential) views.

S4 set new SOTA on the *Long Range Arena* benchmark, particularly on the "Path-X" task that vanilla Transformers fail outright. It was the proof-of-concept that recurrence can reach the long-range regime where attention's quadratic cost prevents it.

## Mamba — content-aware SSMs

*Mamba: Linear-Time Sequence Modeling with Selective State Spaces* (Gu, Dao, COLM 2024) made the leap from "interesting on niche benchmarks" to "competitive with Transformers at LLM scale". The key insight: **make the SSM parameters input-dependent**.

S4's $\bar{A}, \bar{B}, C$ are fixed across positions; Mamba makes them functions of the input:

$$
\bar{B}_t = f_B(\mathbf{x}_t), \qquad \bar{A}_t = f_A(\mathbf{x}_t), \qquad C_t = f_C(\mathbf{x}_t).
$$

Now the recurrence is **selective** — it can decide what to remember and what to forget based on the current token, rather than applying a fixed time-decay.

The trade-off: input-dependent $A$ breaks the convolutional view, so training falls back to a sequential scan. The Mamba paper introduces a **hardware-aware parallel-scan** kernel that makes the sequential update efficient on GPUs by carefully managing memory I/O.

Empirically, Mamba matches Transformers of comparable size on language modelling perplexity, beats them on extreme-long-sequence tasks (audio, DNA, retrieval over millions of tokens), and is about 5× faster at inference per token (no KV cache, $O(1)$ state).

## Mamba-2 / Structured State Space Duality

*Transformers are SSMs* (Dao, Gu, ICML 2024) showed an unexpected result: a particular form of **linear attention** is mathematically dual to selective SSMs. The two families are different views of the same computation, with different parametrisation tradeoffs.

The duality unlocks **matrix-multiplication-based training** for Mamba (faster than parallel-scan) and a unified theoretical framework. Mamba-2 uses this duality and is the production version of the Mamba architecture.

## What Mamba does well, and what it doesn't

Wins:

- **Long sequences.** Linear in $T$ vs Transformers' quadratic. Audio, DNA, ultra-long-context language all benefit.
- **Inference cost.** No KV cache — fixed-size state per layer. Memory is constant in sequence length.
- **Streaming.** State summary is one tensor, easy to checkpoint and resume.

Limits:

- **Exact-match retrieval.** Transformers' attention is content-addressable; SSMs' fixed-size state cannot exactly retrieve a specific earlier token.
- **In-context learning.** Mamba's ICL is somewhat weaker than Transformers' at comparable scale, though closing.
- **Ecosystem.** Most production tooling (vLLM, SGLang, FlashAttention) is Transformer-specific; Mamba support is less mature.

## Hybrid models

The pragmatic 2024–25 trend is **hybrid SSM–Transformer** architectures: most layers are Mamba (cheap), interspersed with occasional attention layers (for retrieval). Examples:

- **Jamba** (AI21, 2024) — interleaves Transformer and Mamba blocks at frontier scale.
- **Zamba** (Zyphra, 2024) — Mamba blocks plus shared-attention layers.
- **Granite Mamba** (IBM, 2024) — production-deployed hybrid model.

The hybrid approach is where SSM + Transformer is currently winning: combine the long-context efficiency of Mamba with attention's exact-retrieval capability where needed.

## What Mamba might do

The open question for 2025–26 is whether SSMs (or hybrids) can fully compete at frontier scale. So far:

- 70B-class Mamba and hybrids exist (Falcon Mamba 7B, Jamba 1.5, Zamba 2).
- Frontier-scale (>100B) is still mostly Transformer.
- The architectural-bet community is split — some labs are training pure-SSM frontier models, others view hybrids as the right answer, others remain Transformer-only.

## What to read next

- [Linear Attention](./linear-attention) — the mathematically-dual cousin.
- [RWKV](./rwkv) — another linear-recurrence Transformer alternative.
- [Architectures (LLM)](../../llm/other/architectures) — broader context.
