---
title: Parameter-Efficient Fine-Tuning
order: 1
---

# Parameter-Efficient Fine-Tuning (PEFT)

Full fine-tuning of a 70B model needs hundreds of gigabytes of GPU memory and produces a 70B-sized artifact per task. PEFT methods fine-tune <1% of parameters, get within a few points of full fine-tuning quality, and produce checkpoints small enough to store thousands of them.

## Prompt tuning

*The Power of Scale for Parameter-Efficient Prompt Tuning* (Lester et al., 2021) freezes the entire model and learns a small set of **continuous prompt embeddings** prepended to the input:

$$
[\,\underbrace{p_1, \dots, p_k}_{\text{learned}},\, x_1, \dots, x_n\,]
$$

Only the $k \times d$ prompt parameters are trained. At small scale this loses to full fine-tuning, but the gap closes as the base model grows — at 10B+ parameters, prompt tuning matches full FT on most benchmarks.

## Adapters

*Parameter-Efficient Transfer Learning for NLP* (Houlsby et al., 2019) — the original adapters paper — inserts a small bottleneck MLP after each Transformer sub-layer:

$$
\text{Adapter}(h) = h + W_{\text{up}} \,\sigma(W_{\text{down}} h)
$$

with $W_{\text{down}} \in \mathbb{R}^{r \times d}, W_{\text{up}} \in \mathbb{R}^{d \times r}$ and $r \ll d$. Only the adapter weights train; the rest of the model is frozen. Inference cost rises slightly because adapters add layers; LoRA fixes that.

## LoRA

*LoRA: Low-Rank Adaptation of Large Language Models* (Hu et al., 2021) — the workhorse. Instead of inserting new modules, decompose the *update* to each weight matrix as a low-rank product:

$$
W' = W + \Delta W, \qquad \Delta W = B A, \quad A \in \mathbb{R}^{r \times d},\ B \in \mathbb{R}^{d \times r}.
$$

Train only $A, B$; freeze $W$. At inference time, $\Delta W$ can be **merged** back into $W$ — zero added latency. With $r = 8$ on a 7B model, you fine-tune ~0.1% of parameters and get within ~1 point of full FT.

LoRA is now the default for instruction tuning, RLHF/DPO post-training, and per-user personalisation. Variants:

- **QLoRA** — load the base model in 4-bit and train LoRA in fp16; fits a 65B model on one consumer GPU.
- **DoRA** — decompose updates into magnitude and direction, only direction is low-rank.
- **rsLoRA** — re-scale to fix the small-rank performance cliff.

## Text-to-LoRA

*Text-to-LoRA: Instant Transformer Adaption* (Charakorn et al., 2025) trains a hypernetwork that, given a natural-language task description, **generates a LoRA adapter directly** — no per-task training data needed. Tens of thousands of LoRAs are pre-generated from synthetic task descriptions; at inference, the user describes their task and the matching adapter is dispatched. A glimpse of "skill libraries" for LLMs.

## When to use what

- **Prompt tuning** — best when you have only a frozen API model with prefix-tuning support.
- **Adapters** — historical interest; superseded by LoRA.
- **LoRA / QLoRA** — default choice for any local fine-tune.
- **Text-to-LoRA** — emerging; promising for personalisation at scale.

## Reading list

- *The Power of Scale for Parameter-Efficient Prompt Tuning* — Lester, Al-Rfou, Constant, EMNLP 2021.
- *Parameter-Efficient Transfer Learning for NLP* — Houlsby et al., ICML 2019.
- *LoRA: Low-Rank Adaptation of Large Language Models* — Hu et al., ICLR 2022.
- *Text-to-LoRA: Instant Transformer Adaption* — Charakorn et al., 2025.

## What to read next

- [Efficient RLVR](./rlvr) — apply LoRA inside the RL fine-tuning loop.
- [Efficient Inference](./inference) — the inference-time companion to PEFT's training-time savings.
