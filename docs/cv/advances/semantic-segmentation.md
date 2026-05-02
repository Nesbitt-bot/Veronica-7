---
title: Semantic Segmentation (Modern)
order: 1
---

# Semantic Segmentation (Modern)

Semantic segmentation assigns a class label to every pixel. The modern story is the move from FCN-style encoder-decoders to Transformer architectures, and then to **prompt-driven, foundation-model** systems where the segmenter answers arbitrary spatial queries.

## Atrous convolutions: DeepLabv3+

*DeepLabv3+* (Chen, Zhu, Papandreou, Schroff, Adam, ECCV 2018) closed the FCN era. The contribution: **atrous (dilated) spatial pyramid pooling** with large rates, allowing a deep CNN backbone to maintain output stride 16 while still pooling global context, plus an encoder-decoder where the decoder restores spatial detail from low-level features. For years this was the strongest convolutional segmenter on Cityscapes / Pascal VOC.

## Transformers enter: SETR, Swin, SegFormer

*SETR* (Zheng et al., CVPR 2021) was the first proof-of-concept that a pure Transformer encoder beats CNNs on segmentation. *Swin Transformer* (Liu et al., ICCV 2021) brought the **hierarchical, shifted-window** design that combines CNN-like multi-scale features with Transformer self-attention, and immediately took the top of the leaderboards. *SegFormer* (Xie et al., NeurIPS 2021) simplified further: an MLP-only decoder over a hierarchical Transformer encoder gives a competitive, strikingly small model (B0 has 3.7M parameters and runs in real time).

## Mask classification: Mask2Former

*Mask2Former* (Cheng, Misra, Schwing, Kirillov, Girdhar, CVPR 2022) unifies semantic, instance, and panoptic segmentation under a single **mask classification** framework. Predict $N$ binary masks plus class probabilities and use Hungarian matching against ground-truth masks. The "masked attention" mechanism in the decoder restricts attention to the predicted mask regions, sharpening boundaries. Mask2Former held the SOTA across all three tasks simultaneously.

## Foundation models: SAM, SAM 2, Grounded SAM

*Segment Anything* (Kirillov et al., ICCV 2023) reframed segmentation as a **promptable foundation task**: an image encoder runs once; a lightweight decoder turns user prompts (point, box, text via a CLIP coupling) into masks in a few ms. Trained on the SA-1B dataset (1.1B masks) with a data engine that bootstraps from human and model-generated annotations. *SAM 2* (Ravi et al., 2024) extends the architecture to **video** with a streaming memory module so masks track across frames.

*Grounded SAM* (Ren et al., 2024) plugs Grounding DINO (open-vocabulary detector — see [open-vocab](./open-vocab)) into SAM: text prompt → bounding boxes → SAM masks. This composes a fully **open-vocabulary segmentation** pipeline from off-the-shelf components.

## Reading list

- *Encoder-Decoder with Atrous Separable Convolution for Semantic Image Segmentation* — Chen, Zhu, Papandreou, Schroff, Adam, ECCV 2018 (DeepLabv3+).
- *Rethinking Semantic Segmentation from a Sequence-to-Sequence Perspective with Transformers* — Zheng et al., CVPR 2021 (SETR).
- *Swin Transformer: Hierarchical Vision Transformer using Shifted Windows* — Liu et al., ICCV 2021.
- *SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers* — Xie et al., NeurIPS 2021.
- *Masked-attention Mask Transformer for Universal Image Segmentation* — Cheng, Misra, Schwing, Kirillov, Girdhar, CVPR 2022 (Mask2Former).
- *Segment Anything* — Kirillov et al., ICCV 2023 (SAM).
- *SAM 2: Segment Anything in Images and Videos* — Ravi et al., 2024.
- *Grounded SAM: Assembling Open-World Models for Diverse Visual Tasks* — Ren et al., 2024.

## What to read next

- [Open-Vocabulary Detection](./open-vocab) — the text-grounding side of Grounded SAM.
- [Vision-Language Models](./vision-language) — encoders that supply the language coupling.
- [Deep Semantic Segmentation](../deep/semantic-segmentation) — the FCN/U-Net foundations.
