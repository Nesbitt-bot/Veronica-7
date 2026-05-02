---
title: GPT-1 — Generative Pretraining
order: 3
---

# GPT-1 — Generative Pretraining

*Improving Language Understanding by Generative Pre-Training* (Radford, Narasimhan, Salimans, Sutskever, OpenAI 2018) introduced the **Generative Pre-Training** recipe: pretrain a Transformer decoder on next-token prediction over a large corpus, then fine-tune on labelled tasks. GPT-1 was modest in size (117M parameters) and modest in headline results — but the recipe it established turned out to be the right one. Every modern frontier LLM is a direct descendant of GPT-1's two-step training.

## The setup

Two-stage training:

**Stage 1 — generative pretraining.** Train a 12-layer Transformer decoder on the BooksCorpus (~800M words, mostly fiction) by next-token prediction:

$$
\mathcal{L}_\text{pretrain}(\theta) \;=\; \sum_t \log P_\theta(x_t \mid x_{<t}).
$$

The autoregressive objective is the language-model objective in its simplest form. With causal attention masking, a Transformer can be unrolled in parallel during training and one-token-at-a-time during inference.

**Stage 2 — supervised fine-tuning.** For each downstream task, format the labelled data into the model's input space (with task-specific delimiters) and fine-tune end-to-end with a small task-specific output head:

$$
\mathcal{L}_\text{ft}(\theta) \;=\; \mathcal{L}_\text{task} + \lambda \, \mathcal{L}_\text{pretrain}.
$$

The auxiliary pretraining-loss term keeps the model from forgetting general language modelling during fine-tuning.

## Architecture

12-layer Transformer decoder with masked self-attention only — no encoder, no encoder-decoder cross-attention. 768 hidden dim, 12 heads, GELU activation, learned positional embeddings. 117M parameters.

The decoder-only choice was significant: BERT (encoder-only) was contemporaneous, and the two papers' choices represented a fork in pretraining that played out for years.

## Results

GPT-1 set new SOTA on 9 of 12 evaluated tasks (NLI, question answering, sentence-similarity, classification). The headline was not the absolute numbers — BERT-large would beat them within months — but the **methodology**: a single pretrained model, lightly fine-tuned, beat per-task systems engineered with heavy task-specific architecture and feature engineering.

This was the proof-of-concept that **generic pretraining transfers** in NLP, the same lesson that ImageNet had taught vision in 2012. By 2019 the recipe was universal.

## Why decoder-only and autoregressive?

The autoregressive objective has three structural advantages that proved decisive:

- **Generative.** The pretrained model can directly produce text — no architectural change needed for tasks like summarisation, translation, or generation.
- **Sample-efficient on every token.** Every position contributes to the loss. Compare BERT's MLM, where only ~15% of positions count.
- **Scaling-friendly.** Same architecture and objective scales from 100M parameters (GPT-1) to 1T+ today, with the [scaling laws](../2020/scaling-laws) showing predictable improvement.

In 2018 these advantages were not obvious — encoder-only BERT initially looked stronger on understanding benchmarks, and encoder-decoder T5 looked cleaner on tasks formatted as text-to-text. The verdict came with [GPT-2](./gpt-2), GPT-3, and the rest: decoder-only autoregressive scales best.

## Input formatting and "task as text"

GPT-1 evaluated on diverse downstream tasks by reformatting each as a token sequence:

- **Classification** — `[BOS] document [DELIM] $`. Predict label from the last hidden state.
- **Entailment** — `[BOS] premise [DELIM] hypothesis $`. Predict label from last hidden state.
- **Multiple choice** — for each option, score `[BOS] context [DELIM] option $`; pick the highest.

This unified-task format was a precursor of T5's text-to-text framing and of GPT-3's zero/few-shot prompting. The same approach generalises to in-context learning at scale.

## What GPT-1 didn't have

- **In-context learning** — GPT-1 still required gradient-based fine-tuning per task. Zero-shot capability emerged in [GPT-2](./gpt-2) and was the headline of [GPT-3](../2020/gpt-3).
- **Instruction following** — fine-tuning on natural-language instructions came with [InstructGPT](../2022/instructgpt).
- **Alignment** — preference-based fine-tuning was four years out ([RLHF](../2022/rlhf)).

## What GPT-1 got right that mattered

The choice of **decoder-only Transformer + next-token prediction + transfer learning** turned out to be the entire architectural commitment for the next 7+ years. GPT-2, GPT-3, GPT-4, Claude, LLaMA, Mistral, Gemini, Qwen — every frontier autoregressive LLM is structurally GPT-1, scaled and refined. The architectural choice in 2018 mattered immensely.

## What to read next

- [GPT-2](./gpt-2) — the same recipe, ten times bigger, with emergent zero-shot.
- [BERT](./bert) — the bidirectional contemporary.
- [T5](./t5) — encoder-decoder unification.
