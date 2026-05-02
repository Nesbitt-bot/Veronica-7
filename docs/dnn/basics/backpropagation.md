---
title: Backpropagation
order: 3
---

# Backpropagation

Backpropagation is the algorithm that makes deep learning possible. It is, mathematically, just **reverse-mode automatic differentiation** applied to a chain of differentiable operations: the chain rule, executed once forward to compute outputs and once backward to compute gradients with respect to every parameter. The cost is a constant factor over the forward pass, regardless of how many parameters there are.

## The setup

A feed-forward network is a sequence of operations

$$
\mathbf{h}_\ell = f_\ell(\mathbf{h}_{\ell - 1}; \theta_\ell), \qquad \ell = 1, \dots, L,
$$

with $\mathbf{h}_0 = \mathbf{x}$ the input, $\hat{\mathbf{y}} = \mathbf{h}_L$ the prediction, and $\mathcal{L} = \ell(\hat{\mathbf{y}}, \mathbf{y})$ the scalar loss. We want $\partial \mathcal{L} / \partial \theta_\ell$ for every layer.

## Forward and backward passes

The forward pass computes and stores each intermediate $\mathbf{h}_\ell$. The backward pass propagates the gradient of the loss with respect to each layer's output:

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{h}_{\ell - 1}} \;=\; \frac{\partial \mathcal{L}}{\partial \mathbf{h}_\ell} \cdot \frac{\partial f_\ell}{\partial \mathbf{h}_{\ell - 1}}, \qquad
\frac{\partial \mathcal{L}}{\partial \theta_\ell} \;=\; \frac{\partial \mathcal{L}}{\partial \mathbf{h}_\ell} \cdot \frac{\partial f_\ell}{\partial \theta_\ell}.
$$

Both quantities are products of **vector–Jacobian products**, never explicit Jacobian matrices. This is what makes the cost a small constant times the forward pass: each layer needs only the output gradient and its locally-stored activations to produce the input gradient and the parameter gradient.

## Worked example: one MLP layer

For a layer $\mathbf{h} = \phi(W \mathbf{x} + \mathbf{b})$, denote $\mathbf{z} = W\mathbf{x} + \mathbf{b}$ and let $\mathbf{g} = \partial \mathcal{L} / \partial \mathbf{h}$ flow in from above. Then

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{z}} = \mathbf{g} \odot \phi'(\mathbf{z}), \qquad
\frac{\partial \mathcal{L}}{\partial W} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}} \, \mathbf{x}^\top, \qquad
\frac{\partial \mathcal{L}}{\partial \mathbf{b}} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}}, \qquad
\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = W^\top \frac{\partial \mathcal{L}}{\partial \mathbf{z}}.
$$

The implementation reads off directly: storing $\mathbf{x}$ and $\mathbf{z}$ during the forward pass, the backward pass is one element-wise product and two matrix multiplications.

## Computational graphs and autodiff

Modern frameworks (PyTorch, JAX, TensorFlow) build a **computational graph** of forward operations and produce backward code automatically. The two paradigms:

- **Define-by-run** (PyTorch's autograd) — build the graph dynamically as the forward pass executes.
- **Define-then-run** / tracing (JAX `grad`, TF `tf.function`) — trace the function once, compile a static graph, run.

Both implement reverse-mode autodiff and reduce to backpropagation when the graph is a feed-forward chain. The autodiff abstraction generalises to RNN unrolls (truncated BPTT), recursive networks, and arbitrary control flow.

## Failure modes: vanishing and exploding gradients

For a deep stack, the chain rule multiplies many Jacobians:

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{h}_0} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_L} \prod_{\ell=1}^{L} \frac{\partial f_\ell}{\partial \mathbf{h}_{\ell - 1}}.
$$

If the operator norm of each Jacobian is consistently $> 1$, gradients **explode**; if consistently $< 1$, they **vanish**. The two structural fixes that made deep training possible — **ReLU activations** (whose Jacobian eigenvalues are 0 or 1, see [activations](./activations)) and **residual connections** (whose Jacobian is $I + \partial f / \partial \mathbf{h}$, naturally close to 1) — both target this term. **Gradient clipping** is the standard runtime patch for explosions, particularly in RNNs.

## What to read next

- [Activation Functions](./activations) — supplies $\phi'$ and shapes gradient flow.
- [Weight Initialization](./initialization) — keeps the per-layer Jacobian close to isometric at start.
- [SGD, Momentum, Nesterov](../optimization/sgd) — what consumes the gradients backprop produces.
