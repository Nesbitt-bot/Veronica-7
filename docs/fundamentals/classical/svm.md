---
title: Support Vector Machines (SVM)
order: 5
---

# Support Vector Machines (SVM)

SVMs were the dominant supervised classifier from roughly 1995 to 2012 — the period between the perceptron's revival and the AlexNet moment. They are still the right answer for many small-data, structured problems, and the *kernel trick* they popularized is reborn in modern attention mechanisms.

## The geometric idea

Given linearly separable data $\{(x_i, y_i)\}_{i=1}^n$ with $y_i \in \{-1, +1\}$, find the hyperplane $w^\top x + b = 0$ that **maximizes the margin** — the distance to the nearest training point.

This gives the **hard-margin** primal:

$$
\min_{w, b} \; \tfrac{1}{2}\lVert w \rVert^2
\quad \text{s.t.} \quad y_i(w^\top x_i + b) \ge 1, \; \forall i.
$$

## Soft margin (Cortes & Vapnik, 1995)

Real data is rarely separable. Introduce slack $\xi_i \ge 0$:

$$
\min_{w, b, \xi} \; \tfrac{1}{2}\lVert w \rVert^2 + C \sum_{i=1}^n \xi_i
\quad \text{s.t.} \quad y_i(w^\top x_i + b) \ge 1 - \xi_i.
$$

The hyperparameter $C$ trades off margin width against training error.

## The dual & support vectors

The Lagrangian dual is

$$
\max_{\alpha} \; \sum_i \alpha_i - \tfrac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j x_i^\top x_j
\quad \text{s.t.} \quad 0 \le \alpha_i \le C, \; \sum_i \alpha_i y_i = 0.
$$

Only points with $\alpha_i > 0$ matter — these are the **support vectors**. The dual depends on $x_i$ only through inner products $x_i^\top x_j$, which is exactly what enables the kernel trick.

## The kernel trick

Replace $x_i^\top x_j$ with a positive-definite kernel $k(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle$ that implicitly maps inputs to a high-dimensional feature space. Common choices:

- **Linear:** $k(x, x') = x^\top x'$
- **Polynomial:** $k(x, x') = (x^\top x' + c)^d$
- **RBF / Gaussian:** $k(x, x') = \exp(-\gamma \lVert x - x' \rVert^2)$

The RBF kernel makes SVMs universal approximators on bounded inputs.

## Why SVMs still matter

1. They give a **principled** large-margin classifier for tabular and small-sample problems.
2. The **dual / kernel formulation** generalises to many other tasks (kernel PCA, Gaussian processes, kernel ridge regression).
3. Modern self-attention is, viewed at one angle, a learned *kernel similarity* between tokens — see [Transformer Era · 2017](/transformer-era/2017/self-attention).

## What to read next

- [Kernel Methods & The Kernel Trick](./kernels)
- [The Perceptron](./perceptron) — the SVM's ancestor.
- [The Kernel Era (1995–2010)](../history/kernel-era) — historical context.

::: info Stub status
Seed introduction. Expand with hinge loss / sub-gradient view, SMO solver, multi-class extensions, and structural SVMs.
:::
