---
title: Efficient RLVR
order: 2
---

# Efficient RLVR

RLVR (see [reasoning/RLVR](../reasoning/rlvr)) is expensive. Each training step requires generating long chains of thought from the policy, scoring them with the verifier, and running PPO updates. A single end-to-end run can cost millions of GPU-hours. This page collects the 2025 wave of techniques that cut that bill without losing reasoning gains.

## The bottleneck: rollouts

In RLVR the dominant cost is **generating rollouts** — sampling long completions to compute advantages. Each rollout is a full autoregressive decode of thousands of tokens, often from a 70B+ model, and most rollouts contribute very little gradient signal (the verifier reward is mostly 0 or saturated 1).

## Selective rollouts

*Act Only When It Pays: Efficient Reinforcement Learning for LLM Reasoning via Selective Rollouts* (Zhao et al., 2025) observes: the policy already knows the answer to many training prompts. Generating rollouts for those is wasted compute. The proposed method scores each prompt by the policy's confidence (or by a small predictor) and **skips low-information rollouts**. Empirically saves 2–4× compute with no accuracy loss.

## High-entropy minority tokens

*Beyond the 80/20 Rule: High-Entropy Minority Tokens Drive Effective Reinforcement Learning for LLM Reasoning* (Wang et al., 2025) finds that ~20% of tokens in a typical reasoning chain — the high-entropy "decision points" where the model branches — carry essentially all of the learning signal. The remaining 80% of tokens (deterministic continuations: "the", "=", "Step 2:") contribute almost no useful gradient. By **masking the gradient on low-entropy tokens**, you cut training compute by ~5× and *improve* final accuracy because the loss is no longer drowned in noise.

## Spurious rewards

*Spurious Rewards: Rethinking Training Signals in RLVR* (Lin et al., 2025) is a sobering ablation. They construct deliberately broken rewards — random rewards, length-based rewards, format-only rewards — and discover that RL training still elicits reasoning gains nearly as good as a real verifier. The interpretation: RL's main role is to **shift the policy distribution** toward a different sampling regime; the specific reward signal often matters less than the act of doing RL itself. This is a strong cousin of the "RL doesn't add new capabilities" argument from Yue et al.

The practical implication: cheap, weakly-supervised reward signals may be enough — you don't always need a perfect verifier.

## R-Zero

*R-Zero: Self-Evolving Reasoning LLM from Zero Data* (Wang et al., 2025) takes the "no human data needed" thread to the extreme. The model itself proposes problems, attempts solutions, and verifies them via a self-consistency check (multiple sampled solutions agreeing on an answer). No external dataset, no human labels, no curated math problems — pure self-play. Reasoning capability emerges and improves over training rounds.

## Common thread

All four papers chip away at the same assumption: that RLVR needs a large dataset of high-quality verified problems and brute-force rollouts. The 2025 reality: most of the budget is wasted, the reward can be noisy, and the data can be self-generated.

## Reading list

- *Act Only When It Pays: Efficient Reinforcement Learning for LLM Reasoning via Selective Rollouts* — Zhao et al., 2025.
- *Beyond the 80/20 Rule: High-Entropy Minority Tokens Drive Effective Reinforcement Learning for LLM Reasoning* — Wang et al., 2025.
- *Spurious Rewards: Rethinking Training Signals in RLVR* — Lin et al., 2025.
- *R-Zero: Self-Evolving Reasoning LLM from Zero Data* — Wang et al., 2025.

## What to read next

- [RLVR](../reasoning/rlvr) — the underlying paradigm these efficiency papers optimise.
- [PEFT](./peft) — the train-time efficiency cousin.
- [Efficient Inference](./inference) — once you've trained a reasoning model, decode it cheaply.
