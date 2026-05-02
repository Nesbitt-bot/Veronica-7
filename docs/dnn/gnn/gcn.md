---
title: Graph Convolutional Networks
order: 1
---

# Graph Convolutional Networks

A graph convolutional network applies a learnable linear operation to each node, mixing in information from its neighbours. The classical GCN of Kipf & Welling is the simplest reference architecture and the entry point to graph deep learning. The trick is identifying what "convolution" should mean on an irregular graph — and the answer comes from spectral graph theory.

## Spectral motivation

For a graph $G$ with $N$ nodes, adjacency matrix $A$, and degree matrix $D$, the **normalised graph Laplacian** is

$$
\tilde{L} \;=\; I - D^{-1/2} A D^{-1/2}.
$$

Its eigendecomposition $\tilde{L} = U \Lambda U^\top$ gives the **graph Fourier basis** $U$. A signal $\mathbf{x} \in \mathbb{R}^N$ is filtered by $\mathbf{y} = U g_\theta(\Lambda) U^\top \mathbf{x}$, with $g_\theta$ a learnable diagonal filter in the spectral domain.

Computing $U$ is $O(N^3)$ — infeasible. *Convolutional Neural Networks on Graphs with Fast Localized Spectral Filtering* (Defferrard, Bresson, Vandergheynst, NeurIPS 2016) approximates $g_\theta(\Lambda)$ as a **truncated Chebyshev polynomial** of order $K$, giving $K$-localised filters at $O(K|E|)$ cost (no eigendecomposition).

## The Kipf-Welling GCN

*Semi-Supervised Classification with Graph Convolutional Networks* (Kipf, Welling, ICLR 2017) takes the Chebyshev approximation to first order ($K=1$) and applies a renormalisation trick. The result is the now-canonical layer:

$$
H^{(l+1)} \;=\; \phi\!\left( \hat{A} H^{(l)} W^{(l)} \right), \qquad \hat{A} = \tilde{D}^{-1/2} (A + I) \tilde{D}^{-1/2},
$$

where $\tilde{D}$ is the degree matrix of $A + I$. Three things happen at each layer:

1. **Self-loops** ($A + I$) keep the node's own features in the mix.
2. **Symmetric normalisation** ($\tilde{D}^{-1/2} \cdot \tilde{D}^{-1/2}$) prevents activation magnitude from depending on node degree.
3. **Linear feature transformation** ($W^{(l)}$) followed by activation $\phi$ (typically ReLU).

A 2-layer GCN with one hidden layer was the original benchmark for **semi-supervised node classification** on Cora, Citeseer, and Pubmed — beating contemporaneous label-propagation and deep-walk baselines by large margins.

## What GCN computes, intuitively

Each layer is a **single hop of neighbour averaging plus a linear transform**. Stacking $L$ layers gives each node access to its $L$-hop neighbourhood. The expressive limit at $L = $ small is fundamentally the **Weisfeiler-Lehman colour refinement** — GCN cannot distinguish graphs that 1-WL cannot distinguish. This is the formal link to graph isomorphism testing and the motivation for more expressive variants like GIN (Graph Isomorphism Network, Xu et al., ICLR 2019).

## Over-smoothing

Stacking many GCN layers produces a counter-intuitive failure: node representations **converge to identical values** across the graph (in the limit, they project onto the principal eigenvector of $\hat{A}$). After 4–6 layers, accuracy on most benchmarks degrades. Practical work-arounds:

- **Skip connections** (similar to ResNet) — *JKNet* (Xu et al., ICML 2018), *GCNII* (Chen et al., ICML 2020).
- **Graph normalisation layers** that explicitly counter representational collapse.
- **Mixed local–global architectures** (e.g., Graph Transformers).

The over-smoothing limitation is the reason most production GNNs are 2–3 layers deep.

## What GCN is good for

- **Node classification** on citation, social, and recommendation graphs.
- **Link prediction** and **graph classification** with appropriate readout heads.
- **Drug discovery** — molecules as graphs; a workhorse architecture in cheminformatics.
- **Recommender systems** — bipartite user-item graphs, with GCN as the embedding model.

## What to read next

- [Message Passing & GraphSAGE](./message-passing) — the more general framework GCN is a special case of.
- [Graph Attention Networks](./gat) — replace fixed adjacency weighting with learned attention.
- [Convolution & Pooling](../cnn/convolution) — the regular-grid analogue.
