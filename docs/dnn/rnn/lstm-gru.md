---
title: LSTM & GRU
order: 2
---

# LSTM & GRU

[Vanilla RNNs](./vanilla) cannot learn dependencies more than ~10 steps apart because gradients vanish through their tanh recurrence. The Long Short-Term Memory cell was designed in 1997 specifically to solve this — by adding a **gated additive memory cell** whose gradient flows essentially unchanged through time. The GRU is a 2014 simplification that costs less and often performs comparably.

## LSTM — the gated cell

*Long Short-Term Memory* (Hochreiter, Schmidhuber, Neural Computation 1997) introduces a separate **cell state** $\mathbf{c}_t$ alongside the hidden state $\mathbf{h}_t$. The cell state is updated *additively*, not multiplicatively, with three learned **gates** controlling what gets written, kept, and read:

$$
\begin{aligned}
\mathbf{f}_t &= \sigma(W_f [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_f) \quad &\text{(forget gate)} \\
\mathbf{i}_t &= \sigma(W_i [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_i) \quad &\text{(input gate)} \\
\tilde{\mathbf{c}}_t &= \tanh(W_c [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_c) \quad &\text{(candidate cell)} \\
\mathbf{c}_t &= \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t \\
\mathbf{o}_t &= \sigma(W_o [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_o) \quad &\text{(output gate)} \\
\mathbf{h}_t &= \mathbf{o}_t \odot \tanh(\mathbf{c}_t).
\end{aligned}
$$

The crucial line is $\mathbf{c}_t = \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t$. If $\mathbf{f}_t = 1$ and $\mathbf{i}_t = 0$, the cell state passes through unchanged — and so does its gradient. Long-range gradient flow becomes possible. Training instabilities reduce dramatically; networks of 100+ steps become tractable.

**Forget-gate bias init:** the default trick is to initialise $\mathbf{b}_f = 1$, so the forget gate starts close to 1 and the cell mostly remembers at the start of training (Jozefowicz et al., 2015).

## Why it works: error carousel

Hochreiter and Schmidhuber called the additive cell-state path the **constant error carousel** — gradients can flow back through arbitrarily many steps if the forget gates stay near 1. This is conceptually the *same* trick as residual connections in [ResNet](../cnn/resnet-family): an identity-like path through the depth/time axis that backprop can use without vanishing.

## GRU — fewer gates

*Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling* (Chung, Gulcehre, Cho, Bengio, NIPS DLW 2014) proposed the Gated Recurrent Unit, which merges the cell state into the hidden state and uses two gates instead of three:

$$
\begin{aligned}
\mathbf{r}_t &= \sigma(W_r [\mathbf{h}_{t-1}, \mathbf{x}_t]) \quad &\text{(reset)} \\
\mathbf{z}_t &= \sigma(W_z [\mathbf{h}_{t-1}, \mathbf{x}_t]) \quad &\text{(update)} \\
\tilde{\mathbf{h}}_t &= \tanh(W_h [\mathbf{r}_t \odot \mathbf{h}_{t-1}, \mathbf{x}_t]) \\
\mathbf{h}_t &= (1 - \mathbf{z}_t) \odot \mathbf{h}_{t-1} + \mathbf{z}_t \odot \tilde{\mathbf{h}}_t.
\end{aligned}
$$

GRU has ~$\tfrac{3}{4}$ the parameters and ~25% fewer multiply-adds per step than LSTM. Empirically, GRUs match LSTMs on most benchmarks (Chung et al. 2014, Greff et al. 2017), with LSTMs slightly better on language modelling and GRUs slightly better on smaller-data tasks.

## Variants worth mentioning

- **Peephole connections** (Gers, Schmidhuber, 2000) — let gates see the cell state. Modest gains, rarely used today.
- **Bi-LSTM** — run one LSTM forward and one backward, concatenate hidden states. The default for sequence labelling and the encoder side of pre-Transformer machine translation.
- **Stacked LSTMs** — multiple LSTM layers, output of layer $\ell$ feeds layer $\ell+1$. 2–4 layers was the sweet spot before residual connections became standard.

## Why LSTMs lost to Transformers

LSTMs ruled sequence modelling from 2014 to 2017. The Transformer's advantage is twofold: **parallelism** (every step can be computed simultaneously, vs LSTM's strict left-to-right) and **direct long-range access** (self-attention is O(1) hops between any two positions, vs LSTM's O(n)). Both matter for training throughput, and the second matters for modelling — even with gating, LSTMs do degrade on very long contexts.

LSTMs persist in low-latency streaming applications (online ASR, time-series), small-data settings (classical sequence-labelling), and as the recurrent component of some Mamba/SSM-Transformer hybrids.

## What to read next

- [Vanilla RNNs](./vanilla) — the failure mode this design fixes.
- [Sequence-to-Sequence](./seq2seq) — encoder–decoder architectures built on LSTMs.
- [Bahdanau Attention](./bahdanau-attention) — what eventually replaced the LSTM context bottleneck.
