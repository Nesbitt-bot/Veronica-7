---
title: Image and Video Generation
order: 4
---

# Image and Video Generation

The visual-generation arc starts with **GANs that condition on text** through attention or specialised discriminators, transitions to **autoregressive Transformers over discrete image tokens**, and lands on **latent diffusion** — now the dominant paradigm for both image and video synthesis. This page surveys the landmarks.

## Text-conditional GANs: AttnGAN and DF-GAN

*AttnGAN* (Xu et al., CVPR 2018) introduced **word-level attention** between text tokens and image regions, allowing fine-grained text grounding in an otherwise standard StackGAN-style pyramid. *DF-GAN* (Tao et al., CVPR 2022) simplified the pyramid to a single-stage backbone with **deep fusion** blocks that inject text into every residual block — fewer moving parts, better quality at training time. Both predate the diffusion takeover but introduced ideas (cross-attention, deep text fusion) that survived into the new generation.

## Autoregressive token models: DALL·E

*DALL·E* (Ramesh, Pavlov et al., ICML 2021) treated text-to-image as **sequence modelling**: train a discrete VAE (dVAE) to encode 256×256 images as a 32×32 grid of 8192-way tokens, then a 12B-parameter Transformer over `[text-tokens; image-tokens]`. Sampling generates image tokens autoregressively, then dVAE decoding produces the pixel image. The result was the first credibly compositional text-to-image generator. Quality has since been overtaken by diffusion, but the autoregressive-tokens recipe re-emerged in Parti, MUSE, and (with continuous tokens) modern frontier image-out LMs.

## Latent diffusion

*High-Resolution Image Synthesis with Latent Diffusion Models* (Rombach et al., CVPR 2022) — the basis of Stable Diffusion — runs the diffusion process in a learned VAE latent space rather than pixel space. The forward process

$$
q(\mathbf{z}_t \mid \mathbf{z}_0) = \mathcal{N}(\mathbf{z}_t;\, \sqrt{\bar\alpha_t}\,\mathbf{z}_0,\, (1-\bar\alpha_t)\mathbf{I})
$$

is reversed by a U-Net trained with the simplified score-matching loss. Conditioning (text, layout, edge maps) enters via cross-attention. Operating in a 4–8× downsampled latent reduces compute by 100–1000× over pixel-space diffusion at comparable quality, making it possible to release open-weights models on consumer GPUs.

## Subject-driven personalisation: DreamBooth

*DreamBooth* (Ruiz et al., CVPR 2023) fine-tunes a pretrained text-to-image diffusion model on 3–5 photos of a specific subject, binding it to a rare token like `[V]`. The trick is the **prior-preservation loss**: regenerate samples of the subject's class with the original model and include them in fine-tuning so the model doesn't collapse onto the new images. The result is a diffusion model that can place "your dog" in arbitrary contexts. DreamBooth and its lower-cost cousins (LoRA, Textual Inversion) are the basis of every personalisation product.

## Video: Sora and Wan

*Sora* (OpenAI, 2024) extends latent diffusion to video by **encoding video as spacetime patches** in a learned latent and running a Diffusion Transformer (DiT) over them. Variable resolution and duration are handled natively. The system produces minute-long, coherent video from text prompts and demonstrates emergent simulation of physical interactions — though it also hallucinates physics whenever the prompt drifts off-distribution.

*Wan 2.1* (Alibaba, 2025) is the strongest open-weights video generator at the time of writing: a 14B-parameter DiT, with a 3D causal VAE for spatial-temporal compression and explicit support for image-to-video, video-to-video, and editing. Wan demonstrates that the open ecosystem can match closed-source quality at this generation.

## Reading list

- *AttnGAN: Fine-Grained Text to Image Generation with Attentional Generative Adversarial Networks* — Xu et al., CVPR 2018.
- *DF-GAN: A Simple and Effective Baseline for Text-to-Image Synthesis* — Tao, Tang, Wu, Jing, Bao, Xu, CVPR 2022.
- *Zero-Shot Text-to-Image Generation* — Ramesh, Pavlov, Goh, Gray, Voss, Radford, Chen, Sutskever, ICML 2021 (DALL·E).
- *High-Resolution Image Synthesis with Latent Diffusion Models* — Rombach, Blattmann, Lorenz, Esser, Ommer, CVPR 2022 (Stable Diffusion).
- *DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation* — Ruiz et al., CVPR 2023.
- *Video generation models as world simulators* — OpenAI Sora technical report, 2024.
- *Wan: Open and Advanced Large-Scale Video Generative Models* — Wan Team, Alibaba, 2025.

## What to read next

- [Neural Rendering](./neural-rendering) — explicit 3D-from-images, complementary to generative video.
- [Vision-Language Models](./vision-language) — the encoders that supply text conditioning.
- [Representation Learning](./representation) — the self-supervised pretraining that backs many generators.
