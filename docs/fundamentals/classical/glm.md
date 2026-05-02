---
title: Generalized Linear Models
order: 6
---

# Generalized Linear Models

The Generalised Linear Model (GLM) is the unified framework that contains [OLS](./ols), [logistic regression](./logistic-regression), Poisson regression, and several others as special cases. Three ingredients — a **distribution** for the response, a **linear predictor**, and a **link function** — fit a wide variety of regression problems with one set of estimation tools (IRLS) and one set of theoretical guarantees.

## The three components

**Random component.** The response $Y$ has a distribution from the **exponential family**:

$$
p(y; \theta, \phi) \;=\; \exp\!\left( \frac{y \theta - b(\theta)}{a(\phi)} + c(y, \phi) \right).
$$

This includes Gaussian, Bernoulli, binomial, Poisson, gamma, and inverse Gaussian distributions. The function $b(\theta)$ determines the mean: $\mathbb{E}[Y] = b'(\theta) \equiv \mu$.

**Systematic component.** A linear predictor

$$
\eta \;=\; \boldsymbol{\beta}^\top \mathbf{x}.
$$

**Link function.** A monotone, differentiable function $g$ connects mean and linear predictor:

$$
g(\mu) \;=\; \eta.
$$

The **canonical link** is the one that makes $\theta = \eta$ — natural-parameter equals linear-predictor. For Bernoulli, the canonical link is the **logit**, recovering [logistic regression](./logistic-regression). For Gaussian it is the **identity**, recovering [OLS](./ols). For Poisson it is the **log**, giving Poisson regression for count data.

## Common GLMs in one table

| Response | Distribution | Canonical link | Use case |
| --- | --- | --- | --- |
| Continuous, unbounded | Gaussian | identity | linear regression |
| Binary | Bernoulli | logit | logistic regression |
| Counts | Poisson | log | event-rate modelling |
| Positive continuous | Gamma | inverse | duration, claim sizes |
| Proportions | Binomial | logit | bounded counts |

The strength of the GLM framework is that all of these fit with the same algorithm and share the same theoretical machinery.

## Maximum likelihood and IRLS

For the canonical link, the log-likelihood is concave and the gradient has the OLS-like form

$$
\nabla_{\boldsymbol{\beta}} \log L \;=\; X^\top (\mathbf{y} - \boldsymbol{\mu}).
$$

The Hessian is $-X^\top W X$ for a diagonal weight matrix $W$ that depends on the variance function. **Iteratively Reweighted Least Squares** (IRLS) updates

$$
\boldsymbol{\beta}^{(t+1)} \;=\; (X^\top W^{(t)} X)^{-1} X^\top W^{(t)} \mathbf{z}^{(t)},
$$

where $\mathbf{z}$ is a working response. Each step is a weighted OLS. Convergence is fast (5–10 iterations) on well-conditioned problems.

## Deviance — the GLM loss

The natural goodness-of-fit measure is the **deviance**:

$$
D \;=\; 2\bigl[\log L_\text{saturated} - \log L_\text{model}\bigr],
$$

where the saturated model fits each observation perfectly. For Gaussian responses, deviance reduces to the residual sum of squares. For Bernoulli, it is twice the binary cross-entropy. Deviance is the right "loss" to minimise within the GLM framework — for non-Gaussian responses, plain MSE is biased.

## Why GLMs matter today

Three reasons:

- **Insurance, epidemiology, social science** — count and rate data is everywhere; Poisson and negative-binomial GLMs are the standard.
- **Interpretability** — coefficients have clean meaning (multiplicative effect on the mean for log-link models, odds ratio for logit), which matters in regulated domains.
- **Conceptual link to deep learning** — the final layer of many modern networks is a GLM in disguise. Choosing the right output activation and loss is choosing the right (link, distribution) pair.

For the deep-learning practitioner, GLMs are the correct mental model for **what your output head should be**:

- Real-valued target → linear output + MSE (Gaussian GLM).
- Binary target → sigmoid + BCE (Bernoulli GLM).
- Categorical target → softmax + cross-entropy (multinomial GLM).
- Count target → exp output + Poisson NLL (Poisson GLM).
- Positive continuous → exp output + gamma NLL.

Picking the right combination matters more than tweaking the network body.

## What to read next

- [Logistic Regression](./logistic-regression) — the most-used GLM.
- [Ordinary Least Squares](./ols) — the Gaussian-identity GLM.
- [Loss Functions](../../dnn/basics/losses) — deep-learning loss choices in GLM language.
