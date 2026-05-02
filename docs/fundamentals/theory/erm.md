---
title: Empirical Risk Minimization
order: 3
---

# Empirical Risk Minimization

Empirical Risk Minimization (ERM) is the foundational principle of supervised learning: pick the hypothesis from a chosen class that minimises **average loss on the training set**, and hope that minimising training loss approximately minimises true loss on unseen data. Almost every supervised method in this curriculum is an instance of ERM with different choices of hypothesis class and loss.

## The setup

Assume samples $(\mathbf{x}, y)$ are drawn i.i.d. from an unknown distribution $\mathcal{D}$. A **hypothesis class** $\mathcal{H}$ is the set of candidate predictors (linear models, decision trees, neural nets of fixed architecture). A **loss function** $\ell(h(\mathbf{x}), y)$ scores how badly hypothesis $h$ predicts $y$. The **true risk** of $h$ is

$$
R(h) \;=\; \mathbb{E}_{(\mathbf{x}, y) \sim \mathcal{D}}\bigl[\ell(h(\mathbf{x}), y)\bigr].
$$

We never observe $\mathcal{D}$, so we cannot evaluate $R(h)$ directly. Given a training set $S = \{(\mathbf{x}_i, y_i)\}_{i=1}^N$, the **empirical risk** is

$$
\hat{R}_S(h) \;=\; \frac{1}{N} \sum_{i=1}^N \ell(h(\mathbf{x}_i), y_i).
$$

ERM picks

$$
\hat{h} \;=\; \arg\min_{h \in \mathcal{H}} \hat{R}_S(h).
$$

This is the algorithmic core — train by minimising the average training-set loss.

## Why ERM works

ERM works because of two things working together:

1. **Concentration** — for fixed $h$, $\hat{R}_S(h) \to R(h)$ as $N \to \infty$ by the law of large numbers. With i.i.d. samples and bounded loss, Hoeffding's inequality gives an exponential rate.
2. **Uniform convergence** — for the *whole* class $\mathcal{H}$, $\sup_{h \in \mathcal{H}} |\hat{R}_S(h) - R(h)|$ also goes to zero, provided $\mathcal{H}$ is not too rich. This is the part that's non-trivial — it's what [VC dimension](./generalization) and Rademacher complexity quantify.

Combining: if uniform convergence holds, then $\hat{h}$ — chosen by ERM — has true risk close to the best in the class. Formally, with high probability:

$$
R(\hat{h}) \;\leq\; \min_{h \in \mathcal{H}} R(h) + 2\, \sup_{h \in \mathcal{H}} |\hat{R}_S(h) - R(h)|.
$$

The second term is the **estimation error** controlled by sample size and class complexity; the first is the **approximation error** — how good the *best* hypothesis in $\mathcal{H}$ is.

## Approximation vs estimation: the bias-variance link

The decomposition

$$
R(\hat{h}) \;=\; \underbrace{\min_{h \in \mathcal{H}} R(h)}_{\text{approximation}} + \underbrace{R(\hat{h}) - \min_{h \in \mathcal{H}} R(h)}_{\text{estimation}}
$$

is the formal version of the [bias-variance tradeoff](./bias-variance). A bigger $\mathcal{H}$ lowers approximation error (better best-in-class) but raises estimation error (harder to find the best from limited data). The art of model selection is balancing them.

## Structural Risk Minimization

*Structural Risk Minimization* (Vapnik, 1971) is the upgrade for choosing $\mathcal{H}$ itself. Instead of fixing one class, consider a sequence $\mathcal{H}_1 \subset \mathcal{H}_2 \subset \dots$ of increasing complexity (e.g., polynomial degree 1, 2, 3, ...). For each $k$, ERM gives $\hat{h}_k$. SRM picks the level $k^*$ minimising

$$
\hat{R}_S(\hat{h}_k) + \mathrm{penalty}(\mathcal{H}_k, N),
$$

where the penalty is a complexity term (VC-dimension based, Rademacher, or AIC/BIC). This is the principled answer to "how big should my model be?". Modern regularisation methods ([ridge, lasso](../classical/ridge-lasso), weight decay) are continuous relaxations of SRM — penalising in-class parameter norm rather than discretely choosing a class.

## ERM in practice

For most modern ML, ERM looks like:

- **Hypothesis class** — neural network of a chosen architecture.
- **Loss** — task-appropriate (cross-entropy, MSE, contrastive).
- **Optimiser** — [SGD](../../dnn/optimization/sgd) or [Adam](../../dnn/optimization/adam) on $\hat{R}_S$.
- **Regularisation / model selection** — combination of weight decay, dropout, augmentation, cross-validation.

The classical theory assumes ERM finds the global minimum of $\hat{R}_S$. For convex problems this is true; for deep networks, [SGD finds something else](../../dnn/regularization/double-descent) — a flat, low-norm minimum that the implicit-bias literature is still working to characterise. The empirical fact is that this *something else* generalises remarkably well, even though classical ERM theory does not directly explain why.

## What to read next

- [Bias-Variance Tradeoff](./bias-variance) — the same decomposition in different vocabulary.
- [Generalization & VC Dimension](./generalization) — formal sample-complexity bounds.
- [PAC Learning](./pac-learning) — ERM's success criterion in the PAC framework.
