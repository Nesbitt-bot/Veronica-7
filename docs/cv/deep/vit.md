---
title: Vision Transformers
order: 5
---

# Vision Transformers

The Vision Transformer (ViT) showed that the [Transformer](../../llm/basics/transformer) architecture, which had taken over NLP, could match or beat CNNs on image classification — provided enough data. The years since have been about restoring CNN-style inductive biases (locality, multi-scale structure) inside Transformers, and about making them efficient enough for dense prediction.

## ViT — patches as tokens

*An Image is Worth 16×16 Words* (Dosovitskiy et al., ICLR 2021) treats an image as a sequence of **patch embeddings**. Split a $H \times W$ image into $N = HW/P^2$ non-overlapping patches of size $P \times P$ (typically $P = 16$), flatten each, project linearly to dimension $D$. Prepend a learned `[class]` token, add positional embeddings, run a standard Transformer encoder. The classifier head reads off the `[class]` token.

The headline result: with **JFT-300M pretraining**, ViT-Large beats ResNet-152 on ImageNet. With ImageNet-only pretraining, ViT *underperforms* CNNs because Transformers lack the convolution's translation-equivariance prior — so they need more data to learn it. This data-vs-prior trade-off framed the next four years of vision research.

## DeiT and training without huge data

*Training data-efficient image transformers* (Touvron et al., ICML 2021) showed that ViT can match CNN accuracy on **ImageNet alone** with the right recipe: aggressive augmentation (RandAugment, MixUp, CutMix), repeated augmentation, stochastic depth, and (the headline trick) a **distillation token** that learns from a CNN teacher's logits. DeiT made ViT trainable for normal lab budgets.

## Swin — hierarchical, shifted-window attention

*Swin Transformer* (Liu et al., ICCV 2021) re-introduces CNN-style **multi-scale features** and **local attention**. The image is processed at four stages of increasing patch size, like a CNN feature pyramid. Within each stage, attention is computed inside non-overlapping local windows; alternating layers **shift** the window partition by half a window so information flows across boundaries. Compute scales linearly with image size (vs ViT's quadratic scaling), and the multi-scale feature pyramid plugs directly into existing detection/segmentation heads.

Swin took the top of the COCO and ADE20K leaderboards almost immediately and is still the workhorse Transformer backbone for dense prediction.

## MAE — masked-image-modelling pretraining

*Masked Autoencoders Are Scalable Vision Learners* (He et al., CVPR 2022) — covered in [representation learning](../advances/representation) — showed that masking 75% of patches and reconstructing them is a stronger ViT pretraining signal than supervised classification. This decoupled "ViT architecture" from "we need huge labelled data" and made MAE-pretrained ViTs the default backbone for many downstream tasks.

## Hybrid / efficient ViTs

The post-Swin years iterated on both directions: hybrids like ConvNeXt (Liu et al., CVPR 2022) modernise CNNs with ViT design choices and match ViT quality with CNN inductive biases; **EfficientFormer**, **MobileViT**, and **EfficientViT** target on-device inference. SAM, DUSt3R, DINOv2, and most modern foundation models use a ViT backbone, often with hierarchical or local-attention modifications. The classification of an image as a sequence of tokens is now the default — CNNs survive primarily as the backbone of choice for tightly resource-constrained deployment.

## What to read next

- [Transformer (LLM basics)](../../llm/basics/transformer) — the architecture being adapted.
- [CNN Backbones](./cnn-backbones) — the predecessors ViT replaced.
- [Representation Learning](../advances/representation) — the self-supervised pretraining recipes that scale ViTs.
