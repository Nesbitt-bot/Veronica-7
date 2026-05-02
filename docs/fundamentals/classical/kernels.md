---
title: Kernel Methods & The Kernel Trick
order: 10
---

# Kernel Methods & The Kernel Trick

A kernel method replaces inner products $\langle \mathbf{x}, \mathbf{x}' \rangle$ with a **kernel function** $K(\mathbf{x}, \mathbf{x}')$ that implicitly computes inner products in some (potentially infinite-dimensional) feature space. Without ever materialising the feature map, you get to do non-linear classification, regression, and density estimation. This was the dominant idea in machine learning from 1995 to about 2010 — the [kernel era](../history/kernel-era).

## Feature maps and the trick

For an input space $\mathcal{X}$ and feature map $\phi: \mathcal{X} \to \mathcal{F}$ into a Hilbert space $\mathcal{F}$, define $K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle$.

Many algorithms — perceptron, ridge regression, SVM, PCA — depend on the data only through inner products. So we can replace every $\langle \mathbf{x}_i, \mathbf{x}_j \rangle$ with $K(\mathbf{x}_i, \mathbf{x}_j)$, get a non-linear method, and **never compute $\phi$ explicitly**. This is the **kernel trick**.

Concretely: ordinary linear regression in $\phi$-space gives a function $f(\mathbf{x}) = \langle \mathbf{w}, \phi(\mathbf{x}) \rangle$. By the [representer theorem](#representer-theorem), the optimum has $\mathbf{w}^* = \sum_i \alpha_i \phi(\mathbf{x}_i)$, so

$$
f(\mathbf{x}) \;=\; \sum_i \alpha_i K(\mathbf{x}_i, \mathbf{x}).
$$

You only need the **Gram matrix** $K_{ij} = K(\mathbf{x}_i, \mathbf{x}_j)$ — never the explicit features.

## What counts as a kernel: Mercer's theorem

A function $K: \mathcal{X} \times \mathcal{X} \to \mathbb{R}$ is a valid kernel iff it is **symmetric** and **positive semi-definite**: for any finite set of inputs, the Gram matrix is PSD. Mercer's theorem then guarantees the existence of a feature space $\mathcal{F}$ and map $\phi$ with $K(\mathbf{x}, \mathbf{x}') = \langle \phi(\mathbf{x}), \phi(\mathbf{x}') \rangle$.

Useful operations preserve PSD-ness: sums, products, multiplication by a positive scalar, and composition with positive-coefficient power series. So you can build complex kernels from simple ones algebraically.

## The standard menu

- **Linear** — $K(\mathbf{x}, \mathbf{x}') = \mathbf{x}^\top \mathbf{x}'$. Just standard linear methods.
- **Polynomial** — $K(\mathbf{x}, \mathbf{x}') = (\mathbf{x}^\top \mathbf{x}' + c)^d$. Feature space contains all monomials up to degree $d$.
- **Gaussian / RBF** — $K(\mathbf{x}, \mathbf{x}') = \exp(-\|\mathbf{x} - \mathbf{x}'\|^2 / 2\sigma^2)$. Feature space is **infinite-dimensional** — corresponds to a Gaussian-smoothed comparison.
- **Laplacian** — $K(\mathbf{x}, \mathbf{x}') = \exp(-\|\mathbf{x} - \mathbf{x}'\|_1 / \sigma)$. L1-based variant.
- **Sigmoid** — $K(\mathbf{x}, \mathbf{x}') = \tanh(\alpha \mathbf{x}^\top \mathbf{x}' + c)$. Not always PSD; historically connected to neural networks.

The RBF kernel with cross-validated bandwidth $\sigma$ is the universal "I don't know what kernel to use" default.

## Representer theorem

For any regularised risk

$$
\min_f \; \sum_i \ell(y_i, f(\mathbf{x}_i)) + \lambda \|f\|_\mathcal{H}^2,
$$

with $\mathcal{H}$ a Reproducing Kernel Hilbert Space (RKHS) for kernel $K$, the optimum has the form

$$
f^*(\mathbf{x}) \;=\; \sum_{i=1}^N \alpha_i K(\mathbf{x}_i, \mathbf{x}).
$$

The infinite-dimensional optimisation reduces to choosing $N$ scalars $\alpha_i$. Combined with the kernel trick, this is what makes kernel methods computationally tractable — but also what makes them **scale poorly**: the Gram matrix is $N \times N$, and $N^2$ memory is the practical ceiling.

## The flagship: kernel SVM

Kernel methods reached their peak in the [SVM](./svm). The dual SVM optimisation is

$$
\max_{\boldsymbol{\alpha}} \; \sum_i \alpha_i - \tfrac{1}{2} \sum_{ij} \alpha_i \alpha_j y_i y_j K(\mathbf{x}_i, \mathbf{x}_j) \quad \text{s.t.} \quad 0 \leq \alpha_i \leq C.
$$

Plug in any valid $K$ and you get a non-linear classifier. RBF SVMs were the de-facto best classifier on most tabular datasets from 2000 to about 2010, only displaced by gradient-boosted trees and (much later) deep networks.

## Why kernels lost ground

Two reasons kernel methods are no longer the default:

- **Scaling.** Gram matrix is $N \times N$. Past $N \approx 10^5$ this becomes prohibitive without low-rank approximations (Nyström, random Fourier features) that introduce their own errors.
- **Representation learning.** Kernels encode a *fixed* feature space. Deep networks **learn** a feature space from data, often discovering more useful representations than any hand-chosen kernel could produce. Once you can train a deep model, RBF features start to look quaint.

Kernel methods survive in:

- Small/medium structured-data problems (tabular regression, support-vector regression in chemistry).
- Theoretical analysis — the **Neural Tangent Kernel** (NTK; Jacot et al., 2018) shows that wide neural networks behave like kernel methods, providing a bridge between the two paradigms.
- Hybrid methods — e.g., Gaussian process regression with kernels, used in Bayesian optimisation.

## What to read next

- [SVM](./svm) — the canonical kernel method.
- [Kernel Era (history)](../history/kernel-era) — the rise and fall, in context.
- [Deep Learning Renaissance](../history/deep-learning-renaissance) — what displaced kernels.
