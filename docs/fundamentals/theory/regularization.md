---
title: Regularization (L1, L2, Elastic Net)
order: 7
---

# Regularization (L1, L2, Elastic Net)

Regularisation adds a penalty term to the empirical risk to discourage overly complex hypotheses. It is the continuous-relaxation answer to "how do we control [model capacity](./generalization) without committing to a discrete model selection step?". L2 (ridge), L1 (lasso), and elastic-net are the canonical penalties for linear models and generalise to weight decay in deep networks.

## The penalised objective

Replace ERM with **regularised empirical risk minimisation**:

$$
\hat{\theta} \;=\; \arg\min_\theta \; \hat{R}_S(\theta) + \lambda\, \Omega(\theta),
$$

with $\Omega$ a penalty function and $\lambda \geq 0$ a hyperparameter trading data fit for complexity. As $\lambda \to 0$, recover unregularised ERM; as $\lambda \to \infty$, force $\theta$ toward whatever $\Omega$ prefers (zero, low norm, sparsity).

## L2 / ridge / Tikhonov

The L2 penalty is $\Omega(\theta) = \|\theta\|_2^2 = \sum_i \theta_i^2$. For linear regression with squared loss this gives **ridge regression**:

$$
\hat{\theta}_\text{ridge} \;=\; (X^\top X + \lambda I)^{-1} X^\top \mathbf{y}.
$$

The $\lambda I$ shifts the eigenvalues of $X^\top X$ away from zero, fixing ill-conditioning when columns of $X$ are correlated. Geometrically, ridge **shrinks** the coefficients smoothly toward zero — small coefficients stay small, large ones get smaller proportionally.

Bayesian view: ridge is **MAP estimation** with a Gaussian prior $\theta \sim \mathcal{N}(0, \sigma^2 / \lambda \cdot I)$ on the parameters. The prior's tightness corresponds to the regularisation strength.

In deep networks, L2 regularisation appears as **weight decay** in the optimiser update: $\theta \leftarrow \theta - \eta(\nabla \mathcal{L} + \lambda \theta)$. As discussed in [Adam vs AdamW](../../dnn/optimization/adam), the *correct* implementation in adaptive optimisers is decoupled (AdamW), not via L2 in the gradient.

## L1 / lasso

The L1 penalty is $\Omega(\theta) = \|\theta\|_1 = \sum_i |\theta_i|$. For linear regression with squared loss this gives **lasso**:

$$
\hat{\theta}_\text{lasso} \;=\; \arg\min_\theta \tfrac{1}{2N} \|\mathbf{y} - X\theta\|_2^2 + \lambda \|\theta\|_1.
$$

L1 is non-differentiable at zero, but the optimisation is still convex. Solvable with coordinate descent, ISTA / FISTA, or LARS (Least Angle Regression).

The geometric distinction from L2: the L1 ball has corners along the axes, so the optimum often sits on a corner — i.e., **some coefficients are exactly zero**. L1 produces **sparse solutions** automatically, which makes it the right tool when you suspect only a few features are relevant.

## Elastic net

When features are correlated, lasso arbitrarily picks one of a correlated group and zeros the rest. **Elastic net** (Zou, Hastie, JRSS-B 2005) combines both penalties:

$$
\Omega(\theta) \;=\; \alpha \|\theta\|_1 + (1 - \alpha)\, \tfrac{1}{2} \|\theta\|_2^2, \qquad \alpha \in [0, 1].
$$

The L2 component groups correlated features (they get similar coefficients), while L1 drives unimportant ones to zero. Elastic net is the practical default for high-dimensional regression with correlated features (gene expression, text features, fMRI).

## The bias-variance reading

Regularisation increases bias (the model can't fit the training data as flexibly) and reduces variance (the predictor is more stable across training sets). Cross-validating $\lambda$ chooses the bias-variance trade-off that minimises validation error — the practical version of the [bias-variance balance](./bias-variance).

## Implicit regularisation

The penalties above are **explicit** — written into the objective. **Implicit regularisation** comes from the optimisation algorithm itself:

- **Early stopping** — stop SGD before convergence; equivalent to L2 regularisation in some convex cases.
- **SGD on over-parameterised models** — finds low-norm interpolating solutions even without an explicit penalty.
- **Dropout, batch norm, augmentation** — each inject noise that has regularising effects without an explicit $\Omega$.

Modern deep learning relies heavily on implicit regularisation. Explicit weight decay is still used (often with small $\lambda \approx 0.01$–$0.1$ in AdamW recipes), but the bulk of generalisation control comes from the optimiser-architecture-data interaction.

## When to use what

- **Linear regression on small/medium data with informative features** — ridge is the safe default.
- **High-dimensional regression with sparse truth** — lasso or elastic net.
- **Logistic regression / SVM** — L2 by default; L1 if you want feature selection.
- **Deep networks** — weight decay (L2) at $\lambda \in [10^{-5}, 10^{-2}]$, plus implicit regularisers (dropout, augmentation, early stopping). Lasso-style sparsity is rare except in pruning literature.

## What to read next

- [Ridge & Lasso Regression](../classical/ridge-lasso) — these penalties applied to OLS in detail.
- [Bias-Variance Tradeoff](./bias-variance) — what regularisation trades.
- [Dropout](../../dnn/regularization/dropout) — the deep-learning regulariser most analogous to noise injection.
