---
title: Camera Models & Calibration
order: 6
---

# Camera Models & Calibration

Calibration recovers the intrinsic parameters $K$ and the lens-distortion coefficients of a camera — the constants that any later geometric reasoning ([stereo](./stereo), [optical flow](./optical-flow), [SfM](../advances/sfm)) needs in order to map between pixels and rays. The page assumes the [image-formation](./image-formation) pinhole model and walks through the standard procedure.

## What we want to recover

For a single camera under the pinhole + Brown–Conrady model, calibration solves for:

- Focal lengths $(f_x, f_y)$, principal point $(c_x, c_y)$, and (rarely) skew $s$ — the five entries of $K$.
- Radial distortion $(k_1, k_2, k_3)$ and tangential distortion $(p_1, p_2)$.
- Implicitly, the per-image extrinsics $(R_i, \mathbf{t}_i)$ used during the calibration capture.

## Zhang's method

*A Flexible New Technique for Camera Calibration* (Zhang, PAMI 2000) is the standard procedure used by every CV library. Capture multiple views ($\geq 3$) of a **planar calibration pattern** (a checkerboard) at varying poses. For each view:

1. Detect the corners of the checkerboard (sub-pixel refined via the gradient response).
2. Compute the **homography** $H_i$ relating the planar pattern to the image, using the known board geometry.
3. Each $H_i$ provides two constraints on the **image of the absolute conic** $\omega = K^{-T}K^{-1}$, a $3\times3$ symmetric matrix with five degrees of freedom.

Stack the constraints across views, solve linearly for $\omega$, recover $K$ via Cholesky, then refine $(K, \{R_i, \mathbf{t}_i\}, k, p)$ jointly by minimising **reprojection error** over all detected corners with Levenberg–Marquardt:

$$
\min_{K, k, p, \{R_i, \mathbf{t}_i\}} \sum_i \sum_j \left\| \mathbf{x}_{ij} - \pi(K, k, p; R_i, \mathbf{t}_i; \mathbf{X}_j) \right\|^2.
$$

The non-linear refinement is what produces the calibration accuracy real applications need (sub-pixel reprojection error).

## Self-calibration and online estimation

Calibration with a known pattern is the right baseline; for arbitrary footage it is impossible to insist on a checkerboard. **Self-calibration** (Faugeras, Hartley) recovers the intrinsics from rigid scene geometry alone, using constraints between fundamental matrices across views. It needs many wide-baseline views and is inherently more brittle than Zhang's method.

In modern systems, intrinsics are often estimated **online** during SLAM or [SfM](../advances/sfm), starting from a rough guess and treating $K$ as additional unknowns inside bundle adjustment. Learned methods (e.g., Tenenbaum, *Camera Calibration with Vanishing Points*) regress focal length and distortion directly from a single image, but accuracy lags Zhang's method when a pattern is available.

## Multi-camera and rolling shutter extensions

A stereo or multi-camera rig requires recovering the **inter-camera extrinsics** $(R_{ij}, \mathbf{t}_{ij})$ in addition to per-camera intrinsics. Tools like Kalibr handle multi-IMU + multi-camera rigs with time offsets. Rolling-shutter sensors (most CMOS cameras) further require modeling the per-row exposure timing — ignored by classical pinhole calibration but visible as wobble in fast motion.

## What to read next

- [Image Formation & Cameras](./image-formation) — the model being calibrated.
- [Stereo & Multi-View](./stereo) — the immediate consumer of calibrated rigs.
- [Correspondence & SfM](../advances/sfm) — bundle adjustment refines intrinsics jointly with structure.
