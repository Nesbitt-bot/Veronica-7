---
title: Message Passing & GraphSAGE
order: 2
---

# Message Passing & GraphSAGE

The Message Passing Neural Network (MPNN) framework generalises [GCN](./gcn), [GAT](./gat), GraphSAGE, and most other GNNs into a single template: at each layer, every node sends a **message** to its neighbours, aggregates the messages it receives, and updates its state. Almost all graph deep learning fits this skeleton, and the engineering choices — what's a message, how to aggregate, how to update — are how variants differ.

## The MPNN abstraction

*Neural Message Passing for Quantum Chemistry* (Gilmer et al., ICML 2017) named and formalised the framework. At layer $\ell$, for each node $v$ with neighbours $\mathcal{N}(v)$:

$$
\begin{aligned}
\mathbf{m}_v^{(\ell+1)} &= \mathrm{AGG}\!\left(\bigl\{ M_\ell\bigl(\mathbf{h}_u^{(\ell)}, \mathbf{h}_v^{(\ell)}, \mathbf{e}_{uv}\bigr) : u \in \mathcal{N}(v) \bigr\}\right), \\
\mathbf{h}_v^{(\ell+1)} &= U_\ell\!\left(\mathbf{h}_v^{(\ell)}, \mathbf{m}_v^{(\ell+1)}\right).
\end{aligned}
$$

- $M_\ell$ — message function (often an MLP over $\mathbf{h}_u, \mathbf{h}_v$, edge features $\mathbf{e}_{uv}$).
- $\mathrm{AGG}$ — permutation-invariant aggregator (sum, mean, max).
- $U_\ell$ — update function (an MLP, GRU cell, or LSTM cell).

GCN, GAT, GraphSAGE, GIN, and Graph Transformers all fit this template — they differ in $M_\ell$ and $\mathrm{AGG}$.

## Choice of aggregator

The aggregator's expressive power is more important than $M_\ell$. *How Powerful are Graph Neural Networks?* (Xu et al., ICLR 2019) showed that **sum aggregation** (with a deep update MLP) achieves the maximum expressive power compatible with the 1-Weisfeiler-Lehman test, while **mean** and **max** strictly under-fit some structural distinctions. The GIN architecture from that paper is the cleanest "maximally expressive" reference GNN.

For tasks where node degree matters (e.g., chemistry — atom valence is a function of degree), use sum. For degree-invariant tasks, use mean or max — they give scale-stable representations.

## GraphSAGE — sampling for large graphs

*Inductive Representation Learning on Large Graphs* (Hamilton, Ying, Leskovec, NeurIPS 2017) addressed the scaling failure of GCN on graphs with millions of nodes. GCN is **transductive** — every layer touches the full $N \times N$ adjacency. GraphSAGE is **inductive**: at each layer, **sample** a fixed-size random subset of neighbours rather than using all of them. This makes per-node compute constant in graph size and lets the model generalise to nodes (or graphs) unseen at training time.

GraphSAGE's three aggregator choices — mean, LSTM (over a randomly-ordered neighbour sequence), and pooling (max over per-neighbour MLPs) — became the standard menu for production GNN deployments. The neighbour-sampling idea is the **architectural foundation of every billion-node GNN system today** (PinSage, GraphSAINT, Cluster-GCN).

## Training schemes

For node-level tasks on a single large graph, two regimes:

- **Full-batch** — load the full adjacency, compute messages everywhere. Fastest convergence, hits memory ceiling around $\sim$1M nodes.
- **Mini-batch with neighbour sampling** (GraphSAGE-style) — sample $k$ neighbours per node per layer; sample target nodes per batch. Scales to billions of nodes; typically requires more epochs to match full-batch quality.

For graph-level tasks (chemistry, molecule property prediction), each graph is small (~50 nodes) and a normal mini-batch pools many graphs into one disconnected mega-graph processed in parallel.

## Position vs structure

Vanilla MPNN messages are based purely on graph structure — they do not know "where" in the graph a node is. *Graph Transformers* (Ying et al., NeurIPS 2021) and *GraphGPS* (Rampášek et al., NeurIPS 2022) add **positional encodings** derived from Laplacian eigenvectors or random walks, restoring the global-context capacity that pure local message passing lacks. This is structurally analogous to positional encodings in [Transformers](../../llm/basics/transformer).

## What MPNN cannot do

The 1-WL upper bound means MPNNs cannot:

- Distinguish certain regular graphs (e.g., two non-isomorphic 3-regular graphs).
- Reliably count subgraphs or identify cycles beyond a fixed size.
- Capture long-range dependencies past their depth (and depth is limited by [over-smoothing](./gcn)).

Higher-order GNNs (k-WL), subgraph GNNs, and Graph Transformers exist precisely to push past these limits.

## What to read next

- [Graph Convolutional Networks](./gcn) — the MPNN special case that started it.
- [Graph Attention Networks](./gat) — message passing with learned weights instead of fixed adjacency.
- [Transformer (LLM)](../../llm/basics/transformer) — the graph attention generalisation when every pair is an edge.
