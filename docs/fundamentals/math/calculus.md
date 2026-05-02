---
title: Multivariate Calculus & Gradients
order: 3
---

# Multivariate Calculus & Gradients

Modern ML is gradient descent on high-dimensional surfaces. This page covers the calculus you need to follow that statement: gradients of multivariable functions, the Jacobian and Hessian, the chain rule in matrix notation, and the geometric reading that makes every later optimisation result intuitive.

## Gradients

For a scalar function $f: \mathbb{R}^n \to \mathbb{R}$, the **gradient** is the vector of partial derivatives:

$$
\nabla f(\mathbf{x}) \;=\; \left(\frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n}\right)^\top.
$$

The geometric reading: $\nabla f(\mathbf{x})$ points in the direction of **steepest ascent**, and its magnitude is the rate of change in that direction. The directional derivative along unit $\mathbf{u}$ is $\nabla f \cdot \mathbf{u}$, maximised when $\mathbf{u} \parallel \nabla f$.

**Gradient descent** $\mathbf{x}_{t+1} = \mathbf{x}_t - \eta \nabla f(\mathbf{x}_t)$ steps opposite the gradient. Convergence depends on the local curvature of $f$ — flat surfaces converge slowly, sharp curvatures need small step sizes.

## Jacobians

For a vector function $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, the **Jacobian** is the $m \times n$ matrix of partial derivatives:

$$
J_{ij} \;=\; \frac{\partial f_i}{\partial x_j}.
$$

The first-order Taylor expansion is $\mathbf{f}(\mathbf{x} + \boldsymbol{\delta}) \approx \mathbf{f}(\mathbf{x}) + J(\mathbf{x})\, \boldsymbol{\delta}$. Jacobians are how you propagate uncertainty (covariance), how [reverse-mode autodiff](../../dnn/basics/backpropagation) is defined (vector-Jacobian products), and what the implicit function theorem operates on.

## The chain rule, matrix-style

For $\mathbf{f} = \mathbf{g} \circ \mathbf{h}$ with $\mathbf{h}: \mathbb{R}^n \to \mathbb{R}^k$ and $\mathbf{g}: \mathbb{R}^k \to \mathbb{R}^m$,

$$
J_\mathbf{f}(\mathbf{x}) \;=\; J_\mathbf{g}(\mathbf{h}(\mathbf{x})) \cdot J_\mathbf{h}(\mathbf{x}).
$$

Composition of functions is multiplication of Jacobians. This is the source of [backpropagation](../../dnn/basics/backpropagation): each layer is a function in a chain, and the gradient of the loss with respect to early-layer parameters is a product of Jacobians from the loss back to that layer.

## Hessians and second-order behaviour

The **Hessian** of a scalar $f$ is the matrix of second partial derivatives, $H_{ij} = \partial^2 f / \partial x_i \partial x_j$. For twice-continuously-differentiable $f$, $H$ is symmetric (Schwarz's theorem). The second-order Taylor expansion is

$$
f(\mathbf{x} + \boldsymbol{\delta}) \;\approx\; f(\mathbf{x}) + \nabla f(\mathbf{x})^\top \boldsymbol{\delta} + \tfrac{1}{2} \boldsymbol{\delta}^\top H(\mathbf{x}) \boldsymbol{\delta}.
$$

The eigenvalues of $H$ classify the local geometry:

- All positive → local **minimum**.
- All negative → local **maximum**.
- Mixed signs → **saddle point**.
- Some zero → **degenerate** (analyse higher-order terms).

In high-dimensional non-convex landscapes (deep networks), saddle points dominate critical points (Dauphin et al., 2014). Most stuck-at-zero-gradient situations are *not* local minima — they are saddle points that SGD escapes on its own through stochastic noise.

## Useful gradient identities

Memorise these — they appear everywhere:

- $\nabla_\mathbf{x} (\mathbf{a}^\top \mathbf{x}) = \mathbf{a}$.
- $\nabla_\mathbf{x} (\mathbf{x}^\top A \mathbf{x}) = (A + A^\top) \mathbf{x}$. For symmetric $A$, this is $2 A \mathbf{x}$.
- $\nabla_\mathbf{x} \|\mathbf{x}\|_2^2 = 2\mathbf{x}$.
- $\nabla_\mathbf{x} \|A\mathbf{x} - \mathbf{b}\|_2^2 = 2 A^\top (A\mathbf{x} - \mathbf{b})$ — the OLS gradient (see [OLS](../classical/ols)).

## Forward-mode and reverse-mode autodiff

Two ways to compute gradients of compositions:

- **Forward mode** — evaluate $f$ and its Jacobian-vector product $J \mathbf{v}$ in one pass. Cost is $O(n \cdot \text{cost}(f))$ for an $n$-input function. Right when there are few inputs (e.g., physics simulation with a few parameters).
- **Reverse mode** — evaluate $f$ once forward (storing intermediates), then run a second pass backward to compute the **vector-Jacobian product** $\mathbf{v}^\top J$. Cost is $O(\text{cost}(f))$ per output. Right when there are few outputs (e.g., a scalar loss). This is **backpropagation**.

For ML, reverse mode wins: the loss is a single scalar, the parameters are millions, and reverse-mode gives all gradients in one extra forward-pass cost.

## What to read next

- [Linear Algebra Recap](./linear-algebra) — Jacobians and Hessians live in matrix notation.
- [Convex Optimization](./convex-optimization) — first- and second-order conditions for the smooth-convex case.
- [Backpropagation](../../dnn/basics/backpropagation) — reverse-mode autodiff applied to neural networks.
