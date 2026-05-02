---
title: k-Nearest Neighbors
order: 7
---

# k-Nearest Neighbors

k-Nearest Neighbors is the simplest learning algorithm — and one of the most stubborn baselines. To classify a query point, find its $k$ closest training examples by some distance metric and take a vote. To regress, average their targets. There is no training in the usual sense; the entire training set *is* the model.

## The algorithm

Given a training set $\{(\mathbf{x}_i, y_i)\}$ and a query $\mathbf{x}$:

1. Compute the distance $d(\mathbf{x}, \mathbf{x}_i)$ for every training point.
2. Pick the $k$ nearest.
3. **Classification:** return the majority label.
4. **Regression:** return the (optionally weighted) average of $y_i$ values.

The choices that matter:

- The **distance metric** $d$ — Euclidean is the default; Manhattan, cosine, Mahalanobis, or learned distances all see use.
- The number of neighbours $k$ — small $k$ gives high variance and low bias; large $k$ smooths predictions toward the global average.
- **Weighting** by $1/d$ — closer neighbours get more influence than distant ones.

## Bias-variance behaviour

kNN is the canonical example of the [bias-variance trade-off](../theory/bias-variance):

- **$k = 1$**: zero training error, very flexible, high variance. Decision boundary is the Voronoi diagram of the training set.
- **$k = N$**: predicts the global mean (or majority) for every query — maximum bias, zero variance.
- **Optimal $k$**: somewhere in between, found by [cross-validation](../theory/cross-validation).

Theoretical bound (Cover, Hart, 1967): the asymptotic error of 1-NN is at most twice the Bayes-optimal error, regardless of the metric. This is a remarkable guarantee — without any model assumptions, 1-NN is competitive with any classifier in the limit of infinite data.

## The curse of dimensionality

In $d$-dimensional spaces with large $d$, things break:

- **Distances concentrate.** For random points in high dimensions, the nearest and farthest neighbours are at almost the same distance. The "nearest neighbour" stops being informative.
- **Volume grows exponentially.** Filling a $d$-dimensional unit ball with samples of density $\geq \rho$ requires $\sim \rho^d$ samples — exponentially many.
- **Most of the volume is at the surface.** In high $d$, almost all of a ball's volume sits near its surface, not its centre.

The practical consequences: kNN works well in low/medium dimensions ($d < 50$) and degrades rapidly past that. **PCA pre-projection** or **learned embeddings** before kNN are common fixes — match in a lower-dimensional space where distances are meaningful.

## Computational cost

Naive kNN inference is $O(N d)$ per query — every query touches every training point. For modern datasets this is too slow. Standard accelerators:

- **kd-trees** — binary trees that recursively split feature space. Effective up to $d \approx 20$, then degrade to brute force.
- **Ball trees** — analogous structure with hypersphere bounds; better than kd-trees in moderate dimensions.
- **Approximate nearest neighbour** (ANN) — algorithms like FAISS, ScaNN, HNSW that trade exact correctness for sub-linear query time. The standard tool for billion-vector retrieval.

For modern systems, ANN is what matters: every retrieval-augmented LLM ([RAG](../../llm/applications/rag)), embedding-based recommender, and image-search backend is fundamentally a kNN system over a learned embedding space.

## When kNN wins

kNN is rarely the best classifier on benchmarks but consistently strong as a baseline:

- **Low-dimensional, modest data** — competitive without tuning.
- **Local structure matters** — when the function changes character across the input space, kNN naturally adapts. Linear models cannot.
- **Retrieval / embedding-based systems** — kNN over learned embeddings is the workhorse of modern recommendation, semantic search, and RAG.

## What to read next

- [Manifold Learning](../unsupervised/manifold-learning) — t-SNE / UMAP rely on local neighbour graphs.
- [PCA & SVD](../unsupervised/pca-svd) — the standard pre-projection for kNN in high $d$.
- [RAG](../../llm/applications/rag) — kNN over text embeddings is the retriever.
