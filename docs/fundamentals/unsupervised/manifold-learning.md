---
title: Manifold Learning
order: 5
---

# Manifold Learning

[PCA](./pca-svd) is the right tool when the structure in your data is linear. **Manifold learning** addresses the more general case where high-dimensional data lies near a low-dimensional non-linear submanifold. Visualisation methods like t-SNE and UMAP are the practical workhorses; the broader literature includes Isomap, Locally Linear Embedding, and the conceptual foundation of every modern non-linear dimensionality-reduction tool.

## The manifold hypothesis

The motivating belief: real-world high-dimensional data (images, text embeddings, gene expression) lies on or near a **low-dimensional manifold** embedded in the high-dimensional ambient space. A 256×256 grayscale image lives in $\mathbb{R}^{65536}$, but the set of "natural images" occupies a vastly smaller submanifold. Manifold learning tries to recover this latent low-dimensional structure.

The hypothesis is not formally provable but is empirically well-supported — and is what makes deep representation learning work at all.

## Classical methods: Isomap, LLE, Laplacian Eigenmaps

Three pre-2010 approaches:

- **Isomap** (Tenenbaum et al., 2000) — compute pairwise **geodesic** distances by graph shortest-paths over a $k$-NN graph, then run multidimensional scaling on the geodesic distance matrix. Recovers the manifold's intrinsic distance structure.
- **Locally Linear Embedding (LLE)** (Roweis, Saul, 2000) — represent each point as a weighted sum of its neighbours, then find a low-dim embedding that preserves the local linear relationships.
- **Laplacian Eigenmaps** (Belkin, Niyogi, 2003) — build a graph Laplacian on the $k$-NN graph; the embedding is the bottom eigenvectors of the Laplacian. Closely connected to spectral clustering.

These methods are mathematically clean but produce visually mediocre embeddings on real data. They were displaced by t-SNE for visualisation purposes.

## t-SNE

*t-Distributed Stochastic Neighbor Embedding* (van der Maaten, Hinton, JMLR 2008) optimises a 2D / 3D embedding to **preserve local neighbourhood structure**.

In high-dim space, define neighbourhood probabilities

$$
p_{j \mid i} \;=\; \frac{\exp(-\|\mathbf{x}_i - \mathbf{x}_j\|^2 / 2\sigma_i^2)}{\sum_{k \neq i} \exp(-\|\mathbf{x}_i - \mathbf{x}_k\|^2 / 2\sigma_i^2)}, \qquad p_{ij} = (p_{j \mid i} + p_{i \mid j}) / 2N.
$$

In low-dim space, define

$$
q_{ij} \;=\; \frac{(1 + \|\mathbf{y}_i - \mathbf{y}_j\|^2)^{-1}}{\sum_{k \neq l} (1 + \|\mathbf{y}_k - \mathbf{y}_l\|^2)^{-1}}.
$$

Optimise the embedding by minimising $\mathrm{KL}(P \| Q) = \sum_{ij} p_{ij} \log(p_{ij} / q_{ij})$. Two design choices matter:

- **Per-point bandwidth** $\sigma_i$ chosen so each point's effective number of neighbours equals a target *perplexity* (typically 30).
- **Heavy-tailed Student-$t$** distribution in low-dim — gives the "crowding fix" that lets distant points repel, producing the characteristic well-separated clusters.

t-SNE produces beautiful visualisations of cluster structure but does not preserve **global** distances — distance between clusters in a t-SNE plot is not interpretable, only the cluster identity is. Stochastic optimisation also means runs vary; reproducibility requires fixing the seed.

## UMAP

*Uniform Manifold Approximation and Projection* (McInnes, Healy, Melville, 2018) is the modern successor to t-SNE. The math is rooted in topological data analysis (fuzzy simplicial sets, Riemannian manifolds), but practically:

- Faster than t-SNE — scales to millions of points.
- Better preservation of **global** structure than t-SNE.
- Configurable: a `min_dist` parameter trades local density for global separation.

UMAP is now the default 2D/3D dimensionality-reduction tool for visualising embeddings — single-cell RNA-seq, image-feature embeddings, NLP token embeddings. Its outputs are not metric-preserving, but they're informative enough that they've become the lingua franca of embedding visualisation.

## Caveats

- **Visualisation only.** t-SNE and UMAP outputs are not stable representations to use as features for downstream models. Embedding numbers depend on the algorithm seed, the hyperparameters, and even the dataset size.
- **Cluster sizes lie.** A larger cluster in a t-SNE / UMAP plot does not mean more points or larger variance — it usually just means the algorithm spread it out more.
- **Inter-cluster distance lies.** Points across clusters are not distance-meaningful.
- **Hyperparameter sensitivity.** Different perplexity / `min_dist` give qualitatively different plots. Always run multiple settings.

The Wattenberg / Viégas et al. *How to Use t-SNE Effectively* tutorial (2016) is required reading for any t-SNE / UMAP user.

## What to read next

- [PCA & SVD](./pca-svd) — the linear baseline.
- [Autoencoders](../../dnn/generative/autoencoders) — non-linear dimensionality reduction with neural networks.
- [Representation Learning](../../cv/advances/representation) — modern self-supervised learning of low-dim features.
