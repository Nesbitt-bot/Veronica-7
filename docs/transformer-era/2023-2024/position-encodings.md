---
title: RoPE, ALiBi & Position Extension
order: 3
---

# RoPE, ALiBi & Position Extension

The original Transformer's [sinusoidal positional encodings](../2017/self-attention) had a known weakness — they struggle to extrapolate beyond training-set sequence lengths. The 2021–2024 generation of LLMs replaced them with two main alternatives: **Rotary Position Embeddings (RoPE)** and **Attention with Linear Biases (ALiBi)**. RoPE won at frontier scale; both gave rise to a literature on **post-hoc context extension** that lets a model trained at 4K context serve at 32K, 128K, or longer.

## Why position matters

Self-attention is permutation-equivariant — it treats input tokens as a set. To reason about order ("the cat sat on the mat" ≠ "mat the on sat cat the"), a Transformer needs *positional information* injected somewhere. The choices:

- **Absolute** — each position $p$ gets a fixed or learned vector added to the embedding.
- **Relative** — attention scores are biased by a function of $i - j$.
- **Rotary** — apply position-dependent rotations in $Q, K$ subspaces.

Each has different generalisation behaviour at lengths beyond training.

## RoPE — Rotary Position Embeddings

*RoFormer: Enhanced Transformer with Rotary Position Embedding* (Su, Lu, Pan, Murtadha, Wen, Liu, 2021). The construction:

For a position $p$ and embedding pair $(x_{2i}, x_{2i+1})$, apply a 2D rotation by angle $p \theta_i$:

$$
\begin{pmatrix} x_{2i}' \\ x_{2i+1}' \end{pmatrix} \;=\; \begin{pmatrix} \cos(p\theta_i) & -\sin(p\theta_i) \\ \sin(p\theta_i) & \cos(p\theta_i) \end{pmatrix} \begin{pmatrix} x_{2i} \\ x_{2i+1} \end{pmatrix}.
$$

Frequencies $\theta_i = 10000^{-2i/d}$, exactly like the original sinusoidal positional encoding's frequency schedule.

The clever property: the dot product of rotated $Q$ and rotated $K$ depends only on the **relative offset**:

$$
\langle R_p \mathbf{q}, R_{p'} \mathbf{k} \rangle \;=\; \langle \mathbf{q}, R_{p' - p} \mathbf{k} \rangle.
$$

So RoPE encodes relative positions while staying compatible with standard attention computation. No modification to the attention math; you just rotate $Q$ and $K$ before the dot product.

RoPE is the **default** in [LLaMA](../2023/llama), [Mistral](../2023/mistral), Qwen, DeepSeek, Phi, Yi, and most modern open and closed LLMs. It is the most-deployed position-encoding scheme of the 2020s.

## ALiBi — Attention with Linear Biases

*ALiBi* (Press, Smith, Lewis, ICLR 2022). Skip positional embeddings entirely; bias attention scores by a function of the relative offset:

$$
\mathrm{Attention}(Q, K, V) \;=\; \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d}} - m \cdot |i - j|\right) V,
$$

with $m$ a head-specific slope. Closer pairs get higher attention scores; far-apart pairs get a linear penalty.

ALiBi was simpler than RoPE and showed strong **extrapolation** properties — a model trained at 1024 tokens could be served at 4096 tokens with minimal quality loss. MPT and BLOOM used it. It largely lost to RoPE for in-distribution quality but remains a clean reference point for out-of-distribution generalisation.

## Why RoPE won and how it failed at long context

RoPE wins on quality at training-distribution lengths. But naively, RoPE *also* extrapolates poorly beyond training: at positions much larger than seen during training, the rotation frequencies create attention patterns the model wasn't trained to handle.

Several **context-extension** techniques solve this:

- **Position Interpolation** (Chen et al., Meta 2023) — at inference, rescale positions so a $4\times$-longer sequence still falls in $[0, L_\text{train}]$. Works surprisingly well after a brief fine-tune.
- **NTK-aware RoPE** — change the *base* of the frequency formula so longer sequences sample frequencies that aren't unfamiliar to the trained model.
- **YaRN** (Peng, Quesnelle, Fan, Shippole, 2023) — combines NTK-aware scaling with a per-frequency interpolation strategy. Used in many production long-context models.
- **LongRoPE** (Microsoft 2024) — search-based discovery of an optimal frequency-rescale schedule, extending models to 2M+ tokens.

These post-hoc methods made it cheap to extend a model trained at 4K or 8K to 128K+ — Llama 3.1's 128K context, Qwen's 1M context, and many others use one of these techniques.

## Long-context training

Modern frontier models ([Gemini 1.5](../2024/gemini-1-5), GPT-4 Turbo 128K, Claude 3 200K) train explicitly at long context for portions of training. Combined with RoPE + interpolation tricks, this routinely extends usable context to 100K–1M+ tokens.

The remaining challenges aren't really about position encoding any more — they're about [long-context](./long-context) attention efficiency, retrieval-quality benchmarking (needle-in-haystack tests), and effective use of long context (most user prompts don't reach it).

## What to read next

- [Long-Context Transformers](./long-context) — the broader engineering story.
- [Self-Attention](../2017/self-attention) — the absolute-position baseline.
- [LLaMA](../2023/llama) — RoPE deployed at frontier scale.
