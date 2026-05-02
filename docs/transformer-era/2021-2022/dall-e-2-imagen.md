---
title: GLIDE, DALL·E 2, Imagen
order: 4
---

# GLIDE, DALL·E 2, Imagen

Three 2022 systems pushed text-to-image diffusion from "interesting research" to "this looks real": **GLIDE** (OpenAI, Dec 2021), **DALL·E 2** (OpenAI, Apr 2022), and **Imagen** (Google, May 2022). Each combined [diffusion](./ddpm) with [classifier-free guidance](./cfg) and added a key conditioning trick. Together they marked the transition from the autoregressive [DALL·E 1](../2020-2021/dall-e) era to diffusion-dominated generation.

## GLIDE — diffusion + CFG works

*GLIDE: Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models* (Nichol et al., Dec 2021) was the first text-to-image diffusion model to *visibly outperform* autoregressive systems. The recipe:

- 3.5B-parameter pixel-space U-Net.
- Cross-attention to a 1.2B Transformer text encoder.
- Classifier-free guidance at $w \approx 4$.
- 64×64 base resolution + super-resolution stages to 256×256.

Human evaluations on COCO captions preferred GLIDE outputs to DALL·E 1's ~67% of the time. GLIDE was also the demonstration that CFG was a load-bearing component — without it, samples were notably worse on prompt-adherence.

OpenAI didn't release GLIDE publicly, citing safety concerns. The technical impact came through the paper.

## DALL·E 2 — unCLIP

*Hierarchical Text-Conditional Image Generation with CLIP Latents* (Ramesh, Dhariwal, Nichol, Chu, Chen, Apr 2022) — known as **DALL·E 2** in the product release — used a clever two-stage cascade:

1. **Prior** — a diffusion model that maps from text embeddings to **CLIP image embeddings**.
2. **Decoder** — a diffusion model conditioned on the CLIP image embedding to produce the actual image.

The architecture is "**unCLIP**" — going backwards from CLIP image embeddings to images. The motivation: CLIP image embeddings already encode prompt-relevant content; conditioning the decoder on them rather than directly on text gives a cleaner separation between *what to generate* (the embedding) and *how to render it* (the decoder).

Output resolution: 1024×1024 via three diffusion stages (64×64 → 256×256 → 1024×1024). Quality was a substantial leap over DALL·E 1, and DALL·E 2's release in April 2022 was the moment text-to-image entered popular consciousness.

## Imagen — text encoder size matters

*Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding* (Saharia et al., Google, May 2022). Imagen's main finding: **scaling the text encoder matters more than scaling the diffusion model**.

Imagen used a frozen **T5-XXL** (11B-parameter encoder-decoder language model) as the text encoder, much larger than CLIP's text tower. Combined with:

- A 2B-parameter pixel-space diffusion U-Net at 64×64.
- Two diffusion super-resolution stages (256×256, 1024×1024).
- **Dynamic thresholding** — a CFG variant that prevents oversaturation at high guidance.

The Imagen paper's headline: at the same diffusion-model size, T5-XXL conditioning produces dramatically better text understanding (compositional prompts, complex spatial relations) than CLIP. Imagen also introduced **DrawBench**, a hand-crafted prompt benchmark that probed compositional understanding more aggressively than COCO.

Imagen was research-released through 2022 and subsequently productised as Google's Gemini-era image generator.

## Common ingredients

Across all three systems:

- **Diffusion + classifier-free guidance.** Universal.
- **Cascade super-resolution.** Generate at low resolution, upsample with separate diffusion stages.
- **Heavy text conditioning.** The text encoder is doing serious work; the diffusion model is mostly executing its instructions.
- **Massive private datasets.** Hundreds of millions of image-text pairs from web scrapes.

Stable Diffusion ([latent diffusion](./latent-diffusion)) — released later in 2022 — chose **operating in latent space** as its differentiator, trading some output quality for hugely lower compute and an open release.

## The end of the autoregressive-T2I era

By mid-2022 it was clear: diffusion beat autoregressive models on T2I quality at comparable compute. DALL·E 1's recipe was abandoned by its own authors. The autoregressive approach didn't die (Parti, MUSE, Gemini's image generation) but lost its claim as the obvious choice.

The diffusion-vs-autoregressive question stayed open: in 2024, frontier multimodal models with image output use a mix. The 2021–2022 wave settled the **photorealism** question in diffusion's favour but left long-tail open questions (compositionality, text rendering, controllability) that newer methods continue to address.

## What to read next

- [DDPM](./ddpm) — the underlying diffusion paradigm.
- [Classifier-Free Guidance](./cfg) — the load-bearing conditioning trick.
- [Latent Diffusion / Stable Diffusion](./latent-diffusion) — the open-source counterpart.
