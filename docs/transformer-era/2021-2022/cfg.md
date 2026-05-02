---
title: Classifier-Free Guidance
order: 2
---

# Classifier-Free Guidance

*Classifier-Free Diffusion Guidance* (Ho, Salimans, NeurIPS-W 2021) is the technique that made conditional [diffusion](./ddpm) actually work for text-to-image. Every modern diffusion-based generator — Stable Diffusion, DALL·E 2, Imagen, Sora — uses CFG. The idea is two pages of math but its practical impact is hard to overstate: without CFG, text-conditioned diffusion produces blurry, prompt-ignoring outputs.

## The conditioning problem

A conditional diffusion model wants to sample from $p(\mathbf{x} \mid \mathbf{c})$ — the distribution of images $\mathbf{x}$ given a condition $\mathbf{c}$ (text caption, class label, image features). The naive approach is to train $\boldsymbol{\epsilon}_\theta(\mathbf{x}_t, \mathbf{c}, t)$ as a conditional noise predictor and sample from it.

This works but produces samples that **insufficiently respect the condition**. Naive conditional diffusion follows the data distribution faithfully, including the parts of the conditional that don't strongly depend on $\mathbf{c}$. Samples are diverse but often off-prompt.

## Classifier guidance

The first fix, *classifier guidance* (Dhariwal & Nichol, NeurIPS 2021), used Bayes' rule:

$$
\nabla \log p(\mathbf{x} \mid \mathbf{c}) \;=\; \nabla \log p(\mathbf{x}) + \nabla \log p(\mathbf{c} \mid \mathbf{x}).
$$

Train an unconditional diffusion model and a separate **noise-aware classifier** $p_\phi(\mathbf{c} \mid \mathbf{x}_t)$. At sampling time, perturb the score:

$$
\boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t) \leftarrow \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t) - s \sigma_t \nabla_{\mathbf{x}_t} \log p_\phi(\mathbf{c} \mid \mathbf{x}_t).
$$

The guidance scale $s > 1$ amplifies adherence to $\mathbf{c}$. This works for class-conditioned ImageNet diffusion but requires training a separate classifier on noisy data — a brittle pipeline.

## Classifier-free guidance

Ho and Salimans realised the classifier could be derived implicitly:

$$
\nabla \log p(\mathbf{c} \mid \mathbf{x}) \;=\; \nabla \log p(\mathbf{x} \mid \mathbf{c}) - \nabla \log p(\mathbf{x}).
$$

Train a **single network** that predicts noise both with and without the condition (achieved by randomly dropping the condition during training, ~10–20% of the time). At sampling time, combine the two predictions:

$$
\tilde{\boldsymbol{\epsilon}}(\mathbf{x}_t, \mathbf{c}, t) \;=\; (1 + w)\, \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, \mathbf{c}, t) - w\, \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, \emptyset, t).
$$

The CFG scale $w$ controls how much extra "push" the conditioning gets:

- $w = 0$ — pure conditional sampling, no boost.
- $w \approx 5$–$15$ — typical text-to-image regime; samples are sharp and prompt-adherent.
- $w \to \infty$ — sample collapses to the highest-likelihood mode, often producing oversaturated, nonsensical images.

## Why CFG works so well

Mathematically, CFG implements a form of **importance reweighting** that emphasises image regions where the conditional density is high relative to the unconditional. Practically:

- **Single network** — no separate classifier to train.
- **Sharp outputs** — high $w$ produces images that strongly match the prompt.
- **Trade-off knob** — $w$ at inference time trades sample diversity for prompt adherence. Run the same prompt at $w = 1$ and $w = 10$ to see the trade-off in action.

The cost: **two forward passes per denoising step** (one with condition, one without). Modern systems batch the two for efficient inference.

## Negative prompts

CFG generalises naturally to **negative prompts** — content the user wants the model to avoid. Replace the unconditional pass with a pass conditioned on a *negative* prompt $\mathbf{c}^-$:

$$
\tilde{\boldsymbol{\epsilon}}(\mathbf{x}_t, \mathbf{c}, \mathbf{c}^-, t) \;=\; (1 + w)\, \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, \mathbf{c}, t) - w\, \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, \mathbf{c}^-, t).
$$

The model is pushed toward $\mathbf{c}$ and *away from* $\mathbf{c}^-$. Stable Diffusion's "negative prompt" feature is exactly this. Common negative prompts: "blurry, low quality, watermark, deformed".

## Limitations and follow-ups

- **Computational cost.** Two forward passes per step. Distillation work (Meng et al., 2022) compresses CFG into a single pass.
- **Saturation at high $w$.** Pushes outputs toward unrealistic over-saturation; modern guidance variants (rescaled guidance, dynamic thresholding) address this.
- **Doesn't always help text** — classifier-free guidance helps less in language modelling, where the analogous "guided sampling" is replaced by [RLHF](../2022/rlhf) or rejection sampling.

## What CFG is for, today

CFG is now a default ingredient of every text-to-image and text-to-video diffusion system. Its conceptual descendants include:

- **Image-conditional guidance** — guide on a reference image as well as text.
- **Multi-condition guidance** — combine several conditions with weighted CFG.
- **Inversion + guidance for editing** — inject CFG during DDIM inversion to edit existing images.

A two-page paper that became a load-bearing piece of every modern generative-image stack.

## What to read next

- [DDPM & Score-Based Models](./ddpm) — the underlying generative paradigm.
- [Latent Diffusion](./latent-diffusion) — CFG in latent space, the Stable Diffusion recipe.
- [DALL·E 2 / Imagen](./dall-e-2-imagen) — frontier T2I systems built on CFG.
