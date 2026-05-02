---
title: Deep Q-Networks (DQN)
order: 4
---

# Deep Q-Networks (DQN)

DQN is [Q-learning](./q-learning) with a deep network as the function approximator. It looks deceptively simple — replace the table with a CNN — but making it actually train required two fixes that have become standard: **experience replay** and a **target network**. The result was the first algorithm to learn a wide range of Atari games end-to-end from raw pixels, and the start of deep RL as a discipline.

## The setup

*Playing Atari with Deep Reinforcement Learning* (Mnih, Kavukcuoglu, Silver et al., NIPS DLW 2013) and *Human-Level Control through Deep Reinforcement Learning* (Mnih et al., Nature 2015) trained a single CNN to play 49 Atari 2600 games. The architecture: 4 stacked grayscale frames as input → CNN → fully-connected layer → one output per discrete action representing $Q(s, a)$. Same architecture and hyperparameters across all games — no per-game tuning.

The loss at each step is the squared TD error:

$$
\mathcal{L}(\theta) \;=\; \mathbb{E}_{(s, a, r, s') \sim \mathcal{D}} \!\left[ \bigl( r + \gamma \max_{a'} Q_{\bar\theta}(s', a') - Q_\theta(s, a) \bigr)^2 \right].
$$

The two crucial algorithmic ingredients are how $\mathcal{D}$ is sampled and what $\bar\theta$ is.

## Experience replay

Naive online Q-learning correlates consecutive samples (the agent's observation at time $t+1$ is highly correlated with that at $t$), and the data distribution shifts as the policy changes. Both violate the i.i.d. assumption SGD relies on.

**Experience replay** maintains a buffer $\mathcal{D}$ of past transitions $(s, a, r, s')$ — typically size $10^6$ — and at each gradient step samples a mini-batch from it uniformly. This **decorrelates** consecutive samples and lets old experience be re-used many times, dramatically improving sample efficiency. Replay is what makes DQN's gradient signal usable.

*Prioritized Experience Replay* (Schaul et al., ICLR 2016) refines this by sampling transitions in proportion to their TD error — high-error transitions are revisited more often. Modest but consistent improvements over uniform replay.

## Target network

The TD target $r + \gamma \max_{a'} Q_\theta(s', a')$ depends on the same parameters being updated. Each gradient step moves the target, the network chases the target, the target moves again — a feedback loop that can amplify estimation errors and destabilise training.

The fix: maintain a **separate target network** with parameters $\bar\theta$, used only to compute the bootstrap target. The target network is updated periodically by copying $\theta$ — typically every $C = 10000$ steps. This **freezes the target** for $C$ steps at a time, breaking the feedback loop. Modern variants use a soft update $\bar\theta \leftarrow \tau \theta + (1 - \tau) \bar\theta$ with small $\tau$ (e.g., 0.005) for smoother transitions.

## The Rainbow improvements

*Rainbow: Combining Improvements in Deep Reinforcement Learning* (Hessel et al., AAAI 2018) collected six independent DQN improvements and showed they compose cleanly:

- **Double DQN** (van Hasselt et al., AAAI 2016) — fixes the maximisation bias in the TD target by using $\theta$ to select actions and $\bar\theta$ to evaluate them.
- **Dueling networks** (Wang et al., ICML 2016) — split the head into separate $V(s)$ and $A(s, a)$ branches, giving better learning when many actions are equally bad.
- **Prioritised replay** — see above.
- **Multi-step returns** — use $n$-step bootstrap targets ($n = 3$) instead of one-step.
- **Distributional RL** (C51, Bellemare et al., ICML 2017) — model the *distribution* of returns rather than just the mean.
- **Noisy networks** — replace $\epsilon$-greedy with parameter-space noise injection for exploration.

Rainbow is the standard reference for "modern DQN" and the practical baseline modern value-based RL papers compare against.

## Limitations

DQN works for **discrete action spaces** — taking $\arg\max_{a'}$ over actions is feasible. For continuous control (locomotion, robot arms), $\arg\max_{a'}$ becomes an inner optimisation; this is the regime where [DDPG/SAC](./ddpg-sac) and policy-gradient methods dominate.

DQN is also notoriously **sample-inefficient** — Atari training uses 50–200M frames per game (about 38–138 days of human play time) and millions of GPU-hours. Modern improvements (model-based methods, parallel actors, better exploration) help, but model-free deep RL still trails human sample efficiency by orders of magnitude.

## What to read next

- [Q-Learning](./q-learning) — the tabular precursor and convergence theory.
- [Actor-Critic](./actor-critic) — the policy-gradient cousin with similar engineering tricks.
- [DDPG, TD3, SAC](./ddpg-sac) — value-based methods for continuous actions.
