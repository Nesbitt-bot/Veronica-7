---
title: Sora — Video Generation
order: 5
---

# Sora — Video Generation

OpenAI announced **Sora** on February 15, 2024 with a set of demo videos that crossed a quality threshold — minute-long, coherent, physics-respecting (mostly), high-resolution video from text prompts. Sora was 12 months ahead of the open-source video-generation field at announcement, and along with Google's Veo, established **diffusion-on-spacetime-patches** as the dominant video-generation architecture. Sora was released to the public as a product in December 2024.

## The architecture

Sora's technical report (OpenAI, *Video generation models as world simulators*, 2024) sketched the architecture without giving specifics:

- **Spacetime patches.** Encode video as a 3D grid of patches (spatial × temporal). Each patch becomes a token. A 1-minute 1080p video produces tens of thousands of tokens.
- **Diffusion Transformer (DiT).** Apply diffusion in the patch-token space, with a Transformer (not a U-Net) as the denoiser. This is the same architecture as Stable Diffusion 3 — DiT scaled to spacetime.
- **Variable resolution and duration.** The patch tokenisation handles arbitrary aspect ratios and lengths natively. Sora can train and generate at 1024×1024, 1920×1080, 240p — same model.
- **VAE compression.** A spacetime VAE compresses raw video into a smaller latent that the diffusion model operates on, like [latent diffusion](../2021-2022/latent-diffusion).

Training data is "internet-scale video" — proprietary, not disclosed in detail.

## What Sora demonstrated

The launch demos showed:

- **Minute-long coherent video** from short text prompts.
- **Object permanence** — characters and objects persisted across frames, not flickering or morphing as much as previous video models.
- **Camera-motion realism** — pans, zooms, perspective shifts that felt cinematographically plausible.
- **Some physics** — water, fire, cloth, hair, soft-body interactions reasonable in many cases.
- **Specific failure modes** — limbs occasionally swapped, objects appearing or disappearing, text-on-objects illegible.

The framing in the OpenAI report: Sora is a *world simulator*. Train a generative model on enough video, and it implicitly learns physics and object permanence. The framing was contested — "world simulator" implies more causal understanding than the model demonstrably had, and the failure modes betray a model that's still doing pattern-matching over visual sequences.

But as an *image-and-video-quality discontinuity*, Sora was real. Previous video models (Runway Gen-2, Pika, Stable Video Diffusion) topped out at 4-6 second clips with significant flicker. Sora's demos were minute-long with no apparent flicker.

## The 2024 video-generation race

Sora's announcement triggered a rush of comparable systems:

- **Runway Gen-3** (June 2024) — substantial leap over Gen-2; closer to Sora-quality.
- **Kling** (Kuaishou, June 2024) — comparable quality, available in China earlier than Sora outside.
- **Luma Dream Machine** (June 2024) — competitive consumer-facing product.
- **Hailuo** (MiniMax, late 2024) — strong on stylised content.
- **Veo / Veo 2 / Veo 3** (Google, May 2024 / Dec 2024 / mid-2025) — Google's frontier video line.
- **Wan 2.1** (Alibaba, early 2025) — strongest **open-weights** video model.

By the end of 2024, several systems matched Sora's launch quality, though Sora retained a lead on prompt adherence and longer durations.

## Sora's release (December 2024)

Sora launched as a product on December 9, 2024, available to ChatGPT Plus and Pro subscribers. The release included:

- **Sora Turbo** — a faster, lower-cost version of the model.
- **Multiple aspect ratios and resolutions.** Up to 1080p, up to 20 seconds for Plus / 1080p, 20 seconds for Pro tier.
- **Storyboarding interface** — sequence multiple shots into a continuous video.
- **Editing primitives** — extend, blend, remix existing videos.

The product launch was less of a discontinuity than the announcement — competitors had caught up — but Sora's tools and integration with ChatGPT made it a serious creative product.

## What Sora established

- **DiT on spacetime patches** as the dominant video architecture. Almost every later video model uses some variant.
- **Diffusion-based video at minute-plus duration** as feasible.
- **Variable-resolution training** — the same model handles different aspect ratios and lengths, useful for product flexibility.
- **The "world simulator" framing** — contested but useful as a way of articulating long-horizon coherence.

## Limitations that remained

- **Physics is still pattern-matching.** Counter-intuitive interactions (objects passing through each other, gravity inversions) are common.
- **Long-horizon coherence is fragile.** Multi-minute outputs drift; characters change identity.
- **Compute is enormous.** Sora's training and inference cost is unprecedented; this is the most expensive generative-AI category.
- **Provenance and safety.** Video deepfakes are now plausible at unprecedented quality; Sora's release was paired with watermarking and detection-API offerings.

## What to read next

- [Latent Diffusion](../2021-2022/latent-diffusion) — the architectural ancestor.
- [DDPM](../2021-2022/ddpm) — the diffusion paradigm.
- [Image and Video Generation (CV)](../../cv/advances/generation) — the broader generative-video story.
