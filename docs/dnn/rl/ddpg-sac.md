---
title: DDPG, TD3, SAC
order: 7
---

# DDPG, TD3, SAC

DDPG, TD3, and SAC are the dominant **off-policy actor-critic** algorithms for continuous control. They use a [DQN](./dqn)-style replay buffer for sample efficiency, a deterministic or Gaussian-policy actor, and a Q-function critic. Each successor fixes a specific failure mode of the previous: TD3 addresses Q-value over-estimation; SAC adds a maximum-entropy objective for principled exploration and far better robustness.

## DDPG — Deep Deterministic Policy Gradient

*Continuous Control with Deep Reinforcement Learning* (Lillicrap et al., ICLR 2016) extends DQN to continuous action spaces. The key trick: parameterise a **deterministic** policy $\mu_\theta: \mathcal{S} \to \mathcal{A}$ alongside a Q-function $Q_\phi(s, a)$. Use the deterministic policy gradient:

$$
\nabla_\theta J \;=\; \mathbb{E}_s\!\left[\nabla_a Q_\phi(s, a) \big|_{a = \mu_\theta(s)} \nabla_\theta \mu_\theta(s)\right].
$$

The $\arg\max_a Q$ that DQN runs at every step is replaced by following $\mu_\theta$, whose parameters are trained to maximise $Q$ via this gradient. Standard DQN engineering tricks transfer: replay buffer, target networks for both $\mu$ and $Q$, soft target updates. Exploration uses additive Ornstein-Uhlenbeck or Gaussian noise on the deterministic action.

DDPG was the first algorithm to learn high-dimensional continuous-control policies (Mujoco humanoid, robotic manipulation) end-to-end from low-level features.

## DDPG's failure mode: Q over-estimation

DDPG inherits Q-learning's **maximisation bias** in the worst possible way: it bootstraps $Q(s', \mu_{\bar\theta}(s'))$ with $\mu$ chosen to maximise $Q$, so any over-estimation in $Q$ feeds back into the target and amplifies. Empirically DDPG is brittle — careful hyperparameter tuning and per-environment tweaks are required.

## TD3 — Twin Delayed DDPG

*Addressing Function Approximation Error in Actor-Critic Methods* (Fujimoto, van Hoof, Meger, ICML 2018) introduces three orthogonal fixes:

- **Twin Q-networks.** Maintain two independent Q-networks $Q_{\phi_1}, Q_{\phi_2}$ and use the **minimum** for the bootstrap target, $y = r + \gamma \min_{i=1,2} Q_{\bar\phi_i}(s', \mu_{\bar\theta}(s'))$. This Clipped Double-Q approach systematically removes positive bias.
- **Delayed policy updates.** Update the policy and target networks every $d$ critic steps (typically $d=2$). The actor moves more slowly than the critic, breaking the over-estimation feedback loop.
- **Target policy smoothing.** Add small noise $\epsilon \sim \text{clip}(\mathcal{N}(0, \sigma), -c, c)$ to the target action: $a' = \mu_{\bar\theta}(s') + \epsilon$. Acts as a regulariser, smoothing the value estimate over an action neighbourhood.

These three changes together turn DDPG from "works with luck" to "works reliably" on Mujoco. TD3 is the right reference for "deterministic-policy actor-critic that works".

## SAC — Soft Actor-Critic

*Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning* (Haarnoja et al., ICML 2018) takes a different angle: optimise the **maximum-entropy** RL objective

$$
J(\pi) \;=\; \sum_t \mathbb{E}_{(s_t, a_t)}\!\left[ r(s_t, a_t) + \alpha \mathcal{H}[\pi(\cdot \mid s_t)] \right].
$$

The entropy bonus rewards stochastic policies. Three consequences:

- **Better exploration** without ad-hoc noise schedules.
- **Smooth, robust policies** that don't collapse to brittle deterministic optima.
- **Multi-modal action distributions** when multiple actions are equally good.

SAC uses a **Gaussian policy** $\pi_\theta(a \mid s) = \mathcal{N}(\mu_\theta(s), \Sigma_\theta(s))$, with Twin Q networks (as in TD3), and an automatic entropy temperature that adapts $\alpha$ to maintain a target entropy. Practically it has fewer hyperparameters than TD3 and is the **current default for continuous-control RL** in robotics and Mujoco-style benchmarks.

## When to use which

- **DDPG** — historical reference; rarely the right choice today.
- **TD3** — works well when a deterministic policy is appropriate and you want simpler tuning than SAC.
- **SAC** — strongest default for continuous control. Use this unless you have a specific reason not to.

For **discrete actions** none of these apply — use [DQN](./dqn) variants or PPO. For **on-policy** continuous control where sample efficiency is less critical than stability or where you cannot afford a replay buffer, [PPO](./ppo-trpo) remains a strong choice.

## What to read next

- [Actor-Critic](./actor-critic) — the algorithmic family these belong to.
- [DQN](./dqn) — the value-based predecessor whose tricks transferred.
- [Offline RL](./offline-rl) — extending these methods to fixed datasets.
