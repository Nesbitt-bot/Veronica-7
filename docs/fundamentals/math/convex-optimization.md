---
title: Convex Optimization Basics
order: 4
---

# Convex Optimization Basics

A **convex optimisation** problem has a convex objective on a convex feasible set. Such problems are *easy* in a precise sense: any local minimum is a global one, the dual lower-bounds the primal cleanly, and efficient algorithms exist. Most pre-deep-learning ML — OLS, ridge, lasso, SVM, logistic regression — fits inside this framework. Even when modern deep learning lives outside it, convex analysis is the right vocabulary for understanding what's *not* working.

## Convex sets and functions

A set $C \subseteq \mathbb{R}^n$ is **convex** if for any $\mathbf{x}, \mathbf{y} \in C$ and $\lambda \in [0, 1]$, $\lambda \mathbf{x} + (1 - \lambda) \mathbf{y} \in C$. The line segment between any two points stays in the set.

A function $f: \mathbb{R}^n \to \mathbb{R}$ is **convex** if its **epigraph** (the set of points above its graph) is convex, equivalently:

$$
f(\lambda \mathbf{x} + (1 - \lambda) \mathbf{y}) \;\leq\; \lambda f(\mathbf{x}) + (1 - \lambda) f(\mathbf{y}).
$$

For twice-differentiable $f$, convexity is equivalent to the Hessian being **positive semi-definite** everywhere. Strict convexity ($<$ in the inequality) gives a unique minimum.

Useful operations preserve convexity: non-negative weighted sums, max, composition with affine maps. **Logsumexp** $\log \sum_i e^{x_i}$ is convex; that's why softmax + cross-entropy is a convex loss in the logits.

## The convex problem

A standard-form convex problem is

$$
\min_\mathbf{x} \; f(\mathbf{x}) \quad \text{s.t.} \quad g_i(\mathbf{x}) \leq 0,\; A\mathbf{x} = \mathbf{b},
$$

with $f$ and each $g_i$ convex. Three classes worth recognising:

- **Linear program (LP)** — linear $f$ and linear $g_i$. Solvable to optimality at scale (commercial solvers handle $10^7$ variables).
- **Quadratic program (QP)** — quadratic $f$, linear $g_i$. SVM dual is a QP. Lasso is a QP.
- **Semidefinite program (SDP)** — variables include matrices, with PSD constraints. Used in some kernel learning, control, and sparse-recovery literature.

## Why convexity matters

Two structural results:

- **Local = global.** A local minimum of a convex function is a global minimum. Gradient descent cannot get stuck in suboptimal basins.
- **First-order conditions are sufficient.** $\nabla f(\mathbf{x}^*) = 0$ on an unconstrained convex problem certifies optimality. With constraints, the **KKT conditions** generalise this: stationarity, primal/dual feasibility, complementary slackness. Solving KKT solves the problem.

In **non-convex** problems (deep networks), neither holds. There can be many local minima, all stationary, with very different objective values. Why deep networks generalise *well* despite this is the central puzzle that [double descent](../../dnn/regularization/double-descent) and implicit-bias work address.

## Lagrangian duality

For a constrained problem $\min f(\mathbf{x})$ s.t. $g_i(\mathbf{x}) \leq 0$, the **Lagrangian** is

$$
L(\mathbf{x}, \boldsymbol{\lambda}) \;=\; f(\mathbf{x}) + \sum_i \lambda_i g_i(\mathbf{x}), \qquad \lambda_i \geq 0.
$$

The **dual function** $g(\boldsymbol{\lambda}) = \min_\mathbf{x} L(\mathbf{x}, \boldsymbol{\lambda})$ lower-bounds the primal optimum for any $\boldsymbol{\lambda} \geq 0$. The **dual problem** $\max_{\boldsymbol{\lambda} \geq 0} g(\boldsymbol{\lambda})$ is always concave (regardless of primal convexity), and for convex problems with **strong duality**, primal optimum = dual optimum.

The most consequential application: **SVM** (see [SVM](../classical/svm)). Solving its dual reveals the kernel structure — predictions depend on inner products, not raw features — which is what unlocks the [kernel trick](../classical/kernels).

## Gradient methods and convergence rates

For smooth convex $f$ with $L$-Lipschitz gradient, gradient descent with $\eta = 1/L$ converges as $f(\mathbf{x}_t) - f(\mathbf{x}^*) = O(1/t)$. For **strongly convex** $f$ (Hessian $\geq m I$), convergence is **linear**: $O((1 - m/L)^t)$. **Nesterov's accelerated method** (1983) achieves $O(1/t^2)$ for smooth convex — the optimal first-order rate — and is the theoretical reason [momentum-based optimisers](../../dnn/optimization/sgd) work.

For non-smooth convex (lasso's $\ell_1$, SVM hinge), use proximal methods or ADMM. Modern interior-point methods solve LP/QP/SDP at much higher rates than first-order, but require $O(n^3)$ operations per iteration so don't scale to deep-learning sizes.

## Smooth, strongly convex problems are easy

The take-home for ML: classical methods (OLS, ridge, logistic, SVM) are **smooth strongly convex** problems with closed-form or rapidly-converging solvers. They were never the bottleneck of pre-2012 ML — feature engineering was. Modern deep learning gave up convexity for representation power; understanding what was lost (the local-minimum guarantee) is the point of this page.

## What to read next

- [OLS](../classical/ols) — the simplest closed-form convex problem.
- [SVM](../classical/svm) — convex QP whose dual unlocks kernels.
- [SGD, Momentum, Nesterov](../../dnn/optimization/sgd) — Nesterov in the stochastic deep-learning regime.
