---
title: Convolution & Pooling
order: 1
---

# Convolution & Pooling

The convolutional layer is the deep-learning answer to the question "how do we exploit the fact that visual signals have local, repeated structure?". The classical [linear-filter](../../cv/foundations/filters) operation becomes a *learnable* feature extractor, with weight sharing across spatial positions. This page covers the layer's mathematical form, its key hyperparameters (kernel size, stride, padding, dilation), and the pooling operation that classically pairs with it.

## The convolutional layer

A 2D convolutional layer maps an input $\mathbf{X} \in \mathbb{R}^{C_\text{in} \times H \times W}$ to an output $\mathbf{Y} \in \mathbb{R}^{C_\text{out} \times H' \times W'}$ via

$$
Y_{c', h, w} \;=\; \sum_{c=1}^{C_\text{in}} \sum_{u, v} K_{c', c, u, v} \cdot X_{c, h + u, w + v} \;+\; b_{c'},
$$

where $K \in \mathbb{R}^{C_\text{out} \times C_\text{in} \times k \times k}$ is the kernel tensor. Two structural properties drive everything:

- **Weight sharing** — the same kernel is applied at every spatial position.
- **Local receptive field** — each output depends on only a $k \times k$ window of inputs.

Compared to a fully-connected layer with the same input/output shape, a conv layer has $\sim k^2 / (HW)$ as many parameters — orders of magnitude fewer. This is the parameter-efficiency argument for convolution on images.

## Padding, stride, dilation

Three knobs control output resolution and receptive field:

- **Padding** $p$ — pixels added around the input. "Same" padding ($p = (k-1)/2$) preserves spatial size.
- **Stride** $s$ — step between applied kernel positions. Stride 2 halves resolution; canonical for downsampling.
- **Dilation** $d$ — gaps between kernel taps, equivalent to atrous convolution. Increases receptive field without adding parameters; central to [DeepLab](../../cv/deep/semantic-segmentation).

Output spatial size: $H' = \lfloor (H + 2p - d(k-1) - 1)/s \rfloor + 1$. This formula is worth memorising — it is the source of countless off-by-one errors when stacking layers.

## Pooling

Pooling reduces spatial resolution and adds a small amount of translation invariance. **Max pooling** takes the maximum within a $k \times k$ window with stride $s$:

$$
Y_{c, h, w} \;=\; \max_{u, v \in [0, k)} X_{c, h \cdot s + u, w \cdot s + v}.
$$

**Average pooling** averages instead. Pooling is parameter-free but reduces information per output spatial position. **Strided convolution** is the modern alternative — a learnable downsampler — and most post-2017 architectures (ResNet's `conv5_x`, ViT's patch embedding) use it instead of pooling.

**Global average pooling (GAP)** averages each feature map to a single number, replacing the flatten-then-FC head of older designs. It cuts parameters dramatically and is the standard classifier head for ResNet and almost every successor.

## Variants worth knowing

- **1×1 convolution** — pointwise mixing across channels with no spatial extent. Used as a cheap channel projector inside Inception, ResNet bottlenecks, and MobileNet.
- **Depthwise convolution** — apply one kernel per input channel independently. **Depthwise-separable convolution** = depthwise + 1×1 pointwise; the building block of MobileNet, EfficientNet, and Xception.
- **Transposed convolution** ("deconvolution") — the upsampling counterpart, used in [FCN/U-Net](../../cv/deep/semantic-segmentation) decoders.
- **Atrous (dilated) convolution** — see Dilation above.

## What learned filters look like

Visualising trained CNN kernels (Zeiler, Fergus, ECCV 2014) shows a hierarchy: early layers learn Gabor-like edge detectors and colour blobs; mid-layers learn texture and motif detectors; deep layers learn object parts. This visual hierarchy is the empirical justification for the convolutional inductive bias and the link back to the [classical features](../../cv/foundations/features) story.

## What to read next

- [LeNet & AlexNet](./lenet-alexnet) — the foundational architectures.
- [VGG, Inception, ResNet](./resnet-family) — the next generation.
- [Linear Filters & Convolution](../../cv/foundations/filters) — classical convolution that this layer generalises.
