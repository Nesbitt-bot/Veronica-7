---
title: Long-Context (1M+ tokens)
order: 4
---

# Long-Context (1M+ tokens)

In 2022, frontier LLMs handled 4K-8K tokens of context. By 2024, the frontier had moved to **128K (GPT-4 Turbo, Claude 3), 200K (Claude 3.5), 1M (Gemini 1.5 Pro), and 10M (Gemini 1.5 in research)**. Long-context capability went from research curiosity to product feature in two years. The mechanisms — efficient attention kernels, RoPE-based position extension, training-time long-doc supervision — are mostly engineering, not algorithm.

## Why long context is hard

Three independent constraints:

- **Quadratic attention.** Memory and compute scale as $O(T^2)$ in sequence length. Doubling context quadruples cost.
- **KV cache.** During autoregressive generation, the model caches keys and values from every previous position. At 1M tokens, this is hundreds of GB of GPU memory.
- **Position encoding generalisation.** Models trained on 4K naturally don't know what to do at position 1,000,000. See [position encodings](./position-encodings) for the post-hoc fixes.

Each requires a different solution.

## FlashAttention — fix the constants

*FlashAttention* (Dao, Fu, Ermon, Rudra, Ré, NeurIPS 2022) and *FlashAttention-2* (Dao, 2023) didn't change the math of attention but redesigned its memory access patterns:

- Tile the attention computation so intermediate values stay in fast SRAM.
- Avoid materialising the $T \times T$ attention matrix in HBM.
- Recompute attention during the backward pass instead of caching activations.

Result: **2–4× faster training, 5–20× lower memory use**, with bit-exact equivalent output. FlashAttention is now the default attention kernel in essentially every Transformer training and inference framework.

The follow-on, **FlashAttention-3** (2024), targets specifically Hopper GPUs (H100, H200) and exploits async copies and warp-specialisation. The combination of FlashAttention-2/3 + KV-cache sharding makes 100K-token training and 1M-token inference viable.

## KV-cache compression

For 1M-context inference, the KV cache is the binding memory constraint. Mitigations:

- **Multi-Query Attention (MQA)** and **Grouped-Query Attention (GQA)** — share K/V across multiple Q heads. Reduces KV-cache memory by 4–8×.
- **Multi-head Latent Attention** (DeepSeek-V2, 2024) — compress K/V into a small latent and decompress on the fly. ~10× memory reduction.
- **KV quantisation** — store KV cache at int8 or int4. Modest quality cost, large memory savings.
- **Sliding-window + sink tokens** (StreamingLLM, Xiao et al., 2024) — keep only the first few "sink" tokens plus the most recent N tokens. Acceptable for streaming, lossy for long-document recall.

Production frontier inference uses some combination of all of these.

## Training at long context

Naively training at 100K context is prohibitively expensive — compute scales quadratically. The standard recipe:

1. **Pretrain at short context** (4K-8K) for the bulk of training tokens.
2. **Continue pretraining at extended context** for a few percent of tokens. Use [RoPE position interpolation](./position-encodings) or YaRN to ensure the position-encoding scheme generalises.
3. **Long-context fine-tune** on (long-doc, instruction) pairs to teach the model to actually use long context.

Long-document training data is curated — books, long codebases, multi-document research summaries. Quality matters: training on poorly-organised long docs teaches the model to ignore the middle.

## Needle-in-haystack benchmarks

The standard probe: embed a "needle" sentence in a long irrelevant document, ask the model to recall it. **Pass rate vs needle position** reveals where the model's attention falls off. Modern frontier LLMs (Claude 3, Gemini 1.5 Pro, Llama 3.1) achieve ~95-100% recall at 128K-1M context.

The catch: needle-in-haystack measures **retrieval**, not **synthesis**. Models often pass needle-in-haystack at 1M but fail when asked to reason across multiple disconnected pieces of the long context. The "long-context capability" headline is real but narrower than it appears.

## Gemini 1.5's 1M+ context

[Gemini 1.5 Pro](../2024/gemini-1-5) (March 2024) was the first widely-available model with 1M-token native context. Architecturally, Gemini 1.5 is a hybrid Transformer-MoE with custom long-context training. Demonstrations include:

- **Reading entire codebases** in one prompt and answering questions across files.
- **Watching hour-long videos** (frames sampled to fit in context).
- **Translating from a low-resource language** given only a grammar book in context.

Gemini's research preview extended to **10M tokens** internally. Whether this is the right architectural direction (vs RAG, hierarchical processing, or external memory) remains open.

## Long context vs RAG

Long context and [retrieval-augmented generation](./rag) are partially competing approaches to the same problem: getting relevant information into the model's working set.

- **Long context** wins when relevance is hard to determine ahead of time, when documents are highly interconnected, or when fine-grained details matter throughout.
- **RAG** wins when retrieval is reliable, the corpus is much larger than what fits in context, and freshness matters (the corpus updates without retraining).

Most production systems use both — long context for the immediate document, RAG for the broader corpus.

## What to read next

- [Position Encodings (RoPE etc.)](./position-encodings) — the position-extension techniques.
- [Efficient Attention](../2020/efficient-attention) — the earlier wave of attention approximations.
- [RAG](./rag) — the retrieval-based alternative.
