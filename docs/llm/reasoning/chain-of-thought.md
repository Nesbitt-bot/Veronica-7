---
title: Chain-of-Thought & Inference-Time Scaling
order: 1
---

# Chain-of-Thought & Inference-Time Scaling

The discovery that LLM accuracy on reasoning tasks improves dramatically when the model is allowed (or instructed) to *write out its intermediate steps* before answering — and that you can buy further accuracy by spending more inference compute.

## The original observation

Wei et al. (2022) showed that prepending "Let's think step by step" or providing few-shot examples that include intermediate reasoning steps lifts a 540B PaLM from ~18% to ~57% on GSM8K (grade-school math). The effect is **emergent**: it appears only above a certain scale (≈100B params) and is essentially absent in smaller models.

The model is not gaining new knowledge — it is buying time. Each generated reasoning token gives more compute to "think with" before committing to an answer.

## Self-consistency

Since each chain is a sample, you can sample $k$ chains and **majority-vote** the final answers (Wang et al., 2023). This trades $k\times$ inference cost for several accuracy points on math/logic benchmarks. The technique works because correct reasoning paths agree, while incorrect ones tend to disagree.

## Self-refine

*Self-Refine* (Madaan et al., 2023) iterates: generate an answer, prompt the model to critique it, prompt again to revise. No retraining — the model improves its own outputs purely through prompting.

## Scaling test-time compute

*Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters* (Snell et al., 2024) is the cleanest statement of the principle: for many problems, doubling the test-time compute (more samples, longer chains, search) yields better accuracy than doubling parameters and retraining. This is the backbone of the **reasoning model** wave (o1, R1) — see [RLVR](./rlvr).

The dial has two knobs:

1. **Width** — number of independent samples / votes / search beams.
2. **Depth** — length of each chain, including self-critique and revision steps.

The compute-optimal mixture depends on problem difficulty: harder problems prefer depth.

## Reading list

- *Chain of Thought Prompting Elicits Reasoning in Large Language Models* — Wei et al., NeurIPS 2022.
- *Self-Consistency Improves Chain of Thought Reasoning in Language Models* — Wang et al., ICLR 2023.
- *Self-Refine: Iterative Refinement with Self-Feedback* — Madaan et al., NeurIPS 2023.
- *Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters* — Snell et al., 2024.

## What to read next

- [Latent-Space Reasoning](./latent) — "thinking" without emitting natural-language tokens.
- [RLVR](./rlvr) — training models to reason longer via verifiable-reward RL.
