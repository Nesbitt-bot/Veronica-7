---
title: Latent Diffusion / Stable Diffusion
order: 3
---

# Latent Diffusion / Stable Diffusion

*High-Resolution Image Synthesis with Latent Diffusion Models* (Rombach, Blattmann, Lorenz, Esser, Ommer, CVPR 2022) showed that running [diffusion](./ddpm) in a learned compressed latent space — instead of pixel space — drops compute by 1–2 orders of magnitude with no quality loss. The released open weights, branded as **Stable Diffusion**, made high-quality text-to-image generation practical on consumer GPUs and triggered the open-source generative-AI explosion.

## The two-stage architecture

Latent diffusion is a clean factorisation:

**Stage 1 — perceptual compression.** Train a VAE-style autoencoder $(E, D)$ that maps images $\mathbf{x} \in \mathbb{R}^{3 \times H \times W}$ to a compact latent $\mathbf{z} = E(\mathbf{x}) \in \mathbb{R}^{C \times h \times w}$ with a downsampling factor of typically 4× or 8×. The autoencoder is trained with reconstruction + perceptual + small KL loss to give a near-lossless compressed representation that ignores high-frequency noise.

**Stage 2 — diffusion in latent space.** Train a diffusion U-Net (or DiT) on the latent distribution. The denoising model never sees raw pixels — it operates on $\mathbf{z}$.

Sampling: run the diffusion process in latent space to produce $\mathbf{z}_0$, then decode with $D(\mathbf{z}_0)$ to recover the image.

## Why this works

Pixel-space diffusion at 512×512 needs to denoise 786,432 values per step. Latent-space diffusion at 8× downsampling needs 12,288 — **64× less compute** for the U-Net forward pass at every step, with negligible quality cost.

The key empirical observation: **most of the visual information** is in the low-frequency structure that the autoencoder preserves; the high-frequency detail the autoencoder drops is largely noise the diffusion model would have to learn to discard anyway. Compressing first lets the diffusion model spend capacity on what matters.

This trick is the single biggest contributor to making text-to-image diffusion runnable on consumer GPUs. Without it, diffusion would have remained a frontier-research-lab phenomenon.

## Cross-attention for text conditioning

The U-Net has **cross-attention layers** that attend to text embeddings (CLIP text encoder in the original; T5-XXL in later work like SDXL/SD3). Text tokens act as keys and values; image latent positions are the queries. This injects fine-grained text conditioning at every spatial location.

Combined with [classifier-free guidance](./cfg), cross-attention conditioning gives strong prompt adherence with controllable strength.

## The release

Stability AI released Stable Diffusion 1.4 in August 2022 with **open weights** under a permissive licence. The model:

- Trained on LAION-5B, the open replica of CLIP's training corpus.
- Required only ~10GB VRAM at fp16 — runs on a consumer RTX card.
- Was trivially fine-tunable, hackable, and re-mixable.

Within weeks, Stable Diffusion had spawned a community-driven ecosystem of fine-tunes, LoRAs, ControlNets, samplers, and creative-tool integrations that no closed-source model has matched. Civitai, AUTOMATIC1111, ComfyUI — all built on Stable Diffusion's open weights.

## Successors and variants

The Stable Diffusion line evolved:

- **SD 2.0 / 2.1** — switched text encoder to OpenCLIP, retrained on different data filters.
- **SDXL** (2023) — bigger U-Net, 1024×1024 native resolution, two text encoders for conditioning richness.
- **SD3** (2024) — Diffusion Transformer (DiT) architecture, multiple conditioning streams, rectified-flow training. The first SD-line model to abandon the U-Net.

External models took the same recipe further: **DALL·E 3** (closed), **Imagen 3**, **Midjourney v6**, **FLUX**. All operate in latent space; the formula is universal.

## Beyond images

The latent-space diffusion recipe generalises:

- **Video** — operate on a 3D latent (spacetime patches). [Sora](../2024/sora), Wan, Movie Gen.
- **Audio** — VAE-compressed spectrograms with diffusion on top.
- **3D / NeRF / Gaussian splats** — diffuse over neural-field parameters or splat representations.

The conceptual recipe — **compress to a perceptual latent, run diffusion there** — is now standard across modalities. It is one of the architectural decisions that defines the modern generative AI stack.

## What to read next

- [DDPM & Score-Based Models](./ddpm) — the diffusion paradigm.
- [Classifier-Free Guidance](./cfg) — the conditioning trick.
- [Image and Video Generation](../../cv/advances/generation) — the broader generative-image landscape.
