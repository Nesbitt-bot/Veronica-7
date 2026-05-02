---
title: RLVR — Reinforcement Learning from Verifiable Rewards
order: 4
---

# RLVR — Reinforcement Learning from Verifiable Rewards

The post-RLHF wave. Instead of training a reward model on subjective human preferences, take tasks where the answer can be **automatically checked** — math problems with known solutions, code with unit tests, formal proofs — and use that verifier as the reward. The result is the new generation of "reasoning models" (DeepSeek-R1, OpenAI o-series, Anthropic's extended-thinking models) that learn to deliberate at length before answering.

## Why "verifiable"?

RLHF's main scaling bottleneck is the reward model: it is itself a learned approximator that the policy can hack (Goodhart). Verifiable rewards close that loop:

- **Math**: parse the final answer, compare to ground truth.
- **Code**: run unit tests, count passes.
- **Formal proofs**: check the proof object against the kernel.
- **Multiple-choice**: match the letter.

There is no learned reward model to game; the policy can only succeed by actually solving the problem.

## DeepSeek-R1

*DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning* (DeepSeek-AI, 2025) showed the recipe at frontier scale. Two surprising findings:

1. **R1-Zero** — RL from a base model with *no* SFT cold-start — already exhibits long chain-of-thought, self-verification, and "aha moments" where it backtracks. RLVR is sufficient on its own to elicit reasoning behaviour.
2. The classical pipeline (SFT cold-start → RL → SFT distillation → RL again) further closes the gap with o1.

The training signal is a simple format reward (CoT must be wrapped in `<think>...</think>` tags) plus the verifier's correctness reward. PPO is used, but with substantial group-baseline tricks (GRPO) to cut memory.

## DAPO

*DAPO: An Open-Source LLM Reinforcement Learning System at Scale* (Yu et al., 2025) packages an open RLVR stack with several training-stability tricks:

- **Decoupled clipping** — separate $\epsilon$ values for upside and downside ratio clipping in PPO.
- **Token-level loss** instead of sequence-level mean — each token contributes equally regardless of sequence length.
- **Dynamic sampling** — over-sample high-reward prompts.
- **Soft over-long penalty** — discourage reward-hacking via runaway chain length.

DAPO matches DeepSeek-R1 reasoning gains with a fraction of the engineering complexity.

## Does RL really teach new capabilities?

*Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?* (Yue et al., 2025) is the critical companion paper. It evaluates RLVR-trained models with **pass@k** for large k and finds: as k grows, the base model often *catches up to or exceeds* the RL-tuned model. RL is not creating new solutions — it is concentrating sampling probability on solutions the base model could already produce.

This reframes RLVR as **inference-compute compression**: it converts test-time search (sample many, verify) into train-time amortisation (one sample, often correct). The "frontier" of capabilities is set by the base model.

## SFT vs. RL

*SFT Memorizes, RL Generalizes: A Comparative Study of Foundation Model Post-training* (Chu et al., 2025) compares SFT and RL on identical tasks. SFT improves in-distribution accuracy but degrades out-of-distribution; RL improves both. The proposed mechanism: SFT pushes the model to mimic specific token sequences, while RL only constrains the *outcome*, leaving the model free to discover diverse pathways — a form of regularisation against memorisation.

## Reading list

- *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning* — DeepSeek-AI, 2025.
- *DAPO: An Open-Source LLM Reinforcement Learning System at Scale* — Yu et al., 2025.
- *Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?* — Yue et al., 2025.
- *SFT Memorizes, RL Generalizes: A Comparative Study of Foundation Model Post-training* — Chu et al., 2025.

## What to read next

- [Efficient RLVR](../efficient/rlvr) — making the RL fine-tuning loop cheap enough to iterate.
- [RLHF](./rlhf) — the alignment technique RLVR builds on.
- [Chain-of-Thought & Inference-Time Scaling](./chain-of-thought) — what RLVR amortises into the model's weights.
