---
title: Correspondence & Structure-from-Motion
order: 7
---

# Correspondence & Structure-from-Motion

Structure-from-Motion (SfM) and its real-time cousin SLAM solve the problem of recovering camera poses and 3D structure from a set of images. The classical pipeline factors into **feature detection → matching → relative pose → triangulation → bundle adjustment**. The modern story is the *learned replacement* of each stage, increasingly fused into single networks that work where COLMAP fails.

## SfM Revisited — the COLMAP era

*Structure-from-Motion Revisited* (Schönberger, Frahm, CVPR 2016) is the canonical reference for incremental SfM and the basis of **COLMAP**, the workhorse pipeline. It introduced robust scene-graph augmentation, **next-best-view selection** that avoids drift, and a triangulation step that filters degenerate observations. COLMAP-quality reconstructions are still the de-facto ground truth for benchmarking learned methods.

## SuperGlue — learned matching with attention

*SuperGlue: Learning Feature Matching with Graph Neural Networks* (Sarlin, DeTone, Malisiewicz, Rabinovich, CVPR 2020) replaces nearest-neighbour matching of SIFT/SuperPoint features with a graph neural network that uses self- and cross-attention between the two images' keypoint sets. The output is a soft assignment matrix solved with a differentiable Sinkhorn algorithm. SuperGlue dominated long-baseline matching where ratio-test matching collapses.

## RAFT — recurrent all-pairs flow

*RAFT: Recurrent All-Pairs Field Transforms for Optical Flow* (Teed, Deng, ECCV 2020) computes a dense **4D correlation volume** between all pixel pairs and iteratively refines a flow field via a recurrent ConvGRU update. Linear in the number of pixels per refinement step, end-to-end trainable, and the basis of many follow-ups (flow + stereo + dense correspondence). RAFT also forms the dense-matching backbone of several SfM/SLAM systems (DROID-SLAM).

## LoFTR — detector-free matching

*LoFTR: Detector-Free Local Feature Matching with Transformers* (Sun, Shen, Wang, Bao, Zhou, CVPR 2021) drops the keypoint-detection stage entirely. A coarse-to-fine Transformer matches every pixel of one image against every pixel of the other, producing dense correspondences without ever extracting discrete keypoints. Wins on textureless and repetitive scenes where SIFT/SuperPoint fail to fire.

## LightGlue — efficient matching

*LightGlue: Local Feature Matching at Light Speed* (Lindenberger, Sarlin, Pollefeys, ICCV 2023) re-engineers SuperGlue for inference: **adaptive depth and width** so easy image pairs exit the network early, learned positional encodings, and a streamlined Sinkhorn step. Same matching quality, ~10× faster — important enough for real-time SLAM that LightGlue is now the default learned matcher in many pipelines.

## MegaSaM — dynamic scene SfM

*MegaSaM* (Li, Tucker, Snavely et al., 2024–25) addresses the long-standing limitation that SfM assumes static scenes. By combining DROID-SLAM-style differentiable bundle adjustment with motion-segmentation priors and learned depth, it produces accurate camera tracks and dense depth on **casually captured dynamic videos** (people, cars, hand-held footage) where COLMAP fails outright. MegaSaM and DUSt3R/VGGT (see [geometric](./geometric)) together mark the practical end of the "you must record a static scene with overlap" assumption.

## Reading list

- *Structure-from-Motion Revisited* — Schönberger, Frahm, CVPR 2016 (COLMAP).
- *SuperGlue: Learning Feature Matching with Graph Neural Networks* — Sarlin, DeTone, Malisiewicz, Rabinovich, CVPR 2020.
- *RAFT: Recurrent All-Pairs Field Transforms for Optical Flow* — Teed, Deng, ECCV 2020.
- *LoFTR: Detector-Free Local Feature Matching with Transformers* — Sun, Shen, Wang, Bao, Zhou, CVPR 2021.
- *LightGlue: Local Feature Matching at Light Speed* — Lindenberger, Sarlin, Pollefeys, ICCV 2023.
- *MegaSaM: Accurate, Fast, and Robust Structure and Motion from Casual Dynamic Videos* — Li et al., 2024.

## What to read next

- [Geometric Computer Vision](./geometric) — DUSt3R / VGGT eliminate this pipeline entirely.
- [Neural Rendering](./neural-rendering) — downstream consumer of SfM poses (and increasingly its replacement).
- [Optical Flow](../foundations/optical-flow) — the foundational chapter behind RAFT.
