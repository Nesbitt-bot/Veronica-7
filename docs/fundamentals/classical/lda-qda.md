---
title: Linear & Quadratic Discriminant Analysis
order: 9
---

# Linear & Quadratic Discriminant Analysis

LDA and QDA are generative classifiers: model each class's feature distribution as a multivariate Gaussian, then classify by Bayes' rule. They sit between [logistic regression](./logistic-regression) (also linear, but discriminative) and [Naive Bayes](./naive-bayes) (also generative, but with a stronger independence assumption). LDA in particular is a workhorse baseline that doubles as a dimensionality reduction technique.

## The model

For $K$ classes, assume

$$
P(\mathbf{x} \mid y = k) \;=\; \mathcal{N}(\boldsymbol{\mu}_k, \Sigma_k), \qquad P(y = k) = \pi_k.
$$

By Bayes' rule, the **log-posterior** is

$$
\log P(y = k \mid \mathbf{x}) \;=\; -\tfrac{1}{2}(\mathbf{x} - \boldsymbol{\mu}_k)^\top \Sigma_k^{-1} (\mathbf{x} - \boldsymbol{\mu}_k) - \tfrac{1}{2}\log |\Sigma_k| + \log \pi_k + \text{const}.
$$

The classifier picks the class with the highest log-posterior. The shape of the decision boundary depends on what we assume about $\Sigma_k$.

## QDA — class-specific covariance

If each class has its own covariance $\Sigma_k$, the decision boundaries are **quadratic** surfaces — ellipsoids, hyperboloids, paraboloids. QDA fits one mean $\boldsymbol{\mu}_k$ and one covariance $\Sigma_k$ per class:

$$
\hat{\boldsymbol{\mu}}_k = \frac{1}{N_k} \sum_{i: y_i = k} \mathbf{x}_i, \qquad \hat{\Sigma}_k = \frac{1}{N_k} \sum_{i: y_i = k} (\mathbf{x}_i - \hat{\boldsymbol{\mu}}_k)(\mathbf{x}_i - \hat{\boldsymbol{\mu}}_k)^\top.
$$

QDA needs $K \cdot d(d+1)/2$ parameters for the covariances — quadratically many in feature dimension — which makes it data-hungry.

## LDA — shared covariance

If all classes share a single covariance $\Sigma_k = \Sigma$, the quadratic terms cancel and the decision boundary becomes **linear**:

$$
\delta_k(\mathbf{x}) \;=\; \mathbf{x}^\top \Sigma^{-1} \boldsymbol{\mu}_k - \tfrac{1}{2} \boldsymbol{\mu}_k^\top \Sigma^{-1} \boldsymbol{\mu}_k + \log \pi_k.
$$

LDA estimates a single pooled covariance from all classes:

$$
\hat{\Sigma} \;=\; \frac{1}{N - K} \sum_k \sum_{i: y_i = k} (\mathbf{x}_i - \hat{\boldsymbol{\mu}}_k)(\mathbf{x}_i - \hat{\boldsymbol{\mu}}_k)^\top.
$$

This is exactly Gaussian Naive Bayes with non-diagonal covariance — the difference from Naive Bayes is that LDA captures correlations between features.

## LDA as dimensionality reduction

Beyond classification, LDA gives a **supervised projection**. The decision rules depend only on $\Sigma^{-1} \boldsymbol{\mu}_k$ — at most $K - 1$ independent directions. **Fisher's LDA** maximises the ratio of between-class to within-class variance:

$$
\max_{\mathbf{w}} \; \frac{\mathbf{w}^\top S_B \mathbf{w}}{\mathbf{w}^\top S_W \mathbf{w}},
$$

with $S_B$ the between-class scatter and $S_W$ the within-class scatter. The solution is a generalised eigenvalue problem; the top $K - 1$ eigenvectors give a $(K-1)$-dimensional projection that maximally separates classes.

This is **the supervised counterpart to PCA** — PCA finds high-variance directions; LDA finds high class-separation directions. For visualisation of a labelled dataset in 2D, LDA-projected scatter plots are often more informative than PCA.

## Regularisation: shrinkage and RDA

When $d$ is large or $N$ small, $\hat{\Sigma}$ may be singular or near-singular. Two fixes:

- **Shrinkage** — replace $\hat{\Sigma}$ with $(1 - \alpha) \hat{\Sigma} + \alpha \cdot \mathrm{diag}(\hat{\Sigma})$ for some $\alpha \in [0, 1]$, blending toward the diagonal-only (Naive Bayes) covariance.
- **Regularised Discriminant Analysis** (Friedman, 1989) — interpolate between LDA and QDA: $\hat{\Sigma}_k(\gamma) = \gamma \hat{\Sigma}_k + (1 - \gamma) \hat{\Sigma}$, with $\gamma$ chosen by cross-validation.

## When LDA / QDA win

- **Modest dimension, Gaussian-ish features** — LDA matches or beats logistic regression, often with much faster training.
- **Multi-class problems with equal effort across classes** — LDA naturally handles all $K$ at once.
- **As a dimensionality-reduction step** before another classifier — Fisher LDA gives strong class-separation directions almost for free.

The Gaussian assumption is rarely *exactly* true, but LDA is robust to mild deviations. For categorical or extremely skewed data, generalised additive models or tree-based methods are better.

## What to read next

- [Naive Bayes](./naive-bayes) — same Gaussian likelihood, but with diagonal covariance.
- [Logistic Regression](./logistic-regression) — the discriminative analogue with the same linear boundary.
- [PCA & SVD](../unsupervised/pca-svd) — the unsupervised analogue of Fisher LDA.
