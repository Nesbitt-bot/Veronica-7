---
title: Gaussian Mixture Models & EM
order: 2
---

# Gaussian Mixture Models & EM

A Gaussian Mixture Model (GMM) is a probabilistic version of [k-means](./kmeans): instead of assigning each point to a single cluster, it models the data as a mixture of Gaussian densities and produces **soft assignments**. The Expectation-Maximization (EM) algorithm — used to fit GMMs — generalises far beyond clustering, becoming a universal recipe for maximum-likelihood estimation with latent variables.

## The model

A $K$-component GMM is

$$
p(\mathbf{x}) \;=\; \sum_{k=1}^K \pi_k\, \mathcal{N}(\mathbf{x};\, \boldsymbol{\mu}_k, \Sigma_k),
$$

with mixing weights $\pi_k \geq 0$, $\sum_k \pi_k = 1$. Generative story: pick a component $k$ with probability $\pi_k$, then sample $\mathbf{x} \sim \mathcal{N}(\boldsymbol{\mu}_k, \Sigma_k)$.

The latent variable $z \in \{1, \dots, K\}$ — which component generated $\mathbf{x}$ — is not observed. This is what makes the likelihood non-convex and EM necessary.

## The EM algorithm

We want $\arg\max_\theta \log p(\mathbf{X}; \theta) = \arg\max_\theta \sum_i \log \sum_k \pi_k \mathcal{N}(\mathbf{x}_i; \boldsymbol{\mu}_k, \Sigma_k)$. The log-of-sum is intractable. EM exploits the latent-variable structure.

**E-step.** Compute the **responsibilities** — posterior probabilities of each component given the data:

$$
\gamma_{ik} \;=\; P(z_i = k \mid \mathbf{x}_i; \theta^\text{old}) \;=\; \frac{\pi_k^\text{old} \mathcal{N}(\mathbf{x}_i; \boldsymbol{\mu}_k^\text{old}, \Sigma_k^\text{old})}{\sum_j \pi_j^\text{old} \mathcal{N}(\mathbf{x}_i; \boldsymbol{\mu}_j^\text{old}, \Sigma_j^\text{old})}.
$$

**M-step.** Update parameters as if the responsibilities were the labels:

$$
N_k = \sum_i \gamma_{ik}, \qquad \boldsymbol{\mu}_k = \frac{1}{N_k} \sum_i \gamma_{ik} \mathbf{x}_i, \qquad \Sigma_k = \frac{1}{N_k} \sum_i \gamma_{ik} (\mathbf{x}_i - \boldsymbol{\mu}_k)(\mathbf{x}_i - \boldsymbol{\mu}_k)^\top, \qquad \pi_k = N_k / N.
$$

Iterate until the log-likelihood converges.

## Why EM works: the ELBO

EM is **coordinate ascent on a lower bound** of the log-likelihood. For any distribution $q(z)$,

$$
\log p(\mathbf{x}; \theta) \;\geq\; \mathbb{E}_{q}[\log p(\mathbf{x}, z; \theta)] - \mathbb{E}_q[\log q(z)] \;\equiv\; \mathcal{L}(q, \theta).
$$

This is the **ELBO** — also the centre of [VAE training](../../dnn/generative/vae).

- **E-step** sets $q(z) = p(z \mid \mathbf{x}; \theta^\text{old})$, making the bound tight.
- **M-step** maximises $\mathcal{L}$ over $\theta$ with $q$ fixed.

Each iteration cannot decrease $\log p(\mathbf{x}; \theta)$ — EM monotonically improves the likelihood until a stationary point. (It does not necessarily find the global optimum; multiple restarts and good initialisation matter.)

## GMM vs k-Means

GMM with isotropic, equal-variance Gaussians and "hard" responsibilities reduces to k-means. The differences:

- **Soft assignments.** $\gamma_{ik}$ is a probability, not a one-hot — points near a cluster boundary contribute to multiple clusters proportionally.
- **Anisotropic clusters.** Full $\Sigma_k$ captures elongated, oriented cluster shapes that k-means cannot.
- **Probabilistic output.** GMMs give a density estimate $p(\mathbf{x})$, useful for outlier detection and generative sampling.
- **Higher computational cost.** $O(K d^2)$ per E-step instead of $O(K d)$.

## Initialisation and degeneracies

EM is sensitive to initialisation:

- Run k-means first; use its centroids and per-cluster covariance as the GMM init.
- Multiple random restarts; pick the highest-likelihood solution.

GMMs have a famous **degeneracy**: a Gaussian centred on a single training point with vanishing covariance achieves infinite likelihood (the density blows up). Standard fix: add a small **regularisation** to each $\Sigma_k$ ($\Sigma_k \leftarrow \Sigma_k + \epsilon I$) or use a **Bayesian prior** (Bayesian GMM, variational mixture of Gaussians).

## Beyond clustering

EM works for any latent-variable model with tractable conditional posteriors:

- **Hidden Markov Models** (see [HMM](../probabilistic/hmm)) — the latent is a sequence; EM is the Baum-Welch algorithm.
- **Probabilistic PCA** — Gaussian latent, Gaussian likelihood; EM gives PCA in the limit.
- **Topic models** (LDA) — EM-style variational inference over latent topic assignments.

The EM template — bound the log-likelihood with the ELBO, alternate E and M — is one of the most general inference recipes in machine learning.

## What to read next

- [k-Means](./kmeans) — the hard-assignment special case.
- [Bayes Nets](../probabilistic/bayes-nets) — graphical models where EM applies broadly.
- [Variational Autoencoders](../../dnn/generative/vae) — modern amortised EM with neural networks.
