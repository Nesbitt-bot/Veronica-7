---
title: Neural Rendering
order: 3
---

# Neural Rendering

Neural rendering reconstructs a 3D scene from posed 2D images by **fitting a differentiable scene representation to image observations**, then rendering novel views. The five-year arc goes from MLPs that fit a continuous radiance field, to grid-accelerated variants, to fully explicit Gaussian splat representations that match NeRF quality at orders-of-magnitude faster rendering.

## NeRF — the original radiance field

*NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis* (Mildenhall et al., ECCV 2020) parameterises a scene as a continuous function $F_\Theta : (\mathbf{x}, \mathbf{d}) \mapsto (c, \sigma)$ — given a 3D position and viewing direction, return colour and density. To render a pixel, integrate radiance along the ray:

$$
C(\mathbf{r}) \;=\; \int_{t_n}^{t_f} T(t)\,\sigma(\mathbf{r}(t))\,c(\mathbf{r}(t), \mathbf{d})\, dt, \qquad T(t) = \exp\!\left(-\int_{t_n}^t \sigma(\mathbf{r}(s))\, ds\right).
$$

The MLP is trained per-scene by minimising rendered-vs-observed pixel error. Headline result: photorealistic novel views from ~100 captures, but minutes per training step and seconds per rendered frame.

## Grid acceleration: Plenoxels, Instant-NGP

NeRF's MLP is the bottleneck. *Plenoxels* (Fridovich-Keil, Yu et al., CVPR 2022) drops it entirely: store density and a spherical-harmonic colour at each cell of a sparse voxel grid and optimise the cells directly. *Instant-NGP* (Müller et al., SIGGRAPH 2022) replaces the MLP with a **multi-resolution hash grid** plus a tiny MLP, training a high-quality NeRF in seconds. These are the foundation for downstream interactive systems.

## Mip-NeRF 360 — unbounded scenes and anti-aliasing

*Mip-NeRF 360* (Barron et al., CVPR 2022) addresses two problems: aliasing when rays cover wildly different volumes, and unbounded outdoor scenes. The solution: cone-tracing instead of ray-tracing (each pixel is a cone, integrated against an integrated positional encoding), plus a **non-linear scene contraction** that maps the unbounded outside into a bounded ball. Mip-NeRF 360 produces the first NeRFs that look photorealistic on full 360° outdoor captures.

## 3D Gaussian Splatting

*3D Gaussian Splatting* (Kerbl, Kopanas, Leimkühler, Drettakis, SIGGRAPH 2023) replaces the implicit field with **explicit anisotropic Gaussians**: each splat carries position, covariance (rotation + scale), opacity, and view-dependent colour (spherical harmonics). Rendering is differentiable rasterisation — sort splats by depth, alpha-composite — and runs at >100 FPS at 1080p. Quality matches Mip-NeRF 360 with training time in minutes. 3DGS opened the door to real-time AR/VR neural scenes and to downstream methods that edit, animate, or compose splats.

## COLMAP-Free 3DGS

Both NeRF and 3DGS assume known camera poses, typically from COLMAP — a brittle pre-step that fails on textureless or low-overlap captures. *COLMAP-Free 3D Gaussian Splatting* (Fu et al., CVPR 2024) jointly optimises poses and Gaussians from scratch using a sequential frame-by-frame strategy. The contribution is removing the pose-estimation dependency, which is what blocks most real-world deployment.

## Reading list

- *NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis* — Mildenhall, Srinivasan, Tancik, Barron, Ramamoorthi, Ng, ECCV 2020.
- *Plenoxels: Radiance Fields without Neural Networks* — Fridovich-Keil, Yu et al., CVPR 2022.
- *Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields* — Barron, Mildenhall, Verbin, Srinivasan, Hedman, CVPR 2022.
- *3D Gaussian Splatting for Real-Time Radiance Field Rendering* — Kerbl, Kopanas, Leimkühler, Drettakis, SIGGRAPH 2023.
- *COLMAP-Free 3D Gaussian Splatting* — Fu, Liu, Kulkarni, Kautz, Efros, Wang, CVPR 2024.

## What to read next

- [Geometric Computer Vision](./geometric) — the dense-prediction networks (DUSt3R, VGGT) that replace COLMAP.
- [Structure from Motion](./sfm) — classical correspondence pipelines neural rendering composes with.
- [Image and Video Generation](./generation) — the generative-model side of the same 3D-from-images question.
