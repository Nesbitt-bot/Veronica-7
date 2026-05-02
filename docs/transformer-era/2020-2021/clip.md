---
title: CLIP — Contrastive Image–Text Pretraining
order: 2
---

# CLIP — Contrastive Image–Text Pretraining

*Learning Transferable Visual Models From Natural Language Supervision* (Radford, Kim, Hallacy, Ramesh, Goh, Agarwal, Sastry, Askell, Mishkin, Clark, Krueger, Sutskever, OpenAI, ICML 2021) introduced **CLIP**: train an image encoder and a text encoder jointly to match (image, caption) pairs against a batch of negatives, on 400M scraped pairs from the web. The result was a vision foundation model with **zero-shot classification capability** on arbitrary class lists, expressed as text prompts. CLIP became the standard image encoder in nearly every later multimodal model and one of the most-cited ML papers of the 2020s.

## The training objective

For a batch of $N$ image-text pairs, both encoders produce $N$ embedding vectors. The image-to-text and text-to-image **InfoNCE losses** are:

$$
\mathcal{L}_\text{i2t} \;=\; -\frac{1}{N}\sum_{i=1}^N \log \frac{\exp(\langle \mathbf{v}_i, \mathbf{t}_i \rangle / \tau)}{\sum_{j=1}^N \exp(\langle \mathbf{v}_i, \mathbf{t}_j \rangle / \tau)},
$$

with the symmetric term over text. The total loss is the average. Temperature $\tau$ is learned. The objective rewards matching the right text to each image (and vice versa) more than any other pair in the batch.

This is **contrastive learning** — see [SimCLR](../../cv/advances/representation) for the image-only version. Adding text as the supervisory signal is what makes CLIP qualitatively different.

## The data

400M (image, caption) pairs scraped from public web sources, filtered with class-balance constraints to ensure broad concept coverage. Captions are noisy, weak, and uncurated — explicitly *not* high-quality labels. The bet was that scale could overcome weak supervision; it paid off.

LAION later released open replicas of this dataset (LAION-400M, LAION-5B) that powered open-source models like OpenCLIP and Stable Diffusion's text encoder.

## Architecture

Two encoders, both Transformer-based:

- **Image encoder** — typically [ViT](./vit) (CLIP-ViT-B/16, ViT-L/14, ViT-H/14). Earlier versions used ResNet-50/101.
- **Text encoder** — a 63M-parameter Transformer over BPE tokens.

Both encoders project to a shared embedding space via final linear layers. The two embedding spaces are aligned by the contrastive objective, never via direct distillation.

## Zero-shot classification

For any list of candidate classes (e.g., the ImageNet 1000), construct text prompts:

`"a photo of a {label}"` for each label. Encode all prompts. For an input image, encode it, compute cosine similarities to all prompt embeddings, and pick the highest. No fine-tuning, no per-class examples.

Headline result: zero-shot CLIP-ViT-L matches a fully supervised ResNet-50 on ImageNet, beats it on many out-of-distribution variants (ImageNet-A, ObjectNet, ImageNet-R), and dominates on niche datasets where standard backbones overfit.

## Why CLIP works

Three properties:

- **Open vocabulary.** Classes are text, not class indices. Adding a new class is just adding a new text prompt — no fine-tuning.
- **Robustness.** Training on noisy web data with broad domain coverage makes CLIP unusually robust to distribution shift. Standard ImageNet classifiers fail badly on perturbed test sets; CLIP degrades much less.
- **Composable.** The shared embedding space lets you do retrieval, similarity, and downstream tasks (e.g., concept erasure, text-conditioned generation) without retraining.

## What CLIP enabled

CLIP's vision tower became the default encoder for every later multimodal system:

- **DALL·E 2 / Stable Diffusion** — CLIP text embeddings condition the image generator.
- **LLaVA / MiniGPT / BLIP-2** — CLIP image features feed into LLM backbones.
- **SAM / DUSt3R / DINOv2** — alternatives, but CLIP remains the most-used vision encoder.
- **Grounding DINO / OVR-CNN / OWL-ViT** — open-vocabulary detection on top of CLIP.

The CLIP embedding space — text and images jointly — is the **lingua franca** of modern vision-language work. When someone says "image embedding", they usually mean a CLIP-derived vector.

## Limitations

- **Caption noise.** The web-scraped captions miss spatial detail, fine-grained attributes, and counts. CLIP is famously bad at "how many?" and at small-object recognition.
- **English-centric.** Captions are mostly English; multilingual variants (M-CLIP, XLM-R-CLIP) exist but lag.
- **Weak compositional understanding.** "A red apple to the left of a green book" gets matched to "an apple and a book"; CLIP is bag-of-concepts in many regimes (Yuksekgonul et al., *When and why vision-language models behave like bags-of-words*, 2023).
- **Bias.** Inherits and often amplifies the biases of its training data. See [CV safety](../../cv/advances/safety).

## What to read next

- [Vision Transformer](./vit) — the image encoder.
- [DALL·E](./dall-e) — uses CLIP's text embeddings for image generation.
- [Vision-Language Models](../../cv/advances/vision-language) — the modern descendants.
