---
title: DDPM & Score-Based Models
order: 1
---

# DDPM & Score-Based Models

*Denoising Diffusion Probabilistic Models* (Ho, Jain, Abbeel, NeurIPS 2020) and *Score-Based Generative Modeling through Stochastic Differential Equations* (Song et al., ICLR 2021) crystallised **diffusion** as a generative paradigm. The two papers showed, from independent angles, that learning to denoise images at multiple noise scales produces a generative model that beats GANs on quality and likelihood. Diffusion took two years to take over image generation and is now the dominant paradigm for images, video, and (increasingly) other modalities.

## The forward process

Define a fixed Markov chain that adds Gaussian noise to a clean image $\mathbf{x}_0$ over $T$ steps:

$$
q(\mathbf{x}_t \mid \mathbf{x}_{t-1}) \;=\; \mathcal{N}\!\left(\mathbf{x}_t;\; \sqrt{1 - \beta_t}\, \mathbf{x}_{t-1},\; \beta_t I \right).
$$

With a small noise schedule $\beta_t$, after $T \approx 1000$ steps the data has been effectively destroyed: $q(\mathbf{x}_T \mid \mathbf{x}_0) \approx \mathcal{N}(\mathbf{0}, I)$. The forward process is **non-trainable** — it has no learnable parameters.

A useful identity: thanks to the Gaussian closure of the chain,

$$
q(\mathbf{x}_t \mid \mathbf{x}_0) \;=\; \mathcal{N}\!\left(\mathbf{x}_t;\; \sqrt{\bar{\alpha}_t}\, \mathbf{x}_0,\; (1 - \bar{\alpha}_t) I \right), \qquad \bar{\alpha}_t = \prod_{s=1}^t (1 - \beta_s).
$$

You can sample $\mathbf{x}_t$ in one step from $\mathbf{x}_0$ — no need to iterate the chain at training time.

## The reverse process

To sample, learn $p_\theta(\mathbf{x}_{t-1} \mid \mathbf{x}_t)$ — the reverse Markov chain. Ho et al. parameterise it as a Gaussian whose mean is predicted by a network:

$$
p_\theta(\mathbf{x}_{t-1} \mid \mathbf{x}_t) \;=\; \mathcal{N}\bigl(\mathbf{x}_{t-1};\; \boldsymbol{\mu}_\theta(\mathbf{x}_t, t),\; \sigma_t^2 I \bigr).
$$

The variance is fixed; the mean is learned. Sample by starting from $\mathbf{x}_T \sim \mathcal{N}(\mathbf{0}, I)$ and iteratively denoising.

## The simplified loss

The training objective derives from the variational bound on $\log p_\theta(\mathbf{x}_0)$, but Ho et al. found a much simpler equivalent: train the network to predict the **noise** $\boldsymbol{\epsilon}$ that produced $\mathbf{x}_t$:

$$
\mathcal{L}_\text{simple} \;=\; \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}, t}\!\left[ \| \boldsymbol{\epsilon} - \boldsymbol{\epsilon}_\theta(\sqrt{\bar{\alpha}_t} \mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t} \boldsymbol{\epsilon},\; t) \|^2 \right].
$$

A weighted MSE on noise prediction. This is the loss every modern diffusion model uses (with various weighting schemes).

## Why this works: score matching

Song et al.'s independent line of work cast diffusion as **score-based generative modelling**. The score is $\nabla_{\mathbf{x}_t} \log q(\mathbf{x}_t)$ — the direction in which density increases. A noise-prediction network is, up to a scaling factor, a score estimator:

$$
\nabla_{\mathbf{x}_t} \log q(\mathbf{x}_t) \;\approx\; -\frac{\boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t)}{\sqrt{1 - \bar{\alpha}_t}}.
$$

Sampling is then equivalent to running **Langevin dynamics** along the learned score. The connection unifies DDPM with the contemporaneous *NCSN* (Song & Ermon, 2019) and gives diffusion a clean foundation in stochastic-differential-equation theory.

The continuous-time view (Song et al., 2021) parameterises the forward process as an SDE; the reverse-time SDE has a clean form involving the score. ODE-based deterministic sampling (DDIM, Song et al., 2021) follows from this view and gives much faster sampling.

## Architecture

The denoising network is typically a **U-Net** (Ronneberger et al., 2015) with:

- Convolutional blocks at multiple resolutions.
- Self-attention at lower resolutions to capture global structure.
- Time-step embedding (sinusoidal + MLP) injected via FiLM-style modulation into every block.

Modern systems use Diffusion Transformers (DiT) — pure Transformers operating on patch tokens — for higher quality at scale.

## Why diffusion beat GANs

Three structural advantages:

- **Stable training.** No min-max game; just MSE on noise. Mode collapse and saturation are non-issues.
- **High sample diversity.** Multi-step generation explores the data distribution rather than collapsing to a few modes.
- **Tractable likelihood / coverage.** The variational bound gives a principled likelihood; samples cover the data distribution rather than concentrating on a few high-density regions.

The downside: 50–1000 forward passes per sample (vs GAN's one). DDIM, distillation (Salimans, Ho 2022), consistency models (Song et al., 2023), and rectified flow have steadily reduced this cost.

## What diffusion enabled

- **Photorealistic text-to-image.** [DALL·E 2, Imagen](./dall-e-2-imagen), Stable Diffusion ([latent diffusion](./latent-diffusion)).
- **Video generation.** [Sora](../2024/sora), Wan, Runway.
- **3D generation.** Diffusion priors over neural fields, Gaussian splats, or meshes.
- **Audio, molecules, protein structures.** Same mathematical machinery, different data.

DDPM is to modern generative AI what AlexNet was to vision: the proof of concept that triggered everything else.

## What to read next

- [Latent Diffusion](./latent-diffusion) — diffusion in a learned compressed space.
- [Classifier-Free Guidance](./cfg) — the conditioning trick.
- [DALL·E 2 / Imagen](./dall-e-2-imagen) — text-to-image diffusion at frontier scale.
