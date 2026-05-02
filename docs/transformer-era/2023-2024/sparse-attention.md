---
title: Sliding-Window & Sparse Attention
order: 10
---

# Sliding-Window & Sparse Attention

The 2023-2024 generation of sparse-attention techniques restricted attention to a structured subset of (query, key) pairs to keep cost sub-quadratic. **Sliding-window attention** (Mistral 7B, Longformer, Mamba's local-attention layers) is the practical default; **sparse and structured attention** (Native Sparse Attention, Sinkhorn attention, BigBird-style) round out the literature. Together they're the third leg of long-context — alongside [linear attention](./linear-attention) / [SSMs](./mamba) and [position-encoding extensions](./position-encodings).

## Sliding-window attention

The simplest sparse pattern: each query attends only to the previous $W$ keys. Standard variants:

- **Causal sliding window** — query at position $t$ attends to keys in $[t - W, t]$. Linear cost.
- **Bidirectional sliding window** — for non-causal models, attend to $[t - W/2, t + W/2]$.
- **Dilated sliding window** — every $d$-th key in the window. Increases effective receptive field at fixed cost.

[Mistral 7B](../2023/mistral) made sliding-window attention a frontier-LLM staple. With $W = 4096$ and 32 layers, the *effective* receptive field grows by stacking — token at depth $L$ has access to information from $L \cdot W$ tokens earlier through the layer-by-layer hopping. In practice this gives roughly window-times-depth context with linear-per-layer cost.

## Local + global hybrid: Longformer & BigBird

*Longformer* (Beltagy, Peters, Cohan, 2020) and *BigBird* (Zaheer et al., NeurIPS 2020) combined three patterns:

- **Local sliding window** for nearby context.
- **Global tokens** that attend to and from every other position (e.g., a `[CLS]` token).
- **Random attention** over a small subset of additional pairs.

The combination preserves the theoretical universality of full attention (BigBird is provably a universal Turing-complete approximator) while keeping cost $O(T)$. Both were used widely for long-document encoder tasks (legal, scientific, biomedical NLP) before frontier models acquired native long-context.

## Native Sparse Attention (DeepSeek, 2025)

*Native Sparse Attention* (Yuan, Tang, Zhao et al., DeepSeek 2025) is the current frontier of sparse attention. NSA decomposes each attention pattern into three branches:

- **Compressed coarse attention** — every $k$-th token's compressed K/V representation. Captures long-range gist at low cost.
- **Selected fine attention** — top-$N$ blocks chosen via a learned scorer. Captures the locally-relevant retrieval pattern.
- **Sliding window** — recent context exactly.

Each branch is hardware-efficient; the combination is trainable end-to-end. NSA reports matching dense-attention quality at substantially lower compute, particularly on long-context retrieval and reasoning benchmarks.

NSA is the first sparse-attention work to be deployed at frontier scale — DeepSeek V3.5+ uses it natively. Earlier sparse-attention research mostly involved retrofitting onto pretrained dense models, which lost quality.

## Sliding-window in practice

Modern open-LLM architectures use sliding-window attention selectively:

- **Mistral 7B / Mixtral** — sliding window 4096 in all layers.
- **Llama 3** — full attention up to 8K (then RoPE-extended).
- **Llama 4** (when MoE) — interleaves sliding-window and full-attention layers, similar to the hybrid Mamba-Transformer pattern.
- **Gemini 1.5** — proprietary mix of local and global attention layers.

The trade-off: pure full attention preserves capability but quadratic cost; pure sliding window is linear but limits long-range exact retrieval. **Hybrid stacks** — alternating sliding-window and full-attention layers — are the modern default.

## Why sparse attention is "the third option"

For long context, the field has three architectural levers:

- **Linear attention / SSMs** — change the math, $O(T)$ training and $O(1)$ per-token state, less ICL.
- **Sparse / windowed attention** — keep the math, restrict the support set. Predictable and stable.
- **Engineering** — FlashAttention + KV-cache compression — exact attention faster, but still quadratic.

Sparse attention is the *least disruptive* choice — it slots into existing Transformer infrastructure without changing inference semantics. That's why it's the default in production long-context models.

## Limitations

- **Random / structured patterns sacrifice some retrieval.** Truly long-range exact matches must be on the local-or-global path; off-path positions are invisible.
- **Pattern-design overhead.** Choosing the right window/global/random mix is per-task tuning.
- **Loss-of-quality vs full attention.** Even NSA, the strongest variant, gives up some quality for the compute savings.

For most production deployments, the verdict is: use sliding-window for the bulk of attention layers, full attention for a few critical layers, and structured-sparse mechanisms (NSA, MoBA) when training a new model from scratch.

## What to read next

- [Long-Context](./long-context) — the broader engineering story.
- [Mamba](./mamba) — the linear-recurrent alternative.
- [Efficient Attention](../2020/efficient-attention) — the predecessor wave.
