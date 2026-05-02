---
title: Bahdanau Attention
order: 4
---

# Bahdanau Attention

The single fixed context vector $\mathbf{c}$ in a [seq2seq](./seq2seq) translator is an information bottleneck — long source sentences cannot be encoded into one 1024-d vector without information loss. *Neural Machine Translation by Jointly Learning to Align and Translate* (Bahdanau, Cho, Bengio, ICLR 2015) introduced the **attention mechanism** that fixed this, and in doing so set the conceptual foundation for the Transformer.

## The mechanism

Replace the single context $\mathbf{c}$ with a **per-step context** $\mathbf{c}_t$ computed as a weighted sum over *all* encoder hidden states. Given encoder outputs $\mathbf{h}_1^\text{enc}, \dots, \mathbf{h}_T^\text{enc}$ and the decoder state $\mathbf{s}_{t-1}$ at the previous step, compute:

$$
e_{t, j} \;=\; \mathbf{v}_a^\top \tanh\!\bigl(W_a \mathbf{s}_{t-1} + U_a \mathbf{h}_j^\text{enc}\bigr),
$$

$$
\alpha_{t, j} \;=\; \frac{\exp(e_{t, j})}{\sum_{k=1}^{T} \exp(e_{t, k})}, \qquad \mathbf{c}_t \;=\; \sum_{j=1}^{T} \alpha_{t, j} \, \mathbf{h}_j^\text{enc}.
$$

The decoder then generates token $y_t$ conditioned on $\mathbf{s}_{t-1}, y_{t-1}, \mathbf{c}_t$. The scoring function $e_{t,j}$ is a small MLP — what would later be called **additive attention**, distinct from the dot-product attention used in the Transformer.

## What it bought

Three immediate gains over fixed-context seq2seq:

- **Long-sentence quality.** BLEU on long sentences stopped degrading. The decoder can attend back to a source word even after producing dozens of output tokens.
- **Interpretability.** Plotting $\alpha_{t,j}$ as a heatmap shows soft alignments between target and source tokens — for the first time, neural translators were inspectable.
- **Generality.** The mechanism is not specific to translation. Any task with a sequence query and a sequence memory can use it: image captioning (attend over image regions; *Show, Attend and Tell*, Xu et al., ICML 2015), question answering, summarisation.

Bahdanau attention was the first time a network could **dynamically pick which inputs to look at** based on its current state, rather than having to encode everything into a fixed bottleneck. That's the conceptual lever the rest of the field then pulled on for a decade.

## Luong attention — the dot-product variant

*Effective Approaches to Attention-based Neural Machine Translation* (Luong, Pham, Manning, EMNLP 2015) followed up with three simplifications:

1. Score with a **dot product** $e_{t, j} = \mathbf{s}_t^\top \mathbf{h}_j^\text{enc}$ or a bilinear form $\mathbf{s}_t^\top W_a \mathbf{h}_j^\text{enc}$, instead of an MLP.
2. Use $\mathbf{s}_t$ (the *current* decoder state) rather than $\mathbf{s}_{t-1}$.
3. Add **local attention** — restrict the attention window around a learned alignment position.

Luong's dot-product attention is structurally what the Transformer's self-attention uses (with the $\sqrt{d_k}$ scaling and multi-head projection added on top). The "scaled dot-product attention" of *Attention is All You Need* is essentially Luong attention applied to itself.

## From RNN+attention to Transformer

For three years (2014–2017), the dominant architecture was **RNN encoder + attention + RNN decoder**. The Transformer (Vaswani et al., NeurIPS 2017) made the radical move of *removing the RNNs entirely* — keeping only attention, layered repeatedly within both encoder and decoder. The argument: attention already provides direct long-range access, and removing the recurrence makes the architecture trivially parallelisable.

Bahdanau attention is the conceptual *origin* of self-attention. Reading the 2015 paper alongside the 2017 Transformer paper makes the architectural lineage clear: every attention head in a Transformer is a Bahdanau-style soft-alignment computation, applied between every pair of positions instead of just between decoder and encoder.

## What to read next

- [Sequence-to-Sequence](./seq2seq) — the bottleneck this attention mechanism removed.
- [Transformer (LLM)](../../llm/basics/transformer) — the modern descendant where attention is the *only* operation.
- [LSTM & GRU](./lstm-gru) — the recurrent cells the original Bahdanau encoder/decoder used.
