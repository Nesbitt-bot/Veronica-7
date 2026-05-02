---
title: From Perceptron to MLP
order: 1
---

# From Perceptron to MLP

The multi-layer perceptron (MLP) is the simplest deep neural network: a stack of linear layers separated by element-wise non-linearities. Every architecture in this track — CNNs, RNNs, Transformers — replaces only the *linear part* of an MLP with something structured (convolution, attention) while keeping the same overall recipe. Understanding why an MLP can express anything, and why a single-layer perceptron cannot, is the foundational lesson.

## The perceptron and what it can't compute

Rosenblatt's perceptron (1958) computes $\hat{y} = \mathrm{sign}(\mathbf{w}^\top \mathbf{x} + b)$, a single linear threshold. Minsky and Papert's *Perceptrons* (1969) showed that this class **cannot** represent functions that are not linearly separable — most famously XOR. The book stalled neural-net research for over a decade. The fix is structural: stack two perceptrons.

## The MLP: composition of affine + non-linearity

An $L$-layer MLP computes

$$
\mathbf{h}_0 = \mathbf{x}, \qquad \mathbf{h}_\ell = \phi(W_\ell \mathbf{h}_{\ell - 1} + \mathbf{b}_\ell), \qquad \hat{\mathbf{y}} = W_L \mathbf{h}_{L-1} + \mathbf{b}_L,
$$

with $\phi$ a non-linear [activation function](./activations) (ReLU, GELU, tanh). Without $\phi$, composing $L$ affine maps collapses to a single affine map — the depth would be useless. The non-linearity is what unlocks expressivity.

## Universal approximation

*Cybenko's Theorem* (1989) and the closely related *Hornik–Stinchcombe–White* (1989) result state that a **single hidden layer** MLP with a non-polynomial activation can approximate any continuous function on a compact set to arbitrary accuracy, given enough hidden units. So the MLP family is not the bottleneck — expressivity is. What universal approximation does *not* tell you is **how wide** the layer must be (often exponentially large) or **how easy** the function is to learn from data. Depth, in practice, gives exponentially more efficient representations than width — this is the empirical motivation for deep, not just wide, networks.

## Loss and the learning signal

Training an MLP is just minimising a [loss function](./losses) of $(\hat{\mathbf{y}}, \mathbf{y})$ over the parameters $\theta = \{W_\ell, \mathbf{b}_\ell\}$. The choice of loss reflects the task: cross-entropy for classification, MSE for regression. Gradient $\nabla_\theta \mathcal{L}$ is computed via [backpropagation](./backpropagation) and parameters are updated with [SGD](../optimization/sgd) or one of its descendants.

## What an MLP is and isn't

An MLP is **permutation-invariant** to its input dimensions only if you tie weights — by default $W_\ell \mathbf{x}$ depends on the order. It has **no inductive bias for spatial or sequential structure**, which is why convolution and attention exist. But the MLP-as-black-box is enough to learn anything in principle, and modern Transformers spend half their parameters in MLP "feed-forward" blocks. The lesson: structure (CNN, attention) for sample efficiency; MLPs for the rest.

## What to read next

- [Activation Functions](./activations) — the non-linearity choice and its consequences.
- [Backpropagation](./backpropagation) — the algorithm that makes MLP training possible.
- [Loss Functions](./losses) — the objective the gradient is taken of.
