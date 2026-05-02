---
title: Normalization Layers
order: 2
---

# Normalization Layers

A normalization layer rescales activations so that downstream layers see a stable distribution regardless of how the upstream weights drift during training. The four canonical variants — **Batch**, **Layer**, **Instance**, and **Group** Norm — differ only in *which axes they normalise over*. The right choice depends on architecture and batch regime.

## Batch Normalization

*Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift* (Ioffe, Szegedy, ICML 2015) was the first and most consequential normalisation technique. For a feature map $x \in \mathbb{R}^{N \times C \times H \times W}$, BN normalises along $(N, H, W)$ — across the batch and spatial dimensions — independently for each channel:

$$
\mu_c = \frac{1}{N H W} \sum_{n, h, w} x_{n, c, h, w}, \qquad \sigma^2_c = \frac{1}{N H W} \sum_{n, h, w} (x_{n, c, h, w} - \mu_c)^2,
$$

$$
\hat{x}_{n,c,h,w} = \frac{x_{n,c,h,w} - \mu_c}{\sqrt{\sigma^2_c + \epsilon}}, \qquad y_{n,c,h,w} = \gamma_c \hat{x}_{n,c,h,w} + \beta_c.
$$

Per-channel learned scale $\gamma_c$ and shift $\beta_c$ restore representational power.

Why it works: BN keeps the optimisation landscape locally smooth — *How Does Batch Normalization Help Optimization?* (Santurkar et al., NeurIPS 2018) showed the original "internal covariate shift" framing is misleading and that BN's actual effect is to bound the loss-landscape curvature.

**Limitations:** BN's per-batch statistics break under tiny batches (e.g., per-GPU batch of 2 in detection) and at inference, where the model uses moving-average statistics from training. Both motivate the alternatives below.

## Layer Normalization

*Layer Normalization* (Ba, Kiros, Hinton, 2016) normalises along $(C, H, W)$ instead — across all features within a *single example*:

$$
\mu_n = \frac{1}{CHW} \sum_{c,h,w} x_{n,c,h,w}, \qquad \sigma^2_n = \frac{1}{CHW} \sum_{c,h,w} (x_{n,c,h,w} - \mu_n)^2.
$$

LayerNorm has no batch dependence, so train and inference behave identically and small batches don't hurt. It is the **universal default in Transformers** — every major LLM and ViT uses LayerNorm (or a close variant) inside each block.

## Instance and Group Normalization

- **Instance Norm** (Ulyanov et al., 2016) normalises per-example *and* per-channel: along $(H, W)$ only. Used in style-transfer networks where per-image style statistics matter.
- **Group Norm** (Wu, He, ECCV 2018) groups channels and normalises within each group — along $(H, W, C/g)$. Recovers BN's per-channel structure without the batch dependency. The standard recommendation when batch size per device is $\leq 4$ (detection, segmentation, video).

## RMSNorm — modern Transformers

*Root Mean Square Layer Normalization* (Zhang, Sennrich, NeurIPS 2019) drops the mean-centring step from LayerNorm:

$$
y \;=\; \gamma \cdot \frac{x}{\sqrt{\tfrac{1}{d}\sum_i x_i^2 + \epsilon}}.
$$

Empirically matches LayerNorm at slightly lower compute. LLaMA, Qwen, and most modern open LLMs use RMSNorm.

## Pre-norm vs post-norm

In a Transformer block $\mathbf{y} = \mathbf{x} + f(\mathrm{Norm}(\mathbf{x}))$ (pre-norm) vs $\mathbf{y} = \mathrm{Norm}(\mathbf{x} + f(\mathbf{x}))$ (post-norm), the placement matters at scale. **Pre-norm** lets gradients flow through the residual unchanged and is what makes training stable for very deep Transformers. The original *Attention is All You Need* used post-norm; every modern LLM uses pre-norm.

## Practical defaults

- **CNN classification, batch size $\geq 16$** — BatchNorm.
- **CNN with small batches (detection, segmentation, video)** — GroupNorm.
- **Transformers / LLMs** — pre-norm RMSNorm or LayerNorm.
- **Style transfer / GANs** — InstanceNorm (or AdaIN, conditional variants).

## What to read next

- [Dropout](./dropout) — the older noise-based regulariser; partially redundant with BN.
- [Weight Initialization](../basics/initialization) — normalisation reduces but does not remove the need for good init.
- [Transformer (LLM)](../../llm/basics/transformer) — pre-norm RMSNorm is part of the modern architecture.
