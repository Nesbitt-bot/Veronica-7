---
title: Markov Chains
order: 1
---

# Markov Chains

A Markov chain is a stochastic process where the next state depends only on the current state, not on the history that led to it. The Markov property is the structural assumption underneath [HMMs](./hmm), [MDPs](../../dnn/rl/mdp), MCMC, n-gram language models, and most of probabilistic time-series modelling. Understanding the chain's stationary behaviour and convergence rate is the prerequisite for the rest.

## The Markov property

A discrete-time stochastic process $\{X_t\}_{t \geq 0}$ over a state space $\mathcal{S}$ is a **Markov chain** if

$$
P(X_{t+1} \mid X_t, X_{t-1}, \dots, X_0) \;=\; P(X_{t+1} \mid X_t).
$$

For finite $\mathcal{S}$, the chain is fully described by the **transition matrix** $P$ with $P_{ij} = P(X_{t+1} = j \mid X_t = i)$. Each row sums to 1 — $P$ is a **stochastic matrix**.

Probability evolution is matrix multiplication: if $\boldsymbol{\pi}_t \in \mathbb{R}^{|\mathcal{S}|}$ is the row-vector distribution of $X_t$, then $\boldsymbol{\pi}_{t+1} = \boldsymbol{\pi}_t P$, and $\boldsymbol{\pi}_{t+k} = \boldsymbol{\pi}_t P^k$.

## Classifications

States have structure:

- **Recurrent** — the chain returns to it with probability 1.
- **Transient** — only visited finitely many times almost surely.
- **Absorbing** — once entered, never left ($P_{ii} = 1$).
- **Periodic** — return times share a common divisor $> 1$.

A chain is **irreducible** if every state can reach every other; **aperiodic** if no period $> 1$. Irreducible aperiodic chains on a finite state space have a **unique stationary distribution** $\boldsymbol{\pi}^*$ satisfying $\boldsymbol{\pi}^* P = \boldsymbol{\pi}^*$, and they converge to it from any start.

## Stationary distribution

The stationary $\boldsymbol{\pi}^*$ is the **left eigenvector** of $P$ with eigenvalue 1. For finite state spaces it can be solved as a linear system $\boldsymbol{\pi}^* (P - I) = 0$ subject to $\sum_i \pi_i^* = 1$.

A useful sufficient condition: if there exists $\boldsymbol{\pi}$ with $\pi_i P_{ij} = \pi_j P_{ji}$ for all $i, j$ (the **detailed balance** equation), then $\boldsymbol{\pi}$ is stationary. Detailed balance gives **reversible** chains — the structural building block of MCMC.

## Mixing time and the spectral gap

How fast does $\boldsymbol{\pi}_t$ approach $\boldsymbol{\pi}^*$? For irreducible aperiodic finite chains, convergence is geometric:

$$
\| \boldsymbol{\pi}_t - \boldsymbol{\pi}^* \|_\text{TV} \;\leq\; C \, \lambda_2^t,
$$

where $\lambda_2$ is the second-largest eigenvalue of $P$ in absolute value. The **spectral gap** $1 - |\lambda_2|$ is the rate of convergence; the **mixing time** $t_\text{mix}$ is roughly $\log(1/\epsilon) / (1 - |\lambda_2|)$.

The spectral gap is what determines whether MCMC inference is fast or slow. Multimodal target distributions typically produce small gaps and slow mixing; this is one of the central practical problems with MCMC.

## MCMC: building chains for inference

Markov Chain Monte Carlo runs the logic in reverse: given a target distribution $\pi$ we want to sample from, **construct** a chain whose stationary distribution is $\pi$.

- **Metropolis-Hastings** — propose moves from a proposal distribution $q$, accept with probability $\min(1, \pi(\mathbf{x}') q(\mathbf{x} \mid \mathbf{x}') / \pi(\mathbf{x}) q(\mathbf{x}' \mid \mathbf{x}))$. Detailed balance gives stationarity.
- **Gibbs sampling** — sample each variable from its conditional given the others. Special case of MH with proposals that are always accepted.
- **Hamiltonian MC** — use gradient information to take long, low-rejection moves; fast mixing for continuous high-dim targets.

MCMC is the workhorse of Bayesian inference, posterior sampling, and any setting where you can evaluate $\pi$ up to a normalising constant but cannot sample directly.

## Where Markov chains appear in ML

- **Reinforcement learning** — [MDPs](../../dnn/rl/mdp) are Markov chains with actions and rewards.
- **Hidden Markov Models** — see [HMM](./hmm).
- **n-gram language models** — text as an order-$n$ Markov chain over tokens.
- **MCMC inference** — Bayesian posterior sampling.
- **PageRank** — Google's original ranking is the stationary distribution of a Markov chain on the web graph.
- **Chain-of-thought reasoning at inference** — autoregressive LM generation is a Markov chain over token sequences (the state being the prefix).

## What to read next

- [Hidden Markov Models](./hmm) — Markov chains with partial observation.
- [MDPs & Bellman Equations](../../dnn/rl/mdp) — Markov chains with actions and rewards.
- [Bayesian Networks](./bayes-nets) — directed graphical models that subsume Markov chains.
