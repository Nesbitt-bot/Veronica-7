---
title: Graph Attention Networks
order: 3
---

# Graph Attention Networks

[GCN](./gcn) and [GraphSAGE](./message-passing) aggregate neighbour features with **fixed weights** — either uniform or degree-normalised. The Graph Attention Network (GAT) replaces these fixed weights with **learned attention** between each node and its neighbours, the same conceptual move that took NLP from RNN+attention to the Transformer.

## The GAT layer

*Graph Attention Networks* (Veličković, Cucurull, Casanova, Romero, Liò, Bengio, ICLR 2018) defines, for node $i$ with features $\mathbf{h}_i \in \mathbb{R}^F$:

$$
e_{ij} \;=\; \mathrm{LeakyReLU}\!\left( \mathbf{a}^\top [W \mathbf{h}_i \,\|\, W \mathbf{h}_j] \right), \qquad \alpha_{ij} \;=\; \frac{\exp(e_{ij})}{\sum_{k \in \mathcal{N}(i)} \exp(e_{ik})}.
$$

The weights $\alpha_{ij}$ are computed **only over $i$'s neighbourhood** $\mathcal{N}(i)$, not the whole graph — this is what keeps GAT scalable. The output is the attention-weighted sum

$$
\mathbf{h}_i' \;=\; \phi\!\left( \sum_{j \in \mathcal{N}(i)} \alpha_{ij} \, W \mathbf{h}_j \right).
$$

Multi-head attention concatenates (or averages, in the final layer) $K$ independent attention computations, exactly as in a [Transformer](../../llm/basics/transformer).

## Why attention helps

In GCN, the neighbour weight $\hat{A}_{ij}$ depends only on degrees — every neighbour is interchangeable up to a constant. GAT gives the model the **freedom to attend more to relevant neighbours** based on their features, not just the graph topology. Concrete wins:

- **Heterogeneous neighbourhoods** — when neighbours have very different roles (e.g., a paper cited by both reviews and primary research), GAT can up-weight the relevant subset.
- **Transferability** — the same model trained on one graph generalises better to graphs with different degree distributions, because attention weights adapt locally.
- **Interpretability** — $\alpha_{ij}$ can be visualised as a per-edge importance.

## GAT and the WL hierarchy

GAT does not exceed [GCN](./gcn) in the formal expressivity sense — both fit within the 1-Weisfeiler-Lehman bound (see [message passing](./message-passing)). What GAT improves is **practical generalisation**: the same architectural class fits real data better because attention provides a flexible inductive bias.

## GATv2 — fixing static attention

*How Attentive are Graph Attention Networks?* (Brody, Alon, Yahav, ICLR 2022) pointed out a subtle flaw in the original GAT: because the attention scoring is

$$
e_{ij} = \mathrm{LeakyReLU}(\mathbf{a}^\top [W \mathbf{h}_i \| W \mathbf{h}_j]),
$$

the *ranking* of neighbours by attention score is the same regardless of the query node $i$ — GAT computes "static" attention. **GATv2** swaps the order of operations:

$$
e_{ij} = \mathbf{a}^\top \mathrm{LeakyReLU}(W [\mathbf{h}_i \| \mathbf{h}_j]),
$$

making attention truly query-dependent. Empirically, GATv2 outperforms GAT on every benchmark in the paper and is the recommended default today.

## When GAT is worth it

- **Use GCN** for small homogeneous citation graphs and as a strong baseline.
- **Use GraphSAGE** when the graph is too large for full-batch GCN.
- **Use GAT/GATv2** when neighbours are heterogeneous and the per-edge importance varies — typical in social, knowledge-graph, and recommender tasks.
- **Use Graph Transformers** when the task involves long-range dependencies and the graph is small enough to afford global attention.

## What to read next

- [Graph Convolutional Networks](./gcn) — the fixed-weight predecessor.
- [Message Passing & GraphSAGE](./message-passing) — the unifying framework.
- [Transformer (LLM)](../../llm/basics/transformer) — full-graph attention; the natural generalisation when every pair has an edge.
