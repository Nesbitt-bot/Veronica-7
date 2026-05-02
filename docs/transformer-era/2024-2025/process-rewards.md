---
title: Process Reward Models
order: 2
---

# Process Reward Models

A **Process Reward Model** (PRM) scores **each step** of a chain-of-thought solution, not just the final answer. PRMs are one of the methodological keys to the [o1 / R1](./o1) reasoning-model era — they let RL fine-tuning give credit (or blame) to specific intermediate reasoning steps, rather than just the final outcome. The 2024-2025 wave of reasoning models all use some variant of process-supervision training.

## Outcome reward vs process reward

Standard [RLHF](../2022/rlhf) and [RLVR](../../llm/reasoning/rlvr) use **outcome rewards** — score the whole solution as right or wrong, train the policy to produce more right ones. This works but has a sample-efficiency problem: a long reasoning trace might have a single error in step 7 that's responsible for the wrong final answer, and step-7-correctness is the actual bottleneck. Outcome reward gives no fine-grained signal.

Process rewards score each intermediate step. The reward model emits a score per step:

$$
r_t = \mathrm{PRM}(\mathbf{c}_{1:t}),
$$

where $\mathbf{c}_{1:t}$ is the partial chain-of-thought up to step $t$. The total reward for a trajectory might be the **minimum** step score (the worst step kills the trajectory), the **product** of step probabilities, or the sum.

Per-step credit assignment is much easier than per-trajectory. A PRM can identify the exact moment a reasoning chain went wrong, and the policy can learn to fix that step specifically.

## OpenAI's *Let's Verify Step by Step*

*Let's Verify Step by Step* (Lightman, Kosaraju, Burda, Edwards, Baker, Lee, Leike, Schulman, Sutskever, Cobbe, OpenAI 2023) was the foundational PRM paper. The setup:

1. Generate model solutions to MATH-style problems.
2. Have human labellers mark each step as correct, incorrect, or neutral.
3. Train a PRM on the per-step labels.
4. At inference, sample many candidate solutions, score each by the PRM, return the highest-scoring one.

Result: PRM-based selection beat outcome-reward selection by substantial margins on MATH and similar benchmarks. The paper also released **PRM800K**, a dataset of 800K human step-level labels.

The headline: process supervision **outperforms outcome supervision even at the same labelling cost**, because each annotated solution gives many step-level labels rather than one outcome label. PRMs are the right teacher signal when you have intermediate-step ground truth.

## Best-of-N + PRM

The simplest PRM use is **inference-time selection**:

1. Sample $N$ candidate solutions from the policy.
2. Score each with the PRM (sum or min of step rewards).
3. Return the highest-scoring candidate.

This is "Best-of-N with a process verifier" and is a substantial improvement over Best-of-N with outcome verifier or no verifier. With $N = 16$ to $64$ and a strong PRM, you can lift base-model performance by tens of percentage points on hard math.

The cost: $N$× inference compute. PRMs were therefore an early demonstration of **test-time compute scaling** before [o1](./o1) made it the headline.

## RL with PRMs

Beyond inference-time selection, PRMs can train the policy via RL:

- **Token-level RLHF** with the PRM giving per-step rewards.
- **PRM-guided beam search** — at each generation step, expand high-PRM-score branches.
- **MCTS-style search** with PRM as the value estimator.

Training the policy with process rewards turns out to be tricky:

- **Reward hacking** — the policy finds spurious patterns the PRM scores well but humans don't recognise as good reasoning.
- **PRM mis-specification** — if the PRM disagrees with humans on what a "correct step" is, the policy will follow the PRM's view.

DeepSeek's R1 paper specifically noted that *naive PRM training was unstable* and that simple RLVR on outcome rewards worked better at their scale. The 2025 picture: PRMs are useful for inference-time selection and verification; whether they should be used as the RL reward is contested.

## PRMs vs outcome RL

The 2024-2025 reasoning-model literature has two camps:

- **Process supervision is necessary.** *Let's Verify Step by Step*, OpenAI o1 (presumed). Per-step credit assignment is what makes long reasoning chains trainable.
- **Outcome RL is sufficient.** [DeepSeek R1](./r1) showed that pure outcome-RL on verifiable problems (math, code) suffices — the model learns to self-verify without explicit step rewards. Process supervision adds complexity without obvious wins at this regime.

The reality is probably both, depending on:

- **Domain.** Verifiable outcomes (math, code) → outcome RL works. Subjective tasks → process supervision via human labels matters.
- **Scale.** Larger base models can self-verify, reducing the marginal value of explicit PRMs.
- **Implementation.** PRMs are powerful but easy to misconfigure.

## What PRMs enable downstream

- **Reasoning-model verification** — a separate PRM can audit a frontier-reasoning-model's outputs for correctness.
- **Distillation** — PRM-scored samples become training data for smaller models.
- **Self-correction** — the model learns to detect its own mistakes by predicting step-level scores.
- **Inference-time scaling** — Best-of-N + PRM is one of several methods that trade compute for quality at inference.

## What to read next

- [o1](./o1) — the reasoning-model line that depended on process-supervision-style ideas.
- [R1](./r1) — the open counter-example showing pure outcome RL also works.
- [RLVR (LLM track)](../../llm/reasoning/rlvr) — the curriculum-track treatment.
