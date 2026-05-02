---
title: Reinforcement Learning — Overview
order: 0
---

# Reinforcement Learning — Overview

Reinforcement learning is the branch of machine learning in which an agent learns to **act** in an environment by observing rewards. Unlike supervised learning, the data the agent sees depends on the actions it takes — the model and the data distribution co-evolve. This page is a roadmap of the rest of the RL track and a quick statement of the framework.

## What is the RL setting

An RL problem is specified by a **Markov Decision Process** (see [MDPs & Bellman Equations](./mdp)):

- a state space $\mathcal{S}$ and action space $\mathcal{A}$,
- a transition kernel $P(s' \mid s, a)$,
- a reward function $r(s, a)$,
- a discount factor $\gamma \in [0, 1)$.

The agent's behaviour is a **policy** $\pi(a \mid s)$, and the goal is to maximise the expected discounted return

$$
J(\pi) \;=\; \mathbb{E}_{\pi}\!\left[ \sum_{t=0}^{\infty} \gamma^t r(s_t, a_t) \right].
$$

What makes RL hard is that learning is **online and active**: the agent must explore unseen actions, and bad early policies generate bad data, which is hard to recover from.

## The methodological taxonomy

The track decomposes into four families:

- **Value-based methods** — learn a value function $V(s)$ or $Q(s, a)$ and act greedily. Covered in [Q-Learning](./q-learning) (tabular) and [DQN](./dqn) (deep).
- **Policy-gradient methods** — directly parameterise the policy and follow $\nabla_\theta J$. Covered in [Policy Gradient](./policy-gradient), with the modern actor-critic family in [Actor-Critic](./actor-critic), [PPO/TRPO](./ppo-trpo), and [DDPG/SAC](./ddpg-sac).
- **Model-based methods** — learn an explicit dynamics model and plan or train a policy inside it. Covered in [World Models](./world-models).
- **Offline & multi-agent** — RL with fixed datasets ([Offline RL](./offline-rl)) and games with multiple learners ([Multi-Agent RL](./multi-agent)).

Modern RL agents combine elements from several families. AlphaGo / AlphaZero are model-based + policy-gradient + value learning + Monte Carlo Tree Search; modern LLM RLHF combines policy gradient (PPO) with a learned reward model.

## RL outside games

The RL framework reaches well past Atari and Go:

- **Robotics** — locomotion, manipulation, grasping. Sim-to-real domain transfer is the central challenge.
- **LLM alignment** — [RLHF](../../llm/reasoning/rlhf) and [RLVR](../../llm/reasoning/rlvr) are RL with human or verifiable rewards.
- **Recommendation, ad ranking, energy management** — sequential-decision settings where supervised learning under-fits.

## What this track covers

The chapters below assume comfort with [supervised deep learning](../basics/mlp), [SGD](../optimization/sgd), and basic probability. The progression is:

1. **MDPs and Bellman equations** — the formalism.
2. **Tabular Q-learning** — the algorithmic prototype, complete with proofs.
3. **Policy gradient** — REINFORCE and the score-function estimator.
4. **DQN** — deep value-based RL, Atari.
5. **Actor-critic, PPO/TRPO** — the modern policy-gradient stack.
6. **DDPG / SAC** — continuous-control RL.
7. **World models, offline RL, multi-agent RL** — three frontier topics.

The point is to understand RL's framework well enough to follow modern RLHF and RLVR work in the LLM track — and to recognise when an RL formulation is and isn't the right tool.

## What to read next

- [MDPs & Bellman Equations](./mdp) — the formalism.
- [Q-Learning](./q-learning) — the simplest concrete algorithm.
- [RLHF](../../llm/reasoning/rlhf) — RL applied to language model alignment.
