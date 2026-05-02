---
title: Semantic Segmentation (Deep Foundations)
order: 3
---

# Semantic Segmentation (Deep Foundations)

Semantic segmentation predicts a class label for every pixel. The deep era began with the realisation that classification networks could be **converted into pixel-prediction networks** by replacing fully-connected layers with convolutions. That move opened up the encoder–decoder family this page covers; the modern Transformer-era continuation is in [advances/semantic-segmentation](../advances/semantic-segmentation).

## Fully Convolutional Networks (FCN)

*Fully Convolutional Networks for Semantic Segmentation* (Long, Shelhamer, Darrell, CVPR 2015) is the founding paper. Take a classification CNN (VGG, AlexNet), replace its FC layers with $1\times1$ convolutions, and upsample the resulting low-resolution score map to the input resolution with **transposed convolutions** (also called deconvolutions). Train end-to-end with per-pixel cross-entropy.

FCN also introduced **skip connections** between encoder and decoder: combine the coarse high-level prediction with finer-resolution features from earlier layers to recover spatial detail. This idea generalises to U-Net, FPN, and every modern segmenter.

## U-Net

*U-Net: Convolutional Networks for Biomedical Image Segmentation* (Ronneberger, Fischer, Brox, MICCAI 2015) is the symmetric encoder-decoder that became ubiquitous far beyond its medical-imaging origins. The architecture mirrors the contracting path with an expanding path of the same depth, joining **every** corresponding scale via concatenation skip connections. Trained with heavy data augmentation (elastic deformations) on small datasets, U-Net set the small-data segmentation baseline that survives today. The U-Net topology also became the dominant **diffusion-model backbone** — almost every text-to-image model derives its denoiser from a U-Net.

## DeepLab v1–v3

The DeepLab family addressed two FCN limitations: receptive field too small for global context, and excessive downsampling losing detail.

- **DeepLabv1** (Chen et al., ICLR 2015) replaced standard convolutions with **atrous (dilated) convolutions**, which expand the receptive field without subsampling: a $3\times3$ kernel with dilation $r$ has the receptive field of a $(2r+1)\times(2r+1)$ standard kernel.
- **DeepLabv2** added the **Atrous Spatial Pyramid Pooling (ASPP)** module — parallel atrous convolutions at different rates to gather multi-scale context.
- **DeepLabv3** (Chen et al., 2017) refined ASPP, dropped the CRF post-processing, and matched DeepLabv2 with a much simpler pipeline.

DeepLabv3+, the encoder-decoder version, sits at the boundary with the [modern](../advances/semantic-segmentation) era.

## Loss functions: cross-entropy, Dice, focal

Per-pixel cross-entropy is the default but suffers under class imbalance — especially in medical imaging where the foreground class may be 1% of pixels. Two common alternatives:

- **Dice loss** — based on the Dice coefficient $2|P \cap G| / (|P| + |G|)$. Differentiable, scale-invariant to foreground area.
- **Focal loss** — same form as the [object-detection](./object-detection) version, applied per pixel.

Most modern systems combine cross-entropy with one of these to balance gradient magnitudes between common and rare classes.

## Evaluation: mIoU and PQ

The standard metric is **mean Intersection-over-Union** (mIoU): for each class $c$, IoU $= |P_c \cap G_c| / |P_c \cup G_c|$, averaged across classes. Class-balanced (each class counts equally) — important because foreground classes are typically much smaller than the background "stuff" class.

For panoptic segmentation, **Panoptic Quality** $\mathrm{PQ} = \mathrm{SQ} \cdot \mathrm{RQ}$ combines segmentation quality (mean IoU of true positives) with recognition quality (F1 of matched instances). See [instance-segmentation](./instance-segmentation).

## What to read next

- [Instance & Panoptic Segmentation](./instance-segmentation) — adding object identity on top of pixel labels.
- [Modern Semantic Segmentation](../advances/semantic-segmentation) — Mask2Former, SAM, Grounded SAM.
- [CNN Backbones](./cnn-backbones) — the encoder these decoders attach to.
