---
title: Flamingo & Multimodal LMs
order: 1
---

# Flamingo & Multimodal LMs

*Flamingo: a Visual Language Model for Few-Shot Learning* (Alayrac et al., DeepMind, NeurIPS 2022) was the first vision-language model to demonstrate **convincing few-shot, in-context learning across modalities**. Show Flamingo a few example image-text pairs in the prompt, then a new image, and it would do the task. The architecture — frozen LLM, frozen vision encoder, lightweight cross-attention bridges — became the conceptual template for [LLaVA](../../cv/advances/vision-language) and most modern VLMs.

## Architecture

Three components, two frozen:

- **Frozen vision encoder** — a Normalizer-Free ResNet (NFNet) or ViT, pretrained with contrastive image-text learning (their internal counterpart of [CLIP](../2020-2021/clip)). Produces patch embeddings.
- **Perceiver Resampler** — a small cross-attention module that compresses the variable-length patch sequence into a **fixed number of visual tokens** (e.g., 64). Trainable.
- **Frozen LLM** — Chinchilla, 70B parameters at the largest scale. Text + visual tokens flow through together.
- **Gated cross-attention layers** inserted between LLM blocks. Trainable. The LLM's text representation queries the resampled visual tokens.

Frozen-LLM design lets Flamingo inherit Chinchilla's language capabilities while adding vision; only the resampler and cross-attention layers (~10B params) are trained. This is the structural bet that paid off: **add modality without retraining the language model**.

## Training data

Three data sources used jointly:

- **Image-text pairs** (LAION-style web scrapes).
- **Video-text pairs** (clip + caption datasets).
- **MultiModal Massive Web (M3W)** — 43M web pages with interleaved images and text, scraped from the open web. The interleaved format is what enables in-context multi-image prompting.

Training objective: standard autoregressive language modelling, with image and text tokens both contributing.

## What Flamingo demonstrated

The paper's signature result was **in-context VL learning** — same idea as [GPT-3](../2020/gpt-3) ICL but with images mixed in. Pass a sequence like `[image1] question: ... answer: ... [image2] question: ... answer: ... [imageN] question: ...` and read off the model's continuation.

Few-shot Flamingo matched or beat heavily fine-tuned task-specific models on ~6 of 16 benchmarks tested, including VQAv2, OK-VQA, MSRVTT-QA, and HatefulMemes. Key qualitative capabilities:

- **Visual question answering** with no per-task training data.
- **Image captioning** in arbitrary styles, controllable by prompt examples.
- **Multi-image reasoning** — comparison, counting, sequence understanding.
- **Video QA** without any video-specific pretraining.

## Why frozen-LLM mattered

Three structural advantages of the frozen-LLM approach:

- **Cheap to scale** — 70B Chinchilla stays frozen; only the bridge is trained. Fine-tuning a 70B model end-to-end is feasible but expensive; Flamingo trades that for far cheaper VL training.
- **Preserves language ability** — fine-tuning a frozen LLM jointly with vision data routinely degrades its text capabilities. Frozen-LLM avoids this entirely.
- **Modular** — the same recipe transfers when swapping LLMs or vision encoders.

The frozen-LLM template shaped the next generation: BLIP-2 used the Q-Former bridge with frozen LLM; LLaVA simplified the bridge to an MLP; almost every open-source VLM in 2023–24 was structurally a Flamingo variant.

## What Flamingo didn't have

- **Image generation** — Flamingo was input-only multimodal (consume images, produce text). Generation came later (Gemini 1.5, GPT-4o).
- **Real-time video** — though Flamingo handled short clips, true streaming video was beyond it.
- **Fine-grained spatial output** — Flamingo could describe images but not localise objects with bounding boxes (later VLMs like Kosmos-2, Florence-2, Qwen-VL do this).

## What Flamingo established

Three lasting contributions:

- **The frozen-LLM template** for adding modalities cheaply.
- **Interleaved image-text pretraining** — M3W-style data became the format for multimodal pretraining everywhere.
- **In-context learning generalises across modalities** — the GPT-3 trick works for vision, audio, video. The 2024 frontier (Gemini 1.5, GPT-4o) is structurally Flamingo-like, with everything fully trained jointly.

## What to read next

- [GPT-3](../2020/gpt-3) — the in-context-learning template Flamingo extended.
- [Multi-Modal LLMs (LLM)](../../llm/applications/multimodal) — the modern descendants.
- [Vision-Language Models (CV)](../../cv/advances/vision-language) — the same story from the vision side.
