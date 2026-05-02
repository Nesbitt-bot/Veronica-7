---
title: Ridge & Lasso Regression
order: 2
---

# Ridge & Lasso Regression

[Ordinary Least Squares](./ols) breaks down when features are correlated or when there are more features than samples — the design matrix becomes ill-conditioned or rank-deficient. Ridge and lasso regression add penalty terms that fix the conditioning problem and, in lasso's case, select features automatically. Together they are the canonical examples of how [regularisation](../theory/regularization) tames classical regression.

## Ridge regression

The ridge objective adds an L2 penalty:

$$
\hat{\boldsymbol{\beta}}_\text{ridge} \;=\; \arg\min_{\boldsymbol{\beta}} \; \tfrac{1}{2N} \|\mathbf{y} - X\boldsymbol{\beta}\|_2^2 + \lambda \|\boldsymbol{\beta}\|_2^2.
$$

Setting the gradient to zero gives the closed form

$$
\hat{\boldsymbol{\beta}}_\text{ridge} \;=\; (X^\top X + \lambda N I)^{-1} X^\top \mathbf{y}.
$$

The added $\lambda N I$ shifts every eigenvalue of $X^\top X$ up by $\lambda N$, fixing ill-conditioning when columns are nearly collinear. Geometrically, ridge **shrinks** all coefficients smoothly toward zero — large coefficients shrink proportionally, none reach exactly zero.

**Bayesian interpretation.** Ridge is the MAP estimate under a Gaussian prior $\boldsymbol{\beta} \sim \mathcal{N}(\mathbf{0}, \sigma^2/(\lambda N) \cdot I)$. The penalty strength $\lambda$ encodes the prior's tightness: larger $\lambda$ = stronger belief in small coefficients.

**Effective degrees of freedom.** For the ridge estimator, $\mathrm{df}(\lambda) = \mathrm{tr}\bigl[X(X^\top X + \lambda N I)^{-1} X^\top\bigr] = \sum_i \sigma_i^2 / (\sigma_i^2 + \lambda N)$, where $\sigma_i$ are the singular values of $X$. Ridge spends "effective parameters" smoothly, in contrast to OLS's hard $p$ degrees of freedom.

## Lasso regression

The lasso objective uses an L1 penalty:

$$
\hat{\boldsymbol{\beta}}_\text{lasso} \;=\; \arg\min_{\boldsymbol{\beta}} \; \tfrac{1}{2N} \|\mathbf{y} - X\boldsymbol{\beta}\|_2^2 + \lambda \|\boldsymbol{\beta}\|_1.
$$

There is no closed form — the L1 penalty is non-differentiable at zero — but the problem is convex. Standard solvers: coordinate descent (Friedman et al., 2007), proximal-gradient ISTA / FISTA, and the LARS algorithm.

The geometric distinction from ridge is critical. The L1 ball has corners on the coordinate axes; the squared-error contours touch the ball preferentially at these corners, producing **exactly-zero coefficients**. Lasso performs **automatic feature selection** as part of fitting.

For orthonormal $X$ ($X^\top X = I$), the lasso solution is **soft thresholding**:

$$
\hat{\beta}_j \;=\; \mathrm{sign}(\hat{\beta}_j^\text{OLS}) \cdot \max\bigl(|\hat{\beta}_j^\text{OLS}| - \lambda, 0\bigr).
$$

Coefficients smaller in magnitude than $\lambda$ are zeroed; larger ones are shrunk by $\lambda$. The general non-orthonormal case is more complex but qualitatively similar.

## Elastic net

Lasso has two known weaknesses: (1) when features are highly correlated, lasso picks one and zeros the rest somewhat arbitrarily; (2) when $p > N$, lasso selects at most $N$ features.

**Elastic net** (Zou & Hastie, JRSS-B 2005) combines both penalties:

$$
\hat{\boldsymbol{\beta}}_\text{enet} \;=\; \arg\min_{\boldsymbol{\beta}} \; \tfrac{1}{2N} \|\mathbf{y} - X\boldsymbol{\beta}\|_2^2 + \lambda \bigl( \alpha \|\boldsymbol{\beta}\|_1 + (1 - \alpha) \tfrac{1}{2} \|\boldsymbol{\beta}\|_2^2 \bigr), \qquad \alpha \in [0, 1].
$$

The L2 component groups correlated features (their coefficients move together), while L1 drives unimportant ones to zero. Elastic net is the practical default in high-dimensional regression when features are correlated — gene expression, fMRI, NLP feature sets.

## When to use which

A quick guide:

- **Many predictors, all believed relevant** — ridge.
- **Suspected sparse truth, uncorrelated features** — lasso.
- **Suspected sparse truth, correlated features** — elastic net.
- **$p \gg N$** — lasso or elastic net (ridge can't do feature selection but can still regularise).
- **Only goal is generalisation, not interpretability** — ridge tends to give slightly lower test error in non-sparse regimes; lasso wins when the truth really is sparse.

Cross-validate $\lambda$ on a log grid; for elastic net, also cross-validate $\alpha$ — typical $\alpha \in \{0.1, 0.5, 0.9\}$.

## What to read next

- [Ordinary Least Squares](./ols) — the unregularised baseline.
- [Regularization Theory](../theory/regularization) — the broader framework these are special cases of.
- [Logistic Regression](./logistic-regression) — same penalties applied to classification.
