---
title: Dropout
order: 1
---

# Dropout

Dropout is a regularisation technique that randomly zeros out activations during training. It was the dominant form of neural-network regularisation from 2012 to ~2018 and remains the default in many architectures (Transformers, RNNs). The idea is simple, the empirical effect is large, and the precise theoretical justification is still debated.

## The procedure

*Dropout: A Simple Way to Prevent Neural Networks from Overfitting* (Srivastava, Hinton, Krizhevsky, Sutskever, Salakhutdinov, JMLR 2014) defines the operation. During training, for each forward pass and each unit $h_i$, draw an independent Bernoulli mask $m_i \sim \text{Bernoulli}(1 - p)$:

$$
\tilde{h}_i \;=\; \frac{m_i}{1 - p} \cdot h_i.
$$

The factor $1/(1-p)$ — **inverted dropout** — keeps the expected activation unchanged, so no rescaling is needed at inference time. At test time, dropout is turned off entirely.

Standard $p$ values: 0.5 for fully connected layers in the original work; 0.1–0.3 for hidden layers in Transformers; usually 0 for embeddings and the final classifier.

## Why it works: ensemble interpretation

A network with dropout trained for $T$ steps is, in expectation, training a different sub-network at each step — a sub-network where ~$(1-p)^L$ of the units in any specific configuration are present. Inference with dropout off is approximately averaging over all $2^N$ such sub-networks:

$$
\mathbb{E}_m[f_m(\mathbf{x})] \;\approx\; f(\mathbf{x}; \theta_\text{full}).
$$

Dropout is, in this view, a cheap **model ensemble** — exponentially many sub-models trained jointly with shared weights, with inference-time averaging built in. This is the heuristic that motivated dropout's invention and explains why it tends to **flatten** loss landscapes in ways that improve generalisation.

## Variants worth knowing

- **DropConnect** (Wan et al., 2013) — drop individual *weights* rather than activations. Rarely used in practice; activations are easier to mask in the standard mat-mul kernel.
- **Spatial Dropout** (Tompson et al., 2015) — drop entire feature maps in a CNN, not individual pixels. Rationale: adjacent pixels in a feature map are highly correlated, so per-pixel dropout under-regularises convolutional layers.
- **Variational Dropout** (Gal, Ghahramani, NeurIPS 2016) — same dropout mask across all timesteps in an RNN. Gives a Bayesian interpretation: the model's predictive distribution under MC sampling is an approximation to a Gaussian-process posterior.
- **DropPath / Stochastic Depth** (Huang et al., ECCV 2016) — drop entire residual branches in a ResNet/ViT. The default form of dropout in modern Transformers and ViT-large.

## Dropout in modern architectures

For very large Transformers, **dropout is often turned off** during pretraining — the dataset is large enough that overfitting is not the limiting concern, and dropout adds gradient noise that competes with the learning signal. **Fine-tuning** typically reintroduces dropout (low rate, ~0.1) because the fine-tuning data is small enough to overfit. The empirical pattern across LLaMA/Mistral/Qwen pretraining is dropout = 0; for downstream supervised fine-tuning, dropout = 0.05–0.1.

## Dropout vs other regularisers

How does dropout interact with other techniques?

- **Weight decay** — orthogonal; both are used together. Dropout adds noise to activations, weight decay shrinks parameters.
- **Batch norm** — partially redundant. Batch norm injects its own training-time noise (different mean/var per batch); stacking heavy dropout on top often hurts. Many recipes use one or the other for hidden activations.
- **Data augmentation** — orthogonal at the input layer; complementary throughout the network.

## What to read next

- [Normalization](./normalization) — the regulariser that partially displaced dropout in CNN-era recipes.
- [Data Augmentation](./augmentation) — input-space regularisation.
- [Double Descent & Implicit Bias](./double-descent) — the broader theory of generalisation in over-parameterised networks.
