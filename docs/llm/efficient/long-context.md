---
title: Long-Context Models
order: 4
---

# Long-Context Models

How a Transformer trained at 4k tokens can be made to read 1M, and whether it actually *uses* that context once it can. Two threads run in parallel: position-encoding tricks that enable extrapolation, and benchmarks that reveal what models do (and don't) do with all that room.

## The lost-in-the-middle problem

*Lost in the Middle: How Language Models Use Long Contexts* (Liu et al., TACL 2024) ran a controlled study: place a key fact at position $i$ in a long context, ask a question whose answer requires it. Accuracy follows a clear **U-shape** — high when the fact is at the start or end, much lower in the middle. The lesson: nominal context length and *useful* context length are not the same. Every long-context paper since lives under this shadow.

## RoPE — rotary position embeddings

*RoFormer: Enhanced Transformer with Rotary Position Embedding* (Su et al., 2021) is the position encoding that powers nearly every modern LLM. Each query and key is rotated in $\mathbb{R}^2$ by an angle proportional to its position:

$$
\tilde q_t = R_t \, q_t, \qquad R_t = \begin{pmatrix} \cos(t \theta_i) & -\sin(t \theta_i) \\ \sin(t \theta_i) & \cos(t \theta_i) \end{pmatrix}
$$

(applied per pair of dimensions with frequencies $\theta_i = 10000^{-2i/d}$). The dot product $\tilde q_t^\top \tilde k_s$ then depends only on the *relative* position $t - s$, not on absolute positions. This relativity is what allows RoPE-trained models to **extrapolate** to context lengths longer than they were trained on, especially when combined with techniques like NTK-aware scaling, YaRN, or position interpolation.

## LongNet

*LongNet: Scaling Transformers to 1B Tokens* (Ding et al., 2023) uses **dilated attention**: each token attends only to a sparse, exponentially-spaced subset of past tokens, with the dilation rate growing with depth. The total number of attention edges is $O(n \log n)$ instead of $O(n^2)$, putting a billion-token context within reach. The architectural cost: some of the long-range patterns must be learned through depth, since shallow layers cannot see all positions directly.

## RULER — what is the *real* context?

*RULER: What's the Real Context Size of Your Long-Context Language Models?* (Hsieh et al., 2024) is the benchmark that put this whole field in perspective. RULER tests models with **multi-needle retrieval**, multi-hop tracing, aggregation, and variable-tracking tasks — well beyond the standard "find the magic number" needle-in-a-haystack test.

Key result: a model marketed at "128k context" often has an *effective* RULER context of 16k or less. Performance collapses far below the advertised limit, especially on tasks that require integrating information from multiple distant passages rather than retrieving a single fact.

## State of the art

The current production frontier (Gemini 1.5, Claude with 1M extended, GPT-4o-128k) is built from: RoPE with extension, sparse attention variants in middle layers, and heavy training-time emphasis on long-context tasks. Even so, RULER-style probes show meaningful degradation past ~100k for most models.

## Reading list

- *Lost in the Middle: How Language Models Use Long Contexts* — Liu et al., TACL 2024.
- *RoFormer: Enhanced Transformer with Rotary Position Embedding* — Su et al., 2021.
- *LongNet: Scaling Transformers to 1B Tokens* — Ding et al., 2023.
- *RULER: What's the Real Context Size of Your Long-Context Language Models?* — Hsieh et al., 2024.

## What to read next

- [Efficient Inference](./inference) — long contexts make decoding *and* prefill expensive.
- [RAG](../applications/rag) — the alternative to "just use a bigger context".
