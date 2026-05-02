---
title: Generative Adversarial Networks
order: 3
---

# Generative Adversarial Networks

A GAN trains two networks against each other: a **generator** $G$ that tries to produce samples indistinguishable from real data, and a **discriminator** $D$ that tries to tell real from fake. The two-player game has a Nash equilibrium where $G$ has matched the data distribution. GANs dominated image generation from 2016 to about 2022, when diffusion took over for photorealism, but the adversarial training paradigm persists in many places — perceptual losses, learned codecs, RLHF reward models, simulation-based inference.

## The original objective

*Generative Adversarial Nets* (Goodfellow et al., NeurIPS 2014) defines the game:

$$
\min_G \max_D \; \mathbb{E}_{\mathbf{x} \sim p_\text{data}}[\log D(\mathbf{x})] + \mathbb{E}_{\mathbf{z} \sim p(\mathbf{z})}[\log(1 - D(G(\mathbf{z})))].
$$

$D$ is trained to assign high probability to real samples and low probability to generated ones; $G$ is trained to flip $D$'s judgements. At the optimal $D$ (for fixed $G$), the inner maximisation gives Jensen–Shannon divergence between $p_\text{data}$ and $p_G$, so $G$ is implicitly minimising JS divergence.

GANs do not provide a likelihood — they are **likelihood-free** generators. This is both their strength (no Gaussian-blur penalty like VAEs) and their weakness (no quantitative comparison across models).

## Training pathologies

The min-max game has two recurring failure modes:

- **Mode collapse** — $G$ produces only a small subset of the data distribution, because doing so still fools $D$. The generator finds a corner of the data and refuses to leave.
- **Training instability** — gradients from $D$ vanish when it gets too good (saturation), or explode when it gets too bad. The standard recipes — alternating updates, label smoothing, gradient penalty — are workarounds.

## DCGAN

*Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks* (Radford, Metz, Chintala, ICLR 2016) gave the first stable convolutional GAN recipe: strided convs (no pooling), batch norm, ReLU in $G$, LeakyReLU in $D$, no fully-connected layers in the body. DCGAN made GANs work on 64×64 images and became the architectural template that StyleGAN later refined.

## WGAN — Wasserstein objective

*Wasserstein GAN* (Arjovsky, Chintala, Bottou, ICML 2017) replaces the JS divergence with the **Wasserstein-1 distance**:

$$
W(p_\text{data}, p_G) \;=\; \sup_{\|f\|_L \leq 1} \mathbb{E}_\text{data}[f(\mathbf{x})] - \mathbb{E}_G[f(G(\mathbf{z}))].
$$

The "discriminator" becomes a 1-Lipschitz **critic** $f$, trained without a final sigmoid. The Wasserstein loss has non-saturating gradients everywhere, dramatically reducing training instability. *WGAN-GP* (Gulrajani et al., NeurIPS 2017) imposes the Lipschitz constraint via a **gradient penalty** $\mathbb{E}[(\|\nabla_{\hat{\mathbf{x}}} f(\hat{\mathbf{x}})\| - 1)^2]$ instead of weight clipping. WGAN-GP is the right reference recipe for "make a GAN train".

## StyleGAN and the photorealism plateau

*Progressive Growing of GANs* (Karras et al., ICLR 2018), *StyleGAN* (Karras, Laine, Aila, CVPR 2019), *StyleGAN2* (CVPR 2020), and *StyleGAN3* (NeurIPS 2021) drove face-image GANs to indistinguishable-from-real photorealism at 1024×1024. Architectural innovations: a **mapping network** that disentangles the latent space, **adaptive instance normalisation** (AdaIN) to inject style at each resolution, and (in StyleGAN3) explicit attention to **alias-free** equivariant generation. StyleGAN remained the SOTA face generator for years.

## Conditional GANs and image-to-image

*Conditional GAN* (Mirza, Osindero, 2014) adds a label $\mathbf{y}$ to both $G$ and $D$: $G(\mathbf{z}, \mathbf{y})$, $D(\mathbf{x}, \mathbf{y})$. The class-conditional generator extends to *image-conditional* generators (pix2pix, Isola et al., CVPR 2017) for tasks like edges→photo, day→night, sketch→colour. These same image-to-image losses live on inside many diffusion-edit and super-resolution systems as **adversarial perceptual losses**.

## Why diffusion took over

GANs lost to diffusion on natural-image generation around 2022 for three reasons: diffusion has a **stable, single-objective training** (no minimax), produces **higher diversity** at the same FID, and scales more straightforwardly with compute. GANs are still the right choice for very-fast inference (one forward pass vs hundreds of denoising steps), specialised face-generation tasks, and as a discriminator inside hybrid systems. The adversarial idea persists everywhere preference modelling does — RLHF reward models, learned losses, perceptual quality estimators.

## What to read next

- [Variational Autoencoders](./vae) — the likelihood-based contemporary.
- [Image Generation (CV)](../../cv/advances/generation) — where diffusion took over.
- [Normalizing Flows](./normalizing-flows) — exact-likelihood generative models.
