---
title: Attention Is All You Need (2017)
order: 1
---

# Attention Is All You Need (2017)

*Attention Is All You Need* (Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin, NeurIPS 2017) introduced the **Transformer** — an encoder-decoder architecture built entirely from attention, with no recurrence and no convolution. It was originally a machine-translation paper; it became the foundation of nearly every modern deep-learning model. The 2017 paper is the single most consequential ML publication of the deep era.

## What the paper claimed

Translation systems in 2017 were RNN encoder-decoders with [Bahdanau attention](../../dnn/rnn/bahdanau-attention) — strong but slow to train (RNNs are inherently sequential) and hard to scale. The paper's claim: **drop the recurrence**, keep only attention.

The Transformer:

- Replaces RNN encoder/decoder layers with stacks of **self-attention** + feed-forward blocks.
- Uses **multi-head attention** to attend to multiple representational subspaces simultaneously.
- Adds **positional encodings** to inject order information without recurrence.
- Trains in parallel — every position is computed simultaneously, giving 10–100× throughput improvements over RNNs.

The headline result: 28.4 BLEU on WMT-14 English-German, beating the previous SOTA, with 1/4 the training cost.

## Architecture

The encoder is $N=6$ identical layers, each with two sub-layers:

- **Multi-head self-attention** over the input.
- **Position-wise feed-forward network** — two linear layers with ReLU.

Each sub-layer has a residual connection and LayerNorm. The decoder has the same structure, plus a third sub-layer in each block that attends to the encoder's output (encoder-decoder attention).

## Scaled dot-product attention

The core operation:

$$
\mathrm{Attention}(Q, K, V) \;=\; \mathrm{softmax}\!\left( \frac{Q K^\top}{\sqrt{d_k}} \right) V.
$$

Each query $\mathbf{q}_i$ scores against every key, the scores are softmax-normalised, and the values are averaged accordingly. The $\sqrt{d_k}$ scaling is critical — without it, dot products in high-dim space become large, the softmax saturates, and gradients vanish.

For self-attention, $Q, K, V$ are all linear projections of the same input; for encoder-decoder cross-attention, $Q$ comes from the decoder and $K, V$ from the encoder.

## Multi-head attention

Run $h = 8$ attention heads in parallel, each with its own learned $Q/K/V$ projections. Concatenate and project:

$$
\mathrm{MHA}(Q, K, V) \;=\; \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)\, W^O,
$$

with $\mathrm{head}_i = \mathrm{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$. Different heads can specialise in different relations — syntactic, positional, semantic. Empirically, large models reuse this capacity heavily.

## Positional encodings

Without recurrence, the model has no notion of order. The paper adds **sinusoidal positional encodings** to the input embeddings:

$$
\mathrm{PE}_{(p, 2i)} = \sin(p / 10000^{2i/d}), \qquad \mathrm{PE}_{(p, 2i+1)} = \cos(p / 10000^{2i/d}).
$$

The fixed sinusoidal scheme generalises beyond training-set sequence lengths (sort of — see RoPE for the modern fix). Later models replaced this with learned absolute, relative, or rotary position embeddings (see [position encodings](../2023-2024/position-encodings)).

## Why it mattered

Three properties made the Transformer take over:

- **Parallelism.** No recurrence means every position is computed simultaneously. Training throughput on a fixed compute budget jumps by orders of magnitude.
- **Long-range dependencies.** Self-attention is $O(1)$ in path length between any two positions, vs. RNN's $O(n)$. Long-context modelling becomes natural.
- **Scaling friendliness.** The same architecture scales from 65M parameters (the paper) to 1T+ today, with predictable improvement (see [scaling laws](../2020/scaling-laws)).

The paper's narrative was modest — "we just simplified a translation model" — but the architecture turned out to be the right inductive bias for almost every problem in ML. NLP was first to follow ([BERT](../2018-2019/bert), [GPT](../2018-2019/gpt-1)); vision came later ([ViT](../2020-2021/vit)); now everything from speech to robotics to genomics is Transformer-based.

## What to read next

- [Self-Attention, Multi-Head, Positional Encodings](./self-attention) — the mechanism in detail.
- [BERT (2018)](../2018-2019/bert) — Transformer encoder for masked-language pretraining.
- [GPT-1 (2018)](../2018-2019/gpt-1) — Transformer decoder for next-token pretraining.
