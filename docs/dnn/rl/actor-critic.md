---
title: Actor–Critic, A2C, A3C
order: 5
---

# Actor–Critic, A2C, A3C

Actor-critic methods combine the two RL families: **the actor** is a parameterised policy ([policy gradient](./policy-gradient)), **the critic** is a learned value function ([Q-learning](./q-learning)/value approximation). The actor uses the critic as a baseline to reduce variance; the critic is trained with TD updates from the same trajectories the actor generates. Almost every modern RL algorithm — [PPO](./ppo-trpo), [SAC](./ddpg-sac), DDPG — is an actor-critic.

## The actor-critic update

The policy-gradient theorem with a learned baseline $V_\phi(s)$ becomes:

$$
\nabla_\theta J(\theta) \;\approx\; \mathbb{E}\!\left[ \sum_t \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot \hat{A}_t \right], \qquad \hat{A}_t \;=\; \delta_t + \gamma \delta_{t+1} + \dots,
$$

with TD errors $\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)$. The critic is trained by minimising

$$
\mathcal{L}_\text{critic}(\phi) \;=\; \mathbb{E}\!\left[ \bigl( r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t) \bigr)^2 \right].
$$

Both updates run together — actor improves policy, critic improves value estimate, they make each other better.

## Why an actor-critic, not just one or the other

- **Pure policy gradient** ([REINFORCE](./policy-gradient)) is high-variance because returns from full Monte Carlo rollouts have large variance.
- **Pure value-based** methods ([DQN](./dqn)) require $\arg\max$ over actions — fine for discrete, painful for continuous.
- **Actor-critic** gets policy gradient's flexibility (stochastic, continuous, structured policies) plus value-based methods' variance reduction (TD target instead of full Monte Carlo).

The price is that the critic is biased — TD bootstrapping relies on the current value estimate. But the variance reduction wins overwhelmingly in practice, and modern algorithms ([GAE](./policy-gradient)) tune the bias-variance trade-off explicitly.

## A3C — asynchronous parallel actors

*Asynchronous Methods for Deep Reinforcement Learning* (Mnih et al., ICML 2016) introduced **A3C** (Asynchronous Advantage Actor-Critic). Run many actors in parallel, each interacting with its own copy of the environment, all asynchronously updating a shared parameter server:

- Actors collect rollouts in parallel, decorrelating their on-policy data.
- Asynchronous updates take the place of [experience replay](./dqn) — the diversity of concurrent actors playing different parts of the state space provides the i.i.d.-like signal.

A3C ran on CPU (no GPU needed for the small networks of the era) and matched DQN on Atari at a fraction of the wall-clock cost. The asynchronous part has fallen out of favour — synchronous A2C is simpler and works as well — but the **multi-actor parallelism** is the standard recipe in modern policy-gradient training.

## A2C — synchronous variant

*A2C* (the synchronous version) does the same thing but waits for all actors to finish a rollout before applying a single batch update. Easier to reason about and reproduce, more sample-efficient on GPUs, and the standard scaffolding underneath PPO and most recent on-policy methods. The OpenAI Baselines / Stable-Baselines3 implementations are A2C-style for this reason.

## On-policy vs off-policy

Vanilla actor-critic is **on-policy** — the critic and actor are trained on data from the *current* policy, so old data must be discarded. Off-policy actor-critic methods (DDPG, SAC, IMPALA) use a replay buffer and importance corrections, trading some bias for far better sample efficiency. The on/off-policy axis is one of the major design decisions in any actor-critic algorithm.

## Entropy regularisation

A common addition to the actor loss is an **entropy bonus** $\beta \mathcal{H}[\pi_\theta(\cdot \mid s_t)]$ that rewards stochastic policies. Reasons:

- Prevents premature collapse to deterministic policies that get stuck in local optima.
- Increases exploration without explicit $\epsilon$-greedy machinery.
- Has a clean interpretation as **maximum-entropy RL**, formalised by the [SAC](./ddpg-sac) family.

## What to read next

- [PPO & TRPO](./ppo-trpo) — actor-critic with trust-region constraints, the modern default.
- [DDPG, TD3, SAC](./ddpg-sac) — off-policy actor-critic for continuous control.
- [Policy Gradient & REINFORCE](./policy-gradient) — the simpler ancestor.
