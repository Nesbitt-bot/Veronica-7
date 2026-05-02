---
title: Linear Algebra Recap
order: 1
---

# Linear Algebra Recap

Almost every operation in machine learning is a matrix multiplication. This page is a fast tour of the linear-algebra concepts that recur throughout the rest of the curriculum: vector spaces, the four fundamental subspaces, matrix factorisations (eigendecomposition, SVD), and the geometric interpretations that let you read matrix expressions as transformations rather than indices.

## Vectors and inner products

Vectors $\mathbf{x} \in \mathbb{R}^n$ have a **norm** $\|\mathbf{x}\|_2 = \sqrt{\sum x_i^2}$ and an **inner product** $\langle \mathbf{x}, \mathbf{y} \rangle = \mathbf{x}^\top \mathbf{y}$. The geometric reading: $\langle \mathbf{x}, \mathbf{y} \rangle = \|\mathbf{x}\| \|\mathbf{y}\| \cos\theta$. Two vectors are **orthogonal** when $\langle \mathbf{x}, \mathbf{y} \rangle = 0$.

A **basis** of $\mathbb{R}^n$ is a set of $n$ linearly independent vectors; an **orthonormal basis** has unit-norm pairwise-orthogonal vectors. Coordinates in an orthonormal basis are inner products: $x_i = \langle \mathbf{x}, \mathbf{e}_i \rangle$.

## Matrices as linear maps

A matrix $A \in \mathbb{R}^{m \times n}$ is a linear map $\mathbb{R}^n \to \mathbb{R}^m$. Two ways to read $A\mathbf{x}$:

- **Column view** — $A\mathbf{x} = \sum_j x_j \mathbf{a}_j$ is a linear combination of $A$'s columns.
- **Row view** — $(A\mathbf{x})_i = \langle \mathbf{a}_i^\top, \mathbf{x} \rangle$ is the inner product of the $i$-th row with $\mathbf{x}$.

Matrix multiplication $AB$ composes the maps. Reading dimensions: if $A$ is $m \times n$ and $B$ is $n \times p$, then $AB$ is $m \times p$. The shared dimension $n$ contracts.

## The four fundamental subspaces

Every $A \in \mathbb{R}^{m \times n}$ defines four subspaces:

- **Column space** $\mathrm{Col}(A) \subseteq \mathbb{R}^m$ — span of the columns.
- **Row space** $\mathrm{Row}(A) = \mathrm{Col}(A^\top) \subseteq \mathbb{R}^n$.
- **Null space** $\mathrm{Null}(A) = \{\mathbf{x} : A\mathbf{x} = 0\} \subseteq \mathbb{R}^n$.
- **Left null space** $\mathrm{Null}(A^\top) \subseteq \mathbb{R}^m$.

Two orthogonality relations: $\mathrm{Row}(A) \perp \mathrm{Null}(A)$ and $\mathrm{Col}(A) \perp \mathrm{Null}(A^\top)$. The **rank-nullity theorem** $\mathrm{rank}(A) + \dim \mathrm{Null}(A) = n$ ties them together. These four subspaces are what regression, projection, least squares, and PCA all manipulate.

## Eigendecomposition

For square $A \in \mathbb{R}^{n \times n}$, an **eigenvector** $\mathbf{v}$ satisfies $A\mathbf{v} = \lambda \mathbf{v}$ for some scalar **eigenvalue** $\lambda$. If $A$ has $n$ linearly independent eigenvectors, it factorises as

$$
A \;=\; V \Lambda V^{-1},
$$

with $V$ the matrix of eigenvectors and $\Lambda = \mathrm{diag}(\lambda_1, \dots, \lambda_n)$. Computing $A^k$ is then trivial: $A^k = V \Lambda^k V^{-1}$.

For **symmetric** $A$, the spectral theorem gives orthonormal eigenvectors and real eigenvalues, so $V$ is orthogonal: $A = V \Lambda V^\top$. Symmetric positive-(semi)definite matrices have non-negative eigenvalues — Hessians, covariances, kernels, Gram matrices all live in this class.

## Singular Value Decomposition

For any $A \in \mathbb{R}^{m \times n}$,

$$
A \;=\; U \Sigma V^\top,
$$

where $U \in \mathbb{R}^{m \times m}$, $V \in \mathbb{R}^{n \times n}$ are orthogonal and $\Sigma \in \mathbb{R}^{m \times n}$ is diagonal with non-negative entries (singular values) in decreasing order. SVD is the universal matrix factorisation — it always exists, generalises eigendecomposition to non-square matrices, and is the foundation of:

- **PCA** — principal components are right singular vectors of the centred data matrix (see [PCA & SVD](../unsupervised/pca-svd)).
- **Pseudo-inverse** — $A^+ = V \Sigma^+ U^\top$, the right thing to use for over-/under-determined least squares.
- **Low-rank approximation** — *Eckart–Young theorem*: the best rank-$k$ approximation is $U_k \Sigma_k V_k^\top$ (top-$k$ singular triplets).
- **Numerical conditioning** — $\sigma_\max / \sigma_\min$ is the condition number; large values mean inversion is unstable.

SVD is the one matrix factorisation worth being fluent in.

## Norms and conditioning

For a matrix $A$:

- **Frobenius norm** $\|A\|_F = \sqrt{\sum_{ij} A_{ij}^2} = \sqrt{\sum_i \sigma_i^2}$.
- **Spectral norm** $\|A\|_2 = \sigma_\max$.
- **Nuclear norm** $\|A\|_* = \sum_i \sigma_i$ — the convex envelope of rank.

Each plays a different role in regularisation: Frobenius for ridge, nuclear for low-rank, spectral for stability constraints (e.g., Lipschitz networks, [WGAN](../../dnn/generative/gan)).

## What to read next

- [Probability & Statistics](./probability) — random vectors and covariance live in this language.
- [Multivariate Calculus & Gradients](./calculus) — gradients are best understood as covectors / 1-forms.
- [PCA & SVD](../unsupervised/pca-svd) — the most important application.
