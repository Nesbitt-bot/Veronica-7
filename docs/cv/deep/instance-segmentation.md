---
title: Instance & Panoptic Segmentation
order: 4
---

# Instance & Panoptic Segmentation

[Semantic segmentation](./semantic-segmentation) labels each pixel with a class. **Instance segmentation** additionally separates *individual objects* — two adjacent cars are not just "car pixels" but "car #1" and "car #2". **Panoptic segmentation** unifies the two: every pixel gets a class label, plus an instance ID for "thing" classes (cars, people) but not for "stuff" classes (sky, road).

## Mask R-CNN

*Mask R-CNN* (He, Gkioxari, Dollár, Girshick, ICCV 2017) is the canonical instance-segmentation architecture. Take Faster R-CNN (see [object detection](./object-detection)), add a small **mask head** in parallel with the existing classification and box-regression heads. For each RoI, the mask head produces a $K \times m \times m$ binary mask (one per class), and only the mask for the predicted class contributes to the loss.

The pivotal engineering detail is **RoI Align**, which replaces RoI Pool's quantised bin sampling with bilinear interpolation. RoI Pool's misalignment was barely visible for box prediction but devastating for the per-pixel mask head — RoI Align lifted mask accuracy by ~10 points and, in retrospect, became standard for downstream box tasks too. Mask R-CNN remained the dominant instance segmenter for years and still serves as the baseline in most papers.

## YOLACT and SOLO — one-stage instance masks

*YOLACT* (Bolya, Zhou, Xiao, Lee, ICCV 2019) brought instance segmentation to one-stage speed. The trick: predict a small set of **prototype masks** for the whole image plus per-instance **mask coefficients**, and produce each instance's mask as a linear combination of prototypes. Inference is one fully-convolutional pass at ~30 FPS.

*SOLO* (Wang et al., ECCV 2020) and SOLOv2 take a different one-stage route — assign each instance to a grid cell based on its centre and let that cell's branch produce the mask directly, removing both anchors and RoI cropping. SOLOv2 matched Mask R-CNN's quality at higher throughput.

## Panoptic Segmentation: PQ

*Panoptic Segmentation* (Kirillov, He, Girshick, Rother, Dollár, CVPR 2019) introduced the unified task and the **Panoptic Quality (PQ)** metric:

$$
\mathrm{PQ} \;=\; \underbrace{\frac{\sum_{(p, g) \in \mathrm{TP}} \mathrm{IoU}(p, g)}{|\mathrm{TP}|}}_{\text{Segmentation Quality}} \cdot \underbrace{\frac{|\mathrm{TP}|}{|\mathrm{TP}| + \tfrac{1}{2}|\mathrm{FP}| + \tfrac{1}{2}|\mathrm{FN}|}}_{\text{Recognition Quality}}.
$$

A predicted segment matches a ground-truth segment if their IoU $> 0.5$. PQ multiplies "how well the matched segments overlap" with "how often we matched correctly", capturing both segmentation and recognition in one number.

Panoptic FPN — a Mask R-CNN with a parallel semantic-segmentation branch — was the first usable panoptic baseline. The unification continues into [Mask2Former](../advances/semantic-segmentation), which handles semantic, instance, and panoptic tasks with a single architecture and matched query.

## What to read next

- [Object Detection](./object-detection) — Faster R-CNN is Mask R-CNN's foundation.
- [Modern Semantic Segmentation](../advances/semantic-segmentation) — Mask2Former unifies all three segmentation tasks.
- [Vision Transformers](./vit) — the backbone that replaced ResNets in modern detectors and segmenters.
