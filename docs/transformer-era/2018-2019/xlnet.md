---
title: XLNet & Transformer-XL
order: 6
---

# XLNet & Transformer-XL

Two 2019 papers from the Carnegie Mellon / Google Brain group attacked specific weaknesses of the [BERT](./bert) and [GPT-1/2](./gpt-1) recipes: **Transformer-XL** addressed fixed context windows in autoregressive models; **XLNet** addressed BERT's MLM-pretrain / autoregressive-finetune mismatch with a **permutation language model**. Both were briefly state-of-the-art and influenced later work, but neither won the long run — the field's eventual answer was just to make decoder-only autoregressive Transformers bigger.

## Transformer-XL — segment recurrence

*Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context* (Dai, Yang, Yang, Carbonell, Le, Salakhutdinov, ACL 2019) addressed the **context-fragmentation** problem. Vanilla Transformers process documents as fixed-length segments; tokens at the start of one segment have no access to the previous segment, breaking long-range dependencies.

Transformer-XL adds two mechanisms:

- **Segment-level recurrence.** Cache the hidden states from the previous segment and let the current segment's attention look back into them. Effectively unlimited context as long as you can hold the cache.
- **Relative positional encoding.** Replace absolute position embeddings with a function of the relative offset between query and key — necessary because cached states don't have a fixed absolute position.

Both ideas survived into the modern era. The cache became the **KV cache** that powers efficient autoregressive inference; the relative-position scheme is the precursor of T5's relative bias and modern RoPE.

## XLNet — permutation language modelling

*XLNet: Generalized Autoregressive Pretraining for Language Understanding* (Yang, Dai, Yang, Carbonell, Salakhutdinov, Le, NeurIPS 2019) tried to combine BERT's bidirectionality with GPT's autoregressive consistency.

The idea: train an autoregressive model over **random permutations** of the token order. For input $x_1, \dots, x_T$, sample a permutation $\pi$ and train

$$
\mathcal{L} \;=\; \mathbb{E}_\pi \left[ \sum_t \log P(x_{\pi_t} \mid x_{\pi_1, \dots, \pi_{t-1}}) \right].
$$

Each prediction sees a *random subset* of the other tokens — usually neither strictly left nor right context. The two-stream attention mechanism keeps target positions distinguishable from content. The result is a model with bidirectional context that nonetheless trains autoregressively (no `[MASK]` tokens, no train-test mismatch).

XLNet beat BERT-large on GLUE, SQuAD, and several other benchmarks at its release. The architectural complexity, however, made it harder to scale and modify; subsequent work (RoBERTa, ELECTRA) showed BERT could close the gap with simpler tweaks.

## Why neither approach won

Both XLNet and Transformer-XL solved real problems with elegant mechanisms. They lost to scale + simplicity:

- **XLNet's permutation objective** is more complex than next-token prediction. As models scaled, the simpler GPT-style objective worked fine, and the engineering simplicity matters when you're training on thousands of GPUs.
- **Transformer-XL's recurrence** requires careful gradient management and complicates parallel training. Modern long-context approaches use [efficient attention](../2020/efficient-attention) variants or just scale the context window directly.

By 2020, the field's consensus was: bigger decoder-only Transformers with next-token prediction beat clever objective design. XLNet and Transformer-XL persist as ideas that *should* work — and would, in a slightly different alternative history.

## What survived

- **Relative positional encodings** — modern Transformers (T5, RoPE-based LLaMA, ALiBi) all use some form of relative bias.
- **The KV cache** — Transformer-XL's segment-recurrence mechanism morphed into the standard KV cache that every autoregressive inference engine uses.
- **The pretraining-vs-inference mismatch concern** — XLNet articulated it; later work (Span corruption in T5, replaced-token in ELECTRA) addressed it differently.

## What to read next

- [Self-Attention, Multi-Head, Positional Encodings](../2017/self-attention) — the absolute-position baseline.
- [Position Encodings (RoPE etc.)](../2023-2024/position-encodings) — the modern relative-position schemes.
- [Long-Context Transformers](../2023-2024/long-context) — what eventually solved Transformer-XL's problem.
