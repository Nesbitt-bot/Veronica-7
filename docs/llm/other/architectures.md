---
title: Alternative Architectures
order: 1
---

# Alternative Architectures

The dense decoder-only Transformer dominates, but several alternative architectures aim at its two structural costs: $O(n^2)$ attention in sequence length, and FLOPs that scale with the entire parameter count per token. Mixture-of-Experts addresses the latter; state-space models and linear-recurrent architectures address the former. A fourth thread, **hierarchical reasoning**, structures the model around explicit subproblem decomposition.

## Mixture-of-Experts (MoE)

A MoE layer replaces a dense feed-forward block with $E$ experts and a router that sends each token to the top-$k$ experts:

$$
y_t \;=\; \sum_{e \in \text{top-}k(g_t)} g_t(e) \cdot \text{FFN}_e(x_t), \qquad g_t = \mathrm{softmax}(W_g x_t).
$$

Only $k$ experts run per token, so per-token FLOPs are roughly $k/E$ of the dense equivalent while parameter count is $E\times$ larger. *Mixtral 8x7B* (Jiang et al., 2024) is the open-weights workhorse: 8 experts, top-2 routing, ~13B active of 47B total parameters, matching dense 70B on benchmarks at ~1/4 the inference compute. Training tricks — load-balancing auxiliary losses, expert-parallel sharding — are what make MoE actually train.

## Mamba and Structured State-Space Duality

*Mamba: Linear-Time Sequence Modeling with Selective State Spaces* (Gu & Dao, 2024) builds on the S4 line of state-space models but adds **input-dependent** state-update parameters, making the recurrence content-aware:

$$
h_{t+1} = A(x_t) h_t + B(x_t) x_t, \qquad y_t = C(x_t) h_t.
$$

Inference is $O(n)$ in sequence length and $O(1)$ per token in state size, with no KV cache. *Mamba-2 / SSD* (Dao & Gu, 2024) shows that selective SSMs are mathematically dual to a particular form of linear attention, unifying the two threads and unlocking matrix-multiplication kernels for state-space training.

Mamba models match Transformers on perplexity at small-medium scale and beat them on extreme-long-context retrieval — but they lag on tasks requiring exact-match copying, where attention's content-addressable memory is structurally better.

## RWKV

*RWKV* (Peng et al., 2023) is another linear-attention/RNN hybrid, designed to be **trainable like a Transformer and inferrable like an RNN**. Self-attention is replaced by a time-mixing block with channel-wise weighted-key-value (WKV) interpolation, expressible both as a parallel matrix operation (training) and a constant-memory recurrence (inference). RWKV was the first non-Transformer to scale to 14B parameters with competitive quality, and the community has continued to release Eagle / Finch / RWKV-7 variants.

## Hierarchical Reasoning Model

*Hierarchical Reasoning Model* (Wang et al., 2024) departs from the "single deep stack of identical blocks" template. Instead, two networks operate at different timescales — a **fast** low-level module (per-step reasoning) and a **slow** high-level module (planning, abstraction) — communicating via state passed at the slow module's tick rate. The architecture explicitly structures the model around subproblem decomposition rather than relying on the chain-of-thought prompt to do it implicitly. Early benchmarks show strong results on combinatorial reasoning tasks (Sudoku, ARC) at small scales; the open question is whether the inductive bias survives scaling.

## Reading list

- *Mixtral of Experts* — Jiang, Sablayrolles, Roux et al., 2024 (Mixtral 8x7B).
- *Mamba: Linear-Time Sequence Modeling with Selective State Spaces* — Gu, Dao, COLM 2024.
- *Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality* — Dao, Gu, ICML 2024 (Mamba-2 / SSD).
- *RWKV: Reinventing RNNs for the Transformer Era* — Peng et al., EMNLP Findings 2023.
- *Hierarchical Reasoning Model* — Wang et al., 2024.

## What to read next

- [Long-Context Transformers](../efficient/long-context) — the scaling-laws-friendly path to long context.
- [Inference Optimisation](../efficient/inference) — KV-cache tricks that MoE and SSM both reduce or remove.
- [The Transformer](../basics/transformer) — the baseline these designs depart from.
