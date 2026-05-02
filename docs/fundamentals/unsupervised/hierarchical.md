---
title: Hierarchical Clustering
order: 3
---

# Hierarchical Clustering

Hierarchical clustering builds a tree of nested groupings — a **dendrogram** — instead of committing to a single $k$-way partition. It is the right tool when you don't know the number of clusters in advance, when you want to inspect cluster structure at multiple scales, or when the data has a genuine taxonomic hierarchy (phylogenetics, document categorisation, gene expression).

## Two directions: agglomerative and divisive

- **Agglomerative (bottom-up)** — start with each point as its own cluster, repeatedly merge the two closest clusters until one remains. The standard choice; runs in $O(N^2 \log N)$ with a priority queue.
- **Divisive (top-down)** — start with one cluster, recursively split. Conceptually cleaner but $O(2^N)$ in worst case; rarely used directly.

The output is a **dendrogram** — a binary tree whose leaves are points and whose internal nodes record merge events with associated heights (the merge distance). Cutting the dendrogram at a chosen height gives a flat clustering.

## Linkage criteria

Once you've defined a distance $d$ between *individual points*, agglomerative clustering needs a **linkage criterion** to define distance between *clusters*. The four standard choices give qualitatively different cluster shapes:

- **Single linkage** — $d(A, B) = \min_{a \in A, b \in B} d(a, b)$. Distance to the nearest pair. Tends to produce long, chain-like clusters ("chaining effect"); finds non-convex shapes but is sensitive to noise.
- **Complete linkage** — $d(A, B) = \max_{a \in A, b \in B} d(a, b)$. Distance to the farthest pair. Produces compact, roughly spherical clusters.
- **Average linkage** — $d(A, B) = \frac{1}{|A| |B|} \sum_{a, b} d(a, b)$. Mean pairwise distance. A reasonable compromise.
- **Ward's method** — merge the pair that produces the smallest increase in within-cluster variance. Equivalent to minimising squared error after each merge; produces variance-balanced clusters similar to those of k-means.

Ward's is the default in most practical applications; single linkage when chaining is genuinely desired (river networks, evolutionary trees); complete linkage when you want compact balls.

## Choosing where to cut

The dendrogram makes the choice of $k$ explicit and visual. Common strategies:

- **Largest gap rule** — cut at the height with the largest jump between consecutive merges. The "natural" $k$ corresponds to a sharp elbow in merge heights.
- **Fixed height** — cut at a domain-meaningful distance threshold.
- **Fixed $k$** — cut to produce exactly $k$ clusters.

Hierarchical clustering doesn't *require* a single $k$ — you can analyse the structure at multiple scales by viewing different cuts of the same dendrogram.

## Computational cost

Naive agglomerative clustering is $O(N^3)$ in time and $O(N^2)$ in memory — the $N \times N$ pairwise distance matrix is the bottleneck. Improvements:

- **Lance-Williams update** for linkage updates after each merge — keeps to $O(N^2 \log N)$.
- **SLINK / CLINK** algorithms — $O(N^2)$ for single and complete linkage.
- **HDBSCAN** — density-based hierarchical clustering with much better scalability, particularly for large noisy datasets.

For $N > 10^4$, prefer HDBSCAN or k-means with multiple $k$ over full hierarchical clustering.

## Strengths and weaknesses

Strengths:

- **No need to pre-specify $k$.** The dendrogram captures structure at all scales.
- **Deterministic** — same data always gives the same tree (up to ties).
- **Visualisable** — dendrograms are interpretable and informative on their own.
- **Works in any metric space** — no Euclidean-isotropy assumption.

Weaknesses:

- **Doesn't scale.** Quadratic memory is fatal for large datasets.
- **Greedy.** Merge decisions are never undone; an early bad merge contaminates the rest.
- **Sensitive to distance/linkage choice.** Different choices give very different trees.

## Where hierarchical clustering wins

- **Biology** — gene-expression clustering, phylogenetic trees. The hierarchical structure is real, not an artefact.
- **Document organisation** — topic taxonomies, news clustering at multiple granularities.
- **Exploratory analysis** of small ($N < 5000$) datasets where you want to see the full structure rather than commit to a single $k$.
- **As a probe** — running hierarchical clustering reveals whether your data has natural cluster scales at all.

## What to read next

- [k-Means](./kmeans) — the partitional alternative.
- [GMM & EM](./gmm-em) — soft probabilistic clustering.
- [Manifold Learning](./manifold-learning) — dimensionality reduction for clustering high-dimensional data.
