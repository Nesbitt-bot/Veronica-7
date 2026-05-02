---
title: Image Pyramids & Scale Space
order: 5
---

# Image Pyramids & Scale Space

A real scene contains structure at many sizes — a face is a few hundred pixels close up and a few dozen at a distance. Detection and matching algorithms need to fire at the *right* scale. The classical answer is the **pyramid**, a stack of progressively smoothed and downsampled copies of an image; the formal answer is **scale-space theory**, which singles out the Gaussian as the unique kernel that builds a pyramid without introducing artefacts.

## Gaussian and Laplacian pyramids

The **Gaussian pyramid** (Burt & Adelson, 1983) is built by alternating Gaussian smoothing and 2× downsampling. Level $\ell+1$ is

$$
G_{\ell+1} \;=\; (G_\ell * g_\sigma) \downarrow_2,
$$

with $g_\sigma$ a small Gaussian kernel. Compute is $O(N^2)$ total across all levels (geometric series), and storage is $4/3$ of the original.

The **Laplacian pyramid** stores the *differences* between adjacent Gaussian levels, giving a band-pass decomposition that reconstructs the image exactly when summed back. It is the foundation of multi-resolution image blending — used in panorama stitching, exposure fusion, and image inpainting — and a precursor to the wavelet transform.

## Scale-space and the uniqueness of the Gaussian

Lindeberg's *Scale-Space Theory in Computer Vision* (1994) formalises what "smoothing" should mean. A scale-space representation $L(x, y, \sigma)$ of an image must satisfy three axioms: (1) **non-creation of structure** — extrema cannot be added as $\sigma$ increases; (2) **linearity** and (3) **shift/rotation/scale invariance**. The unique kernel satisfying these is the **Gaussian**, with $\sigma$ as the scale parameter:

$$
L(x, y, \sigma) \;=\; G_\sigma(x, y) * I(x, y).
$$

The Gaussian's role across CV — from [filters](./filters) to [SIFT](./features) to learned scale-space embeddings — flows from this uniqueness result.

## Difference of Gaussians and SIFT detection

The **DoG operator** approximates the scale-normalised Laplacian:

$$
\sigma^2 \nabla^2 L \;\approx\; L(x, y, k\sigma) - L(x, y, \sigma),
$$

with $k > 1$. Computing DoG is just *subtracting adjacent levels* of a Gaussian pyramid — much cheaper than a Laplacian filter. Local extrema of the DoG response in the 3D scale-space volume (two spatial dimensions plus scale) are the **SIFT keypoints**. Each detection comes with a scale, which lets the descriptor pull a patch of the right size for canonicalisation. This is what makes [SIFT-style features](./features) **scale-invariant**.

## Pyramid pooling in deep nets

The pyramid idea persists into the deep era: **Spatial Pyramid Pooling** (He et al., 2014) pools CNN features at multiple grid resolutions to give scale-invariant classification heads; **Feature Pyramid Networks** (Lin et al., CVPR 2017) build a top-down + lateral pathway that produces semantically rich features at every spatial scale — now standard in modern detectors and segmenters. The classical theory is what tells you the right axis to vary, even when the smoothing is no longer literally Gaussian.

## What to read next

- [Linear Filters & Convolution](./filters) — Gaussian smoothing is the building block.
- [Local Feature Descriptors](./features) — SIFT detection is built on DoG scale-space.
- [Edges & Corners](./edges-corners) — multi-scale extension of derivative operators.
