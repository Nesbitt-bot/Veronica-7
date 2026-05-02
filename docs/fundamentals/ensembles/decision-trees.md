---
title: Decision Trees
order: 1
---

# Decision Trees

A decision tree is a recursive partitioning of feature space — at each internal node, split on a single feature with a threshold; each leaf has a predicted label or value. Single trees are interpretable but high-variance; ensembled into [random forests](./random-forests) and [gradient-boosted trees](./gradient-boosting) they become some of the strongest classical-ML models, especially on tabular data.

## How a tree predicts

Each leaf $L$ stores a prediction:

- **Classification** — majority class of training points in $L$, or class probabilities proportional to counts.
- **Regression** — mean of $y$ values in $L$.

To predict for a new $\mathbf{x}$, walk from root to leaf using each node's split rule.

## How a tree is built (greedy recursion)

The algorithm is depth-first greedy:

1. At the current node with training set $S$, pick the **(feature, threshold)** pair that maximises a split-quality measure.
2. Split $S$ into $S_\text{left}$ and $S_\text{right}$ accordingly.
3. Recurse on each subset.
4. Stop when a stopping criterion is met (max depth, min samples per leaf, no improvement).

The choice of split-quality measure defines the algorithm.

## Split criteria

For classification, the standard measures are **impurity reductions**:

- **Gini impurity** — $G = 1 - \sum_k p_k^2$. Minimised when one class dominates.
- **Entropy** — $H = -\sum_k p_k \log p_k$. The information-theoretic measure.

A split's quality is the weighted-average impurity of children, subtracted from the parent's impurity (the **information gain**). Gini and entropy give very similar trees — Gini is slightly cheaper to compute and is CART's default.

For regression, the standard split is **variance reduction**: minimise $\sum_\text{children} N_c \cdot \mathrm{Var}(y_c)$. Equivalent to minimising squared error if the leaf prediction is the mean.

## Three classical algorithms

- **ID3** (Quinlan, 1986) — entropy-based, categorical features only, no pruning.
- **C4.5** (Quinlan, 1993) — handles continuous features, missing values, post-hoc pruning. Information-gain-ratio normalises against split fan-out.
- **CART** (Breiman et al., 1984) — Classification and Regression Trees. Binary splits, Gini impurity for classification, squared error for regression. The basis of most modern implementations including scikit-learn's.

## Overfitting and pruning

A fully-grown tree can perfectly memorise the training set — every leaf is a single training point. This generalises terribly. Two control strategies:

- **Pre-pruning** — stop splitting early. Limit max depth, min samples per leaf, or minimum impurity decrease.
- **Post-pruning** — grow the tree fully, then collapse subtrees that don't help on a validation set. **Cost-complexity pruning** (CART's α-pruning) selects the subtree minimising $\sum (\text{leaf error}) + \alpha \cdot |\text{leaves}|$.

Even with pruning, single trees have high variance — small changes in the training set produce very different trees. This is the central motivation for ensembles.

## Strengths and weaknesses

Strengths:

- **Interpretable** — easy to read, even for non-experts. Each prediction has a clear path of "if-then" rules.
- **No feature scaling needed** — splits are scale-invariant.
- **Handles mixed types** — continuous, categorical, ordinal features all work.
- **Handles missing values** — surrogate splits in CART, or just sending NaN down a chosen branch in modern implementations.
- **Captures non-linear interactions** automatically.

Weaknesses:

- **High variance** as a single tree. Mostly fixed by ensembling.
- **Greedy** — no global optimisation; bad early splits can't be undone.
- **Axis-aligned only** — diagonal decision boundaries require many splits.
- **Extrapolation fails** — predictions are constant within each leaf, so trees don't extrapolate beyond their training range.

## Why trees ensemble so well

Trees are perfect base learners for ensembles because they are **high-variance, low-bias** — averaging or boosting many trees reduces variance without reintroducing bias. The next three pages — [random forests](./random-forests), [AdaBoost](./adaboost), [gradient boosting](./gradient-boosting) — each operationalise this differently.

## What to read next

- [Random Forests](./random-forests) — bagging trees + feature subsampling.
- [Gradient Boosting](./gradient-boosting) — sequentially fit trees to residuals.
- [AdaBoost](./adaboost) — the historical first ensemble of stumps.
