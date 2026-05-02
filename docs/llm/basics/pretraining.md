---
title: Pre-training
order: 3
---

# Pre-training

The 2018–2019 transition: instead of training a model from scratch on each downstream task, *pre-train* on a self-supervised objective over a huge unlabeled corpus, then *fine-tune* with a small labelled dataset. This is the recipe that made BERT and GPT.

## Two families of objective

### Autoregressive (causal) language modelling — GPT

Given tokens $w_1, \dots, w_T$, factor the joint as

$$
\log p(w_{1:T}) \;=\; \sum_{t=1}^{T} \log p(w_t \mid w_{<t}).
$$

A causal mask in self-attention prevents position $t$ from looking at positions $> t$. This is exactly what GPT-2 (and every decoder-only LLM since) optimises.

GPT-2 also showed that a sufficiently large autoregressive model performs many tasks **zero-shot** when prompted appropriately — the seed of in-context learning.

### Masked language modelling — BERT

Bidirectional context is more useful for downstream classification than left-to-right. BERT randomly masks 15% of tokens and trains the encoder to recover them:

$$
\mathcal{L}_{\text{MLM}} \;=\; -\sum_{t \in M} \log p(w_t \mid w_{\setminus M}).
$$

A second next-sentence-prediction objective was later shown to be unnecessary (RoBERTa).

### Replaced-token detection — ELECTRA

MLM is sample-inefficient: the gradient only flows through the 15% of masked tokens. ELECTRA trains a small generator to substitute plausible replacements, then trains the *discriminator* to flag which tokens were replaced — every token contributes to the loss, giving 4× more signal per sample.

### Denoising seq2seq — BART / T5

BART corrupts the input with arbitrary noise (token masking, deletion, infilling, sentence shuffling) and trains an encoder–decoder to reconstruct the original. T5 unifies every NLP task as text-to-text. This family powers most modern instruction-tuned encoder–decoders.

## What pre-training gives you

A frozen language representation that can be **fine-tuned** with a tiny task-specific head and a few thousand examples — the dominant paradigm from 2019 until the GPT-3-style "just prompt it" approach took over for large enough models. Both views coexist today: BERT-style encoders for retrieval / classification, GPT-style decoders for generation.

## Reading list

- *Language Models are Unsupervised Multitask Learners* — Radford, Wu, Child, Luan, Amodei, Sutskever, 2019 (GPT-2).
- *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding* — Devlin, Chang, Lee, Toutanova, NAACL 2019.
- *ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators* — Clark, Luong, Le, Manning, ICLR 2020.
- *BART: Denoising Sequence-to-Sequence Pre-training* — Lewis et al., ACL 2020.

## What to read next

- [Scaling Laws & Emergent Abilities](./scaling-laws) — what happens when you make the pre-training run much larger.
- [Instruction Tuning](./instruction-tuning) — how to make a pre-trained model actually *follow* instructions.
