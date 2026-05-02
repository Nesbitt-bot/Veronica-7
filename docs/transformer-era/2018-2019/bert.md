---
title: BERT — Bidirectional Pretraining
order: 1
---

# BERT — Bidirectional Pretraining

*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding* (Devlin, Chang, Lee, Toutanova, NAACL 2019) was the model that established the **pretrain-then-fine-tune** paradigm in NLP. By 2019, every published NLP system that mattered started with BERT pretraining; by 2020, BERT pretraining had been generalised into the foundation-model paradigm that defines modern AI. BERT is also a clean illustration of how a small architectural choice (bidirectional vs autoregressive) shapes downstream applications.

## What BERT did differently

Pre-BERT, large NLP models were either:

- **Word embeddings** (Word2Vec, GloVe) — context-free single vectors per token.
- **ELMo / ULMFiT** — contextual representations from LSTMs, but autoregressive (left-to-right or two unidirectional models concatenated).

BERT replaced the LSTM with a [Transformer encoder](../2017/attention-is-all-you-need) and trained it to be **truly bidirectional** — every token's representation depends on all other tokens, in both directions. This was made possible by **masked-language-model (MLM) pretraining**.

## Pretraining objectives

Two objectives:

**1. Masked Language Model (MLM).** Replace ~15% of input tokens with a `[MASK]` token (or a random token, or leave unchanged) and predict the original. The loss is cross-entropy over the masked positions only:

$$
\mathcal{L}_\text{MLM} \;=\; -\sum_{t \in \mathcal{M}} \log P(x_t \mid \mathbf{x}_{\setminus \mathcal{M}}).
$$

By predicting masked tokens from full bidirectional context, BERT learns rich token representations — every layer can attend to every other position.

**2. Next Sentence Prediction (NSP).** Concatenate two sentences A and B with a `[SEP]` token; predict whether B is the actual next sentence in the corpus or a random one. Later work (RoBERTa) showed NSP is unhelpful — but the original paper included it, and downstream tasks formatted as sentence pairs benefited from the `[CLS]` token representation it produced.

## Architecture

- **BERT-base** — 12 layers, 768 hidden dim, 12 heads, 110M params.
- **BERT-large** — 24 layers, 1024 hidden, 16 heads, 340M params.

Pretrained on BooksCorpus (800M words) + English Wikipedia (2.5B words), at the time considered a massive corpus.

The architecture innovation over the original Transformer is just the **encoder-only** design — no decoder, no causal masking. The model is a Transformer encoder in the strict sense.

## Fine-tuning

For each downstream task, add a small task-specific head (one or two linear layers) on top of BERT's outputs and fine-tune the entire model on the labelled task data. Standard heads:

- **Classification** — pool the `[CLS]` token's final hidden state, project to class logits.
- **Sequence labelling (NER, POS)** — per-token linear layer.
- **Span prediction (SQuAD)** — two linear layers, one for start position and one for end position, applied to each token.

The recipe was so consistent across tasks that an entire generation of NLP papers were "we fine-tuned BERT and added X". GLUE leaderboards became BERT leaderboards within months.

## Why MLM, not autoregressive?

Bidirectional context produces stronger token representations than left-only context. For **understanding** tasks (classification, NER, QA, NLI), bidirectional is better — every token is informed by full context. For **generation** tasks, you need left-to-right generation, which is what GPT does.

This bidirectional/autoregressive split structured all of NLP for years: BERT-style for understanding, GPT-style for generation, T5 (encoder-decoder) for both. Modern decoder-only LLMs eventually subsumed all three, but the classic 2018–2020 division is still useful pedagogically.

## Cost and accessibility

BERT was a milestone in *democratising* pretraining: BERT-base could be fine-tuned on a single consumer GPU. Hugging Face Transformers (released 2019, originally as `pytorch-pretrained-BERT`) was created specifically to make BERT easy to use, and grew into the dominant deep-learning model hub.

## Limitations

- **Maximum sequence length 512** — set by positional embeddings. Long-document tasks need workarounds.
- **No generation** — BERT cannot autoregressively produce text. Encoder-only models are useful for classification and retrieval but not chatbots.
- **Compute-suboptimal pretraining** — RoBERTa later showed BERT was massively under-trained.
- **MLM is sample-inefficient** — only ~15% of tokens contribute to the loss per batch.

## Legacy

BERT's direct descendants — RoBERTa, ALBERT, ELECTRA — refined the recipe. The pretrain-fine-tune paradigm became universal. The MLM objective lives on in [MAE](../../cv/advances/representation), masked image modelling, and the broader self-supervised pretraining literature. The encoder-only architecture is still preferred for **embedding** models (sentence transformers, retrieval) where a fixed-size representation matters more than generation.

## What to read next

- [BERT Variants](./bert-variants) — RoBERTa, ALBERT, ELECTRA improvements.
- [GPT-1](./gpt-1) — the autoregressive contemporary.
- [T5](./t5) — encoder-decoder unification.
