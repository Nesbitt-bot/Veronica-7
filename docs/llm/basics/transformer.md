---
title: The Transformer
order: 2
---

# The Transformer

The 2017 architecture that replaced both convolutions and recurrence in NLP, then in vision, then in essentially everything. The whole rest of this site is a chronicle of what people built on top of it.

## The core idea

A self-attention layer turns a sequence $X \in \mathbb{R}^{n \times d}$ into a new sequence by letting every position attend to every other position. Concretely:

$$
\mathrm{Attention}(Q, K, V) \;=\; \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V,
$$

where $Q = X W^Q$, $K = X W^K$, $V = X W^V$ are linear projections of the input. The softmax row for position $i$ is a probability distribution over all positions, used to take a weighted sum of the value vectors.

The $\sqrt{d_k}$ scaling keeps the dot products from growing too large in high dimensions and saturating the softmax.

## Multi-head attention

Run $h$ attention operations in parallel with different projections, concatenate, and project once more:

$$
\mathrm{MHA}(X) \;=\; \mathrm{Concat}(\text{head}_1, \dots, \text{head}_h) W^O.
$$

Each head can specialise (e.g. one tracks subject–verb agreement, another tracks coreference); empirically the model exploits this without supervision.

## A Transformer block

Each block is

```text
x ← x + MHA(LayerNorm(x))
x ← x + FFN(LayerNorm(x))
```

with a position-wise feed-forward network $\mathrm{FFN}(x) = W_2 \,\mathrm{GELU}(W_1 x + b_1) + b_2$. Pre-LN (placing LayerNorm *before* the sub-layer) has become the standard because it trains stably without warmup tricks.

## Positional information

Self-attention is permutation-equivariant — without help, the model can't tell *the dog bit the man* from *the man bit the dog*. The original paper added sinusoidal positional encodings; later variants (RoPE, ALiBi — see [long-context](../efficient/long-context)) inject position directly into $Q$ and $K$.

## Why it won

1. **Parallelism.** Unlike RNNs, every position can be processed in parallel — a perfect fit for GPU hardware.
2. **Long-range dependencies.** Information moves between any two positions in $O(1)$ layers, not $O(n)$.
3. **Scaling.** The architecture scales smoothly to billions of parameters and trillions of tokens — see [Scaling Laws](./scaling-laws).

## Reading list

- *Attention Is All You Need* — Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin, NeurIPS 2017.

## What to read next

- [Pre-training](./pretraining) — what to do with a Transformer once you have one.
- [Scaling Laws & Emergent Abilities](./scaling-laws) — why bigger Transformers behave qualitatively differently.
