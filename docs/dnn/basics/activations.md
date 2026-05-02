---
title: Activation Functions
order: 2
---

# Activation Functions

The activation function $\phi$ is the element-wise non-linearity applied between linear layers in an [MLP](./mlp). Without it, the whole network collapses to a single affine map. Different choices change gradient flow, training stability, and the mathematical class of functions the network represents.

## Sigmoid and tanh — the saturating era

The classical activations are smooth and bounded:

$$
\sigma(x) = \frac{1}{1 + e^{-x}}, \qquad \tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}.
$$

Both saturate at the extremes, which makes them differentiable everywhere and gives a nice probabilistic interpretation for $\sigma$ as a Bernoulli mean. The fatal flaw: their derivatives vanish at saturation ($\sigma'(x) \to 0$ as $|x| \to \infty$), causing the **vanishing gradient problem** in deep stacks. By the mid-2010s sigmoid had been almost entirely replaced in hidden layers.

## ReLU — the workhorse

*Rectified Linear Units Improve Restricted Boltzmann Machines* (Nair, Hinton, ICML 2010) and *Deep Sparse Rectifier Neural Networks* (Glorot, Bordes, Bengio, AISTATS 2011) made the ReLU the default:

$$
\mathrm{ReLU}(x) = \max(0, x), \qquad \mathrm{ReLU}'(x) = \mathbb{1}[x > 0].
$$

Its derivative is exactly 0 or 1, propagating gradients cleanly to depth and computing in one comparison + one masked write. The trade-off is **dying ReLUs** — units that get a large negative bias and never fire again, contributing zero gradient forever.

Variants address the dying-unit failure:

- **Leaky ReLU** — $\max(\alpha x, x)$ with small $\alpha$ (~0.01).
- **PReLU** — same form with $\alpha$ learnable per channel.
- **ELU** — smooth negative tail, $e^x - 1$ for $x < 0$.

## Smooth modern activations: GELU, SiLU/Swish

*Gaussian Error Linear Units* (Hendrycks, Gimpel, 2016) defines GELU as $x \cdot \Phi(x)$ where $\Phi$ is the standard normal CDF — a smooth approximation to "ReLU with stochastic gating." It is the default activation in BERT, GPT, ViT, and nearly every modern Transformer.

*SiLU* / **Swish** (Ramachandran, Zoph, Le, 2017), $x \cdot \sigma(x)$, was found by neural-architecture search and matches GELU closely. Both have smooth derivatives, no exact dead zone, and modest empirical gains over ReLU at large scale.

## Softmax for classification

The output activation for multi-class classification is **softmax**:

$$
\mathrm{softmax}(\mathbf{z})_i \;=\; \frac{e^{z_i}}{\sum_j e^{z_j}}.
$$

Softmax converts logits to a categorical distribution and pairs naturally with cross-entropy loss — the gradients of cross-entropy + softmax simplify to $(p - y)$, the prediction error. Numerical implementation must subtract $\max_j z_j$ before exponentiating to avoid overflow.

## Choosing an activation

Practical defaults:

- **Hidden layers** of CNN/MLP — ReLU; for residual blocks consider GELU at large scale.
- **Hidden layers of Transformers** — GELU (BERT, GPT) or SiLU (LLaMA).
- **Output for classification** — softmax for multi-class, sigmoid for multi-label.
- **Output for regression** — linear (no activation), unless you need a bounded range.

## What to read next

- [Backpropagation](./backpropagation) — what activation derivatives feed into.
- [Weight Initialization](./initialization) — initialisation depends on activation choice (He init for ReLU, Xavier for tanh).
- [Loss Functions](./losses) — softmax + cross-entropy is one closely-coupled pair.
