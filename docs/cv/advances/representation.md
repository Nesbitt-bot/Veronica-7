---
title: Representation Learning (Vision)
order: 6
---

# Representation Learning (Vision)

A self-supervised vision representation is a feature space learned from images alone, without semantic labels. The 2020–2024 arc has three families: **contrastive** (SimCLR, MoCo) — pull views of the same image together, push views of different images apart; **masked** (MAE) — predict missing patches; and **joint-embedding predictive** (JEPA, DINOv2, FLAIR) — predict embeddings of one view from another. Each delivers strong transfer; the open question is which inductive bias scales best.

## SimCLR — contrastive baseline

*A Simple Framework for Contrastive Learning of Visual Representations* (Chen, Kornblith, Norouzi, Hinton, ICML 2020) showed that strong augmentations + a projection head + a large batch are all you need. The InfoNCE loss is

$$
\ell_{i,j} \;=\; -\log \frac{\exp(\langle z_i, z_j \rangle / \tau)}{\sum_{k \neq i} \exp(\langle z_i, z_k \rangle / \tau)},
$$

with positives $(i,j)$ from two augmentations of the same image. SimCLR matched supervised ImageNet pretraining on linear probes — the first time a self-supervised method had done so cleanly.

## MoCo — momentum encoder and queue

*Momentum Contrast for Unsupervised Visual Representation Learning* (He, Fan, Wu, Xie, Girshick, CVPR 2020) addressed SimCLR's batch-size dependency. A **momentum-updated** key encoder produces consistent negatives across iterations; a queue of past keys provides a large effective negative set without needing a huge batch. MoCo-v2 and v3 carried this design into the ViT era and remained competitive on transfer well past SimCLR.

## MAE — masked autoencoding

*Masked Autoencoders Are Scalable Vision Learners* (He, Chen, Xie, Li, Dollár, Girshick, CVPR 2022) ports BERT to vision. Mask 75% of image patches; train an asymmetric encoder–decoder to reconstruct pixels of the masked patches. Reconstruction is an auxiliary task — the encoder representation is what transfers. MAE scales cleanly with model size where contrastive methods plateau, and is the dominant pretraining recipe for ViT backbones.

## JEPA — joint-embedding prediction

*I-JEPA / V-JEPA* (Assran et al., CVPR 2023 / Bardes et al., 2024) drop pixel reconstruction in favour of **predicting embeddings of masked regions in the latent space**. The argument: pixels contain too much irrelevant detail, so predicting them wastes capacity; predicting embeddings forces the model to learn higher-level structure. JEPA matches MAE on dense-prediction tasks while training faster and producing more semantic features. LeCun has framed JEPA as the architectural step toward "world models" for vision.

## DINOv2

*DINOv2: Learning Robust Visual Features without Supervision* (Oquab et al., 2023) combined the iBOT (DINO + masked image modelling) recipe with a curated 142M-image dataset and ViT-g scale to produce **the strongest open vision encoder** at its release. DINOv2 features are the default backbone in many downstream pipelines (Depth Anything, classification probes, retrieval) — a "CLIP without text", with stronger spatial features.

## FLAIR — foundation model with language alignment

*FLAIR* (2024–2025 frontier work) extends the DINOv2-style self-supervised tower with **language alignment as a fine-tuning step**, recovering CLIP-style zero-shot text grounding without compromising the dense feature quality. The trajectory is the merger of self-supervised and language-supervised tracks: keep DINOv2's dense features, add CLIP's text head.

## Reading list

- *A Simple Framework for Contrastive Learning of Visual Representations* — Chen, Kornblith, Norouzi, Hinton, ICML 2020 (SimCLR).
- *Momentum Contrast for Unsupervised Visual Representation Learning* — He, Fan, Wu, Xie, Girshick, CVPR 2020 (MoCo).
- *Masked Autoencoders Are Scalable Vision Learners* — He, Chen, Xie, Li, Dollár, Girshick, CVPR 2022 (MAE).
- *Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture* — Assran et al., CVPR 2023 (I-JEPA).
- *DINOv2: Learning Robust Visual Features without Supervision* — Oquab et al., 2023.
- *FLAIR* — recent foundation-model release combining dense self-supervision with language alignment.

## What to read next

- [Vision-Language Models](./vision-language) — the language-supervised counterpart.
- [Geometric Computer Vision](./geometric) — DUSt3R, VGGT, Depth Anything build on these encoders.
- [Open-Vocabulary Detection](./open-vocab) — text grounding on top of strong vision features.
