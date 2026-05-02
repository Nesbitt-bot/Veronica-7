---
title: Variational Autoencoders
order: 2
---

# Variational Autoencoders

The Variational Autoencoder (VAE) is the probabilistic relative of the [vanilla autoencoder](./autoencoders). It learns a generative model $p_\theta(\mathbf{x}, \mathbf{z}) = p(\mathbf{z}) p_\theta(\mathbf{x} \mid \mathbf{z})$ that supports both reconstruction and ancestral sampling, by training a recognition network $q_\phi(\mathbf{z} \mid \mathbf{x})$ to approximate the posterior. The two-network setup, the reparameterisation trick, and the ELBO objective are now standard machinery in many later models.

## The setup

We posit a latent variable $\mathbf{z} \sim p(\mathbf{z}) = \mathcal{N}(\mathbf{0}, \mathbf{I})$ and a likelihood $p_\theta(\mathbf{x} \mid \mathbf{z})$ — a decoder network parameterising, e.g., a Gaussian over $\mathbf{x}$. The marginal log-likelihood

$$
\log p_\theta(\mathbf{x}) \;=\; \log \int p_\theta(\mathbf{x} \mid \mathbf{z}) p(\mathbf{z}) \, d\mathbf{z}
$$

is intractable. Introduce an **encoder** $q_\phi(\mathbf{z} \mid \mathbf{x})$ — usually a Gaussian whose mean and log-variance are output by a network — and use Jensen's inequality to derive the **Evidence Lower BOund (ELBO)**:

$$
\log p_\theta(\mathbf{x}) \;\geq\; \mathbb{E}_{q_\phi(\mathbf{z}\mid\mathbf{x})}\bigl[\log p_\theta(\mathbf{x} \mid \mathbf{z})\bigr] - \mathrm{KL}\bigl(q_\phi(\mathbf{z}\mid\mathbf{x}) \,\|\, p(\mathbf{z})\bigr).
$$

Maximising the ELBO simultaneously fits a likelihood model (first term) and an encoder that approximates the true posterior (the gap is a KL).

## The reparameterisation trick

Naively, $\nabla_\phi \mathbb{E}_{q_\phi(\mathbf{z}\mid\mathbf{x})}[\cdot]$ requires REINFORCE-style high-variance gradients. *Auto-Encoding Variational Bayes* (Kingma, Welling, ICLR 2014) replaces sampling $\mathbf{z} \sim q_\phi$ with a deterministic transformation of fixed-distribution noise:

$$
\mathbf{z} \;=\; \boldsymbol{\mu}_\phi(\mathbf{x}) + \boldsymbol{\sigma}_\phi(\mathbf{x}) \odot \boldsymbol{\epsilon}, \qquad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}).
$$

Now $\nabla_\phi$ flows through $\boldsymbol{\mu}, \boldsymbol{\sigma}$ to the encoder weights via standard backprop. This single trick is what made variational inference a tractable deep-learning method, and the reparameterisation idea generalises to discrete (Gumbel-Softmax), structured, and amortised settings.

## What VAEs learn

The KL term acts as an information-theoretic regulariser, pulling the posterior $q_\phi(\mathbf{z}\mid\mathbf{x})$ toward the prior $p(\mathbf{z})$. Empirically:

- **Smooth latent space** — interpolations between two encoded points decode to plausible interpolations of the data, unlike vanilla autoencoders.
- **Sampling works** — drawing $\mathbf{z} \sim p(\mathbf{z})$ and decoding produces samples from the learned distribution. (Quality on natural images is markedly worse than GANs or diffusion, but the *probabilistic guarantee* is what VAEs gave the field.)
- **Posterior collapse** — when the decoder is very expressive, the model can learn to ignore $\mathbf{z}$ and put all information into the decoder, making $q_\phi$ collapse to the prior. A recurring failure mode addressed by KL annealing, free-bits, and stronger encoders.

## β-VAE and disentanglement

*β-VAE* (Higgins et al., ICLR 2017) multiplies the KL term by $\beta > 1$:

$$
\mathcal{L}_{\beta\text{-VAE}} \;=\; \mathbb{E}_{q_\phi}[\log p_\theta(\mathbf{x}\mid\mathbf{z})] - \beta \cdot \mathrm{KL}(q_\phi \,\|\, p).
$$

Larger $\beta$ trades reconstruction for tighter posterior–prior alignment, which empirically encourages **disentangled** latent factors — individual latent dimensions corresponding to distinct generative factors of variation (rotation, scale, lighting). Subsequent work (Locatello et al., ICML 2019) showed that disentanglement without supervision is fundamentally unidentifiable, but the qualitative behaviour holds.

## VQ-VAE — discrete latents

*Neural Discrete Representation Learning* (van den Oord, Vinyals, Kavukcuoglu, NeurIPS 2017) replaces the Gaussian latent with a **codebook** of discrete vectors. The encoder output is snapped to the nearest codebook entry; gradients are passed through with a straight-through estimator. Discrete latents enable downstream **autoregressive priors** (like the dVAE in DALL·E) and powered the audio compression in WaveNet/SoundStream and the video tokenisation in modern video models.

## Why VAEs lost on samples but won on infrastructure

VAE samples on natural images are notoriously blurry — the Gaussian likelihood penalises sharp boundaries that the encoder can't perfectly reconstruct. GANs and diffusion produce visibly sharper outputs. But VAEs **persist as the latent-space stage** of latent diffusion models (Stable Diffusion uses a VAE-style autoencoder to compress to latent), as the **discrete tokeniser** in image-generating Transformers (DALL·E's dVAE), and as a **probabilistic baseline** wherever you want a likelihood, sampling, and a smooth latent — all in one model.

## What to read next

- [Generative Adversarial Networks](./gan) — sharper samples without an explicit likelihood.
- [Normalizing Flows](./normalizing-flows) — exact-likelihood generative models.
- [Autoencoders](./autoencoders) — the deterministic predecessor.
