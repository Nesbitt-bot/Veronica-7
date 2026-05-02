---
title: Naive Bayes
order: 8
---

# Naive Bayes

Naive Bayes is the simplest **generative** classifier: model $P(\mathbf{x} \mid y)$ as a product of feature-wise distributions and apply Bayes' rule. Despite the conspicuously wrong independence assumption, it works surprisingly well — particularly for text classification — and remains a useful baseline whenever feature dimensions are high and labelled data is scarce.

## The model

Bayes' rule for classification:

$$
P(y \mid \mathbf{x}) \;=\; \frac{P(\mathbf{x} \mid y)\, P(y)}{P(\mathbf{x})} \;\propto\; P(\mathbf{x} \mid y)\, P(y).
$$

The "naive" assumption is **conditional independence** of features given the label:

$$
P(\mathbf{x} \mid y) \;=\; \prod_{j=1}^d P(x_j \mid y).
$$

This collapses an exponentially-large joint distribution into $d$ small marginals, making both estimation and inference tractable. Predict $\hat{y} = \arg\max_y P(y) \prod_j P(x_j \mid y)$.

## Three flavours

The variant depends on the assumed marginal $P(x_j \mid y)$:

- **Gaussian Naive Bayes** — $P(x_j \mid y) = \mathcal{N}(\mu_{jy}, \sigma_{jy}^2)$. Continuous features, two parameters per (feature, class). Good baseline for low-dimensional continuous data.
- **Multinomial Naive Bayes** — $P(\mathbf{x} \mid y)$ is multinomial over feature counts. Standard for **text classification** with bag-of-words counts.
- **Bernoulli Naive Bayes** — features are 0/1 indicators. For binary text features (word present/absent).

## Estimation: closed-form MLE

For a multinomial model with class $y$ and word $j$ count $n_{jy}$ in class-$y$ documents:

$$
\hat{P}(x_j \mid y) \;=\; \frac{n_{jy} + \alpha}{\sum_{k} n_{ky} + \alpha V},
$$

with $\alpha > 0$ a **Laplace smoothing** parameter (typically 1) and $V$ the vocabulary size. Smoothing is critical: a word never seen in class $y$ at training time would otherwise zero out the entire product, regardless of all the evidence from other features.

Class prior $\hat{P}(y) = N_y / N$. Total training cost: one pass over the data to count.

## Why does it work despite the bad assumption?

Features in real data are rarely independent given the class. Words in a document are correlated by topic; pixel values are correlated by neighbourhood. The independence assumption is wrong.

But the **decision boundary** depends only on the *ranking* of $P(y \mid \mathbf{x})$ across classes, not on the absolute values. As long as the relative ordering survives the misspecification, the classification is correct. Domingos & Pazzani (1997) gave the canonical analysis of why Naive Bayes is "optimal under zero-one loss for a much broader class of distributions than the one it represents".

The probability *estimates* are typically miscalibrated (over-confident, with values pushed to 0 or 1), but the argmax is often right.

## When Naive Bayes wins

- **Text classification, small data.** The original Naive Bayes spam filter (Sahami et al., 1998) and most early email/SMS spam systems were Naive Bayes. Even in 2025, Multinomial Naive Bayes is a competitive baseline on small text corpora and is the right starting point before throwing transformers at the problem.
- **High-dimensional, sparse features.** When $d \gg N$, complex models overfit; Naive Bayes' simple parameterisation is robust.
- **Streaming / incremental settings.** Counts are easy to update online — no retraining required when new data arrives.

## When it fails

- **Strongly correlated features** that the independence assumption can't compensate for via class-marginal effects.
- **Continuous data with non-Gaussian marginals** — the Gaussian variant breaks. Use kernel density estimation for $P(x_j \mid y)$ instead.
- **When you need calibrated probabilities** — Naive Bayes is famously over-confident.

## What to read next

- [Logistic Regression](./logistic-regression) — the discriminative cousin; the comparison "Naive Bayes vs Logistic Regression" (Ng & Jordan, NIPS 2001) is a classic.
- [Bayesian Networks](../probabilistic/bayes-nets) — the generalisation that drops the independence assumption.
- [LDA & QDA](./lda-qda) — Gaussian Naive Bayes with shared / non-shared covariance.
