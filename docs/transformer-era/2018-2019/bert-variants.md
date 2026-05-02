---
title: BERT Variants — RoBERTa, ALBERT, ELECTRA
order: 2
---

# BERT Variants — RoBERTa, ALBERT, ELECTRA

The year after [BERT](./bert), three major papers refined the recipe — addressing under-training, parameter inefficiency, and the inefficient MLM objective. RoBERTa is the most widely adopted; ELECTRA introduced the most theoretically interesting alternative; ALBERT compressed BERT to ~1/10 the parameters. Together they marked the transition from "BERT works" to "BERT is mature engineering".

## RoBERTa — train BERT properly

*RoBERTa: A Robustly Optimized BERT Pretraining Approach* (Liu, Ott et al., 2019) showed that BERT was **massively under-trained** and made several recipe changes that lifted GLUE scores by ~5 points without changing the architecture:

- **Drop NSP** — Next Sentence Prediction adds nothing useful.
- **Larger batches, longer training** — 8K-token batches for 500K steps; 10× the original BERT compute budget.
- **Dynamic masking** — generate fresh masks each epoch instead of pre-computing them once. Same architecture, more efficient sample usage.
- **Larger corpus** — 160 GB combining BooksCorpus, Wikipedia, CC-News, OpenWebText, Stories.
- **No `[CLS]` / `[SEP]` quirks** — clean text input.

The lesson is methodological: scaling laws were not yet articulated, but *RoBERTa is essentially BERT with the Chinchilla-style "train longer on more data" recipe applied avant la lettre*. RoBERTa-base became the de-facto fine-tuning starting point throughout 2019–2021, replacing the original BERT-base.

## ALBERT — parameter-sharing for compression

*ALBERT: A Lite BERT for Self-supervised Learning of Language Representations* (Lan et al., ICLR 2020) cut BERT's parameter count by ~10× while matching or exceeding its accuracy. Three changes:

- **Factorised embedding** — separate the input embedding dimension from the hidden dimension, reducing the embedding matrix from $V \times H$ to $V \times E + E \times H$ for $E \ll H$.
- **Cross-layer parameter sharing** — share the same Transformer block across all $L$ layers. Memory drops from $L \times \mathrm{block}$ to $1 \times \mathrm{block}$, with surprisingly little quality loss.
- **Sentence-Order Prediction** replaces NSP with a harder coherence task — predict whether two consecutive sentences are in the original order or swapped.

ALBERT-xxlarge has ~235M parameters but matches BERT-large (340M) — a compelling argument that BERT is over-parameterised. Cross-layer sharing made ALBERT slow at *inference* (you still run $L$ forward passes), so it lost popularity after RoBERTa, but the parameter-sharing idea recurred in later work.

## ELECTRA — replaced-token detection

*ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators* (Clark, Luong, Le, Manning, ICLR 2020) attacked BERT's most striking inefficiency: **only ~15% of tokens contribute to the loss per batch**.

The setup:

- A small **generator** (a tiny MLM, BERT-style) replaces 15% of tokens with plausible alternatives.
- A larger **discriminator** is trained to predict, for **every token**, whether it is original or replaced.

The discriminator's loss covers 100% of tokens, not 15%. ELECTRA-base matches RoBERTa-large at a fraction of the compute, and ELECTRA-large set new GLUE SOTA at its release. The objective is structurally similar to GAN training but applied to representation learning.

ELECTRA didn't take over (RoBERTa's simpler recipe scaled better in practice), but the **replaced-token detection** objective remains theoretically attractive and has reappeared in modern pretraining variants.

## What this era taught us

- **Scaling matters more than architectural cleverness.** RoBERTa's "just train longer" beat clever architecture changes.
- **The pretraining objective matters in compute-limited regimes.** ELECTRA's denser signal wins per-FLOP.
- **Parameter sharing has a cost-benefit ceiling.** ALBERT works but is slow; sharing didn't transfer to the modern decoder-only LLM era.

The bigger lesson: by ~2020 the architectural-design phase of NLP was largely finished. The next half-decade would focus on **scale** ([scaling laws](../2020/scaling-laws)), **alignment** ([RLHF](../2022/rlhf)), and **modality fusion** rather than encoder-architecture tweaking.

## What to read next

- [BERT](./bert) — the foundation these variants improve on.
- [T5](./t5) — encoder-decoder unification, contemporaneous.
- [Scaling Laws](../2020/scaling-laws) — the formal version of "just train longer".
