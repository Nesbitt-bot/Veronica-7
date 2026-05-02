---
title: PaLM, Chinchilla, Gopher
order: 5
---

# PaLM, Chinchilla, Gopher

The 2022 frontier models from Google (PaLM) and DeepMind (Gopher, Chinchilla) refined the [scaling-laws](../2020/scaling-laws) recipe and explored the limits of pre-RLHF dense Transformers. Chinchilla in particular changed the playbook: it showed that GPT-3 and most contemporary big LMs were **massively under-trained**, that data-and-model should scale together, and that a 70B model trained on 1.4T tokens beats a 280B model trained on 280B tokens at matched compute.

## Gopher (Dec 2021)

*Scaling Language Models: Methods, Analysis & Insights from Training Gopher* (Rae, Borgeaud, Cai et al., DeepMind 2021) trained a series of dense Transformers from 44M to 280B parameters on a curated 300B-token corpus. Headline findings:

- **Scale matters most for some tasks** (math, logical reasoning, common sense), saturates faster on others (translation, syntax).
- **Bias and toxicity scale modestly** — bigger models are not dramatically worse on these axes, partly because of better instruction-following.
- **Some tasks plateau** at a few billion parameters; scaling beyond doesn't help.

Gopher was the largest dense LM of its time and the empirical backbone of subsequent DeepMind LLM work — RETRO, Sparrow, and eventually Gemini.

## Chinchilla (March 2022) — the compute-optimal correction

*Training Compute-Optimal Large Language Models* (Hoffmann, Borgeaud, Mensch et al., DeepMind 2022) **revisited the [scaling laws](../2020/scaling-laws)** with a more careful experimental setup and reached a strikingly different conclusion than Kaplan et al. 2020.

Kaplan: $N_\text{opt} \propto C^{0.73}$, $D_\text{opt} \propto C^{0.27}$ — most extra compute should go into bigger models.

Chinchilla: $N_\text{opt} \propto C^{0.5}$, $D_\text{opt} \propto C^{0.5}$ — model size and training tokens should scale **together**.

The empirical demonstration: train a **70B-parameter Chinchilla** on 1.4T tokens with the same compute as 280B-parameter Gopher trained on 300B tokens. Result: Chinchilla beats Gopher across the board, often by large margins.

The implication: **GPT-3, Jurassic, Gopher, MT-NLG, and most other large LMs of the era were under-trained.** The frontier should be reorganised around training smaller models on more data. This recipe directly informed every subsequent open and frontier LLM training recipe — LLaMA, Mistral, Qwen, Claude, Gemini all adopt Chinchilla-style data-heavy training.

## PaLM (April 2022)

*PaLM: Scaling Language Modeling with Pathways* (Chowdhery et al., Google 2022) trained a **540B-parameter** dense decoder on 780B tokens. PaLM was the largest dense LM at its release and demonstrated several "emergent" capabilities at scale:

- **Multi-step reasoning** — chain-of-thought prompting elicited substantially better results at 540B than at 62B than at 8B (Wei et al., NeurIPS 2022). This was the headline empirical demonstration of emergent capabilities.
- **Code generation** competitive with [Codex](../2020-2021/codex) without code-specific fine-tuning.
- **Multilingual capabilities** across 100+ languages.
- **Joke-explanation** at human-meaningful quality (a capability that had been a research open question).

PaLM was significant for two technical reasons: it was the first LM trained on **multi-pod TPU** infrastructure with the Pathways system, and it confirmed that capabilities scale through (and past) the 100B-parameter regime in interpretable ways.

PaLM 2 (May 2023) used the Chinchilla recipe — smaller model, more tokens — and was the basis of Google Bard / Gemini precursors.

## What this era settled

By mid-2022 the field had:

- **A correct scaling-laws recipe** (Chinchilla).
- **Empirical demonstrations of emergent capabilities** (PaLM) at the 100B+ scale.
- **A consistent picture** of how frontier dense Transformers should be trained.

It also marked the **end of pure scaling as a research story**. Chinchilla was the last paper that primarily moved the conversation by changing the loss vs compute curve. After 2022, frontier-model news was about **alignment** ([RLHF](./rlhf), [Constitutional AI](../2023/constitutional-ai)), **architectures beyond dense Transformers** ([Mixtral / MoE](../2023-2024/moe), [Mamba](../2023-2024/mamba)), and **inference-time compute** ([o1](../2024-2025/o1), [process rewards](../2024-2025/process-rewards)).

## What to read next

- [Scaling Laws](../2020/scaling-laws) — the framework Chinchilla corrected.
- [InstructGPT](./instructgpt) — the alignment turn that defined the next era.
- [LLaMA](../2023/llama) — the first widely-distributed open weights using Chinchilla-style training.
