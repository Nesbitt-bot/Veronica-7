---
title: Weight Initialization
order: 5
---

# Weight Initialization

How you initialise a network's weights determines whether [backpropagation](./backpropagation) sees usable gradients at the first step. The two failure modes are dual: weights too small produce vanishing forward activations and gradients; weights too large produce exploding activations. Modern initialisations target a specific invariant — keep the variance of activations and gradients constant across layers — and derive the right scale from the activation function.

## What we want: signal preservation

For a linear layer $\mathbf{z} = W \mathbf{x}$ with $W \in \mathbb{R}^{n_\text{out} \times n_\text{in}}$, treating $W_{ij}$ and $x_j$ as independent zero-mean random variables,

$$
\mathrm{Var}(z_i) \;=\; n_\text{in} \cdot \mathrm{Var}(W_{ij}) \cdot \mathrm{Var}(x_j).
$$

For $\mathrm{Var}(z_i) = \mathrm{Var}(x_j)$ across layers, we need $\mathrm{Var}(W_{ij}) = 1 / n_\text{in}$. The same calculation in the backward direction asks for $\mathrm{Var}(W_{ij}) = 1 / n_\text{out}$.

## Xavier (Glorot) initialisation

*Understanding the difficulty of training deep feedforward neural networks* (Glorot, Bengio, AISTATS 2010) compromised between the forward and backward conditions:

$$
\mathrm{Var}(W_{ij}) \;=\; \frac{2}{n_\text{in} + n_\text{out}}.
$$

Sampled from a uniform distribution this becomes $W_{ij} \sim \mathcal{U}\!\left[-\sqrt{6/(n_\text{in} + n_\text{out})},\;\sqrt{6/(n_\text{in} + n_\text{out})}\right]$. Xavier was the first principled init and made deep tanh/sigmoid networks trainable. It assumes a roughly linear regime — appropriate for tanh but conservative for ReLU.

## He (Kaiming) initialisation

*Delving Deep into Rectifiers* (He, Zhang, Ren, Sun, ICCV 2015) extended the analysis to ReLU. Because ReLU zeroes half its input, $\mathrm{Var}(\mathrm{ReLU}(z)) = \tfrac{1}{2}\mathrm{Var}(z)$, so to compensate, the variance of $W$ must be doubled:

$$
\mathrm{Var}(W_{ij}) \;=\; \frac{2}{n_\text{in}}.
$$

He init is the **default for ReLU networks** and is built into PyTorch's `kaiming_normal_` / `kaiming_uniform_`. The same formula extended to leaky ReLU multiplies by $1 / (1 + a^2)$ where $a$ is the negative slope.

## Orthogonal init for RNNs

Recurrent networks apply the same weight matrix $W$ many times. If $W$'s spectral radius differs from 1, repeated multiplication causes exploding or vanishing gradients along the time dimension. **Orthogonal initialisation** — sample a random orthogonal matrix via QR decomposition — gives all singular values exactly 1, suppressing both failures at $t=0$. This was the key trick that made deep [vanilla RNNs](../rnn/vanilla) trainable for hundreds of steps before LSTMs were even necessary.

## Residual / Transformer initialisation

For residual networks $\mathbf{x} \mapsto \mathbf{x} + f(\mathbf{x})$, naive init gives variance growth at every block. **Fixup** (Zhang et al., ICLR 2019) and **T-Fixup** (Huang et al., 2020) scale the residual branch by $1/\sqrt{L}$ where $L$ is the depth, giving stable training without normalisation layers. Modern Transformers use a mix of: small initial gain (e.g., $0.02$ standard deviation in BERT/GPT), zero-init for the final projection of each residual branch (so residuals start as identity), and learning-rate warmup to absorb early-step instability.

## Practical defaults

- **ReLU/LeakyReLU MLPs and CNNs** — He normal/uniform with the right fan mode (`fan_in` for typical training, `fan_out` for transposed conv).
- **Tanh/Sigmoid networks** — Xavier (Glorot).
- **Vanilla RNN recurrent matrix** — orthogonal.
- **Transformer / large LM** — small Gaussian (~0.02 std), residual-branch zero init, LR warmup.

The biases default to zero everywhere, except for the LSTM forget gate, which is initialised to 1 to encourage long-term memory at the start of training.

## What to read next

- [Activation Functions](./activations) — the choice of $\phi$ determines the right init.
- [Backpropagation](./backpropagation) — what initialisation feeds gradients into.
- [Normalization](../regularization/normalization) — batch/layer norm makes init less critical, but does not replace it.
