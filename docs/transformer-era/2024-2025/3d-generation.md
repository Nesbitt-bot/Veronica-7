---
title: 3D Gaussian Splatting & Beyond
order: 6
---

# 3D Gaussian Splatting & Beyond

3D Gaussian Splatting (3DGS), introduced at SIGGRAPH 2023, became the dominant scene-representation in 2024-2025. Combined with **diffusion-based 3D generation**, **feed-forward 3D inference** (DUSt3R, VGGT), and **3D-aware video generation**, 3D content creation has transitioned from a hand-crafted artisan workflow to a generative-AI workflow in an astonishingly short period. This page covers the 2024-2025 frontier; the architectural foundation is at [Neural Rendering](../../cv/advances/neural-rendering) and [Geometric CV](../../cv/advances/geometric).

## 3D Gaussian Splatting recap

3DGS represents a scene as millions of explicit Gaussians — each with a 3D position, anisotropic covariance (rotation + scale), opacity, and view-dependent colour (spherical harmonics). Rendering is differentiable rasterisation:

- Project each Gaussian onto the image plane.
- Sort by depth.
- Alpha-composite from front to back.

The result is **>100 FPS at 1080p** with quality matching NeRF-based methods that were 1000× slower. 3DGS's combination of explicit geometry, fast rendering, and differentiability makes it the right substrate for downstream 3D ML.

See [Neural Rendering](../../cv/advances/neural-rendering) for the architectural details.

## What changed in 2024-2025

The 2024-2025 wave moved 3D generation in several directions simultaneously:

### Feed-forward 3D from images

Pre-2024, building a 3D model from photos required **per-scene optimization** (NeRF, 3DGS) — minutes to hours per scene. The 2024 generation produced **feed-forward** networks that ingest images and emit 3D in a single forward pass:

- **DUSt3R** (Wang et al., CVPR 2024) — outputs per-pixel pointmaps in a shared frame from two images.
- **VGGT** (Wang et al., 2024) — extends to N views, multi-modal output (depth, pose, points, dense correspondences).
- **Fast3R** — handles 1000+ images.

These networks can run in seconds and don't require known camera poses. They feed 3DGS or mesh reconstructions much faster than per-scene optimization.

### Diffusion-based 3D generation

Adapting [diffusion](../2021-2022/ddpm) to 3D took different forms:

- **Direct 3D diffusion** — diffuse over 3D representations (point clouds, voxels, splat parameters). Fast inference but quality lags 2D diffusion.
- **Multi-view diffusion** — generate consistent multi-view images of an object, then reconstruct 3D from them (Zero-1-to-3, Wonder3D, MVDream, ImageDream). The dominant practical approach in early 2024.
- **Score Distillation Sampling** (DreamFusion, ProlificDreamer) — distill a 2D diffusion model into a 3D representation by minimising rendered-vs-2D-diffusion-score loss. Slow per-scene optimization but high quality on stylised content.
- **Native 3D foundation models** — TRELLIS (Microsoft, 2024), CRM, Hunyuan3D, Rodin, Trellis-3D-mini. Combine multi-view diffusion with feed-forward reconstruction in one model.

By mid-2025 single-image-to-3D took ~10-30 seconds at quality good enough for game assets, AR/VR props, and visualisation.

### Generative video → 3D

A surprising 2024-2025 result: **video-generation models implicitly understand 3D structure**, and you can extract 3D from their internal representations or by orbit-conditioning the generation. *World-Consistent Video Diffusion* and similar work repurposes [Sora](../2024/sora)-class models for novel-view synthesis with multi-frame consistency.

### Real-time 3D scene reconstruction

Combining feed-forward 3D networks with 3DGS rendering produces real-time captureable 3D pipelines. Smartphone apps (Polycam, Luma AI's Genie / Polyfields) record a video; the system reconstructs and serves a 3DGS in seconds. The first wave of these tools shipped in 2024-2025.

## Use cases

The technology is finding traction in:

- **AR / VR content creation** — Apple Vision Pro and Meta Quest content pipelines.
- **Game asset generation** — proxy assets for prototyping; final assets still mostly hand-crafted.
- **E-commerce** — quick 3D product views from photos.
- **Mapping and surveying** — 3DGS reconstructions of buildings, indoor spaces, infrastructure.
- **Robotics simulation** — generated 3D scenes for training and testing policies.
- **Cinematography previs** — quick rough 3D previz from prompts.

## What's still hard

- **Geometry quality.** Surface normals, watertight meshes, sharp edges remain hard for diffusion-based 3D. Hand modelling still beats generation for production assets.
- **Editability.** Once generated, 3D scenes are hard to *modify* in ways that preserve other content. The image-editing analogues haven't fully transferred.
- **Animation.** Static 3D is solved-ish; animation (rigging, motion, articulation) is much harder.
- **Scale.** Generating large-scale environments (cities, levels) with consistent style and semantics is open.

## Architectural patterns

The 2024-2025 generation has converged on two patterns:

- **Multi-view-then-reconstruct.** Generate 6-32 consistent views of an object via 2D diffusion conditioned on view direction; reconstruct 3D via feed-forward networks (TripoSR, LRM-style). Fast, modular.
- **Native-3D foundation model.** Train a single network that outputs 3D directly (TRELLIS, Trellis-3D, Rodin). More capacity-intensive but handles complex topology better.

Both approaches are used in production. Hybrid stacks (diffusion for shape, separate refinement for textures, separate animation) are common in commercial pipelines.

## What to read next

- [Neural Rendering](../../cv/advances/neural-rendering) — NeRF, 3DGS, the architectural foundation.
- [Geometric CV](../../cv/advances/geometric) — DUSt3R, VGGT, feed-forward 3D.
- [Image and Video Generation](../../cv/advances/generation) — the broader generative-content story.
