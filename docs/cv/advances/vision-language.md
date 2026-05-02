---
title: Vision-Language Models
order: 2
---

# Vision-Language Models

A vision-language model (VLM) couples an image encoder with a language model so that one can talk to the other. The track from the CV side mirrors the [LLM multimodal](../../llm/applications/multimodal) page but emphasises the **vision tower** evolution: contrastive pretraining, then few-shot conditioning, then bootstrapped captioner-encoder pairs, then fully merged decoder-only frontier systems.

## CLIP — contrastive image–text pretraining

*Learning Transferable Visual Models From Natural Language Supervision* (Radford et al., ICML 2021) trained an image and a text encoder on 400M (image, caption) pairs with a symmetric InfoNCE loss. Zero-shot ImageNet matched a fully supervised ResNet-50. CLIP's image tower is the de-facto vision encoder for almost every later VLM.

## Flamingo — frozen LM with cross-attention

*Flamingo: a Visual Language Model for Few-Shot Learning* (Alayrac et al., NeurIPS 2022) keeps a large LM frozen and inserts **gated cross-attention** layers that attend to image features from a frozen vision encoder. The model accepts arbitrarily interleaved images and text and supports in-context few-shot learning over visual tasks (VQA, captioning, OCR) without per-task fine-tuning. Flamingo was the first proof that the LM can stay completely frozen while gaining vision.

## BLIP-1 / BLIP-2 — captioner–filter and Q-Former

*BLIP* (Li et al., ICML 2022) introduced a captioner-filter loop that bootstraps clean (image, caption) data from web-scale noisy corpora. *BLIP-2* (Li et al., 2023) bridges a frozen image encoder and a frozen LLM with a small **Q-Former** — a learned set of query tokens that pull a fixed-size visual summary from the encoder and feed it to the LLM. Q-Former is the engineering insight: most of the parameter count stays frozen, only ~100M parameters are trained.

## LLaVA-1.5 — open-source instruction tuning

*Improved Baselines with Visual Instruction Tuning* (Liu, Li, Li, Lee, NeurIPS 2023, "LLaVA-1.5") simplified BLIP-2's bridge to an MLP projection and showed that a Vicuna-13B + CLIP backbone with a two-stage training recipe (alignment, then visual-instruction tuning on GPT-4-generated data) closes much of the gap to GPT-4V at a fraction of the budget. It is the canonical open-source VLM recipe.

## Frontier: Gemini, Molmo, ReVisionLLM

*Gemini 1.5* (Google, 2024) is **natively multimodal** — text, image, audio, and video share the same Transformer from the start, with a 1M–10M token context window. *Molmo* (Allen AI, 2024) is the strongest fully-open VLM at its scale, trained on a tightly curated PixMo dataset of human-collected pointing and description data, and is competitive with proprietary VLMs on document and pointing benchmarks. *ReVisionLLM* (Hannan et al., 2024) targets **hour-long video** with a hierarchical temporal sampler that scales VLM context far beyond the LLaVA frame budget.

## Reading list

- *Learning Transferable Visual Models From Natural Language Supervision* — Radford et al., ICML 2021 (CLIP).
- *Flamingo: a Visual Language Model for Few-Shot Learning* — Alayrac et al., NeurIPS 2022.
- *BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models* — Li, Li, Savarese, Hoi, ICML 2023.
- *Improved Baselines with Visual Instruction Tuning* — Liu, Li, Li, Lee, NeurIPS 2023 (LLaVA-1.5).
- *Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context* — Google DeepMind tech report, 2024.
- *Molmo and PixMo: Open Weights and Open Data for State-of-the-Art Multimodal Models* — Deitke et al., Allen AI, 2024.
- *ReVisionLLM: Recursive Vision-Language Model for Temporal Grounding in Hour-Long Videos* — Hannan et al., 2024.

## What to read next

- [LLM · Multi-Modal LLMs](../../llm/applications/multimodal) — the same story from the language side.
- [Open-Vocabulary Detection](./open-vocab) — text-grounded localisation built on these encoders.
- [Representation Learning](./representation) — the pre-CLIP/post-DINO strand of pretraining.
