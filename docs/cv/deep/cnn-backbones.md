---
title: CNN Backbones
order: 1
---

# CNN Backbones

A "backbone" is the body of a CNN that turns an image into a feature pyramid; downstream heads (classification, detection, segmentation) attach on top. The eight years from AlexNet to EfficientNet trace the engineering ideas that made deep CNNs trainable and efficient: deeper stacks, residual connections, principled width/depth/resolution scaling.

## VGG — uniform 3×3 stacks

*Very Deep Convolutional Networks for Large-Scale Image Recognition* (Simonyan, Zisserman, ICLR 2015) showed that **stacking small 3×3 convolutions** can replace larger filters with fewer parameters and more non-linearity. Three 3×3 layers have the same receptive field as one 7×7 but with 3 ReLUs and ~55% the parameters. VGG-16 and VGG-19 set the template — uniform conv block + max-pool downsampling, no exotic tricks — and remain the de-facto teacher network for perceptual losses and feature visualisation.

## ResNet — residual learning

*Deep Residual Learning for Image Recognition* (He, Zhang, Ren, Sun, CVPR 2016) is the most important architectural paper of the deep era. Adding more layers should not *hurt* training, but pre-2015 networks plateaued at ~20 layers because gradients struggled to flow back. ResNet's fix: each block predicts a **residual** over the identity,

$$
\mathbf{y} = \mathcal{F}(\mathbf{x};\, W) + \mathbf{x},
$$

so an unmodified identity is the trivial initialisation. With this skip connection (and batch norm), ResNet-152 trains stably and ResNet-1001 is achievable. Skip connections then propagated everywhere — DenseNet, U-Net, Transformers all rely on them.

## Inception and GoogLeNet — multi-scale blocks

*Going Deeper with Convolutions* (Szegedy et al., CVPR 2015) and the Inception-v2/v3/v4 family introduced **multi-branch blocks** that combine 1×1, 3×3, and 5×5 convolutions plus pooling within each layer, with 1×1 convolutions to control channel counts. The pattern lives on as the conceptual ancestor of MobileNet's depthwise-separable blocks and EfficientNet's MBConv blocks.

## DenseNet — feature reuse

*Densely Connected Convolutional Networks* (Huang, Liu, van der Maaten, Weinberger, CVPR 2017) takes the residual idea to its limit: **every layer receives all preceding feature maps as input** (concatenated, not summed). This drastically improves parameter efficiency at modest depth — DenseNet-121 matches ResNet-50 quality with fewer parameters — at the cost of higher memory traffic during training.

## MobileNet and EfficientNet — efficient backbones

*MobileNetV2* (Sandler et al., CVPR 2018) introduced **inverted residuals with linear bottlenecks** for mobile deployment, plus the depthwise-separable convolution that factors a 3×3×$C$ conv into a 3×3 spatial conv per channel followed by a 1×1 channel mixer.

*EfficientNet* (Tan, Le, ICML 2019) studied the **width × depth × resolution** trade-off and found that scaling all three by a constant compound coefficient $\phi$ (with empirically tuned ratios $\alpha, \beta, \gamma$) gives a Pareto-optimal family:

$$
\text{depth} = \alpha^\phi, \quad \text{width} = \beta^\phi, \quad \text{resolution} = \gamma^\phi, \qquad \alpha\beta^2\gamma^2 \approx 2.
$$

EfficientNet-B0 through B7 dominated the accuracy/FLOPs Pareto for years. The paper's lasting contribution is the **principle of compound scaling**, applied later to almost every architecture family including ViTs.

## What to read next

- [Object Detection](./object-detection) — the immediate downstream user of these backbones.
- [Vision Transformers](./vit) — the architectural successor.
- [Semantic Segmentation (Deep)](./semantic-segmentation) — the dense-prediction branch built on these backbones.
