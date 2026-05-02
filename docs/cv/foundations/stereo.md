---
title: Two-View Geometry & Stereo
order: 7
---

# Two-View Geometry & Stereo

Two cameras observing the same scene from different positions impose a strong geometric constraint on what they can see. Working out that constraint — the **epipolar geometry** — is what lets us triangulate 3D points from pairs of image observations. Stereo vision is the direct application: a calibrated pair of cameras produces a dense **disparity map** that converts to depth.

## Epipolar geometry and the fundamental matrix

For two views with camera matrices $P_1, P_2$, a 3D point $\mathbf{X}$ projects to $\mathbf{x}_1$ and $\mathbf{x}_2$. These satisfy the **epipolar constraint**

$$
\mathbf{x}_2^T F \mathbf{x}_1 \;=\; 0,
$$

where $F$ is the $3\times3$ rank-2 **fundamental matrix**. Given a point in image 1, the matching point in image 2 must lie on the **epipolar line** $F\mathbf{x}_1$. Reducing search from 2D to 1D is the entire reason stereo matching is tractable.

When the cameras are calibrated (intrinsics $K_1, K_2$ known), $F = K_2^{-T} E K_1^{-1}$ where $E$ is the **essential matrix** $E = [\mathbf{t}]_\times R$, encoding the relative rotation and translation up to scale. $E$ has 5 degrees of freedom and is recoverable from 5 point correspondences (Nistér's 5-point algorithm, PAMI 2004).

## Estimating $F$: the eight-point algorithm

Hartley's normalised eight-point algorithm (PAMI 1997) solves for $F$ from $\geq 8$ correspondences:

1. **Normalise** image coordinates so both views are zero-mean with average distance $\sqrt{2}$. Skipping this is the classical foot-gun — the linear system becomes wildly ill-conditioned.
2. Stack the constraint $\mathbf{x}_2^T F \mathbf{x}_1 = 0$ for each correspondence into a linear system $A \mathbf{f} = 0$ where $\mathbf{f}$ is the 9 entries of $F$.
3. Solve via SVD; enforce the rank-2 constraint by zeroing the smallest singular value of the resulting $F$.
4. **Wrap in RANSAC** — outliers are inevitable in feature matching, so this is non-negotiable in practice.

## Rectification

Once $F$ (or $E$) is estimated, **rectification** rotates the two images so that corresponding epipolar lines become horizontal scanlines. After rectification, finding the match for a pixel at row $y$ in image 1 is a 1D search along row $y$ in image 2 — converting the 2D matching problem into per-row block matching.

## Disparity and depth

In a rectified stereo pair with baseline $b$ and focal length $f$, a 3D point at depth $Z$ projects to two image points separated by **disparity** $d = x_1 - x_2$, related by

$$
Z \;=\; \frac{f \cdot b}{d}.
$$

Closer points have larger disparity. Estimating the disparity at every pixel is the **stereo matching** problem: methods range from local block matching (window correlation, SAD/NCC) through Semi-Global Matching (SGM, Hirschmüller, CVPR 2005) — the workhorse of OpenCV's `StereoSGBM` — to learned cost-volume networks (PSMNet, GA-Net, RAFT-Stereo).

## What to read next

- [Camera Models & Calibration](./calibration) — needed before stereo geometry can yield metric depth.
- [Optical Flow](./optical-flow) — dense correspondence in time rather than across cameras.
- [Correspondence & SfM](../advances/sfm) — generalising two-view geometry to many views.
