---
title: Object Detection
order: 2
---

# Object Detection

Detection asks: which objects are in the image, of what class, and where? The deep era split into two camps — **two-stage** detectors (propose then classify, R-CNN family) and **one-stage** detectors (predict everything in a single forward pass, YOLO/SSD/RetinaNet). DETR later unified them by replacing hand-coded matching with set prediction.

## R-CNN → Fast R-CNN → Faster R-CNN

*R-CNN* (Girshick et al., CVPR 2014) was the first deep detector: run Selective Search to produce ~2000 region proposals, crop each, run an ImageNet-pretrained CNN, classify with SVMs. Excellent accuracy, but training was multi-stage and inference took seconds per image.

*Fast R-CNN* (Girshick, ICCV 2015) collapsed the per-proposal CNN runs into one whole-image forward pass and added **RoI Pooling** — extracting fixed-size feature maps for each proposal from the shared feature grid. Single-stage training with a multi-task loss (classification + bounding-box regression) and ~10× faster inference.

*Faster R-CNN* (Ren, He, Girshick, Sun, NeurIPS 2015) replaced Selective Search with a learned **Region Proposal Network** (RPN) sharing the same backbone — proposals become a $\sim$1ms operation. Faster R-CNN is still the architectural reference for "two-stage detector" and the basis of Mask R-CNN ([instance segmentation](./instance-segmentation)).

## YOLO and SSD — one-stage detection

*You Only Look Once* (Redmon, Divvala, Girshick, Farhadi, CVPR 2016) discarded proposals entirely. Divide the image into an $S \times S$ grid; each cell predicts $B$ bounding boxes plus class probabilities. The output is a fixed $S \times S \times (B \cdot 5 + C)$ tensor regressed in one shot. YOLO sacrifices some accuracy on small objects for vastly better speed — real-time at 45+ FPS in 2016. Subsequent versions (v3 anchor-based, v5/v8/v11 evolved heads) remain the dominant practical detectors.

*SSD: Single Shot MultiBox Detector* (Liu et al., ECCV 2016) interleaved YOLO's per-grid prediction with detection at **multiple feature scales**, helping with small objects without sacrificing the single-pass advantage.

## Anchor-based vs anchor-free

Both Faster R-CNN and SSD pre-define **anchors** — fixed reference boxes at every grid cell — and regress offsets to them. Hyperparameter tuning over anchor scales and aspect ratios was a constant pain. Anchor-free detectors (FCOS, CornerNet, CenterNet) regress the box directly from the feature point, removing the anchor-design knob. FCOS (Tian et al., ICCV 2019) is the cleanest reference: per-pixel classification + 4 distances to box edges + a centerness score.

## Focal Loss and class imbalance

One-stage detectors face a sharp class imbalance — most anchors are background, drowning the loss signal from positives. *Focal Loss* (Lin, Goyal, Girshick, He, Dollár, ICCV 2017) reshapes cross-entropy to **down-weight easy examples**:

$$
\mathrm{FL}(p_t) \;=\; -(1 - p_t)^\gamma \log p_t,
$$

where $p_t$ is the predicted probability of the true class. The factor $(1-p_t)^\gamma$ vanishes for confidently classified examples (typical of background) and stays close to 1 for hard ones. Focal Loss made RetinaNet match two-stage accuracy at one-stage speed.

## DETR — set prediction with Transformers

*End-to-End Object Detection with Transformers* (Carion et al., ECCV 2020) replaces the entire detection pipeline with **set prediction**. Encode the image with a CNN/Transformer; pass $N$ learned object queries through a Transformer decoder that attends to image features; output $N$ (class, box) pairs. Training uses **bipartite matching** (Hungarian algorithm) between predictions and ground-truth — this single change eliminates anchors, NMS, and most hyperparameters. DETR is slow to converge but became the architectural template for [Mask2Former](../advances/semantic-segmentation), Grounding DINO, and most modern unified perception models.

## What to read next

- [CNN Backbones](./cnn-backbones) — what produces the feature pyramid these detectors consume.
- [Instance & Panoptic Segmentation](./instance-segmentation) — Mask R-CNN extends Faster R-CNN with masks.
- [Open-Vocabulary Detection](../advances/open-vocab) — generalising to arbitrary text queries.
