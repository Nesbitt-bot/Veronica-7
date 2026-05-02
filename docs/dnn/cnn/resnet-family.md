---
title: VGG, Inception, ResNet
order: 3
---

# VGG, Inception, ResNet

The three years 2014–2015 produced the architectures that defined CNN best practice for the rest of the decade: **VGG** (uniform 3×3 stacks), **GoogLeNet/Inception** (multi-branch blocks), and **ResNet** (residual connections). Each addressed a specific failure mode of AlexNet's design and set a template that survives in modern Transformers. The companion [CV Backbones](../../cv/deep/cnn-backbones) page covers the same lineage from the vision-track perspective; this page emphasises the architectural innovations.

## VGG — go deep with small kernels

*Very Deep Convolutional Networks for Large-Scale Image Recognition* (Simonyan, Zisserman, ICLR 2015) made one observation: stacking many small (3×3) convolutions is **strictly better** than fewer large ones. Three 3×3 layers have the same receptive field as one 7×7 but with 3 ReLUs and ~55% the parameters. VGG-16 has 16 weight layers, all conv 3×3 + max-pool, ending in three FC layers and softmax.

The idea was so clean it became the template for downstream tasks: VGG-16 with the FC layers replaced by task-specific heads served as the de-facto backbone for object detection (Faster R-CNN), segmentation (FCN), and style transfer. VGG features are still the basis of perceptual losses today.

The cost: 138M parameters and ~15 GFLOPs per image — slow and memory-hungry, which is why the next generation moved on.

## Inception / GoogLeNet — multi-branch blocks

*Going Deeper with Convolutions* (Szegedy et al., CVPR 2015) replaced VGG's uniform stack with **Inception modules** — multi-branch blocks where parallel 1×1, 3×3, and 5×5 convolutions plus 3×3 max-pool all process the same input and concatenate the outputs:

$$
\text{Inception}(\mathbf{x}) \;=\; \mathrm{concat}\bigl(\, \mathrm{conv}_{1\times 1}(\mathbf{x}),\ \mathrm{conv}_{3\times 3}(\mathrm{conv}_{1\times 1}(\mathbf{x})),\ \mathrm{conv}_{5\times 5}(\mathrm{conv}_{1\times 1}(\mathbf{x})),\ \mathrm{maxpool}(\mathbf{x}) \bigr).
$$

The 1×1 convs before the 3×3 and 5×5 branches are the trick: they reduce channel count cheaply, making the multi-branch block computationally tractable. GoogLeNet (Inception-v1) won ILSVRC 2014 with 22 layers but only ~7M parameters — far smaller than VGG. Inception-v2/v3/v4 refined the blocks (factorising 7×7 as 1×7 + 7×1) and added batch norm.

## ResNet — residual learning

*Deep Residual Learning for Image Recognition* (He, Zhang, Ren, Sun, CVPR 2016) — the most consequential architecture paper after AlexNet. The empirical puzzle: stacks beyond ~20 layers had **higher** training error than shallower stacks, even though they could in principle represent the shallower function as a special case. The fix: each block predicts a **residual** $\mathcal{F}(\mathbf{x})$ over the identity:

$$
\mathbf{y} \;=\; \mathcal{F}(\mathbf{x};\, W) + \mathbf{x}.
$$

If the optimal block is the identity, $\mathcal{F}$ just needs to learn zero — trivial. This single change made depths of 152, 1001, and beyond trainable. ResNet-50 became the universal backbone — the workhorse for object detection, segmentation, and any task that needed a strong feature extractor.

Bottleneck blocks (1×1 → 3×3 → 1×1) further reduced compute. ResNet-50 has ~25M parameters and trains in a fraction of VGG-16's compute at higher accuracy.

## Why residuals matter beyond CNNs

The skip connection's importance extends far past CNNs. Every Transformer block is structurally a residual block — $\mathbf{x} + \mathrm{Attn}(\mathrm{Norm}(\mathbf{x}))$ — and the same identity-init argument keeps deep Transformer training stable (see [normalization](../regularization/normalization)). The ResNet paper's lasting contribution is not the convolutional backbone itself but the **architectural primitive** that has appeared in every successful deep model since.

## Squeeze-and-Excitation, ResNeXt, DenseNet

The end of the ResNet era added refinements rather than replacements:

- **ResNeXt** (Xie et al., CVPR 2017) — group the 3×3 convolution in a bottleneck into 32 cardinality groups. Roughly Inception-style multi-branch structure with weight-sharing.
- **DenseNet** (Huang et al., CVPR 2017) — every layer takes all preceding layers' outputs as input. Maximises feature reuse, smaller parameter counts at the cost of higher memory traffic.
- **SE-ResNet** (Hu, Shen, Sun, CVPR 2018) — Squeeze-and-Excitation block: a channel-attention module that re-weights feature maps based on global statistics. Won ILSVRC 2017 and is a precursor of attention as we now use it.

By 2019 EfficientNet (covered in [CV Backbones](../../cv/deep/cnn-backbones)) had crystallised the optimal width × depth × resolution scaling, ending the human-in-the-loop CNN-architecture-design era.

## What to read next

- [LeNet & AlexNet](./lenet-alexnet) — the predecessors.
- [CNN Backbones (CV)](../../cv/deep/cnn-backbones) — the same story from the vision track.
- [Vision Transformers](../../cv/deep/vit) — the architecture that succeeded ResNet.
