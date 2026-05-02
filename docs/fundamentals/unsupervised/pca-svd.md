---
title: PCA & SVD
order: 4
---

# PCA & SVD

Principal Component Analysis is the canonical linear dimensionality-reduction technique: find the directions of maximum variance in the data and project onto the top $k$ of them. Computationally, it is just the [SVD](../math/linear-algebra) of the centred data matrix. PCA is the "first thing to try" for any high-dimensional dataset and the conceptual ancestor of every later representation-learning method.

## The objective

Given $N$ data points $\mathbf{x}_i \in \mathbb{R}^d$, find a $k$-dimensional projection that **maximises projected variance** — equivalently, minimises reconstruction error. Centre the data: $\tilde{\mathbf{x}}_i = \mathbf{x}_i - \bar{\mathbf{x}}$. The first principal component is

$$
\mathbf{w}_1 \;=\; \arg\max_{\|\mathbf{w}\| = 1} \mathrm{Var}(\mathbf{w}^\top \tilde{\mathbf{x}}) \;=\; \arg\max_{\|\mathbf{w}\| = 1} \mathbf{w}^\top S \mathbf{w},
$$

with $S = \frac{1}{N} \sum_i \tilde{\mathbf{x}}_i \tilde{\mathbf{x}}_i^\top$ the (sample) covariance matrix. The top-$k$ components are the eigenvectors of $S$ corresponding to the $k$ largest eigenvalues.

## SVD computation

For the centred data matrix $\tilde{X} \in \mathbb{R}^{N \times d}$ (one row per sample), the SVD is $\tilde{X} = U \Sigma V^\top$. Then:

- The columns of $V$ are the **principal components** (eigenvectors of $\tilde{X}^\top \tilde{X} = N S$).
- The squared singular values $\sigma_i^2 / N$ are the **variances** along each component.
- The projected data is $\tilde{X} V_k = U_k \Sigma_k$ — the first $k$ columns of $U \Sigma$.

For $d \ll N$, work with the $d \times d$ covariance and its eigendecomposition. For $N \ll d$ (e.g., genomics with $N$ samples and $d$ genes), work with the $N \times N$ Gram matrix instead. Both routes give the same components.

## Three views

PCA can be derived from three independent objectives that all agree:

- **Maximum variance** — pick the projection whose projected variance is largest.
- **Minimum reconstruction error** — pick the projection whose reconstruction $\hat{\mathbf{x}} = V_k V_k^\top \tilde{\mathbf{x}}$ minimises $\sum_i \|\mathbf{x}_i - \hat{\mathbf{x}}_i\|^2$.
- **Decorrelation** — find an orthonormal basis in which features are linearly uncorrelated.

These coincide because of the **Eckart-Young theorem**: the best rank-$k$ approximation of $\tilde{X}$ in Frobenius norm is the truncated SVD.

## Whitening

After projecting, you can **whiten** by dividing each component by its singular value:

$$
\mathbf{z} = \Sigma_k^{-1} V_k^\top \tilde{\mathbf{x}}.
$$

The result has unit covariance and is the input format expected by some downstream methods (Fisher LDA, ICA). Whitening is a regularisation choice — it equalises components, removing the natural variance-based weighting.

## Choosing $k$

- **Variance explained** — $k$ such that $\sum_{i \leq k} \sigma_i^2 / \sum_i \sigma_i^2 \geq 0.95$ (or 0.99). Standard but ad-hoc.
- **Scree plot** — plot $\sigma_i^2$ vs $i$, look for an "elbow".
- **Cross-validate** — pick $k$ minimising downstream-task error.

## Probabilistic PCA

*Probabilistic PCA* (Tipping, Bishop, 1999) gives a generative model:

$$
\mathbf{x} = W \mathbf{z} + \boldsymbol{\mu} + \boldsymbol{\epsilon}, \qquad \mathbf{z} \sim \mathcal{N}(0, I), \; \boldsymbol{\epsilon} \sim \mathcal{N}(0, \sigma^2 I).
$$

The maximum-likelihood $W$ converges to the top-$k$ eigenvectors of $S$ as $\sigma^2 \to 0$. The probabilistic view enables Bayesian PCA, missing-data PCA, and the [VAE](../../dnn/generative/vae)-style extensions.

## Limitations

- **Linear.** PCA finds the best **linear** subspace. Non-linear structure (manifolds, clusters) is missed.
- **Variance is not always meaning.** High variance might come from noise or scale, not signal. Standardise inputs first if features are on different scales.
- **Sensitive to outliers.** Squared error is dominated by extreme points; consider robust PCA for noisy data.

For non-linear structure use [t-SNE / UMAP](./manifold-learning) or autoencoders. For non-Gaussian latents, use ICA or normalising flows.

## What PCA is for, today

- **Visualisation** of high-dimensional data — project to 2D / 3D for inspection.
- **Compression** with reconstruction guarantees — top-$k$ SVD is the optimal rank-$k$ approximation.
- **Pre-processing** for downstream methods sensitive to dimensionality (kNN, GMM, clustering).
- **Feature analysis** — examining principal components reveals dominant axes of variation.
- **Inside larger systems** — covariance estimators in finance, denoising, image compression (DCT-style).

In the deep-learning era, PCA's role has shifted from feature extractor to diagnostic tool — it tells you *whether* low-dimensional structure exists before you commit to a more expressive model.

## What to read next

- [Manifold Learning](./manifold-learning) — non-linear dimensionality reduction.
- [Linear Algebra Recap](../math/linear-algebra) — the SVD that powers PCA.
- [LDA / QDA](../classical/lda-qda) — the supervised analogue.
