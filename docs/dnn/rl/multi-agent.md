---
title: Multi-Agent RL
order: 10
---

# Multi-Agent RL

Multi-agent RL (MARL) extends single-agent RL to environments with multiple learners. The single hardest fact: each agent's environment includes the *other agents*, and as their policies change during training, the environment dynamics from any one agent's perspective become **non-stationary**. Almost every MARL difficulty traces back to this.

## The setting

Generalise the [MDP](./mdp) to $N$ agents. The full game is a tuple $(\mathcal{S}, \{\mathcal{A}^i\}, P, \{r^i\}, \gamma)$ where each agent has its own action space $\mathcal{A}^i$ and reward $r^i$. The transition $P(s' \mid s, a^1, \dots, a^N)$ depends on **all** agents' actions.

Three regime classes:

- **Cooperative** — all agents share a single team reward $r^i = r$. Examples: StarCraft micromanagement, multi-robot warehouse coordination.
- **Competitive (zero-sum)** — $\sum_i r^i = 0$. Examples: chess, Go, poker.
- **Mixed** — neither. Examples: traffic routing, multi-agent economics.

The right algorithmic family depends on which regime you're in.

## The non-stationarity problem

Naive **independent learning** — run [Q-learning](./q-learning) or [PPO](./ppo-trpo) for each agent separately, treating other agents as part of the environment — fails for a structural reason. As agent $j$'s policy $\pi_j$ changes, the observed transition probabilities from agent $i$'s perspective change. Agent $i$'s value estimates become outdated, agent $i$ updates against stale targets, the dynamics shift again. The environment is no longer a stationary MDP and standard convergence guarantees evaporate.

In practice, independent PPO often *does* work on cooperative tasks — the messy, non-stationary signal turns out to be acceptable when rewards are aligned. In competitive games it fails: opponents specifically learn to exploit the learner's stale assumptions.

## Self-play and AlphaZero

For **two-player zero-sum games**, **self-play** is the canonical solution. Train a single network playing both sides; each policy improvement makes the opponent harder, which generates harder training data. Combined with Monte Carlo Tree Search (MCTS) and a value network, this is the **AlphaGo / AlphaZero** recipe (Silver et al., Science 2018):

- Run MCTS using current policy and value networks to produce strong moves.
- Update networks to imitate MCTS choices and predict eventual game outcome.
- Repeat against the latest network as opponent.

Convergence to Nash equilibrium is theoretically guaranteed for two-player zero-sum games (Heinrich & Silver, 2016, *Fictitious Self-Play*) and empirically robust on Go, chess, shogi, and StarCraft.

## Centralised training, decentralised execution

A pragmatic compromise for cooperative MARL: at training time, give the critic access to **global state and all agents' actions** (a centralised critic), but keep each actor restricted to its **local observation** (decentralised execution). Examples:

- **MADDPG** (Lowe et al., NIPS 2017) — centralised Q for each agent, conditioned on all agents' actions. Each Q is trained with full information; each actor only uses local state at deploy.
- **QMIX** (Rashid et al., ICML 2018) — for cooperative tasks, factorise the joint Q-function as a monotonic mixing of per-agent Q-functions, $Q_\text{tot}(\mathbf{s}, \mathbf{a}) = f(Q_1, \dots, Q_N)$ with $f$ monotone in each input. This guarantees that decentralised greedy action selection $\arg\max_{a^i} Q_i$ matches centralised joint maximisation.

Centralised-training/decentralised-execution is the dominant template for cooperative MARL benchmarks (StarCraft Multi-Agent Challenge, Hanabi, MPE).

## Communication and emergent language

When agents share goals but partial observations, explicit **communication channels** can be added. *Emergent communication* research (Foerster et al., 2016; Lazaridou et al., 2017) trains differentiable channels and observes that agents develop their own protocols — sometimes interpretable, often not. This work feeds into modern multi-agent LLM research, where systems like multi-LLM debate or [agent](../../llm/applications/agents) coordination are conceptually MARL with language as the action space.

## Game-theoretic foundations

For competitive environments, MARL connects to **game theory**. Nash equilibrium, correlated equilibrium, and fictitious play all formalise solution concepts. Modern poker-bot work (Pluribus, DeepStack) blends counterfactual regret minimisation (CFR) with deep value networks to produce Nash-approximating policies in imperfect-information games.

## What to read next

- [PPO & TRPO](./ppo-trpo) — independent PPO is the cooperative-MARL baseline.
- [World Models](./world-models) — opponent modelling is a model-based MARL strategy.
- [LLM Agents](../../llm/applications/agents) — LLM-as-agent setups inherit MARL's coordination problems.
