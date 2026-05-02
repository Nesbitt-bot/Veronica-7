---
title: Instruction Tuning
order: 5
---

# Instruction Tuning

A pre-trained LM is excellent at *continuing text*, not at *following instructions*. Instruction tuning is the bridge: take a base model and fine-tune it on a dataset of `(instruction, response)` pairs covering many tasks, so it learns the meta-skill of obeying natural-language directives.

## The recipe

1. Collect a diverse multi-task dataset, expressed as natural-language instructions plus desired responses.
2. Fine-tune the base model with standard next-token cross-entropy.
3. Evaluate **zero-shot** on held-out task families — instruction tuning's main claim is that the model now generalises to instructions it never saw at training time.

T0 (Sanh et al.) and FLAN (Wei et al.) both demonstrated this: an 11B-parameter T5 instruction-tuned on a tag soup of NLP benchmarks beats a 175B GPT-3 zero-shot on many held-out tasks.

## Where do instructions come from?

- **Re-cast existing benchmarks** — Sanh et al.'s P3 dataset templates 170+ NLP datasets into instruction form.
- **Crowdsourced** — Mishra et al.'s *Natural Instructions* hires annotators to write task descriptions, then uses model outputs as responses.
- **Self-generated** — *Self-Instruct* (Wang et al.) bootstraps from a few seed tasks: prompt a base LM to invent new instructions, prompt it again to answer them, filter, fine-tune. This is how Alpaca and many open instruction-tuned models were built.

## How much data do you need?

*LIMA* (Zhou et al., 2023) made the surprising claim that **1,000 carefully curated examples** suffice to instruction-tune a strong base model to near-frontier dialogue quality — quality of demonstrations dwarfs quantity.

*How Far Can Camels Go?* (Wang et al., 2023) systematically compared instruction-tuning datasets at fixed budget and found that mixing data sources (academic NLP + crowdsourced + dialogue) is more important than any single source's size.

## Limitations

Pure supervised instruction tuning teaches the model to *imitate* desired outputs but not to *prefer* one output over another. For preference-shaping (helpfulness, harmlessness, style) you also need the techniques in [RLHF](../reasoning/rlhf).

## Reading list

- *Multitask Prompted Training Enables Zero-Shot Task Generalization* — Sanh et al., ICLR 2022 (T0).
- *Cross-Task Generalization via Natural Language Crowdsourcing Instructions* — Mishra et al., ACL 2022.
- *Self-Instruct: Aligning Language Models with Self-Generated Instructions* — Wang et al., ACL 2023.
- *LIMA: Less Is More for Alignment* — Zhou et al., NeurIPS 2023.
- *How Far Can Camels Go? Exploring the State of Instruction Tuning on Open Resources* — Wang et al., NeurIPS 2023.

## What to read next

- [RLHF](../reasoning/rlhf) — the second alignment stage that follows instruction tuning.
- [Chain-of-Thought & Inference-Time Scaling](../reasoning/chain-of-thought) — what an instruction-tuned model can do when you ask it to think.
