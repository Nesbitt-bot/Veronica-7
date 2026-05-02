---
title: Ordinary Least Squares (OLS)
order: 1
---

# Ordinary Least Squares (OLS)

OLS is the *first* model worth deeply understanding. It is the simplest predictor that makes a non-trivial probabilistic assumption, and almost every modern technique — ridge, logistic regression, neural network linear layers, even the final projection of an LLM — reduces to OLS in some limit.

## Setup

Given a design matrix $X \in \mathbb{R}^{n \times d}$ and a response vector $y \in \mathbb{R}^n$, OLS chooses the coefficient vector $\beta \in \mathbb{R}^d$ that minimizes the residual sum of squares

$$
\hat{\beta} \;=\; \arg\min_{\beta} \; \lVert y - X\beta \rVert_2^2.
$$

## Closed form

Setting the gradient to zero gives the **normal equations** $X^\top X \beta = X^\top y$, so when $X^\top X$ is invertible

$$
\hat{\beta} \;=\; (X^\top X)^{-1} X^\top y.
$$

In practice we never form the inverse — we solve the linear system via QR or SVD for numerical stability.

## Geometric view

$X\hat{\beta}$ is the orthogonal projection of $y$ onto the column space of $X$. The residual $y - X\hat{\beta}$ is orthogonal to every column of $X$ — that orthogonality *is* the normal equations.

## Probabilistic view

If $y = X\beta + \varepsilon$ with $\varepsilon \sim \mathcal{N}(0, \sigma^2 I)$, then OLS is the **MLE** of $\beta$. This is the bridge to ridge (Gaussian prior), Bayesian linear regression, and ultimately to GLMs.

## What to read next

- [Ridge & Lasso Regression](./ridge-lasso) — what to do when $X^\top X$ is singular or ill-conditioned.
- [Logistic Regression](./logistic-regression) — replace Gaussian noise with Bernoulli; everything else is the same story.
- [Generalized Linear Models](./glm) — the unifying framework.

::: info Stub status
This page has a seed introduction. Expand sections on Gauss–Markov, leverage, influence, and the bias–variance decomposition.
:::
