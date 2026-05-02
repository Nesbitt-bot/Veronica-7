---
title: The Perceptron (Rosenblatt, 1958)
order: 4
---

# The Perceptron

The perceptron is the historical ancestor of every neural network. Frank Rosenblatt introduced it in 1958 as a mechanical model of biological perception; Minsky & Papert's 1969 book *Perceptrons* showed its limits and triggered the first AI winter; the multi-layer perceptron and backpropagation eventually revived it.

## The algorithm

Given labelled data $\{(x_i, y_i)\}$ with $y_i \in \{-1, +1\}$, initialise $w \leftarrow 0$. Iterate over examples:

- If $y_i (w^\top x_i) \le 0$ (mistake), update $w \leftarrow w + y_i x_i$.

That is the entire learning rule.

## Convergence (Novikoff, 1962)

If the data is linearly separable with margin $\gamma$ and $\lVert x_i \rVert \le R$, the perceptron makes at most $(R/\gamma)^2$ mistakes — independent of dataset size.

## Why it eventually mattered

- The mistake-bound proof is the prototype for **online learning**.
- Stacking perceptrons gave the **MLP**, which with backpropagation became deep learning.
- The dual form (storing only support vectors) anticipates **SVMs**.

## What to read next

- [SVM](./svm) — the perceptron's margin-maximising successor.
- [From Perceptron to MLP](/dnn/basics/mlp) — the deep-learning continuation.
- [Connectionism & The Perceptron Controversy](../history/connectionism) — historical context.

::: info Stub status
Seed introduction. Expand with the dual form, the kernel perceptron, and Minsky–Papert's XOR critique.
:::
