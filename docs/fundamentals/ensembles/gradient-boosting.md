---
title: Gradient Boosting & XGBoost
order: 4
---

# Gradient Boosting & XGBoost

Gradient Boosting Machines (GBMs) generalise [AdaBoost](./adaboost) from exponential loss to *any* differentiable loss, and from "reweight examples" to "fit residuals". The result is a sequential ensemble that has dominated tabular-data competitions since 2014 — XGBoost, LightGBM, and CatBoost are the production implementations. For tabular ML in 2025, the question "what should I use?" has the answer "GBM" 90% of the time.

## Functional gradient descent

Friedman (2001) framed boosting as **gradient descent in function space**. Train an additive model

$$
F_T(\mathbf{x}) \;=\; \sum_{t=1}^T \nu \cdot h_t(\mathbf{x}),
$$

with $\nu$ a learning rate (~0.05–0.1) and each $h_t$ a small tree. At round $t$:

1. Compute the **negative gradient** of the loss at the current predictions: $r_i^{(t)} = -\partial \ell(y_i, F_{t-1}(\mathbf{x}_i)) / \partial F_{t-1}(\mathbf{x}_i)$.
2. Fit a tree $h_t$ to the residuals $r_i^{(t)}$ using squared error.
3. Update $F_t(\mathbf{x}) = F_{t-1}(\mathbf{x}) + \nu \cdot h_t(\mathbf{x})$.

For squared-error regression, $r_i = y_i - F(\mathbf{x}_i)$ — literally the residual. For other losses (logistic, Poisson, Huber), the negative gradient gives the right direction in functional space.

This generalisation is the conceptual leap from AdaBoost: any loss with a gradient becomes boostable.

## XGBoost: second-order + engineering

XGBoost (Chen, Guestrin, KDD 2016) made GBM a production tool. Three improvements over Friedman's original:

- **Second-order Taylor expansion** of the loss. At each split, decide using both the gradient $g_i$ and Hessian $h_i$ of the loss at the current prediction. The split objective becomes

$$
\mathcal{L}_\text{split} \;=\; -\tfrac{1}{2} \frac{(\sum_{i \in L} g_i)^2}{\sum_{i \in L} h_i + \lambda} - \tfrac{1}{2} \frac{(\sum_{i \in R} g_i)^2}{\sum_{i \in R} h_i + \lambda} + \tfrac{1}{2} \frac{(\sum_i g_i)^2}{\sum_i h_i + \lambda} + \gamma.
$$

This is essentially Newton-Raphson per leaf: faster convergence than first-order GBM.

- **Regularisation built in.** The $\lambda$ term penalises large leaf values; $\gamma$ penalises adding leaves. Both control complexity directly during tree growth, not just via post-hoc pruning.
- **Engineering** — sparse-feature optimisation, parallelised split finding, column subsampling, cache-aware histograms. These are why XGBoost is fast in practice.

XGBoost won the majority of Kaggle tabular competitions from 2015 to 2018 and remains the reference implementation.

## LightGBM and CatBoost

Two notable successors:

- **LightGBM** (Microsoft, 2017) — leaf-wise tree growth (split the leaf with maximum loss reduction, ignoring depth) and **GOSS / EFB**, sampling techniques that drastically reduce per-iteration cost. Faster training than XGBoost at comparable accuracy. Default for very large tabular data.
- **CatBoost** (Yandex, 2017) — special handling for categorical features ("ordered boosting" to prevent target leakage) and symmetric-tree growth. Often the strongest baseline when the dataset has many high-cardinality categoricals.

Practically: try LightGBM first for raw speed, CatBoost when you have lots of categoricals, XGBoost when you want the ecosystem support and battle-tested stability.

## Hyperparameter knobs that matter

For a quick-tune of any GBM:

- **Learning rate** $\nu$: 0.01–0.1. Smaller needs more trees, generalises better.
- **Number of trees** $T$: 100–2000, with **early stopping** on a validation set.
- **Max depth** or max leaves: 4–10 typically. Shallow trees + many of them generalise better than fewer-but-deep trees.
- **Subsample** rows and columns: 0.5–1.0. Bagging-style randomness improves generalisation.
- **L2 regularisation** $\lambda$: 0.1–10.0. Often defaulted to small but worth tuning.

A reasonable default: $\nu = 0.05$, $T = 1000$ with early stopping at patience 50, depth 6, subsample 0.8, colsample 0.8.

## Why GBMs win on tabular data

Three properties make GBMs the strong default for tabular ML:

- **Heterogeneous features** — handles continuous, categorical, ordinal, missing values without preprocessing.
- **Non-linear interactions** — trees automatically capture them; deep nets need tons of data and the right architecture.
- **Strong inductive bias for tabular** — axis-aligned splits match the structure of typical tabular data better than smooth functions like neural nets impose.

The classic *Why do tree-based models still outperform deep learning on tabular data?* (Grinsztajn, Oyallon, Varoquaux, NeurIPS 2022) gives the empirical evidence and partial theoretical justification.

## When deep learning wins

Deep tabular models (TabNet, FT-Transformer, SAINT) close the gap on **very large datasets** ($N > 10^6$) and dominate when you can pretrain on a related corpus or when input is mixed-modality (e.g., tabular + text + images). For most production tabular problems with $N < 10^5$, GBMs remain the right choice.

## What to read next

- [Decision Trees](./decision-trees) — the base learner.
- [AdaBoost](./adaboost) — the historical precursor.
- [Random Forests](./random-forests) — the bagging-based competitor.
