---
title: Generalization & VC Dimension
order: 4
---

# Generalization & VC Dimension

[ERM](./erm) works only if the gap between training and true error vanishes uniformly over the hypothesis class. The size of that gap depends on a complexity measure of the class — what we will call its **capacity**. VC dimension is the canonical capacity measure for classification; Rademacher complexity is the modern data-dependent successor. Together they provide the formal vocabulary for "this class is too rich to learn from $N$ samples".

## What we want

A **generalisation bound** is a statement of the form: with probability $\geq 1 - \delta$ over a training set of size $N$,

$$
\sup_{h \in \mathcal{H}} \bigl| \hat{R}_S(h) - R(h) \bigr| \;\leq\; \mathcal{O}\!\left(\sqrt{\frac{\text{capacity}(\mathcal{H})}{N}}\right).
$$

Capacity matters; sample size matters more (the $\sqrt{N}$ floor); the dimension of the input does *not* appear directly. This is the core insight: complexity controls generalisation, not raw input dimension.

## The growth function and shattering

For a binary-classifier class $\mathcal{H}$ on input space $\mathcal{X}$, the **growth function** is

$$
\Pi_\mathcal{H}(N) \;=\; \max_{\mathbf{x}_1, \dots, \mathbf{x}_N \in \mathcal{X}} \,\bigl| \{\,(h(\mathbf{x}_1), \dots, h(\mathbf{x}_N)) : h \in \mathcal{H} \,\} \bigr|.
$$

It counts, in the worst case, how many distinct labellings of $N$ points the class can produce. It is at most $2^N$. A set of $N$ points is **shattered** by $\mathcal{H}$ if all $2^N$ labellings are achievable.

## VC dimension

The **Vapnik-Chervonenkis dimension** $\mathrm{VC}(\mathcal{H})$ is the largest $N$ such that some set of $N$ points is shattered by $\mathcal{H}$. Examples:

- Threshold functions on $\mathbb{R}$ — VC = 1.
- Linear classifiers in $\mathbb{R}^d$ — VC = $d + 1$.
- Axis-aligned rectangles in $\mathbb{R}^2$ — VC = 4.
- Neural network with $W$ weights — VC = $\Theta(W^2)$ for typical activations.

**Sauer's lemma** then bounds the growth function in terms of VC dimension:

$$
\Pi_\mathcal{H}(N) \;\leq\; \sum_{i=0}^{d} \binom{N}{i} \;\leq\; \left(\frac{eN}{d}\right)^d, \qquad d = \mathrm{VC}(\mathcal{H}),
$$

so the growth function is *polynomial* in $N$ once $N > d$ — even though it could in principle be exponential. This polynomial-vs-exponential gap is what gives finite-VC classes finite-sample learnability.

## The VC bound

The headline result (Vapnik, Chervonenkis 1971): with probability $\geq 1 - \delta$,

$$
\sup_{h \in \mathcal{H}} \bigl| \hat{R}_S(h) - R(h) \bigr| \;\leq\; \mathcal{O}\!\left(\sqrt{\frac{d \log(N/d) + \log(1/\delta)}{N}}\right),
$$

with $d = \mathrm{VC}(\mathcal{H})$. Sample complexity to learn within tolerance $\epsilon$ is $N = \tilde{O}(d / \epsilon^2)$. This is the formal "you need samples to match capacity" theorem, and the basis of [PAC learning](./pac-learning).

## Rademacher complexity

A more refined, **data-dependent** capacity measure is the **Rademacher complexity**

$$
\mathfrak{R}_N(\mathcal{H}) \;=\; \mathbb{E}_{S, \boldsymbol{\sigma}}\!\left[ \sup_{h \in \mathcal{H}} \frac{1}{N} \sum_{i=1}^N \sigma_i\, h(\mathbf{x}_i) \right],
$$

with $\sigma_i \in \{-1, +1\}$ independent random signs. It measures how well the class can fit *random* labels — high Rademacher complexity = the class can memorise noise = poor generalisation. Bounds analogous to VC-bound replace the $\sqrt{d/N}$ term with $\mathfrak{R}_N(\mathcal{H})$, and are typically tighter for real distributions.

## The deep-learning paradox

Deep networks have **enormous VC dimension** — typically $\Omega(W \log W)$ in the weight count $W$, often exceeding the dataset size by orders of magnitude. Classical bounds predict no generalisation. But they generalise.

*Understanding Deep Learning Requires Rethinking Generalization* (Zhang, Bengio, Hardt, Recht, Vinyals, ICLR 2017) demonstrated this concretely: deep networks fit random labels on CIFAR-10 to zero training error (so VC capacity is genuinely huge) but on real labels they generalise. Standard generalisation bounds become vacuous.

The resolution is partial:

- **Implicit bias of SGD** — among the many zero-train-loss solutions, SGD finds flat, low-norm ones (see [double descent](../../dnn/regularization/double-descent)).
- **Algorithm-dependent bounds** — *PAC-Bayes* and *stability-based bounds* depend on the optimiser as well as the class, and give non-vacuous predictions for some deep networks.
- **Data-dependent capacity** — Rademacher complexity restricted to *low-norm* sub-class can be much smaller than worst-case VC.

The full theoretical picture is still incomplete, but the framework — capacity controls generalisation — survives. What changed is the right notion of capacity for over-parameterised networks.

## What to read next

- [PAC Learning](./pac-learning) — the framework VC bounds plug into.
- [ERM](./erm) — the algorithm whose success VC theory analyses.
- [Double Descent](../../dnn/regularization/double-descent) — the modern correction to classical generalisation bounds.
