---
title: Video Generation — Sora, Veo, Wan
order: 5
---

# Video Generation — Sora, Veo, Wan

The 2024-2025 wave of frontier video-generation systems — OpenAI's [Sora](../2024/sora), Google's **Veo**, **Veo 2**, **Veo 3**, Alibaba's open-weights **Wan**, plus competitors like Runway Gen-3, Kling, Hailuo, Hunyuan Video — moved generative video from "research demo" to "shipping product". By mid-2025, sub-minute photorealistic video from text prompts was a paid consumer feature across multiple platforms. This page summarises the post-Sora generation; for the architectural baseline see [Sora](../2024/sora).

## Veo line — Google

Google's video-generation answer to Sora:

- **Veo 1** (May 2024) — announced shortly after Sora, with comparable demos. 1080p, up to 1 minute.
- **Veo 2** (December 2024) — substantial quality and physics improvement. Available in Gemini and Vertex AI.
- **Veo 3** (May 2025) — adds **synchronised audio** generation. The model produces video and audio (dialogue, music, ambient) jointly, eliminating the previous gap where video models needed a separate audio pipeline.

Veo's architectural lineage matches Sora's: latent-space DiT operating on spacetime patches. Google's training-data advantage (YouTube) gives Veo a recognisable strength on real-world physical scenes. Veo 3's joint audio-video generation was a practical headline — the first frontier video model with built-in soundtracks.

## Wan — open-weights frontier

**Wan 2.1** (February 2025) and **Wan 2.2** (mid-2025), released by Alibaba's Wan-AI team, are the strongest open-weights video models. Architecture:

- 14B-parameter Diffusion Transformer.
- 3D causal VAE for spacetime-patch latent compression.
- Native support for image-to-video, video-to-video, video editing, plus pure text-to-video.
- Apache 2.0 licence — fully open including weights and code.

Wan 2.1's release was a Sora moment for the open-source community: 14B parameters runnable on a high-end consumer GPU (with quantisation), generating 480p-720p video at quality competitive with paid closed-source services. By mid-2025 the Wan ecosystem had spawned a community of LoRA fine-tunes, control adapters, and pipeline integrations comparable to Stable Diffusion's image-side ecosystem from 2022-2023.

## Other 2024-2025 systems

The video-generation market is unusually crowded:

- **Runway Gen-3** (June 2024) — strong cinematographic style, the favourite of professional creatives at launch.
- **Kling** (Kuaishou, June 2024) and **Kling 1.5 / 2.0** — Chinese leader, frequently top-rated on user comparisons.
- **Hailuo** (MiniMax) — strong stylised content.
- **Hunyuan Video** (Tencent, Dec 2024) — open-weights competitor to Wan, ~13B parameters.
- **Luma Dream Machine** (June 2024) — competitive consumer-facing product.
- **Pika** — long-running competitor, repositioning around editing rather than pure generation.
- **LTX Video** (Lightricks) — fast, real-time-ish generation at lower quality.

By mid-2025 there were ~20 viable video-generation systems. Compare to the image-generation market in 2022 (4-5 viable systems) — the video market in 2025 is at a similar phase of broad accessibility but pre-consolidation.

## Capabilities by mid-2025

What works reliably:

- **5-30 second clips** at 720p-1080p quality from text prompts.
- **Image-to-video** — animate a still image into a short clip. Often more reliable than text-to-video.
- **Style consistency** within a single clip.
- **Camera-motion control** via prompt or explicit camera-path tooling.
- **Audio synchronisation** (Veo 3) — dialogue, sound effects, music.

What's still hard:

- **Long-form coherence.** Multi-minute outputs drift; characters change identity.
- **Editing** — making a *specific* change to an existing video without disrupting other content.
- **Physics on hard cases** — fluids, soft bodies, complex object interactions.
- **Text rendering inside video** — slowly improving but unreliable.
- **Subject persistence across cuts** — even short montages require handholding.

## Architectures: DiT-on-spacetime is universal

Every frontier system uses some variant of:

- VAE compression to a spacetime latent.
- Diffusion Transformer (DiT) on patch tokens.
- T5 or CLIP text encoder for conditioning.
- Classifier-free guidance.
- Multi-stage training (image, image + low-res video, full-res video).

Architectural diversity has *decreased* compared to image generation — the DiT-on-spacetime template won decisively. What differs is data, scale, and post-training.

## What this enables

- **Stock-video replacement.** Many B-roll, advertising, and social-media use cases that previously required filming or stock licensing now use generated video.
- **Low-budget creative production.** Indie filmmakers, music-video creators, content creators using these tools as part of their pipeline.
- **Rapid prototyping** of cinematography and shot framing before live shoots.
- **Provenance and safety concerns** — deepfakes, misinformation, non-consensual intimate imagery. Watermarking, detection APIs, and platform-side moderation are catching up.

## What to read next

- [Sora](../2024/sora) — the architectural ancestor.
- [Latent Diffusion](../2021-2022/latent-diffusion) — the recipe these scaled.
- [Image and Video Generation (CV)](../../cv/advances/generation) — broader generative-video context.
