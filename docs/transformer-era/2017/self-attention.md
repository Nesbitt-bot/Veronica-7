---
title: Self-Attention, Multi-Head, Positional Encodings
order: 2
---

# Self-Attention, Multi-Head, Positional Encodings

The Transformer architecture from [*Attention Is All You Need*](./attention-is-all-you-need) rests on three primitives: **self-attention** (each position attends to all others), **multi-head** projection (run several attentions in parallel), and **positional encoding** (inject order). This page works through the math and the design choices.

## Self-attention

Given a sequence of token embeddings $X \in \mathbb{R}^{T \times d}$, project to queries, keys, and values:

$$
Q = X W^Q, \quad K = X W^K, \quad V = X W^V, \qquad W^{Q,K,V} \in \mathbb{R}^{d \times d_k}.
$$

The output is the scaled-dot-product attention:

$$
\mathrm{Attn}(Q, K, V) \;=\; \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V \;\in\; \mathbb{R}^{T \times d_k}.
$$

Reading the formula: each row $\mathbf{q}_i$ is compared (via dot product) to every key $\mathbf{k}_j$, the scores are softmax-normalised across $j$, and the output is the weighted sum of values $\mathbf{v}_j$.

Three properties:

- **Permutation-equivariant** — without positional information, attention treats the input as a set. Order must be added explicitly.
- **$O(T^2)$ in sequence length** — every pair of positions interacts. The quadratic cost is the central scaling bottleneck (see [efficient attention](../2020/efficient-attention)).
- **Direct long-range access** — any two positions interact in one attention layer. Compare to RNNs' $O(T)$ gradient path length.

## Why $\sqrt{d_k}$?

For $\mathbf{q}, \mathbf{k} \in \mathbb{R}^{d_k}$ with i.i.d. unit-variance components, $\mathbf{q}^\top \mathbf{k}$ has variance $d_k$. As $d_k$ grows, dot products become large, the softmax becomes sharply peaked, and gradients of softmax(${\rm logit}$) collapse. Dividing by $\sqrt{d_k}$ keeps the dot-product variance at 1 regardless of depth.

This is the kind of detail that's easy to miss when reading the paper but critical when implementing. Skipping the $\sqrt{d_k}$ scaling is a routine bug source.

## Multi-head attention

Instead of one attention computation in $\mathbb{R}^d$, run $h$ heads in parallel in $\mathbb{R}^{d/h}$ each:

$$
\mathrm{MHA}(X) \;=\; \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)\, W^O,
$$

with $\mathrm{head}_i = \mathrm{Attn}(X W_i^Q, X W_i^K, X W_i^V)$. Total parameters and FLOPs are roughly the same as single-head attention with the full $d$, but the representational capacity is split across heads.

Why split? Different heads can specialise:

- **Syntactic** — track subject-verb agreement.
- **Positional** — track relative offsets.
- **Semantic** — track entity relations.

Probing studies (Clark et al., *What Does BERT Look At?*, 2019) show clean specialisation in some heads. In well-trained large Transformers, many heads are partially redundant — Michel et al. (NeurIPS 2019) showed many heads can be pruned post-training.

## Causal masking

For autoregressive generation (decoder-only LMs), each position must attend only to *earlier* positions. Implement with a **causal mask** added to the pre-softmax logits:

$$
M_{ij} = \begin{cases} 0 & j \leq i \\ -\infty & j > i \end{cases}, \qquad \mathrm{Attn}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}} + M\right) V.
$$

The $-\infty$ becomes 0 after softmax, eliminating attention to future positions. This is what makes [GPT](../2018-2019/gpt-1)-style models autoregressive.

## Encoder-decoder attention

In the original encoder-decoder Transformer, the decoder has a third attention sub-layer where queries come from the decoder and keys/values from the encoder output. This is the [Bahdanau-attention](../../dnn/rnn/bahdanau-attention) generalisation in self-attention dress.

## Positional encodings

The vanilla self-attention layer is permutation-equivariant — no positional information. The original paper adds **sinusoidal** positional encodings:

$$
\mathrm{PE}_{(p, 2i)} = \sin\!\left(\frac{p}{10000^{2i/d}}\right), \qquad \mathrm{PE}_{(p, 2i+1)} = \cos\!\left(\frac{p}{10000^{2i/d}}\right).
$$

Each position gets a deterministic vector that varies smoothly with position and dimension. Linear functions of these encodings can express relative offsets, so attention can learn relative-position relations.

Modern variants:

- **Learned absolute** — train one position vector per slot. Used in BERT/GPT-2.
- **Relative position bias** — T5, ALiBi: bias attention scores by a function of $i - j$.
- **Rotary Position Embeddings (RoPE)** — apply position-dependent rotations in $Q, K$ subspaces. Used in LLaMA, Qwen, and most modern open LLMs. See [position encodings](../2023-2024/position-encodings).

## What to read next

- [Attention Is All You Need](./attention-is-all-you-need) — the broader paper.
- [Efficient Attention](../2020/efficient-attention) — how to break the $O(T^2)$ cost.
- [Position Encodings (RoPE etc.)](../2023-2024/position-encodings) — the modern positional schemes.
