---
title: Normalizing Flows
order: 4
---

# Normalizing Flows

A normalizing flow models a complex distribution as the pushforward of a simple base distribution (typically a unit Gaussian) through a sequence of *invertible*, differentiable transformations. The price of invertibility is paid up front — restricted layer designs — but in exchange the model gives **exact log-likelihoods** and **exact ancestral sampling**, neither of which VAEs or GANs deliver.

## The change-of-variables formula

If $\mathbf{z} \sim p(\mathbf{z})$ and $\mathbf{x} = f(\mathbf{z})$ with $f$ a diffeomorphism, then

$$
\log p_\mathbf{x}(\mathbf{x}) \;=\; \log p_\mathbf{z}(f^{-1}(\mathbf{x})) \;-\; \log\left| \det \frac{\partial f}{\partial \mathbf{z}}(f^{-1}(\mathbf{x})) \right|.
$$

A flow stacks $K$ such transformations $f = f_K \circ \cdots \circ f_1$. The log-determinant becomes a sum of per-step log-determinants. Training is straightforward maximum likelihood:

$$
\theta^* \;=\; \arg\max_\theta \sum_{\mathbf{x} \in \mathcal{D}} \log p_\theta(\mathbf{x}).
$$

The engineering challenge is designing $f_k$ that are **invertible**, **expressive**, and have a **cheap** log-Jacobian — all three at once.

## Coupling layers: NICE and Real NVP

*NICE: Non-linear Independent Components Estimation* (Dinh, Krueger, Bengio, ICLR 2015 W) introduced **coupling layers**: split the input into $(\mathbf{x}_a, \mathbf{x}_b)$, leave $\mathbf{x}_a$ unchanged, and transform $\mathbf{x}_b$ conditioned on $\mathbf{x}_a$:

$$
\mathbf{y}_a = \mathbf{x}_a, \qquad \mathbf{y}_b = \mathbf{x}_b + t(\mathbf{x}_a).
$$

The Jacobian is triangular with unit diagonal — log-det is exactly zero. *Real NVP* (Dinh, Sohl-Dickstein, Bengio, ICLR 2017) generalises to affine coupling, $\mathbf{y}_b = \mathbf{x}_b \odot \exp(s(\mathbf{x}_a)) + t(\mathbf{x}_a)$, giving a non-trivial diagonal Jacobian whose log-det is $\sum_i s_i(\mathbf{x}_a)$ — still cheap. Alternating which dimensions get transformed (with permutations between layers) lets the network mix all variables.

## Glow

*Glow: Generative Flow with Invertible 1×1 Convolutions* (Kingma, Dhariwal, NeurIPS 2018) replaced the fixed permutations with **learned invertible 1×1 convolutions**, parameterised via LU decomposition for cheap log-determinants. Glow demonstrated photorealistic face generation at 256×256 from a flow — competitive with contemporaneous GANs at the time — and became the canonical "modern flow" reference.

## Autoregressive flows

*Masked Autoregressive Flow* (MAF, Papamakarios et al., NeurIPS 2017) and *Inverse Autoregressive Flow* (IAF, Kingma et al., NeurIPS 2016) are flows where the transformation is **autoregressive**:

$$
y_i = \mu_i(\mathbf{x}_{<i}) + \sigma_i(\mathbf{x}_{<i}) \cdot x_i.
$$

The Jacobian is triangular; log-det is the sum of $\log \sigma_i$. **MAF** has fast density evaluation (one parallel forward pass via masking) and slow sampling (sequential, $O(D)$). **IAF** is the dual — fast sampling, slow density. Choose based on use case: MAF for likelihood evaluation (e.g., variational inference posteriors), IAF for fast sampling.

## Continuous flows: FFJORD and neural ODEs

*Neural Ordinary Differential Equations* (Chen et al., NeurIPS 2018) replaces the discrete chain $\mathbf{x}_{k+1} = f_k(\mathbf{x}_k)$ with a continuous-time ODE $d\mathbf{x}/dt = f(\mathbf{x}, t; \theta)$ integrated by an ODE solver. *FFJORD* (Grathwohl et al., ICLR 2019) extends this to flows with the **Hutchinson trace estimator** for the log-Jacobian:

$$
\log p_T(\mathbf{x}_T) \;=\; \log p_0(\mathbf{x}_0) - \int_0^T \mathrm{tr}\!\left( \frac{\partial f}{\partial \mathbf{x}_t} \right) dt.
$$

Continuous flows free the model from coupling-layer architectural restrictions but add ODE-solver compute at training and sampling time. Subsequent **flow-matching** and **rectified-flow** approaches (Lipman et al., Liu et al., 2022–23) reformulate the training objective to bypass the integration entirely, and have become competitive with diffusion for image generation.

## Why flows lost on natural images

Flows were a serious image-generation contender ~2018 but were overtaken by diffusion for two reasons: the invertibility constraint forces relatively low expressivity per layer (so flows need many layers), and they don't compress to a low-dimensional latent the way VAEs do (so naive flows operate at full pixel resolution). Diffusion bypasses both by giving up exact likelihood.

Flows persist where exact likelihood matters — physics simulation, density estimation, particle physics, simulation-based inference — and as the conceptual ancestor of flow-matching, which has come back to image generation.

## What to read next

- [Variational Autoencoders](./vae) — approximate-likelihood alternative.
- [Generative Adversarial Networks](./gan) — likelihood-free alternative.
- [Image Generation (CV)](../../cv/advances/generation) — diffusion took over the image task; flow-matching is reclaiming ground.
