---
title: Probability & Statistics Primer
order: 2
---

# Probability & Statistics Primer

Machine learning is mostly applied probability. Models are families of probability distributions; training is selecting one from the family; evaluation is comparing the selected distribution to held-out data. This page is the minimum probability/statistics vocabulary the rest of the curriculum assumes.

## Random variables and distributions

A random variable $X$ is a function from a sample space $\Omega$ to $\mathbb{R}$ (or $\mathbb{R}^n$ for vectors). It has a **distribution** described by its **CDF** $F_X(x) = P(X \leq x)$ and (for continuous variables) a **PDF** $p_X(x) = dF_X/dx$.

Three distributions to know cold:

- **Bernoulli($p$)** — single coin flip; $\mathrm{Var} = p(1-p)$.
- **Gaussian** ($\mathcal{N}(\mu, \sigma^2)$) — $p(x) = \frac{1}{\sqrt{2\pi}\sigma} \exp(-(x-\mu)^2 / 2\sigma^2)$. The default noise model and the limit of every well-behaved CLT-style sum.
- **Categorical($\boldsymbol{\pi}$)** — multi-class generalisation of Bernoulli; $P(X = k) = \pi_k$. Softmax outputs are categorical parameters.

## Expectation, variance, covariance

For a function $f$ of a random variable $X$,

$$
\mathbb{E}[f(X)] \;=\; \int f(x)\, p(x)\, dx, \qquad \mathrm{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2].
$$

Linearity of expectation: $\mathbb{E}[a X + b Y] = a \mathbb{E}[X] + b \mathbb{E}[Y]$ — even when $X, Y$ are dependent.

For two random variables, **covariance** $\mathrm{Cov}(X, Y) = \mathbb{E}[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])]$ measures linear dependence; **correlation** $\rho = \mathrm{Cov} / (\sigma_X \sigma_Y)$ scales it to $[-1, 1]$. Independence implies $\mathrm{Cov} = 0$ but not vice versa.

## Conditional probability and Bayes' rule

The conditional probability of $A$ given $B$ is $P(A \mid B) = P(A \cap B) / P(B)$. Bayes' rule rearranges it:

$$
P(A \mid B) \;=\; \frac{P(B \mid A)\, P(A)}{P(B)}.
$$

In machine-learning terms, $P(\theta \mid \mathcal{D}) \propto P(\mathcal{D} \mid \theta) P(\theta)$ — posterior $\propto$ likelihood × prior. This is the central equation of Bayesian inference.

**Conditional independence**: $X \perp Y \mid Z$ iff $P(X, Y \mid Z) = P(X \mid Z) P(Y \mid Z)$. Conditional-independence structure is what graphical models ([Bayes nets](../probabilistic/bayes-nets), [HMMs](../probabilistic/hmm), [CRFs](../probabilistic/crf)) exploit to factorise high-dimensional joints into tractable products.

## Maximum likelihood estimation

Given a parametric model $p_\theta(x)$ and i.i.d. data $\mathcal{D} = \{x_1, \dots, x_N\}$, the **maximum-likelihood estimator** is

$$
\hat\theta_\text{MLE} \;=\; \arg\max_\theta \prod_i p_\theta(x_i) \;=\; \arg\max_\theta \sum_i \log p_\theta(x_i).
$$

Almost every loss function in ML is a negative log-likelihood under some probabilistic model:

- **MSE** = NLL of Gaussian noise with fixed variance.
- **Cross-entropy** = NLL of a categorical model.
- **Binary cross-entropy** = NLL of a Bernoulli.

This is why training-via-gradient-descent on these losses is just MLE under SGD.

## Concentration inequalities

How far does a sample mean stray from the true mean? Three answers in increasing strength:

- **Markov:** $P(|X| \geq t) \leq \mathbb{E}[|X|] / t$.
- **Chebyshev:** $P(|X - \mu| \geq k\sigma) \leq 1/k^2$.
- **Hoeffding:** for bounded i.i.d. $X_i \in [a, b]$, $P\bigl(|\bar{X}_n - \mu| \geq t\bigr) \leq 2 \exp\bigl(-2 n t^2 / (b - a)^2\bigr)$.

These bounds are the analytical foundation of [PAC learning](../theory/pac-learning) and the generalisation guarantees in classical ML theory.

## Statistical tests and confidence intervals

Hypothesis testing — null hypothesis $H_0$, test statistic, p-value — formalises "did this model do better than chance?" The mainstream ML mistakes here are:

- **Multiple testing** — running many comparisons inflates false-positive rate; correct with Bonferroni or BH.
- **Optional stopping** — peeking at the test set during model selection invalidates the test.
- **Confidence interval misinterpretation** — a 95% CI is not "95% probability the true value is here"; it is "the procedure produces an interval covering the truth in 95% of repetitions".

For ML practitioners, the most useful tool is the **bootstrap**: resample with replacement to estimate sampling distributions of any statistic. It avoids most of the above pitfalls and works whenever you have enough data to resample.

## What to read next

- [Linear Algebra Recap](./linear-algebra) — covariance matrices, multivariate Gaussians.
- [Information Theory](./information-theory) — entropy, KL, and mutual information build on probability.
- [Bayes Nets](../probabilistic/bayes-nets) — structured probability models.
