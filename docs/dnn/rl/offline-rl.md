---
title: Offline RL
order: 9
---

# Offline RL

Offline RL — also called batch RL — learns a policy from a **fixed, pre-collected dataset** of $(s, a, r, s')$ transitions, with no further environment interaction allowed. The setting matters wherever exploration is expensive, dangerous, or impossible: medical decision-making, autonomous driving, recommender systems, and any domain where you have logs but cannot run a learning agent live. Standard online RL algorithms fail spectacularly in this setting; offline RL identifies the failure mode and corrects it.

## The core problem: distribution shift

Online RL relies on collecting fresh data with the current policy. Offline RL forbids this — the dataset $\mathcal{D}$ was collected by some **behaviour policy** $\beta$, and the learned policy $\pi$ may differ.

The TD target $\max_{a'} Q(s', a')$ in [Q-learning](./q-learning) and [DDPG](./ddpg-sac) evaluates $Q$ at actions that $\beta$ may never have taken. Function-approximation errors at these out-of-distribution actions feed back into the bootstrap target, the policy then prefers those mis-evaluated actions, and the system **diverges silently** — the learned policy looks fine on training-set transitions but performs catastrophically when deployed.

This is the **deadly triad** ([function approximation + bootstrapping + off-policy](./q-learning)) under maximum stress. Standard fixes (replay buffer, target network) do not help — they were designed for online corrections that offline RL forbids.

## Behaviour Cloning as a baseline

The simplest offline approach: **behaviour cloning** (BC) — supervised learning $\pi(a \mid s)$ on the dataset, ignoring rewards. BC works well when the dataset is from a near-optimal expert and badly when it isn't. It has no mechanism to **improve over the dataset's behaviour**, and a noisy or sub-optimal $\beta$ produces a noisy or sub-optimal $\pi$.

Offline RL aims to do *better* than BC by using the reward signal — without falling into the distribution-shift trap.

## Constraint-based methods

The dominant family addresses the OOD-action problem by **constraining the learned policy to stay close to the dataset's action distribution**.

- **BCQ** (Fujimoto, Meger, Precup, ICML 2019) — train a generative model $G$ of $\beta$, then restrict the actor's actions to perturbations of $G$'s samples. Q evaluation never sees actions outside the data.
- **CQL** (Kumar, Zhou, Tucker, Levine, NeurIPS 2020) — Conservative Q-Learning. Add a regulariser to the Q-loss that **pushes Q-values down for OOD actions and up for in-distribution ones**:

$$
\mathcal{L}_\text{CQL} \;=\; \alpha\, \mathbb{E}_s\!\left[\log \sum_a \exp Q(s, a) - \mathbb{E}_{a \sim \beta}[Q(s, a)]\right] + \mathcal{L}_\text{TD}.
$$

CQL gives a *lower bound* on the true Q-function, ensuring the policy never bootstraps from optimistic estimates. It's the most-cited modern offline RL baseline.

- **IQL** (Kostrikov, Nair, Levine, ICLR 2022) — Implicit Q-Learning. Estimate the value $V(s)$ via expectile regression on dataset returns, then update the policy via advantage-weighted behaviour cloning. **Never queries Q at OOD actions** — the entire OOD problem is sidestepped. Strong empirical performance with simpler tuning than CQL.

## Sequence modelling: Decision Transformer

*Decision Transformer: Reinforcement Learning via Sequence Modeling* (Chen et al., NeurIPS 2021) reframes offline RL as supervised sequence learning. Train a Transformer to predict the next action given a sequence of $(R_t, s_t, a_t, R_{t+1}, s_{t+1}, a_{t+1}, \dots)$ where $R_t$ is the **return-to-go** from time $t$. At inference, prompt with a high target return and let the Transformer roll out actions that achieve it.

The framing eliminates Bellman bootstrapping entirely — there is no Q function, no value bootstrap, no distribution shift in the algorithmic sense. It is a clean recipe and competitive with CQL/IQL on D4RL benchmarks. The conceptual link to LLMs is exact: this is the **same architecture and same training objective** as a language model, applied to (state, action, return) sequences.

## What offline RL is good for

- **Healthcare** — train treatment policies from observational records, where deploying an exploratory agent on real patients is unacceptable.
- **Autonomous driving** — millions of fleet hours of logged driving data, where on-policy exploration is dangerous.
- **Recommender systems** — production traffic logs, where exploring recommendations costs revenue.
- **Robotics** — combine with on-policy fine-tuning: pretrain offline on collected demonstrations + autonomous logs, then fine-tune online on task-specific exploration.

## What to read next

- [Q-Learning](./q-learning) — the source of the deadly-triad failure offline RL has to fix.
- [DDPG, TD3, SAC](./ddpg-sac) — the off-policy algorithms offline RL builds conservative versions of.
- [World Models](./world-models) — model-based offline RL can plan inside the learned model.
