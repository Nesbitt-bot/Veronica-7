---
title: Linear Attention — Hyena, RetNet
order: 9
---

# Linear Attention — Hyena, RetNet

The 2023 wave of "linear attention" architectures — **Hyena**, **RetNet**, **GLA**, and others — revisited the [efficient-attention](../2020/efficient-attention) idea with a sharper pitch: Transformer-quality at $O(T)$ training cost, with $O(1)$ per-token state at inference. They're closely related to [SSMs / Mamba](./mamba) — the *Mamba-2* paper showed selective SSMs and certain linear attentions are mathematically dual — and together form the **linear-recurrent challenger** to the Transformer.

## Linear attention, from the kernel view

Recall that scaled dot-product attention is

$$
\mathrm{Attn}(Q, K, V) \;=\; \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d}}\right) V.
$$

If we replace the softmax-of-dot-product kernel with any kernel $\phi$ that decomposes as $\phi(\mathbf{q}, \mathbf{k}) = \langle \psi(\mathbf{q}), \psi(\mathbf{k}) \rangle$, attention becomes

$$
\mathrm{LinAttn}_t \;=\; \frac{\sum_{s \leq t} \langle \psi(\mathbf{q}_t), \psi(\mathbf{k}_s) \rangle \mathbf{v}_s}{\sum_{s \leq t} \langle \psi(\mathbf{q}_t), \psi(\mathbf{k}_s) \rangle}.
$$

By associativity, the inner sums $\sum_s \psi(\mathbf{k}_s) \mathbf{v}_s^\top$ and $\sum_s \psi(\mathbf{k}_s)$ can be **accumulated incrementally** — they're constant-size matrices, not $T \times T$ matrices. Inference becomes $O(1)$ per token.

The catch: linear attention is generally **less expressive** than softmax attention. The softmax's hard selection between strongly- and weakly-matching keys is structurally lost, and naive linear attention underperforms.

## Hyena (2023)

*Hyena Hierarchy: Towards Larger Convolutional Language Models* (Poli, Massaroli, Nguyen et al., ICML 2023). Hyena replaces attention with a **stack of long-range convolutions** parameterised in the frequency domain — closely related to S4 but with a different parametrisation.

The Hyena operator, simplified:

- For each layer, three projections $\mathbf{q}, \mathbf{k}, \mathbf{v}$ as in Transformers.
- Replace the $Q K^\top$ similarity with **element-wise multiplication** + a **long convolution** with implicitly-parameterised kernel.
- Output is $\mathbf{q} \odot (\mathbf{h} * (\mathbf{k} \odot \mathbf{v}))$, where $\mathbf{h}$ is the long-range convolution kernel.

The long convolutions are parameterised by a small MLP indexed by position, then evaluated efficiently in the frequency domain via FFT. The result is sub-quadratic ($O(T \log T)$) attention substitute that scales to long sequences.

Hyena models match Transformers at sequence-modelling perplexity at the small-medium scale (155M-1B). At frontier scale, the architecture has been less explored.

## RetNet — Retentive Network

*Retentive Network: A Successor to Transformer for Large Language Models* (Sun, Dong et al., Microsoft 2023). RetNet's contribution is offering **three computational views** of the same recurrent operation:

- **Parallel view** — for training, similar cost to attention.
- **Recurrent view** — for inference, $O(1)$ per-token state, like an RNN.
- **Chunkwise view** — for long-context training, $O(T)$ scaling.

The retention operator:

$$
\mathrm{Retention}(Q, K, V) \;=\; (Q K^\top \odot D) V, \qquad D_{ij} = \gamma^{i - j} \cdot [i \geq j].
$$

The matrix $D$ is a causal mask with **exponential decay** $\gamma$. Different heads use different $\gamma$ values, giving different time-decay rates analogous to multi-head attention's specialisation.

Empirically, RetNet matched Transformers at modest scale and offered substantial inference-throughput improvements due to the constant-state recurrent view. Its production deployment has been smaller than Mamba's, but the multi-view-of-the-same-op idea recurred in later work.

## GLA — Gated Linear Attention

*Gated Linear Attention Transformers with Hardware-Efficient Training* (Yang, Wang, Hu, Wang, Zhang et al., ICML 2024). GLA adds **input-dependent gating** to linear attention — the same selectivity idea that made Mamba competitive applied to linear attention. Each step, gates control how much of the running state is retained.

GLA's recurrence is roughly:

$$
S_t = G_t \odot S_{t-1} + \mathbf{k}_t \mathbf{v}_t^\top, \qquad \mathbf{o}_t = \mathbf{q}_t S_t,
$$

with $G_t$ an input-dependent forget gate. The result is selective linear attention that competes with Transformers at language modelling.

GLA is the architecture in DeltaNet, RWKV-7, and several frontier hybrid models in 2024-25.

## What linear attention is for

The linear-attention family is winning on:

- **Long-sequence efficiency.** $O(T)$ training and $O(1)$ per-token inference are real wins past 100K-token contexts.
- **Streaming inference.** Constant-state recurrent inference suits voice agents, real-time analytics, low-latency agents.
- **Hybrid architectures.** Modern hybrid stacks (Jamba, Zamba, Granite Mamba) interleave Transformer attention with linear-attention or SSM blocks.

It's *not* yet winning on:

- **Frontier-scale pure architectures.** Pure linear-attention models at 100B+ are still rare.
- **In-context learning.** Linear-attention ICL lags Transformer ICL at comparable scale, though closing.
- **Exact retrieval.** Constant-size state cannot precisely recall arbitrary earlier tokens.

## Linear attention vs SSMs vs Transformers

The 2024-25 architectural landscape has three challengers:

- **Transformers** — expressive, ICL-strong, ecosystem-mature, but $O(T^2)$.
- **SSMs (Mamba/Mamba-2)** — efficient, content-aware, state-of-the-art for long sequences, but ICL-weaker.
- **Linear attention (GLA, RWKV-7)** — efficient, similar trade-offs to SSMs, mathematically dual to selective SSMs in some forms.

The dominant production answer in 2025 is hybrids: Transformer attention layers (for retrieval and ICL) plus linear-recurrent layers (for efficiency on long contexts).

## What to read next

- [Mamba](./mamba) — selective SSMs, mathematically dual to selective linear attention.
- [RWKV](./rwkv) — another linear-recurrent Transformer alternative.
- [Efficient Attention](../2020/efficient-attention) — the predecessor wave.
