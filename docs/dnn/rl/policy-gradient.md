---
title: Policy Gradient & REINFORCE
order: 3
---

# Policy Gradient & REINFORCE

Policy gradient methods are the alternative to value-based RL ([Q-learning](./q-learning), [DQN](./dqn)). Instead of learning a value function and acting greedily with respect to it, they parameterise the policy directly and follow the gradient of expected return. This makes them natural for continuous action spaces and stochastic policies, and lifts directly to modern actor-critic stacks like [PPO](./ppo-trpo) and [SAC](./ddpg-sac), as well as to [RLHF](../../llm/reasoning/rlhf).

## The objective

Parameterise the policy as $\pi_\theta(a \mid s)$ — typically a neural network outputting action logits or distribution parameters. The objective is expected return:

$$
J(\theta) \;=\; \mathbb{E}_{\tau \sim \pi_\theta}\!\left[ \sum_{t=0}^{T} \gamma^t r(s_t, a_t) \right].
$$

We want $\nabla_\theta J(\theta)$ so we can ascend it with [SGD](../optimization/sgd).

## The policy gradient theorem

The naive expression $\nabla_\theta J = \nabla_\theta \mathbb{E}_\tau[R(\tau)]$ is hard because the trajectory distribution depends on $\theta$. The **log-derivative trick** (also called REINFORCE or the **score-function estimator**) rewrites it as

$$
\nabla_\theta J(\theta) \;=\; \mathbb{E}_{\tau \sim \pi_\theta}\!\left[ \sum_{t=0}^{T} \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot R_t(\tau) \right],
$$

with $R_t = \sum_{k=t}^{T} \gamma^{k-t} r_k$ the return-to-go. The gradient is computable from sampled trajectories — no model of the environment dynamics required. The key step is $\nabla_\theta p_\theta = p_\theta \nabla_\theta \log p_\theta$, which trades the gradient of an expectation for the expectation of a (gradient × score) product.

## REINFORCE

*Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning* (Williams, 1992) named the algorithm. The update rule is plain SGD on the estimator above:

1. Sample a trajectory $\tau$ by rolling out $\pi_\theta$.
2. Compute returns-to-go $R_t$.
3. Update $\theta \leftarrow \theta + \alpha \sum_t \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot R_t$.

REINFORCE is unbiased but has **enormous variance** — the same trajectory can yield wildly different $\nabla_\theta J$ estimates depending on noise. The algorithm is correct in theory but rarely usable as-is on real problems.

## Variance reduction: baselines

Subtract a state-dependent **baseline** $b(s_t)$ from the return without changing the gradient's expectation:

$$
\nabla_\theta J(\theta) \;=\; \mathbb{E}\!\left[ \sum_t \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot \bigl(R_t - b(s_t)\bigr) \right].
$$

The unbiasedness follows from $\mathbb{E}_{a_t \sim \pi_\theta}[\nabla_\theta \log \pi_\theta(a_t \mid s_t)] = 0$. The variance-minimising choice for $b(s_t)$ is approximately the value function $V^\pi(s_t)$ — and using $V^\pi$ as a learned baseline is exactly what **actor-critic** methods do (see [Actor-Critic](./actor-critic)).

The advantage $A(s_t, a_t) = R_t - V^\pi(s_t)$ measures how much better than average action $a_t$ was. Modern policy-gradient methods all use some form of advantage estimation.

## Generalised Advantage Estimation (GAE)

*High-Dimensional Continuous Control Using Generalized Advantage Estimation* (Schulman et al., ICLR 2016) addresses the bias-variance trade-off in advantage estimation. The "Monte Carlo" advantage $R_t - V(s_t)$ is unbiased but high-variance; the one-step TD advantage $r_t + \gamma V(s_{t+1}) - V(s_t)$ is low-variance but biased. GAE blends them via a $\lambda$ knob:

$$
\hat{A}_t^\text{GAE}(\lambda) \;=\; \sum_{l=0}^{\infty} (\gamma \lambda)^l \, \delta_{t+l}, \qquad \delta_k = r_k + \gamma V(s_{k+1}) - V(s_k).
$$

$\lambda = 0$ recovers TD; $\lambda = 1$ recovers Monte Carlo. Typical values $\lambda \in [0.9, 0.99]$. GAE is the default advantage estimator in PPO.

## Continuous actions: Gaussian policies

For continuous action spaces, the policy is typically a Gaussian $\pi_\theta(a \mid s) = \mathcal{N}(\mu_\theta(s), \Sigma_\theta(s))$. The score function is $\nabla_\theta \log \pi_\theta(a \mid s) = \nabla_\theta \log \mathcal{N}(a; \mu, \Sigma)$, which is a closed-form Gaussian log-density gradient. Continuous-action policy gradient is what enables [DDPG/SAC](./ddpg-sac) and most robotics RL.

## The deeper view: scoring functions and RLHF

The score-function estimator generalises beyond RL. In **RLHF**, the same expression underlies the PPO update on a language model: the "action" is a token, the "policy" is the LM, the "reward" is from a human-feedback reward model. Reading [RLHF](../../llm/reasoning/rlhf) after this page makes the connection explicit.

## What to read next

- [Actor-Critic](./actor-critic) — adding a learned baseline / value function.
- [PPO & TRPO](./ppo-trpo) — the modern policy-gradient stack with trust regions.
- [DQN](./dqn) — the value-based alternative.
