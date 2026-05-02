---
title: Optical Flow
order: 8
---

# Optical Flow

Optical flow is the apparent 2D motion of pixels between two consecutive video frames. Computing it dense-per-pixel is the temporal counterpart of [stereo disparity](./stereo) — both are correspondence problems, but flow operates across time on a single moving camera (or a moving scene), and the displacements can be in any direction, not just horizontal.

## The brightness constancy assumption

The classical formulation assumes that a tracked point keeps the same intensity across frames:

$$
I(x, y, t) \;=\; I(x + u, y + v, t + 1).
$$

A first-order Taylor expansion gives the **optical flow constraint equation**:

$$
I_x \, u + I_y \, v + I_t \;=\; 0.
$$

A single equation in two unknowns — this is the famous **aperture problem**. Locally you can recover only the component of motion *normal* to the gradient; the tangential component is unobservable from one pixel alone. All flow algorithms add some regularisation or larger-window constraint to break the ambiguity.

## Lucas–Kanade

*An Iterative Image Registration Technique* (Lucas, Kanade, IJCAI 1981) takes the windowed-constancy approach: assume flow is constant over a small neighbourhood $W$, giving a linear system

$$
\begin{bmatrix} \sum I_x^2 & \sum I_x I_y \\ \sum I_x I_y & \sum I_y^2 \end{bmatrix} \begin{bmatrix} u \\ v \end{bmatrix} \;=\; - \begin{bmatrix} \sum I_x I_t \\ \sum I_y I_t \end{bmatrix}.
$$

The $2\times2$ matrix on the left is the same **second-moment matrix** that appears in [Harris corner detection](./edges-corners): well-conditioned (two large eigenvalues) means a corner, which means a tractable flow estimate. Lucas–Kanade in a [pyramid](./pyramids) (coarse-to-fine warping) handles displacements larger than the window.

## Horn–Schunck — global smoothness

*Determining Optical Flow* (Horn, Schunck, AI 1981) takes the opposite approach: add a global smoothness regulariser and solve a variational problem,

$$
\min_{u, v} \int \left( I_x u + I_y v + I_t \right)^2 + \lambda \left(\|\nabla u\|^2 + \|\nabla v\|^2\right) \, dx\, dy.
$$

The Euler–Lagrange equations give a coupled linear system solved by Gauss–Seidel or successive over-relaxation. Horn–Schunck produces dense flow everywhere — at the cost of over-smoothing motion discontinuities at object boundaries.

## TV-L1 and modern variational flow

Replacing the L2 data and smoothness terms with **L1** (or robust Huber/Charbonnier) penalties makes the estimator robust to brightness violations and edge-preserving across motion boundaries. *TV-L1 Optical Flow* (Zach et al., DAGM 2007) is the canonical formulation, with primal-dual solvers and GPU implementations that ran near-real-time well before deep methods. The principle — robust data term, total-variation regularisation — survived into many learned methods as auxiliary losses.

## Deep era: FlowNet, PWC-Net, RAFT

*FlowNet* (Dosovitskiy et al., ICCV 2015) was the first end-to-end CNN for flow, supervised on synthetic data. *PWC-Net* (Sun et al., CVPR 2018) added the classical **pyramid-warping-cost-volume** structure inside the network. *RAFT* (Teed, Deng, ECCV 2020) — covered in [SfM](../advances/sfm) — is the dominant modern approach: build a 4D all-pairs correlation volume once, then iteratively refine flow with a recurrent update operator. Modern SLAM, video segmentation, and frame interpolation systems all rest on RAFT-style flow.

## What to read next

- [Linear Filters & Convolution](./filters) — the gradient operations underpinning $I_x, I_y, I_t$.
- [Two-View Geometry & Stereo](./stereo) — disparity is flow with an epipolar prior.
- [Correspondence & SfM (Modern)](../advances/sfm) — RAFT, LoFTR, and the post-classical landscape.
