---
title: Cross-Validation & Model Selection
order: 2
---

# Cross-Validation & Model Selection

Training error is biased downward — the model has seen the training data and gets to fit it. To estimate true generalisation error, you need data the model has not seen. Cross-validation is the standard technique for estimating this from a limited dataset, and the foundation of essentially all model selection in classical ML.

## The train/validation/test split

The cleanest setup, when data is plentiful:

- **Training set** — fit model parameters.
- **Validation set** — tune hyperparameters and pick architectures.
- **Test set** — *final* evaluation; touched at most once.

Touching the test set during model development biases the estimate (you implicitly select for noise patterns specific to that set). The 70/15/15 or 80/10/10 split is conventional but not load-bearing — what matters is that the test set is large enough for a reliable estimate and is treated as a one-shot resource.

## $K$-fold cross-validation

When the dataset is too small for a fixed validation split, **$K$-fold CV** is the standard tool:

1. Split the data into $K$ disjoint folds.
2. For each fold $i$: train on the other $K-1$ folds, evaluate on fold $i$.
3. Average the $K$ validation scores.

Common choices: $K = 5$ or $K = 10$. The average is an (almost) unbiased estimate of the model's generalisation error, with variance shrinking as $K$ grows. A bigger $K$ uses more data per training fold (less bias) but takes more compute and produces correlated estimates (the train sets overlap heavily).

**Leave-one-out CV** ($K = N$) is the extreme case — useful for tiny datasets, expensive otherwise.

## Stratified and time-series CV

Two common pitfalls:

- **Class imbalance.** Random folds can produce splits with unrepresentative class proportions. **Stratified CV** keeps each fold's class distribution close to the dataset's.
- **Temporal data.** Random splits leak future-into-past. For time series, use **forward-chaining** CV: fold $i$ is everything before time $t_i$ for training, $[t_i, t_{i+1})$ for validation. This is what's needed for any deployment context where you predict future from past.

## Hyperparameter selection: nested CV

If you use CV for both hyperparameter selection and final evaluation on the same folds, you've validated hyperparameters on the very data used to score the model — biased upward. **Nested CV** addresses this:

- **Outer loop** $K$-fold for evaluation.
- **Inner loop** $K'$-fold within each outer training set for hyperparameter selection.

Quadratic compute cost ($K \cdot K'$ training runs) is the price for unbiased estimates. For large hyperparameter sweeps, simpler practical approaches: a held-out validation set inside each outer fold, or Bayesian optimisation that explicitly accounts for evaluation cost.

## Information criteria as an alternative

When CV is too expensive (huge models, many candidate configurations), **information criteria** estimate generalisation analytically from the fitted model on the training set alone:

- **AIC** $= -2 \log L + 2 k$ — Akaike Information Criterion. Approximates KL distance from the true distribution.
- **BIC** $= -2 \log L + k \log N$ — Bayesian Information Criterion. Approximates the marginal likelihood.

Both penalise model size $k$, with BIC penalising more strongly. They work for nested model families fit by maximum likelihood; they break down for non-likelihood losses, deep networks, and when independence assumptions are violated. For the modern ML practitioner they are mostly useful for classical statistics and small-data settings.

## Modern caveats

- **Deep learning** — full $K$-fold CV on million-parameter networks is prohibitively expensive. The default is a single train/val/test split with the validation set used for early stopping and architecture choices.
- **Large pretraining** — for foundation-model pretraining, "validation" is often a small held-out slice plus a portfolio of downstream evaluations. Cross-validation in the classical sense is rarely used.
- **Test-set leakage on the web** — modern test benchmarks risk being scraped into pretraining corpora. See [test-set contamination](../../llm/evaluation/eval).

## What to read next

- [Bias-Variance Tradeoff](./bias-variance) — what the validation curve is measuring.
- [Generalization & VC Dimension](./generalization) — the theoretical complement to empirical validation.
- [Regularization](./regularization) — the most common hyperparameter cross-validation tunes.
