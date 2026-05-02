---
title: Information Theory (Entropy, KL, MI)
order: 5
---

# Information Theory

Information theory shows up everywhere in modern ML: the cross-entropy loss, the KL term in a VAE's ELBO, the mutual-information bound behind contrastive learning, the channel-capacity intuition behind compression-as-intelligence. This article is the minimum vocabulary needed before any of those make sense.

## Shannon entropy

For a discrete random variable $X$ with distribution $p$,

$$
H(X) \;=\; -\sum_{x} p(x) \log p(x).
$$

It is the expected number of bits (if $\log = \log_2$) needed to encode a sample of $X$ under an optimal code.

## Cross-entropy

For two distributions $p$ (true) and $q$ (model),

$$
H(p, q) \;=\; -\sum_x p(x) \log q(x).
$$

This is the **cross-entropy loss** that nearly every classifier minimises.

## KL divergence

$$
D_{\mathrm{KL}}(p \,\|\, q) \;=\; \sum_x p(x) \log \frac{p(x)}{q(x)} \;=\; H(p, q) - H(p).
$$

It measures the extra bits paid by encoding $p$ with a code optimised for $q$. KL is non-negative, asymmetric, and vanishes iff $p = q$.

## Mutual information

$$
I(X; Y) \;=\; D_{\mathrm{KL}}\bigl( p(x, y) \,\|\, p(x)\,p(y) \bigr).
$$

How much knowing $Y$ reduces uncertainty about $X$. Modern self-supervised methods (InfoNCE, SimCLR) maximise a tractable lower bound on $I(\text{view}_1; \text{view}_2)$.

## Channel capacity (preview)

For a noisy channel with input $X$ and output $Y$, the capacity is

$$
C \;=\; \max_{p(x)} I(X; Y),
$$

the maximum reliable communication rate. This is Shannon's celebrated theorem and the entry point into the lecture sequence in `information-theory-notes/`.

## What to read next

- The full lecture sequence imported from [NoteNextra · CSE5313](https://github.com/Trance-0/NoteNextra/tree/main/content/CSE5313).
- [Probability & Statistics Primer](./probability) — assumed background.
- [VAE](/dnn/generative/vae) — KL appears as the regulariser in the ELBO.

::: info Stub status
Seed introduction. Expand with differential entropy, Jensen's inequality proofs, data-processing inequality, and Fano's inequality.
:::
