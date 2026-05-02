---
title: k-Means
order: 1
---

# k-Means

k-Means is the simplest clustering algorithm — partition $N$ points into $k$ clusters by alternating between assigning points to the nearest centroid and recomputing centroids as cluster means. Despite its 1957 vintage (Lloyd, published 1982), it remains the default first thing to try for unsupervised cluster discovery and the conceptual foundation for [Gaussian Mixture Models](./gmm-em).

## The objective

k-Means minimises the **within-cluster sum of squares** (WCSS):

$$
\min_{\mu_1, \dots, \mu_k,\, c} \; \sum_{i=1}^N \|\mathbf{x}_i - \boldsymbol{\mu}_{c(i)}\|^2,
$$

where $c: \{1, \dots, N\} \to \{1, \dots, k\}$ is the cluster assignment. Equivalently, partition into $k$ disjoint groups and minimise the total squared distance from each point to its group mean.

## Lloyd's algorithm

1. Initialise $k$ centroids (random points, k-means++, or external seeds).
2. **Assignment step**: $c(i) = \arg\min_j \|\mathbf{x}_i - \boldsymbol{\mu}_j\|^2$.
3. **Update step**: $\boldsymbol{\mu}_j = \frac{1}{|c^{-1}(j)|} \sum_{i: c(i) = j} \mathbf{x}_i$.
4. Repeat until assignments don't change.

Each step decreases the WCSS — assignment because each point picks its closest centroid, update because the mean is the squared-error minimiser of a fixed cluster. The algorithm converges in finitely many steps (the assignment is one of $k^N$ discrete configurations and never revisits one). It does not necessarily reach the global optimum.

## k-means++ initialisation

Random initialisation is bad — clusters end up empty or local optima dominate. **k-means++** (Arthur, Vassilvitskii, 2007) chooses initial centroids one at a time, with each new centroid sampled with probability proportional to the squared distance from the closest already-chosen centroid:

$$
P(\mathbf{x}_i \text{ chosen}) \;\propto\; \min_{\mu \in C} \|\mathbf{x}_i - \boldsymbol{\mu}\|^2.
$$

The result is provably $O(\log k)$-competitive with the optimal clustering and is the practical default in every modern implementation.

## Choosing $k$

The number of clusters is a hyperparameter, not a learned quantity. Standard heuristics:

- **Elbow method** — plot WCSS vs $k$, look for the "elbow" where additional clusters give diminishing returns.
- **Silhouette score** — for each point, $(b - a)/\max(a, b)$ where $a$ is mean intra-cluster distance and $b$ is mean nearest-other-cluster distance. Higher is better; pick $k$ maximising mean silhouette.
- **Gap statistic** (Tibshirani et al., 2001) — compare WCSS to that under a null reference distribution.
- **Domain knowledge** — sometimes you know how many clusters you want.

In practice, the elbow is often ambiguous and silhouette is the more reliable score. For high-dimensional data, all of these become unreliable simultaneously.

## Limitations

- **Spherical clusters only.** k-Means assumes clusters of similar size and shape (isotropic). Elongated, non-convex, or unequal-density clusters are recovered badly.
- **Sensitive to outliers.** Squared distance heavily penalises far points; outliers pull centroids.
- **Requires Euclidean-meaningful distances.** Use after appropriate scaling, or switch to k-medoids for non-Euclidean spaces.
- **No probability output.** A point either belongs to a cluster or doesn't — no soft assignment. [GMMs](./gmm-em) generalise this.

## Variants

- **k-medoids (PAM)** — replace centroids with actual data points; works in any metric space, more robust to outliers.
- **Mini-batch k-Means** — subsample at each step. Standard for billion-point datasets.
- **Soft k-Means / fuzzy c-means** — assign weighted membership to all clusters, intermediate between k-means and GMMs.
- **k-Means++ for general $\ell_p$** — same idea, different distance.

## When k-Means is the right tool

- **First-pass clustering** — when you don't know the structure, k-means gives a quick partition with little tuning.
- **Vector quantisation** — encoding via centroid indices for compression, retrieval, or [VQ-VAE](../../dnn/generative/vae).
- **Initialisation for GMMs** — fitting a GMM by EM benefits from k-means initialisation of means.
- **Large-scale embedding clustering** — combined with mini-batch updates, k-means scales to billions of vectors.

## What to read next

- [Gaussian Mixture Models & EM](./gmm-em) — the probabilistic generalisation.
- [Hierarchical Clustering](./hierarchical) — for variable-$k$ exploration.
- [PCA & SVD](./pca-svd) — typical pre-processing for high-dimensional data.
