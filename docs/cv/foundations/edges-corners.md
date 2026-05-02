---
title: Edges & Corners
order: 3
---

# Edges & Corners

Edges are 1D loci of intensity discontinuity; corners are 0D points where intensity changes in *every* direction. Both are derivative-based features built from the [gradient operations](./filters) of the previous chapter, and both feed downstream pipelines: edges into segmentation and contour analysis, corners into [feature matching](./features) and SfM.

## The Canny edge detector

*A Computational Approach to Edge Detection* (Canny, PAMI 1986) is the canonical edge detector and remains the reference algorithm for sharp, single-pixel-width edges. The pipeline is four stages:

1. **Smooth** the image with a Gaussian to suppress noise.
2. **Compute the gradient** $\nabla I = (I_x, I_y)$ via convolution; the magnitude $|\nabla I| = \sqrt{I_x^2 + I_y^2}$ marks edge strength and the orientation $\arctan(I_y / I_x)$ marks the edge normal.
3. **Non-maximum suppression** along the gradient direction — keep only pixels that are local maxima of magnitude perpendicular to the edge.
4. **Hysteresis thresholding** — accept any pixel above $T_\text{high}$, reject any below $T_\text{low}$, accept the in-between band only if connected to a strong pixel.

Canny is *the* example of how a multi-stage classical pipeline (smoothing, derivatives, suppression, hysteresis) is needed to produce clean output from noisy inputs.

## Harris corner detector

A corner is detected by looking at how the **second-moment matrix** behaves in a window:

$$
M = \sum_{(x,y) \in W} w(x, y)\, \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix}.
$$

The eigenvalues of $M$ describe how intensity varies in the two principal directions. Two large eigenvalues = corner, one large = edge, two small = flat region. The Harris response avoids explicit eigendecomposition:

$$
R = \det(M) - \kappa\,(\mathrm{trace}\,M)^2, \qquad \kappa \in [0.04, 0.06].
$$

Local maxima of $R$ above a threshold are corners. Harris (1988) is rotation-invariant but not scale-invariant — that is what motivated the [SIFT](./features) line of detectors.

## FAST corners

*FAST: Features from Accelerated Segment Test* (Rosten & Drummond, ECCV 2006) is the algorithm of choice when corner-detection cost matters (real-time SLAM, embedded systems). For each candidate pixel $p$, examine the 16 pixels on a Bresenham circle of radius 3 around it. $p$ is a corner if a contiguous arc of $N \geq 9$ of those pixels are all brighter or all darker than $p$ by a threshold. A learned decision tree pre-filters the test, giving order-of-magnitude speedups over Harris.

## Edges and corners in the deep era

Modern detectors and descriptors (SuperPoint, KeyNet, DISK) re-derive these signals as side outputs of CNNs trained for downstream tasks. SuperPoint, for example, predicts a corner heatmap and a per-pixel descriptor jointly, distilling years of hand-crafted detector design into a single forward pass. The classical edge/corner story matters because it explains *what* those networks learn and *why* the receptive-field, scale, and threshold considerations remain relevant.

## What to read next

- [Local Features (SIFT, SURF, ORB)](./features) — turning corners into matchable descriptors.
- [Image Pyramids & Scale-Space](./pyramids) — the multi-scale extension that makes detectors scale-invariant.
- [Linear Filters & Convolution](./filters) — the gradient operators these detectors are built on.
