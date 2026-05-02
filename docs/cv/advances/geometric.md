---
title: Geometric Computer Vision
order: 5
---

# Geometric Computer Vision

The "geometric" track learns to recover 3D structure — camera pose, depth, or full point clouds — directly from images. Classical pipelines factor this into hand-crafted stages (feature matching, RANSAC, bundle adjustment); the modern story is the steady **end-to-end replacement** of those stages with networks, culminating in feed-forward models that map raw images to dense 3D reconstructions.

## PoseNet — single-image camera pose regression

*PoseNet* (Kendall, Grimes, Cipolla, ICCV 2015) replaces SfM-based localisation with a CNN that directly regresses a 6-DoF pose from one image, trained on (image, pose) pairs from a SfM reconstruction. The contribution was the proof that a learned regressor generalises across viewpoints in a known scene; subsequent work (Bayesian PoseNet, Geometric Loss) refined the loss to weight rotation and translation jointly and added uncertainty estimates.

## MeshLoc — neural feature matching against meshes

*MeshLoc* (Panek, Kukelova, Sattler, ECCV 2022) bridges classical and learned approaches: keep the geometric backbone (RANSAC + PnP) but replace the **feature matching** stage with neural correspondences against a 3D mesh's rendered views. This sidesteps maintaining a feature database and improves robustness on textureless geometry where SIFT-style features fail.

## DUSt3R — dense 3D from two views

*DUSt3R: Geometric 3D Vision Made Easy* (Wang, Leroy, Cabon, Chidlovskii, Revaud, CVPR 2024) discards the SfM pipeline entirely. Given two arbitrary images, a Transformer outputs **per-pixel pointmaps in a shared coordinate frame** — depth, intrinsics, and relative pose all fall out for free. Training is on synthetic (image, pointmap) pairs from CO3D + ScanNet + Habitat. The headline is that *no calibration, no overlap assumption, no SfM* is needed: DUSt3R works on uncalibrated phone images of any scene.

## Depth Anything

*Depth Anything* (Yang, Kang, Huang, Xu, Feng, Zhao, CVPR 2024) is the "foundation model" for monocular depth: a ViT trained on 62M unlabelled images via a pseudo-label distillation loop from a SOTA teacher. Robust to natural variation that breaks task-specific depth networks (lighting, occlusion, unusual scenes). v2 (later 2024) improves fine details with synthetic-data fine-tuning. Depth Anything is now the default depth prior used elsewhere — neural rendering, video editing, scene reconstruction.

## VGGT and Fast3R — feed-forward dense 3D

*VGGT: Visual Geometry Grounded Transformer* (Wang, Chen, Cabon, Leroy, Revaud, 2024) extends DUSt3R to *N* views in a single forward pass, removing the iterative pairwise alignment. *Fast3R* (Yang et al., 2024) pushes further with sparse attention and a streaming variant for ~1000-image collections. The combined trajectory: full SfM in a single, differentiable, batched network call — the **end of the multi-stage pipeline** for many practical reconstruction tasks.

## Reading list

- *PoseNet: A Convolutional Network for Real-Time 6-DOF Camera Relocalization* — Kendall, Grimes, Cipolla, ICCV 2015.
- *MeshLoc: Mesh-Based Visual Localization* — Panek, Kukelova, Sattler, ECCV 2022.
- *DUSt3R: Geometric 3D Vision Made Easy* — Wang, Leroy, Cabon, Chidlovskii, Revaud, CVPR 2024.
- *Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data* — Yang, Kang, Huang, Xu, Feng, Zhao, CVPR 2024.
- *VGGT: Visual Geometry Grounded Transformer* — Wang, Chen, Cabon, Leroy, Revaud, 2024.
- *Fast3R: Towards 3D Reconstruction of 1000+ Images in One Forward Pass* — Yang et al., 2024.

## What to read next

- [Structure from Motion](./sfm) — the classical pipeline these networks compress.
- [Neural Rendering](./neural-rendering) — uses dense 3D outputs as initialisation for radiance fields.
- [Representation Learning](./representation) — the self-supervised vision encoders DUSt3R and VGGT build on.
