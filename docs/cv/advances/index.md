---
title: Modern CV — Overview
order: 0
---

# Modern CV — Overview

The CV Advances section surveys ten research areas that defined modern computer vision in the 2020s. Each page is structured as a paper list — the canonical references, in roughly the order a reader new to the area would benefit from. Together they trace the path from CNN-based vision through transformer backbones into the foundation-model era.

## The ten topics

- **[Semantic Segmentation](./semantic-segmentation)** — DeepLabv3+, Swin, SegFormer, Mask2Former, SAM, Grounded SAM.
- **[Vision-Language Models](./vision-language)** — CLIP, Flamingo, BLIP-2, LLaVA, Gemini, Molmo.
- **[Neural Rendering](./neural-rendering)** — NeRF, Plenoxels, Mip-NeRF 360, 3D Gaussian Splatting.
- **[Image and Video Generation](./generation)** — AttnGAN, DALL·E, Latent Diffusion, DreamBooth, Sora, Wan.
- **[Geometric Computer Vision](./geometric)** — PoseNet, MeshLoc, DUSt3R, Depth Anything, VGGT.
- **[Representation Learning](./representation)** — SimCLR, MoCo, MAE, JEPA, DINOv2.
- **[Correspondence & SfM](./sfm)** — COLMAP, SuperGlue, RAFT, LoFTR, LightGlue, MegaSaM.
- **[Safety, Robustness, Evaluation](./safety)** — Object Recognition for Everyone, OccamNets, GeoNet, T2I bias.
- **[Embodied CV & Robotics](./embodied)** — ViNG, ViKiNG, GNM, NoMaD, Navigation World Models.
- **[Open-Vocabulary Detection](./open-vocab)** — OVR-CNN, MDETR, ViLD, CORA, Grounding DINO.

## Reading paths

Three suggested paths through the section, depending on background:

- **Generative AI focus** — start with [Representation Learning](./representation), [Vision-Language Models](./vision-language), [Image and Video Generation](./generation), [Neural Rendering](./neural-rendering).
- **3D / robotics focus** — start with [Geometric Computer Vision](./geometric), [Correspondence & SfM](./sfm), [Neural Rendering](./neural-rendering), [Embodied CV](./embodied).
- **Detection / segmentation focus** — start with [Semantic Segmentation](./semantic-segmentation), [Open-Vocabulary Detection](./open-vocab), [Vision-Language Models](./vision-language).

## What unifies these areas

Three common threads across all ten:

- **Transformer architectures** are now standard. Each area's modern frontier (SAM 2, BLIP-2, Sora, DUSt3R, Mask2Former, Grounding DINO) uses Transformer backbones.
- **Foundation-model framing** — pretrain a generic vision/multimodal backbone once, adapt to many downstream tasks. CLIP, DINOv2, MAE, SAM are all foundation models in this sense.
- **Language as the universal interface** — text is the most common bridge across modalities, control mechanisms, and evaluation protocols. Even pure-vision tasks now route through language for prompting, evaluation, and zero-shot use.

## What to read next

- [CV Foundations](../foundations/image-formation) — for the classical material these methods build on.
- [Deep Vision Architectures](../deep/cnn-backbones) — the CNN/ViT backbone era.
- [LLM track](../../llm/index) — the language-side of the modern multimodal frontier.
