---
title: Autoencoders & Denoising AEs
order: 1
---

# Autoencoders & Denoising AEs

An autoencoder is a network trained to reconstruct its own input through a low-dimensional bottleneck. The bottleneck forces the model to compress the data into a useful latent representation; the reconstruction loss makes the compression lossless on the training distribution. Autoencoders are the structural ancestor of [VAEs](./vae), [MAE](../../cv/advances/representation), and the encoder-decoder denoiser at the heart of latent-diffusion image generators.

## The basic autoencoder

Given an input $\mathbf{x} \in \mathbb{R}^d$, an autoencoder is a pair $(f_\text{enc}, g_\text{dec})$ with $f_\text{enc}: \mathbb{R}^d \to \mathbb{R}^k$ and $g_\text{dec}: \mathbb{R}^k \to \mathbb{R}^d$ trained to minimise reconstruction error:

$$
\mathcal{L}(\theta, \phi) \;=\; \mathbb{E}_{\mathbf{x} \sim \mathcal{D}} \left\| \mathbf{x} - g_\phi\bigl(f_\theta(\mathbf{x})\bigr) \right\|^2.
$$

The bottleneck dimension $k \ll d$ is what stops the network from learning the identity. With a linear encoder/decoder and squared error, the optimal $f$ projects onto the top-$k$ principal components — autoencoder = nonlinear PCA.

## Denoising autoencoders

*Extracting and Composing Robust Features with Denoising Autoencoders* (Vincent, Larochelle, Bengio, Manzagol, ICML 2008) trains an autoencoder to reconstruct the *clean* input from a *corrupted* version $\tilde{\mathbf{x}}$:

$$
\mathcal{L}_\text{DAE} \;=\; \mathbb{E}_{\mathbf{x} \sim \mathcal{D}, \tilde{\mathbf{x}} \sim q(\cdot \mid \mathbf{x})} \left\| \mathbf{x} - g\bigl(f(\tilde{\mathbf{x}})\bigr) \right\|^2.
$$

Common corruptions: Gaussian noise, salt-and-pepper noise, masking. Forcing the model to "undo" noise eliminates the trivial identity-map solution and makes the bottleneck unnecessary — DAEs work even when $k \geq d$.

The deeper result (Vincent 2011, Alain & Bengio 2014) is that a denoising autoencoder trained on Gaussian noise of small variance learns a function whose residual is the **score** of the data distribution:

$$
\frac{\hat{\mathbf{x}}(\tilde{\mathbf{x}}) - \tilde{\mathbf{x}}}{\sigma^2} \;\approx\; \nabla_{\tilde{\mathbf{x}}} \log p(\tilde{\mathbf{x}}).
$$

This is the connection to score-based and diffusion models — denoising at multiple noise scales is the entire training objective of DDPM and friends.

## Sparse, contractive, and stacked autoencoders

The 2008–2013 literature explored several variants to encourage useful latent structure:

- **Sparse autoencoders** — add an L1 (or KL-from-Bernoulli) penalty on hidden activations, forcing each input to use only a few latent dimensions.
- **Contractive autoencoders** — add a Frobenius-norm penalty on the encoder Jacobian $\|\partial f / \partial \mathbf{x}\|_F^2$, encouraging the encoder to be insensitive to input perturbations except along the data manifold.
- **Stacked autoencoders** — pretrain layer-by-layer (greedy unsupervised pretraining), then fine-tune. Was the dominant deep-learning recipe in 2007–2010 before ReLU + good init made supervised pretraining straightforward.

Most of these ideas survive in spirit (sparsity penalties, manifold-respecting representations) but rarely as named pipelines. The descendants people actually use today are VAEs, MAEs, and the denoiser inside latent diffusion.

## What modern systems use AEs for

- **Latent-diffusion models** (Stable Diffusion etc.) — train a VAE-style autoencoder once, then run all subsequent diffusion in the compact latent space. The autoencoder is the reason diffusion is computationally tractable at high resolution.
- **MAE** (see [representation learning](../../cv/advances/representation)) — an asymmetric denoising autoencoder where the corruption is masking 75% of patches.
- **Anomaly detection** — train on in-distribution data; high reconstruction error at test time flags outliers.
- **Compression** — neural image and video codecs (Ballé et al.) are autoencoders with a learned entropy model on the latents.

## What to read next

- [Variational Autoencoders](./vae) — the probabilistic generative version.
- [Generative Adversarial Networks](./gan) — the alternative approach to learning a sampler.
- [PixelRNN / PixelCNN](./pixel-models) — autoregressive image modelling, a third axis in the generative-model space.
