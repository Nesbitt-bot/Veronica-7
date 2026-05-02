---
title: Local Feature Descriptors
order: 4
---

# Local Feature Descriptors

A feature descriptor is a fixed-length vector summarising the local image patch around a keypoint. It is the bridge between detection ("here's an interesting pixel") and matching ("this pixel in image A corresponds to that pixel in image B"). The descriptor must be invariant to changes that should not matter (illumination, viewpoint, scale) and discriminative against everything else.

## SIFT — the canonical descriptor

*Distinctive Image Features from Scale-Invariant Keypoints* (Lowe, IJCV 2004) defines the **SIFT** pipeline. It bundles four ideas:

1. **Detection in scale-space** — extrema of the Difference-of-Gaussians (DoG) response across spatial position and scale, giving keypoints with associated scale (see [pyramids](./pyramids)).
2. **Orientation assignment** — assign each keypoint a dominant gradient orientation by histogramming local gradients; descriptors are then computed in this rotated frame, giving rotation invariance.
3. **Descriptor construction** — divide the local patch (rotated, scaled to a canonical size) into a 4×4 grid; in each cell, accumulate an 8-bin orientation histogram of weighted gradients. Concatenating gives a **128-D vector**.
4. **Normalisation** — L2-normalise, clip values $> 0.2$, renormalise. The clip step robustifies against contrast shifts and saturation.

SIFT works astonishingly well — strong invariance to rotation, scale, modest viewpoint and illumination changes — and was the dominant matching descriptor for over a decade.

## SURF — the speed-optimised cousin

*SURF: Speeded-Up Robust Features* (Bay, Tuytelaars, Van Gool, ECCV 2006) approximates SIFT's expensive Gaussian convolutions with **box filters** computed in $O(1)$ via integral images. The Hessian-based detector and the descriptor (sums of Haar wavelet responses over a 4×4 grid) cut compute by ~3× at modest accuracy cost. SURF was the right answer when SIFT was the bottleneck of an SfM or panorama-stitching system.

## ORB — binary descriptors for real-time

*ORB: An Efficient Alternative to SIFT or SURF* (Rublee, Rabaud, Konolige, Bradski, ICCV 2011) chains [FAST corners](./edges-corners) with the **BRIEF** binary descriptor (Calonder, ECCV 2010). BRIEF samples a fixed pattern of pixel pairs and outputs one bit per pair (which is brighter), giving a 256-bit vector. ORB adds steered (rotated) sampling patterns and a learned uncorrelated pair set. Matching is **Hamming distance** — XOR plus popcount — which is one to two orders of magnitude faster than L2 on float vectors. ORB is the descriptor used in ORB-SLAM and is still the right pick when matching latency dominates.

## Patent-free SIFT, learned descriptors

For years SIFT was patented (expired 2020) and SURF still is, which pushed the community to ORB and to **learned** descriptors that are now the dominant family: HardNet, L2-Net, SuperPoint, DISK, and ALIKED. Learned descriptors trained with metric-learning losses on photo-tourism data outperform SIFT on benchmarks like HPatches, especially under large viewpoint changes. The classical descriptors remain the reference algorithms — and the targets to beat.

## What to read next

- [Edges & Corners](./edges-corners) — where the keypoints come from.
- [Image Pyramids & Scale-Space](./pyramids) — the construction underlying scale-invariant detection.
- [Correspondence & SfM](../advances/sfm) — what feature matches feed into.
