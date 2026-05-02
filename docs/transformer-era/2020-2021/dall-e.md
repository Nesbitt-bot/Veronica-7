---
title: DALL·E 1
order: 3
---

# DALL·E 1

*Zero-Shot Text-to-Image Generation* (Ramesh, Pavlov, Goh, Gray, Voss, Radford, Chen, Sutskever, ICML 2021) introduced **DALL·E** — a 12B-parameter Transformer that generated images from text prompts by treating images as sequences of discrete visual tokens. It was the first credibly compositional text-to-image system, the proof-of-concept that *autoregressive Transformers can do image generation*, and the inspiration for the explosion of generative-image work that followed.

## The two-stage recipe

DALL·E is a clean cascade:

**Stage 1 — discrete VAE (dVAE).** Train a VAE that encodes a 256×256 image as a 32×32 grid of discrete tokens from an 8192-entry codebook. Each grid cell is one of 8192 codes. The decoder maps these 1024 tokens back to a 256×256 RGB image.

**Stage 2 — autoregressive Transformer.** Train a 12B-parameter Transformer on the concatenation of tokenised text (up to 256 BPE tokens) and tokenised image (1024 image tokens). The Transformer learns the joint distribution over `[text-tokens; image-tokens]` and samples auto-regressively.

At inference: encode the text prompt, sample image tokens one by one from the Transformer, decode them through the dVAE.

## Why this works

The decomposition matters. Direct pixel-level autoregressive generation (Image GPT, Chen et al. 2020) was prohibitively expensive at high resolution. The dVAE's compression — 256×256 → 32×32 token grid — makes the autoregressive image-modeling tractable: 1024 tokens is the same scale as a long sentence, not a million pixels.

This **tokenize-then-Transformer** recipe became the template for almost every later generative-image and -video model that wasn't pure diffusion: VQ-VAE-2, Parti, MUSE, the image-output side of Gemini, the patches-to-tokens framing of Sora.

## What DALL·E demonstrated

The capabilities surprised everyone in early 2021:

- **Compositional control** — "an armchair in the shape of an avocado" (the canonical demo image) made the rounds because it was novel: the model handled a property + object + analogy combination that no training image could have shown directly.
- **Zero-shot rendering of unusual concepts** — "a snail made of harp", "a baby daikon radish in a tutu walking a dog".
- **Style transfer** — `"in the style of {artist}"` worked for a wide range of styles seen during training.
- **Multi-object scenes** with rough spatial control via prompt phrasing.

The headline images were *cherry-picked from many samples* — DALL·E had a high failure rate, and reranking outputs with [CLIP](./clip) was used to filter the best ones.

## Limitations

DALL·E 1's failure modes are now familiar:

- **Counts** — "five apples" reliably produced a different number.
- **Spatial relations** — "to the left of", "above" were unreliable.
- **Text rendering** — words inside images came out as gibberish.
- **Photorealism** — outputs looked synthetic; not until DALL·E 2 (and contemporaries) did photorealism arrive.

The 1024-token bottleneck also limited resolution; upscaling networks improved this in DALL·E 2.

## How it stacks up against diffusion

DALL·E 1 was contemporaneous with **GLIDE** (Nichol et al., 2021), an early text-conditional diffusion model from the same OpenAI group. GLIDE's photorealism was substantially better than DALL·E 1's — and within a year, DALL·E 2 (Apr 2022) abandoned the autoregressive recipe in favour of a CLIP-conditioned diffusion model. By 2023 most production text-to-image systems were diffusion-based.

But the autoregressive approach didn't die. Parti (Google, 2022) and MUSE (Google, 2023) showed scaling pure autoregressive image modeling to 20B parameters matched or beat contemporary diffusion. The image-output side of Gemini and similar frontier multimodal models has more in common with DALL·E 1 than with Stable Diffusion.

## Conceptual significance

DALL·E 1 was the moment text-to-image stopped being a research toy. It was also the proof that **autoregressive Transformers generalise across modalities**: same architecture, same training recipe (next-token prediction), different tokeniser. This conceptual unification — "everything is a token" — is what makes modern foundation models possible. Image, audio, and video models that emerged in 2024–25 (frontier multimodal LMs that can both consume and produce images) are direct descendants of DALL·E 1's framing.

## What to read next

- [VAE](../../dnn/generative/vae) — the VQ-VAE that supplies image tokens.
- [DALL·E 2 / Imagen](../2021-2022/dall-e-2-imagen) — the diffusion successor.
- [Image and Video Generation](../../cv/advances/generation) — the broader generative-image story.
