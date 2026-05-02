---
title: Vision Transformer (ViT)
order: 1
---

# Vision Transformer (ViT)

*An Image is Worth 16×16 Words: Transformers for Image Recognition at Scale* (Dosovitskiy, Beyer, Kolesnikov, Weissenborn, Zhai et al., ICLR 2021) showed that **the Transformer architecture, untouched, beats CNNs on image classification** — provided enough data. ViT was the model that broke the convolutional monopoly and started the slow takeover of computer vision by Transformers. The same architecture is now the default backbone for most modern vision systems.

## The setup

Treat an image as a sequence of patches:

1. Split the image into non-overlapping $16 \times 16$ pixel patches. A 224×224 image gives $14 \times 14 = 196$ patches.
2. Flatten each patch and project linearly to dimension $D$.
3. Prepend a learned `[CLS]` token. Add learned 1D positional embeddings.
4. Run a standard Transformer encoder.
5. Read the classifier off the final `[CLS]` representation.

Architecturally, this is a [Transformer encoder](../2017/attention-is-all-you-need) operating on patch embeddings. No convolutions, no pooling, no architectural priors specific to images.

## The headline result: data-efficiency / data-greediness trade-off

ViT's key empirical finding: with **ImageNet-only pretraining**, ViT *underperforms* CNNs at matched compute. With **JFT-300M pretraining** (Google's internal 300M-image dataset), ViT-Large beats ResNet-152, and ViT-Huge sets new SOTA on ImageNet, CIFAR-100, and VTAB.

The interpretation: CNNs have built-in inductive biases (locality, translation equivariance, hierarchical features) that help when data is limited. Transformers have **fewer priors**; they need more data to learn equivalent invariances from scratch. Past a certain data threshold, Transformers' lack of priors becomes an advantage — they can fit patterns CNNs' priors prevent.

This data-efficiency / data-greediness trade-off framed all of vision research for years. DeiT (Touvron et al., 2021) showed strong augmentation + distillation could close the gap on ImageNet alone; modern ViTs use both.

## Architecture sizes

The paper introduced three reference sizes that became canonical:

- **ViT-Base** — 12 layers, 768 hidden dim, 12 heads, 86M params.
- **ViT-Large** — 24 layers, 1024 hidden, 16 heads, 307M params.
- **ViT-Huge** — 32 layers, 1280 hidden, 16 heads, 632M params.

Patch size 16 is standard; ViT-Base/16, ViT-Large/14, ViT-Large/16 are common variants. Smaller patch sizes give longer sequences (more compute, finer detail).

## Why patches as tokens?

Pixels-as-tokens would give 50K-token sequences — quadratic attention is hopeless. Patches at 16×16 give a manageable 196 tokens at standard resolution, comparable to an NLP sentence. The patch embedding is a single linear layer per channel — essentially a small CNN with stride 16.

Modern variants use overlapping patches, hierarchical patch merging (Swin), or convolutional stem layers (CoAtNet) to recover some of CNN's locality advantages.

## What ViT enabled

Three downstream effects:

- **Unified vision-language architectures.** Image patches and text tokens become interchangeable inputs to a single Transformer, the foundation of [CLIP](./clip), [LLaVA](../../cv/advances/vision-language), and the multimodal frontier.
- **MAE pretraining.** [Masked Autoencoders](../../cv/advances/representation) (He et al., CVPR 2022) showed ViTs can be pretrained by reconstructing 75% of masked patches — a much stronger pretraining signal than ImageNet supervision.
- **Hierarchical variants.** [Swin](../../cv/deep/vit), MViT, and modern CV backbones use ViT's patch-token insight with multi-scale features for dense-prediction tasks (detection, segmentation).

By 2024, all the strongest vision foundation models (DINOv2, SAM, CLIP, MAE, EVA) are ViT-based. CNNs persist in resource-constrained edge inference (MobileNet) and as sub-components of hybrid systems.

## What ViT got wrong (initially)

- **Compute inefficiency.** Fixed-resolution global attention is wasteful; later work added hierarchical structure.
- **Position embedding extrapolation.** Learned 1D positional embeddings don't generalise to higher resolutions; later work uses interpolation, 2D embeddings, or RoPE-style relative positions.
- **Patch tokenisation is lossy.** Sub-pixel detail and small objects suffer; convolutional stems and overlapping patches help.

Each was incrementally fixed. The **patches-as-tokens** core idea survived intact.

## What to read next

- [CLIP](./clip) — pairs a ViT image encoder with a text encoder for contrastive learning.
- [DALL·E](./dall-e) — image generation as autoregressive sequence modelling on patches.
- [Vision Transformers (CV)](../../cv/deep/vit) — the modern backbone variants.
