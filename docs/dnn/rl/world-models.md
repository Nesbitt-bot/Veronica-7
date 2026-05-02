---
title: Model-Based RL & World Models
order: 8
---

# Model-Based RL & World Models

Model-based RL learns an explicit model of the environment dynamics $\hat{P}(s' \mid s, a)$ and reward $\hat{r}(s, a)$, then trains a policy by **planning or imagining rollouts inside the learned model**. The promise is dramatically better sample efficiency — model-free methods need millions of real interactions; model-based methods amortise them by replaying inside the model. The challenge is that errors in the model compound when policies are optimised against it.

## Why model-based?

A learned model is a generative simulator. Once you have one, you can:

- **Plan** — Monte Carlo Tree Search (MCTS), shooting methods, or random-shooting.
- **Train a policy in imagination** — generate fake trajectories to augment scarce real data.
- **Reason about uncertainty** — propagate ensemble disagreement through rollouts to bias toward safe regions.

Model-free methods get none of this for free. The empirical sample efficiency of state-of-the-art model-based RL is 10–100× better than model-free on the same tasks.

## Dyna and the imagination loop

*Integrated Architectures for Learning, Planning, and Reacting* (Sutton, 1990) introduced **Dyna**, the simplest blueprint:

1. Take a real action; observe $(s, a, r, s')$.
2. Update both the value/policy and the model.
3. Sample $K$ imagined transitions from the model and update the value/policy on each.

The "imagined" updates are pure compute — no environment interaction — so $K$ can be 10× or 100× the real-step count. Dyna is the conceptual ancestor of every modern model-based RL system.

## PETS — probabilistic ensembles for short-horizon planning

*Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models* (Chua, Calandra, McAllister, Levine, NeurIPS 2018) trains an **ensemble** of probabilistic neural-network dynamics models and plans with cross-entropy method (CEM) over short action sequences. Two ideas matter:

- The **probabilistic** prediction (Gaussian per next-state) captures aleatoric uncertainty in dynamics.
- The **ensemble** captures epistemic uncertainty (model disagreement); divergent predictions mean the model doesn't know.

PETS solved several Mujoco tasks with 10–100× fewer environment steps than SAC, becoming the reference baseline for model-based RL.

## Dreamer — world models for pixels

*World Models* (Ha, Schmidhuber, NeurIPS 2018) trained a VAE + RNN model of pixels and learned a CMA-ES policy in the latent. The successor *Dreamer* (Hafner, Lillicrap, Ba, Norouzi, ICLR 2020) and *DreamerV2/V3* (2021–23) systematise this:

1. A **Recurrent State-Space Model (RSSM)** combines a deterministic GRU with stochastic latent samples — a hybrid VAE-RNN that handles partial observability.
2. The actor and critic are trained on **imagined latent trajectories** rolled out inside the RSSM, never on raw pixels.
3. Real environment data is used only to update the model.

DreamerV3 achieved expert-level performance on diverse domains (Atari, Mujoco, Minecraft, robotics) with the same hyperparameters — a major scaling result for model-based RL.

## MuZero — planning without an explicit dynamics model

*Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model* (Schrittwieser et al., Nature 2020) takes a subtle stance: don't model raw observations, model **abstract latent states** sufficient for value and policy prediction. MuZero learns three networks: representation $h$ (observation → latent), dynamics $g$ (latent + action → next latent + reward), and prediction $f$ (latent → policy + value). All trained jointly to make MCTS rollouts in latent space match the actual returns.

MuZero matched AlphaZero on Go/Chess/Shogi *without* being given the rules of the game and matched DQN on Atari without explicit pixel-level dynamics. It generalises the AlphaZero recipe to environments with unknown dynamics — the model needs to predict only what's relevant for decisions, not what's needed to reconstruct observations.

## Where model-based wins, and where it doesn't

Model-based RL wins decisively when:

- Real data is **expensive** (robotics, real-world deployment).
- Dynamics are **smooth and predictable** (rigid-body physics, deterministic simulators).
- The task has a **clear reward signal** the model can predict.

Model-free RL still leads when:

- Real data is **cheap** (Atari, simulation). Modern policy-gradient methods are sample-efficient enough that the model-learning overhead doesn't pay off.
- Dynamics are **complex or stochastic** (other-agent behaviour, partial observability with adversaries).
- The reward landscape is sparse and the model can't learn it accurately.

## What to read next

- [Offline RL](./offline-rl) — model-based methods naturally extend to fixed-dataset RL.
- [Embodied CV & Robotics](../../cv/advances/embodied) — navigation world models in the robotics setting.
- [PPO & TRPO](./ppo-trpo) — model-free baselines that model-based RL has to beat.
