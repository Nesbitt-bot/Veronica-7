---
title: Open-Vocabulary Detection
order: 10
---

# Open-Vocabulary Detection

A standard object detector predicts boxes plus labels from a fixed class list. **Open-vocabulary detection (OVD)** generalises this: at inference, the model accepts an arbitrary text query — single category names, phrases, or full referring expressions — and returns the matching boxes. The unifying engineering idea is to decouple the box-proposal stage from the classification stage by sharing a CLIP-style text/image embedding space.

## OVR-CNN — open-vocabulary R-CNN

*Open-Vocabulary Object Detection Using Captions* (Zareian, Rosa, Hu, Chang, CVPR 2021) was the first to formalise OVD. Train an R-CNN-style detector on (image, caption) pairs by **first** distilling a vision–language embedding from caption matching, **then** fine-tuning the detection head on a small base-class set. At inference, classify proposals against the embeddings of arbitrary class names. Establishes the now-standard split: **base classes** (with boxes) train the localiser, **novel classes** (only seen in captions) test generalisation.

## MDETR — modulated detection

*MDETR: Modulated Detection for End-to-End Multi-Modal Understanding* (Kamath, Singh, LeCun, Synnaeve, Misra, Carion, ICCV 2021) extends DETR to take a **free-form text query** as additional input. The Transformer's queries attend to both image features and text tokens; the model is trained on grounded-caption datasets like Flickr30k-Entities. MDETR was the proof that detection and phrase grounding can share one model, end-to-end, without per-class heads.

## ViLD — distilling CLIP into a detector

*ViLD: Open-Vocabulary Object Detection via Vision and Language Knowledge Distillation* (Gu, Lin, Kuo, Cui, ICLR 2022) keeps a Mask R-CNN backbone but **distils CLIP's image features into the per-region embeddings** during training. The classification head is then dropped at inference and replaced by cosine similarity to CLIP-encoded text class names. Cleaner than OVR-CNN's two-stage recipe and stronger on novel classes.

## CORA

*CORA: Adapting CLIP for Open-Vocabulary Detection with Region Prompting and Anchor Pre-Matching* (Wu, Zhao, Lu, CVPR 2023) addresses two CLIP-detector mismatch problems. **Region prompting**: CLIP image features are global — to get region embeddings, condition the visual backbone on RoI prompts. **Anchor pre-matching**: align learned anchor queries with text class queries before training proceeds. The result is much stronger novel-class detection on COCO and LVIS.

## Grounding DINO and frontier OVD

*Grounding DINO* (Liu, Zeng, Ren et al., ECCV 2024) fuses a DINO-style detection Transformer with a BERT text encoder via **early, deep cross-attention** (rather than late embedding alignment). It accepts arbitrary referring expressions as the query and is the standard text-grounded detector used in pipelines like Grounded SAM (see [semantic segmentation](./semantic-segmentation)).

*OW-OVD* (Open-World OVD, 2024) targets the harder regime where novel classes can appear at *test time* without ever being mentioned in training captions, mixing OOD detection with OVD. *DINO-X* (2024–25) is the current frontier for unified open-world detection + grounding + segmentation in a single model.

## Reading list

- *Open-Vocabulary Object Detection Using Captions* — Zareian, Rosa, Hu, Chang, CVPR 2021 (OVR-CNN).
- *MDETR: Modulated Detection for End-to-End Multi-Modal Understanding* — Kamath et al., ICCV 2021.
- *ViLD: Open-Vocabulary Object Detection via Vision and Language Knowledge Distillation* — Gu, Lin, Kuo, Cui, ICLR 2022.
- *CORA: Adapting CLIP for Open-Vocabulary Detection with Region Prompting and Anchor Pre-Matching* — Wu, Zhao, Lu, CVPR 2023.
- *Grounding DINO: Marrying DINO with Grounded Pre-Training for Open-Set Object Detection* — Liu et al., ECCV 2024.
- *OW-OVD* and *DINO-X* — open-world / unified-perception extensions, 2024–25.

## What to read next

- [Vision-Language Models](./vision-language) — the encoders these detectors borrow.
- [Semantic Segmentation](./semantic-segmentation) — Grounded SAM composes Grounding DINO + SAM.
- [Object Detection (Deep)](../deep/object-detection) — the closed-set foundations these methods generalise.
