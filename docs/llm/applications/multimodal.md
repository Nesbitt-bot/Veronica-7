---
title: Multi-Modal LLMs
order: 4
---

# Multi-Modal LLMs

A multi-modal LLM accepts non-text inputs — images, audio, video — and reasons about them in the same token stream as language. The recurring engineering question is the **fusion seam**: where does the modality become tokens? CLIP encodes the whole image to a single embedding for contrastive matching; LLaVA projects patch features into the LM's token space; NExT-GPT goes further and lets the model emit non-text outputs too.

## CLIP — contrastive image–text alignment

*Learning Transferable Visual Models From Natural Language Supervision* (Radford et al., 2021) trained an image encoder and a text encoder jointly on 400M (image, caption) pairs from the web with a symmetric InfoNCE loss:

$$
\mathcal{L} = -\frac{1}{2N} \sum_{i=1}^{N} \log \frac{\exp(\langle v_i, t_i \rangle / \tau)}{\sum_j \exp(\langle v_i, t_j \rangle / \tau)} \;+\; (\text{symmetric term over text}).
$$

The headline result was zero-shot ImageNet — by phrasing class labels as prompts ("a photo of a {label}"), CLIP matched a fully supervised ResNet-50 without seeing a single ImageNet image at training time. CLIP is not itself a generative LLM, but it is the **vision tower** that almost every later VLM borrows.

## Visual instruction tuning — LLaVA

*Visual Instruction Tuning* (Liu, Li, Wu, Lee, NeurIPS 2023) introduced **LLaVA**, the cleanest recipe for turning a frozen LLM into a VLM:

1. Take CLIP's image encoder and a Vicuna LLM, both frozen.
2. Train a small **MLP projection** that maps CLIP image features into the LLM's embedding space (so an image becomes a sequence of "visual tokens").
3. Fine-tune on GPT-4-generated visual instruction data (descriptions, conversations, complex reasoning over images).

The projection layer is the only new part during stage 1; stage 2 unfreezes the LM. This factorisation made VLM research cheap to iterate on, and the LLaVA recipe is still the dominant pattern.

## NExT-GPT — any-to-any modality

*NExT-GPT* (Wu, Fei, Qu, Ji, Chua, ICML 2024) extends the LLaVA idea in *both* directions. On the input side, encoders for image, audio, and video each project into the LLM. On the output side, the LLM emits **modality-specific signal tokens** that get decoded by frozen Stable Diffusion / AudioLDM / video diffusion heads. With only ~1% of total parameters trainable (the projection layers and a handful of tokens), the model handles any-to-any conversion. The contribution is the diffusion-decoder coupling — generation, not just understanding.

## Object hallucination in VLMs

VLMs hallucinate objects that are not in the image, and standard captioning metrics (BLEU, CIDEr) miss this. *Evaluating Object Hallucination in Large Vision-Language Models* (Li et al., EMNLP 2023) introduced **POPE**, a polling-based protocol: ask the model "Is there a {object} in the image?" for both present and absent objects and measure F1. POPE revealed that even strong VLMs answer "yes" too often, especially for objects that *co-occur* frequently with what is actually in the image — language priors leaking into visual perception. The diagnosis links VLM safety to broader [hallucination](../factuality/hallucination) work.

## Reading list

- *Learning Transferable Visual Models From Natural Language Supervision* — Radford et al., ICML 2021 (CLIP).
- *Visual Instruction Tuning* — Liu, Li, Wu, Lee, NeurIPS 2023 (LLaVA).
- *NExT-GPT: Any-to-Any Multimodal LLM* — Wu, Fei, Qu, Ji, Chua, ICML 2024.
- *Evaluating Object Hallucination in Large Vision-Language Models* — Li, Du, Zhou, Wang, Zhao, Wen, EMNLP 2023 (POPE).

## What to read next

- [Hallucination & Mitigations](../factuality/hallucination) — the language-only counterpart to VLM object hallucination.
- [Vision-Language (CV)](../../cv/advances/vision-language) — VLM landscape from the computer-vision side.
- [Architectures](../other/architectures) — modality-specific routing (e.g. MoE) used in some recent VLMs.
