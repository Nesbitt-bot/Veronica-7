---
title: SGD, Momentum, Nesterov
order: 1
---

# SGD, Momentum, Nesterov

Stochastic Gradient Descent (SGD) and its momentum variants are the simplest, oldest, and — for many tasks — still the best optimisers for training neural networks. The recipe is two lines of code, but the dynamics it produces (escape from saddle points, implicit regularisation toward flat minima) underpin the empirical success of deep learning.

## Plain SGD

Given a loss $\mathcal{L}(\theta) = \mathbb{E}_{(x, y) \sim \mathcal{D}}[\ell(\theta; x, y)]$, full-batch gradient descent updates $\theta_{t+1} = \theta_t - \eta \, \nabla \mathcal{L}(\theta_t)$ — but the dataset is too large to evaluate the full gradient each step. SGD replaces the expectation with a **mini-batch estimate**:

$$
\theta_{t+1} \;=\; \theta_t - \eta \cdot \frac{1}{B} \sum_{i \in \text{batch}_t} \nabla \ell(\theta_t; x_i, y_i).
$$

The mini-batch gradient is unbiased but noisy. The noise is not just a budget compromise — it has been shown empirically to bias SGD toward **flatter minima** that generalise better than the sharp minima found by full-batch optimisation (Keskar et al., 2017).

## Heavy-ball momentum

*A method of solving a convex programming problem with convergence rate $O(1/k^2)$* (Polyak, 1964) introduced momentum:

$$
\mathbf{v}_{t+1} = \mu \mathbf{v}_t + \nabla \mathcal{L}(\theta_t), \qquad \theta_{t+1} = \theta_t - \eta \, \mathbf{v}_{t+1}.
$$

The velocity $\mathbf{v}$ accumulates past gradients with exponential decay $\mu$ (typically 0.9). Effects:

- **Smoothing** — short-timescale gradient noise averages out.
- **Acceleration** — in directions where gradients consistently point the same way, the effective step size grows by $1/(1-\mu) \approx 10$.
- **Damping** — in oscillating directions (e.g., across a narrow valley), opposing gradients cancel.

Momentum is what makes SGD competitive with second-order methods on quadratic problems and is the reason "SGD with momentum" is the standard reference, not pure SGD.

## Nesterov accelerated gradient

Nesterov's twist (1983) is to evaluate the gradient at the **lookahead** position $\theta_t - \eta \mu \mathbf{v}_t$ rather than at $\theta_t$:

$$
\mathbf{v}_{t+1} = \mu \mathbf{v}_t + \nabla \mathcal{L}(\theta_t - \eta \mu \mathbf{v}_t), \qquad \theta_{t+1} = \theta_t - \eta \, \mathbf{v}_{t+1}.
$$

The lookahead lets the optimiser correct course before the momentum carries it past a curving valley. On smooth convex problems, NAG achieves the optimal $O(1/T^2)$ convergence rate vs. heavy-ball's $O(1/T)$. The deep-learning gain is more modest but consistent — a small but reliable boost over plain momentum.

## Mini-batch size and the linear-scaling rule

Empirically, when batch size $B$ doubles, the right learning rate roughly doubles too (Goyal et al., 2017, *Accurate, Large Minibatch SGD*). The intuition: the variance of the mini-batch gradient scales as $1/B$, and so does the safe step size — but in the opposite direction, the effective per-epoch progress wants to scale linearly in batch size. Below some critical batch size, this rule holds; above it, returns diminish (McCandlish et al., 2018).

## Convergence theory and SGD's blind spots

For convex losses, SGD with $\eta_t \propto 1/\sqrt{t}$ converges at $O(1/\sqrt{T})$. For non-convex losses, only convergence to a **stationary point** (gradient norm $\to 0$) is guaranteed. Why SGD finds *good* stationary points for deep networks — flat, generalisation-friendly minima — is a topic of [implicit-bias](../regularization/double-descent) research and is still open in full generality.

## What to read next

- [Adam, AdamW, RMSProp](./adam) — adaptive optimisers that match or beat SGD on many modern workloads.
- [Learning Rate Schedules](./lr-schedules) — the third hyperparameter, after batch size and momentum.
- [Backpropagation](../basics/backpropagation) — what produces the gradients SGD consumes.
