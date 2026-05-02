---
title: AdaBoost
order: 3
---

# AdaBoost

AdaBoost — Adaptive Boosting — was the first practical boosting algorithm and the conceptual breakthrough that "weak learners can be combined into a strong learner". It paved the way for [gradient boosting](./gradient-boosting) and the entire family of sequentially-trained ensembles. Despite its 1995 vintage, it remains one of the cleanest illustrations of how reweighting hard examples produces strong classifiers.

## The algorithm

Given training data $\{(\mathbf{x}_i, y_i)\}$ with $y_i \in \{-1, +1\}$, AdaBoost (Freund & Schapire, 1995) trains $T$ weak classifiers sequentially:

Initialise weights $w_i^{(1)} = 1/N$ for all $i$. For $t = 1, \dots, T$:

1. Fit weak classifier $h_t$ to weighted training set, minimising weighted error $\epsilon_t = \sum_i w_i^{(t)} \mathbb{1}[h_t(\mathbf{x}_i) \neq y_i]$.
2. Compute classifier weight $\alpha_t = \tfrac{1}{2} \log\bigl((1 - \epsilon_t)/\epsilon_t\bigr)$.
3. Update sample weights: $w_i^{(t+1)} \propto w_i^{(t)} \exp\bigl(-\alpha_t y_i h_t(\mathbf{x}_i)\bigr)$.

The final classifier is

$$
H(\mathbf{x}) \;=\; \mathrm{sign}\!\left( \sum_{t=1}^T \alpha_t h_t(\mathbf{x}) \right).
$$

Misclassified examples have their weights *increased*; correctly-classified examples have them decreased. The next weak learner is forced to focus on the points its predecessors got wrong.

## The weak learner

The canonical weak learner is a **decision stump** — a one-split tree. A stump per feature is the simplest possible classifier; AdaBoost combines hundreds of stumps to produce a strong classifier. This is the surprising part: linear combinations of stumps cover a much richer hypothesis class than any one stump, and AdaBoost finds an efficient combination.

The **weak learner condition**: each $h_t$ must achieve $\epsilon_t < 1/2$ on its weighted training set — better than random. This is a much weaker requirement than what a "good" classifier must do. Schapire's 1990 result that *the existence of any weak learner implies the existence of a strong learner* is one of the foundational results of computational learning theory.

## Margin theory

AdaBoost dramatically reduces *training* error — exponentially fast, in fact:

$$
\hat{R}(H) \;\leq\; \prod_{t=1}^T 2\sqrt{\epsilon_t (1 - \epsilon_t)},
$$

which is $\leq \exp(-2 \sum_t \gamma_t^2)$ for $\gamma_t = 1/2 - \epsilon_t$.

Yet test error often keeps decreasing **even after training error reaches zero**. Schapire et al.'s margin-based explanation (1998): AdaBoost continues to **enlarge the classification margin** of training examples even past zero training error, and large margins generalise. This was an early hint at the implicit regularisation that [over-parameterised deep networks](../../dnn/regularization/double-descent) later exhibited.

## Exponential loss

AdaBoost is equivalent to greedy minimisation of the **exponential loss**:

$$
\mathcal{L}(H) \;=\; \sum_i \exp\bigl(-y_i H(\mathbf{x}_i)\bigr).
$$

In each round, the algorithm picks the $h_t$ that most reduces this loss in a coordinate-descent step. This is the connection to [gradient boosting](./gradient-boosting), which generalises to arbitrary differentiable losses.

## Strengths and weaknesses

Strengths:

- **Few hyperparameters** — number of rounds $T$ is essentially the only knob.
- **Strong margin guarantees** — performs well even past zero training error.
- **Provable** — clean PAC-style learning bounds.

Weaknesses:

- **Sensitive to label noise** — exponential loss heavily penalises misclassified points; a mislabelled outlier gets reweighted to dominate the training distribution. Real-world noisy data hurts AdaBoost more than random forests.
- **Sequential** — cannot be parallelised across rounds (unlike bagging).
- **Mostly displaced by [gradient boosting](./gradient-boosting)** — XGBoost / LightGBM use the same sequential idea with smarter losses (logistic, squared) and tree structure.

## Legacy

AdaBoost is rarely the right modern choice but is the **conceptual ancestor** of every modern boosting algorithm. Reading the 1995 paper alongside an XGBoost tutorial makes the lineage clean: same sequential structure, same focus-on-residual mechanic, but generalised loss and tree-specific optimisations.

## What to read next

- [Gradient Boosting](./gradient-boosting) — the modern descendant.
- [Decision Trees](./decision-trees) — the typical weak learner.
- [Random Forests](./random-forests) — the bagging-based contrast.
