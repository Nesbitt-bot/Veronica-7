---
title: Bagging & Random Forests
order: 2
---

# Bagging & Random Forests

A single [decision tree](./decision-trees) has high variance — small changes in the training set produce wildly different trees. **Bagging** (Bootstrap AGGregatING; Breiman, 1996) reduces this variance by averaging many trees fit on bootstrap resamples. **Random forests** (Breiman, 2001) extend bagging with random feature subsampling at each split, decorrelating the individual trees and giving the strongest variance reduction. Random forests have remained one of the most reliable tabular-data baselines for two decades.

## Bagging

Given a training set $\mathcal{D}$ of size $N$, generate $B$ bootstrap samples — each obtained by sampling $N$ points from $\mathcal{D}$ **with replacement**. Train one model $f_b$ on each sample. The bagged predictor averages:

$$
\hat{f}_\text{bag}(\mathbf{x}) \;=\; \frac{1}{B} \sum_{b=1}^B f_b(\mathbf{x}).
$$

For classification, **majority vote** instead of average. The variance of the average is

$$
\mathrm{Var}\!\left(\hat{f}_\text{bag}\right) \;=\; \frac{\sigma^2}{B} + \rho \cdot \sigma^2 \cdot \frac{B - 1}{B},
$$

where $\sigma^2$ is the per-tree variance and $\rho$ is the average pairwise correlation between bootstrap-sampled trees. As $B \to \infty$, the variance approaches $\rho \sigma^2$ — the correlation $\rho$ is the binding constraint, not $B$.

Bagging works well only if the base learner is **unstable** (high-variance). Decision trees fit the bill perfectly. Bagging stable learners (linear models) gives little improvement.

## Out-of-bag estimation

Each bootstrap sample omits about $1/e \approx 37\%$ of the original training points. These **out-of-bag (OOB)** points provide a free validation set: for each $\mathbf{x}_i$, average over the trees that did *not* see $\mathbf{x}_i$ during training:

$$
\hat{R}_\text{OOB} \;=\; \frac{1}{N} \sum_i \ell\!\left(y_i,\; \mathrm{avg}_{b: i \notin \mathcal{D}_b} f_b(\mathbf{x}_i)\right).
$$

OOB error tracks test error closely, eliminating the need for a separate held-out validation set in many practical settings.

## Random forests

Bagged trees are correlated through their shared training distribution. Random forests reduce $\rho$ further by adding **random feature subsampling**: at each split, choose the best split using only a random subset of $m$ features (out of $d$).

Standard choices:

- **Classification**: $m = \lfloor \sqrt{d} \rfloor$.
- **Regression**: $m = \lfloor d/3 \rfloor$.

This injects independent randomness into every split, sharply reducing $\rho$ between trees. Empirically, random forests dominate plain bagged trees on almost every benchmark, with negligible additional cost.

Other practical defaults:

- Grow each tree fully (no pruning) — bias is already low; only variance matters.
- $B \in [100, 1000]$ trees. Performance saturates around 500 for most problems.

## Feature importance

Random forests provide two natural importance measures:

- **Mean decrease in impurity (MDI / Gini importance)** — sum of impurity decreases over all splits using a feature, averaged across trees. Cheap but biased toward high-cardinality features.
- **Permutation importance** — measure OOB accuracy, then permute one column and re-measure; the drop is that feature's importance. Slower but unbiased.

Both are diagnostic, not formal hypothesis tests. Random forest feature importances are the standard quick-look tool when you want to know "what matters?" in a tabular problem.

## When random forests win

- **Tabular data, mixed types** — RFs are typically the strongest single-method baseline.
- **Limited data** — OOB estimation gives clean cross-validation almost for free.
- **You need a calibration of feature importance.**
- **No tuning budget** — RFs work well out-of-the-box; the hyperparameters are forgiving.

When [gradient boosting](./gradient-boosting) (XGBoost, LightGBM, CatBoost) wins:

- Slightly higher accuracy ceiling on most tabular benchmarks at the cost of more careful hyperparameter tuning.
- Both belong in the toolkit — RFs as the no-tune baseline, GBMs as the tuned competitor.

## What to read next

- [Decision Trees](./decision-trees) — the base learner.
- [Gradient Boosting](./gradient-boosting) — the sequential alternative to bagging.
- [AdaBoost](./adaboost) — the historical predecessor of gradient boosting.
