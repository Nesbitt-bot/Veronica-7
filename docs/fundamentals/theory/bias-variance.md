---
title: Bias–Variance Tradeoff
order: 1
---

# Bias–Variance Tradeoff

The bias–variance decomposition is the classical lens for understanding generalisation error. It splits expected test error into three contributions — **bias** (systematic mismatch between model and truth), **variance** (sensitivity to training data), and **irreducible noise**. Modern over-parameterised deep learning complicates the picture (see [double descent](../../dnn/regularization/double-descent)) but does not invalidate the classical case.

## The decomposition

Suppose data is generated as $y = f(\mathbf{x}) + \varepsilon$ with $\mathbb{E}[\varepsilon] = 0$ and $\mathrm{Var}(\varepsilon) = \sigma^2$. Train a learner on a random training set $\mathcal{D}$ to produce a predictor $\hat{f}_\mathcal{D}(\mathbf{x})$. The expected squared error at a test point $\mathbf{x}$, averaged over the random draw of $\mathcal{D}$, decomposes as

$$
\mathbb{E}_\mathcal{D}\bigl[(y - \hat{f}_\mathcal{D}(\mathbf{x}))^2\bigr] \;=\; \underbrace{\bigl(\mathbb{E}_\mathcal{D}[\hat{f}_\mathcal{D}(\mathbf{x})] - f(\mathbf{x})\bigr)^2}_{\text{Bias}^2} + \underbrace{\mathrm{Var}_\mathcal{D}\bigl(\hat{f}_\mathcal{D}(\mathbf{x})\bigr)}_{\text{Variance}} + \underbrace{\sigma^2}_{\text{Noise}}.
$$

Three sources, each minimisable independently up to a point — and the first two trade off.

## Bias and variance, intuitively

- **Bias** measures how far the *average* model is from the truth. High bias = the model class is too restrictive. Linear regression on a sinusoidal target is high-bias.
- **Variance** measures how much the model fluctuates as the training set changes. High variance = the model is too flexible relative to the data. A 1-NN classifier is high-variance.
- **Noise** is the floor — irreducible from the data alone.

A high-bias model **underfits**; a high-variance model **overfits**.

## The classical U-curve

Plot test error against model complexity. The classical picture:

- At low complexity, bias dominates — increasing complexity reduces bias faster than it increases variance.
- At high complexity, variance dominates — the model memorises training noise.
- The optimal complexity lives at the **U-shaped minimum** of test error.

This drove decades of model-selection wisdom: regularise to limit complexity, validate on held-out data, prefer the simpler model that performs comparably (Occam's razor).

## What deep learning broke

Modern deep networks have so many parameters that they can perfectly memorise training data — yet they generalise. This *should not happen* in the classical U-curve picture. The resolution, established empirically by *Reconciling Modern Machine Learning Practice and the Classical Bias–Variance Trade-off* (Belkin et al., PNAS 2019), is **double descent**: as capacity grows past the **interpolation threshold**, test error first peaks (the classical regime hits its maximum) and then *descends again* into a low-error over-parameterised regime.

The mechanism: in the over-parameterised regime, infinitely many parameter settings achieve zero training error. The optimiser picks one; SGD's [implicit bias](../../dnn/regularization/double-descent) selects a flat, low-norm minimum that generalises. More capacity doesn't add variance because the optimiser doesn't *use* it to fit noise.

## Practical implications

The classical bias-variance frame is correct in three regimes:

- **Classical ML methods** (linear/logistic regression, SVM, small MLPs) — model selection via validation curves, regularisation, early stopping all apply.
- **Small deep networks** (under-parameterised) — same advice as classical.
- **Test-set evaluation in any regime** — bias-variance still describes test error; the *relationship to capacity* is what changes.

For modern over-parameterised deep learning, the take-home is that you should **train longer and larger** than classical wisdom suggests, and **validation curves can be misleading** — a model that looks worse at the interpolation threshold may be much better past it.

## What to read next

- [Generalization & VC Dimension](./generalization) — the formal capacity-based generalisation bounds.
- [Cross-Validation](./cross-validation) — the technique for estimating the bias-variance trade-off empirically.
- [Double Descent & Implicit Bias](../../dnn/regularization/double-descent) — the modern correction.
