---
title: Second-Order & Natural Gradient
order: 4
---

# Second-Order & Natural Gradient

First-order optimisers ([SGD](./sgd), [Adam](./adam)) use only the gradient. **Second-order methods** use the Hessian — or a structured approximation to it — to take a step that respects the local curvature of the loss. Newton-like methods converge faster on well-conditioned problems but are too expensive in their pure form for deep networks. The practical compromise is the **K-FAC** / **Shampoo** line: Hessian-aware updates with manageable memory and compute.

## Newton's method as the reference

For a quadratic loss $\mathcal{L}(\theta) = \tfrac{1}{2}\theta^\top H \theta + g^\top \theta$, the Newton step

$$
\theta_{t+1} \;=\; \theta_t - H^{-1} \nabla \mathcal{L}(\theta_t)
$$

solves the optimum in **one step**. For non-quadratic losses, $H$ is the local Hessian and Newton converges quadratically near a local minimum — much faster than SGD's linear convergence. The cost is that storing and inverting a $P \times P$ Hessian is $O(P^2)$ memory and $O(P^3)$ flops, infeasible for $P > 10^5$ parameters.

## Quasi-Newton: BFGS and L-BFGS

**BFGS** approximates $H^{-1}$ with successive rank-1 or rank-2 updates from observed gradient differences, never instantiating $H$ explicitly. **L-BFGS** (limited-memory BFGS) keeps only the last $m$ updates, giving $O(mP)$ memory. Both are workhorses for **batch** non-convex optimisation in classical ML and remain useful for fine-tuning small models, hyperparameter optimisation, and physics-informed networks. They do not work well in the **stochastic** setting — noisy gradient estimates poison the curvature approximation — which is why neural-network training rarely uses them.

## Natural gradient

*Natural Gradient Works Efficiently in Learning* (Amari, 1998) replaces the Hessian with the **Fisher Information Matrix**:

$$
F(\theta) \;=\; \mathbb{E}_{x, y \sim p_\theta}\!\left[ \nabla_\theta \log p_\theta(y \mid x) \, \nabla_\theta \log p_\theta(y \mid x)^\top \right].
$$

The natural gradient $F^{-1} \nabla \mathcal{L}$ takes the steepest direction in the **probability space** (KL divergence) rather than parameter space. This is invariant to reparameterisation: scaling weights or changing units does not change the optimisation trajectory. Natural gradient is the principled justification for many adaptive methods — Adam approximates the diagonal of $F$.

Natural gradient is also the foundation of **TRPO** ([trust-region policy optimisation](../rl/ppo-trpo)), where it constrains policy updates to a fixed KL ball.

## K-FAC — Kronecker-factored approximate curvature

*Optimizing Neural Networks with Kronecker-factored Approximate Curvature* (Martens, Grosse, ICML 2015) factorises $F$ as a **Kronecker product** of small matrices per layer. For a fully-connected layer with input $\mathbf{a}$ and pre-activation gradient $\mathbf{g}$,

$$
F_\ell \;\approx\; \mathbb{E}[\mathbf{a} \mathbf{a}^\top] \otimes \mathbb{E}[\mathbf{g} \mathbf{g}^\top].
$$

Inverting a Kronecker product is the Kronecker product of inverses, so $F_\ell^{-1}$ is computable in $O(d^3)$ per layer instead of $O((d^2)^3)$. K-FAC matches Adam's per-step compute budget and converges in fewer steps on many problems.

## Shampoo — multi-layer Kronecker preconditioning

*Shampoo: Preconditioned Stochastic Tensor Optimization* (Gupta, Koren, Singer, ICML 2018) extends K-FAC to general tensor parameters. For a weight tensor with axes $i, j, k, \dots$, maintain one preconditioner per axis and combine them as a Kronecker product. Recent work (*Distributed Shampoo*, Anil et al., 2020) ports the method to large-batch industrial training and has produced state-of-the-art results on language and recommendation models. The current frontier of "is second-order ever worth it for deep nets" is being run on Shampoo and its descendants.

## When second-order pays off

Practical heuristics:

- **Small-to-medium models, full-batch** — L-BFGS is hard to beat.
- **Stochastic deep training** — Adam/AdamW are usually faster wall-clock than K-FAC/Shampoo despite needing more steps.
- **Very large models with massive batch sizes** — Shampoo and its variants close the gap with Adam and sometimes win, particularly when wall-clock is dominated by communication rather than compute.
- **RL / KL-constrained optimisation** — natural gradient (and its descendants TRPO/PPO) is the standard.

## What to read next

- [SGD, Momentum, Nesterov](./sgd) — the first-order baseline.
- [Adam, AdamW, RMSProp](./adam) — diagonal-Fisher approximation; the closest first-order method to natural gradient.
- [PPO/TRPO](../rl/ppo-trpo) — natural-gradient-based RL.
