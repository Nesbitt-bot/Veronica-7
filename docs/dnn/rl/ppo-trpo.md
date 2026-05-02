---
title: PPO & TRPO
order: 6
---

# PPO & TRPO

PPO (Proximal Policy Optimization) is the dominant on-policy RL algorithm in 2025 — used in robotics, game AI, and the [RLHF](../../llm/reasoning/rlhf) pipeline that aligns large language models. It is a simplified, more practical descendant of TRPO (Trust Region Policy Optimization), which gave the field its first principled answer to "how do we keep policy updates from destabilising training?".

## The trust-region idea

Vanilla [policy gradient](./policy-gradient) updates can be catastrophically large — one bad batch flips a working policy into a useless one. The fundamental insight: don't measure update size in **parameter space** ($\|\Delta\theta\|$, which is meaningless across reparameterisations) but in **policy space** ($\mathrm{KL}(\pi_\theta \| \pi_{\theta'})$).

## TRPO — the constrained problem

*Trust Region Policy Optimization* (Schulman, Levine, Abbeel et al., ICML 2015) maximises expected advantage subject to a KL constraint:

$$
\max_\theta \; \mathbb{E}\!\left[\frac{\pi_\theta(a \mid s)}{\pi_{\theta_\text{old}}(a \mid s)}\, \hat{A}(s, a)\right]
\quad \text{s.t.} \quad \mathbb{E}\!\bigl[ \mathrm{KL}(\pi_{\theta_\text{old}}(\cdot \mid s) \,\|\, \pi_\theta(\cdot \mid s)) \bigr] \leq \delta.
$$

Solved with a constrained second-order method: linearise the objective, quadratically approximate the KL constraint via the Fisher information matrix (the **natural gradient** direction), then a line search. The result is a guaranteed monotonic policy improvement bound, with $\delta \approx 0.01$ working across Mujoco and Atari.

The drawback is engineering complexity — TRPO requires conjugate-gradient solves and is awkward to mix with parameter sharing or recurrent networks.

## PPO — the practical simplification

*Proximal Policy Optimization Algorithms* (Schulman, Wolski, Dhariwal, Radford, Klimov, 2017) replaces TRPO's hard constraint with a **clipped surrogate objective**:

$$
\mathcal{L}^\text{CLIP}(\theta) \;=\; \mathbb{E}\!\left[ \min\bigl( r_t(\theta) \hat{A}_t,\; \mathrm{clip}(r_t(\theta), 1 - \epsilon, 1 + \epsilon) \, \hat{A}_t \bigr) \right],
$$

where $r_t(\theta) = \pi_\theta(a_t \mid s_t) / \pi_{\theta_\text{old}}(a_t \mid s_t)$ is the importance ratio. Two regimes:

- **Positive advantage** ($\hat{A}_t > 0$): clip prevents the gradient from increasing $\pi_\theta(a_t \mid s_t)$ beyond a factor of $1 + \epsilon$. The model can still learn, but only up to a bounded "trust region" around $\pi_\text{old}$.
- **Negative advantage** ($\hat{A}_t < 0$): clip prevents pushing $\pi_\theta(a_t \mid s_t)$ below $1 - \epsilon$.

Standard $\epsilon = 0.2$. The full PPO loss adds a value-function loss and an entropy bonus:

$$
\mathcal{L}^\text{PPO}(\theta, \phi) \;=\; \mathcal{L}^\text{CLIP}(\theta) - c_1 \, \mathcal{L}^\text{VF}(\phi) + c_2 \, \mathcal{H}[\pi_\theta].
$$

PPO uses standard SGD/Adam, runs **multiple epochs** over each batch of rollouts (unlike TRPO's single update), and trivially supports any policy parameterisation including recurrent and attention-based ones. This combination — strong empirical performance plus low engineering tax — is why PPO became the default.

## What PPO is and isn't

PPO is **not** a theoretical improvement over TRPO — TRPO's monotonic-improvement bound was rigorous; PPO's clipping is heuristic. What PPO is is *much easier to engineer correctly*. The "37 implementation details" list (Engstrom et al., ICLR 2020) catalogues the engineering choices that distinguish a working PPO from one that diverges silently — orthogonal initialisation, advantage normalisation, gradient clipping, learning-rate annealing, and several others all matter.

## PPO in RLHF

The [RLHF](../../llm/reasoning/rlhf) pipeline that produced ChatGPT runs PPO with a learned reward model. Specifics:

- Policy = the language model.
- Action = next token.
- Reward = scalar from a separate reward model fitted on human preference labels.
- KL penalty between the policy and a frozen SFT reference model — implemented as an additive reward $-\beta \log[\pi_\theta(y \mid x) / \pi_\text{ref}(y \mid x)]$ rather than a hard constraint.

The KL-to-reference penalty is the analogue of PPO's trust region in the language-model setting: it prevents the policy from drifting arbitrarily far from a known-good initialisation. DPO and follow-ups removed even the PPO machinery for many cases, but PPO-RLHF was the recipe that made aligned LLMs first viable.

## What to read next

- [Actor-Critic](./actor-critic) — the structural template both TRPO and PPO sit in.
- [DDPG, TD3, SAC](./ddpg-sac) — the off-policy continuous-control alternative.
- [RLHF](../../llm/reasoning/rlhf) — PPO applied to language models.
