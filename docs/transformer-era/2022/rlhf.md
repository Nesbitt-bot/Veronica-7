---
title: "RLHF: Reward Models & PPO"
order: 3
---

# RLHF: Reward Models & PPO

Reinforcement Learning from Human Feedback is the technique that made [InstructGPT](./instructgpt), ChatGPT, Claude, and most aligned LLMs work. Conceptually it predates 2022 — Christiano et al. (NeurIPS 2017) introduced RLHF for Atari preference learning, and Stiennon et al. (NeurIPS 2020) applied it to summarisation — but 2022 is the year it became the canonical alignment recipe at LLM scale. This page covers the mechanics; see [InstructGPT](./instructgpt) for the headline result and the [LLM track](../../llm/reasoning/rlhf) for a deeper treatment.

## Why RL?

Two pre-RLHF alignment options:

- **Supervised fine-tuning** on (prompt, ideal-response) pairs. Works for behaviours you can demonstrate; fails when "ideal" is hard to specify directly.
- **Hand-crafted heuristics** in the loss. Brittle; cannot capture nuanced preferences like "helpful but not sycophantic".

RLHF lets you optimise against a **learned proxy** for human preference — preferences are easier to elicit than demonstrations ("which of these two is better?" beats "what would the perfect answer be?"). The reward model converts pairwise comparisons into a scalar score, and RL optimises the LM against it.

## Stage 1 — Reward modelling

Collect human-preference data: for each prompt $x$, sample two completions $y_w, y_l$ from a model and have humans pick the **winner**. Train a reward model $r_\phi(x, y)$ — initialised from the SFT LM with a scalar regression head — to fit a Bradley-Terry preference model:

$$
P(y_w \succ y_l \mid x) \;=\; \sigma(r_\phi(x, y_w) - r_\phi(x, y_l)).
$$

The training loss is the negative log-likelihood:

$$
\mathcal{L}_\phi \;=\; -\mathbb{E}_{(x, y_w, y_l)}\!\bigl[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\bigr].
$$

The reward model gives a scalar evaluation of any (prompt, response) pair, evaluable in milliseconds. Its absolute scale is unidentified — only differences matter.

## Stage 2 — RL fine-tuning with PPO

Optimise the LM policy $\pi_\theta$ against the reward model with [PPO](../../dnn/rl/ppo-trpo):

$$
\max_\theta \; \mathbb{E}_{x \sim \mathcal{D},\; y \sim \pi_\theta(\cdot \mid x)}\!\bigl[r_\phi(x, y)\bigr] - \beta\, \mathrm{KL}\bigl(\pi_\theta(\cdot \mid x) \,\|\, \pi_\text{ref}(\cdot \mid x)\bigr).
$$

The KL term anchors the policy to the SFT reference. Without it, PPO would **over-optimise** against $r_\phi$ — find adversarial responses that the reward model misjudges as great but humans hate. With $\beta$ around 0.01–0.05, the optimisation stays in a "near-SFT" neighbourhood while exploring useful improvements.

In practice, the KL penalty is folded into the per-token reward:

$$
\tilde{r}(x, y) \;=\; r_\phi(x, y) \;-\; \beta \log \frac{\pi_\theta(y \mid x)}{\pi_\text{ref}(y \mid x)}.
$$

This is conceptually the same as a hard-constrained KL trust region but easier to engineer.

## Engineering details that matter

RLHF is notoriously hard to get right. The "37 implementation details" list (Engstrom et al.) for PPO on Atari has a counterpart for LLM RLHF, including:

- **Generalised Advantage Estimation** with $\lambda \approx 0.95$.
- **Reward normalisation** — running mean/std over rewards, otherwise PPO becomes scale-sensitive.
- **Value function** — separate head, trained with MSE loss against returns.
- **Clipped policy ratio** — standard PPO, with $\epsilon \approx 0.2$.
- **Periodic reference-model updates** — the SFT reference can be replaced with a recent policy snapshot to avoid pinning the policy too tightly.
- **Reward-model overoptimisation** — monitor for mode collapse and reward hacking; consider ensembling multiple reward models.

Get any of these wrong and RLHF either diverges or produces a model that scores well on $r_\phi$ but degrades subjectively.

## Common failure modes

- **Reward hacking** — the policy finds prompts/strategies the RM evaluates favourably for the wrong reasons. Examples: hedging language, padding answers, sycophancy.
- **Verbosity bloat** — RMs trained on human preference often prefer longer answers, so the policy learns to be verbose. Mitigated by length normalisation.
- **KL drift** — even with the penalty, the policy diverges from SFT slowly; eventually the reference becomes stale.
- **Mode collapse** — the policy concentrates on a narrow set of high-reward responses, losing diversity.

Each has known mitigations; getting them all right requires production-grade RLHF infrastructure that few orgs operate.

## Alternatives

- **DPO** — Direct Preference Optimization (Rafailov et al., 2023) skips the explicit reward model and PPO loop, fitting the policy directly from preference data with a closed-form supervised loss. Simpler, often comparable, the modern default for many open-source projects.
- **GRPO** — Group Relative Policy Optimization (DeepSeek, 2024) replaces the value model with a relative-rank baseline within sampled groups. Cheaper than PPO at frontier scale.
- **RLAIF / Constitutional AI** — replace human preferences with AI-generated preferences from a constitution (Anthropic, 2022). See [Constitutional AI](../2023/constitutional-ai).
- **RLVR** — replace the reward model with verifiable rewards (unit tests, math correctness). Powers o1, R1, and the modern reasoning-LM era.

## What to read next

- [InstructGPT](./instructgpt) — the SFT + RM + PPO pipeline.
- [PPO & TRPO](../../dnn/rl/ppo-trpo) — the RL algorithm.
- [RLHF (LLM track)](../../llm/reasoning/rlhf) — alternative formulations including DPO.
