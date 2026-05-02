---
title: Logistic Regression
order: 3
---

# Logistic Regression

Logistic regression is the canonical model for binary classification — a linear function of features passed through a sigmoid to produce a probability. Despite the name, it is *not* regression. It is the discrete-output cousin of [OLS](./ols), the simplest member of the [generalised-linear-model family](./glm), and the building block from which softmax regression, the perceptron, and the final layer of every classification network all descend.

## The model

For binary labels $y \in \{0, 1\}$, logistic regression posits

$$
P(y = 1 \mid \mathbf{x}) \;=\; \sigma(\boldsymbol{\beta}^\top \mathbf{x}) \;=\; \frac{1}{1 + e^{-\boldsymbol{\beta}^\top \mathbf{x}}}.
$$

The sigmoid maps the unbounded linear predictor $\eta = \boldsymbol{\beta}^\top \mathbf{x}$ (the **log-odds**) into a probability in $(0, 1)$. Two readings:

- **Probabilistic** — model the conditional class probability directly.
- **Linear log-odds** — $\log\bigl(P(y=1) / P(y=0)\bigr) = \boldsymbol{\beta}^\top \mathbf{x}$. Each unit increase in $x_j$ multiplies the odds of $y = 1$ by $e^{\beta_j}$.

## Maximum likelihood

The log-likelihood of $N$ i.i.d. samples is

$$
\log L(\boldsymbol{\beta}) \;=\; \sum_{i=1}^N y_i \log p_i + (1 - y_i) \log(1 - p_i), \qquad p_i = \sigma(\boldsymbol{\beta}^\top \mathbf{x}_i).
$$

Equivalently, the **binary cross-entropy** loss with a flipped sign. The gradient has a remarkably clean form:

$$
\nabla_{\boldsymbol{\beta}} \log L \;=\; \sum_i (y_i - p_i)\, \mathbf{x}_i \;=\; X^\top (\mathbf{y} - \mathbf{p}).
$$

Just like OLS, the gradient is the design matrix transpose times the residual — but the residual is now in probability space. There is **no closed form** for $\hat{\boldsymbol{\beta}}$; instead, optimise iteratively.

## Optimisation: Newton-Raphson / IRLS

The Hessian is

$$
H \;=\; -X^\top W X, \qquad W = \mathrm{diag}\bigl(p_i(1 - p_i)\bigr).
$$

$H$ is negative semi-definite, so the log-likelihood is **concave** — the unique stationary point is the global maximum. Newton's method updates

$$
\boldsymbol{\beta}^{(t+1)} \;=\; \boldsymbol{\beta}^{(t)} + (X^\top W^{(t)} X)^{-1} X^\top (\mathbf{y} - \mathbf{p}^{(t)}).
$$

This is **Iteratively Reweighted Least Squares** (IRLS) — at each step you solve a weighted-least-squares problem. Converges in 5–10 iterations on well-behaved data; a robust default for small-to-medium logistic regression.

For large data, **gradient descent** / SGD is the practical solver — same approach as deep networks. Convergence is slower but per-step cost is lower.

## Regularised logistic regression

L1 / L2 penalties extend directly:

$$
\hat{\boldsymbol{\beta}} \;=\; \arg\min_{\boldsymbol{\beta}} \; -\log L(\boldsymbol{\beta}) + \lambda \Omega(\boldsymbol{\beta}).
$$

The penalised problem is still strictly convex (assuming non-zero $\lambda$ for L2), with a unique optimum. **Glmnet** (Friedman et al., 2010) is the canonical R/Python package for fitting elastic-net-penalised logistic regression at scale via coordinate descent.

For complete linear separability, unregularised logistic regression has $\hat{\boldsymbol{\beta}} \to \infty$ — the likelihood increases unboundedly. Regularisation (or stopping early) is the standard fix.

## Multi-class extension: softmax regression

For $K$-class classification, replace the sigmoid with **softmax**:

$$
P(y = k \mid \mathbf{x}) \;=\; \frac{\exp(\boldsymbol{\beta}_k^\top \mathbf{x})}{\sum_{j=1}^K \exp(\boldsymbol{\beta}_j^\top \mathbf{x})}.
$$

Trained by maximum likelihood with cross-entropy loss. Same convex objective, same gradient form. Softmax regression is what the final layer of every classification deep network computes.

## Connection to deep learning

A neural-network classifier is just a stack of logistic regressions whose features are themselves learned. The final layer $\hat{p} = \sigma(W_L \mathbf{h}_{L-1} + b_L)$ is binary logistic regression on learned features $\mathbf{h}_{L-1}$. Cross-entropy + softmax + linear layer is the universal classification head.

The connection runs deeper: **the gradient of cross-entropy + softmax simplifies to (predicted - target)** — the same gradient as OLS, applied in probability space. This is one of the reasons cross-entropy + softmax pairs so naturally with backpropagation.

## What to read next

- [Generalized Linear Models](./glm) — the unified framework for regression-with-a-link-function.
- [Ridge & Lasso Regression](./ridge-lasso) — the same penalties applied to OLS.
- [Activation Functions](../../dnn/basics/activations) — softmax in the deep-learning context.
