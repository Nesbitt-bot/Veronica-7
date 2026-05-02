---
title: Efficient Attention (Linformer, Performer, Reformer)
order: 3
---

# Efficient Attention (Linformer, Performer, Reformer)

Self-attention is $O(T^2)$ in sequence length — fine for the original Transformer's 512-token translations, painful for documents, books, and long contexts. The 2019–2021 wave of "efficient Transformer" papers proposed dozens of approximations: **Linformer**, **Performer**, **Reformer**, **Longformer**, **BigBird**. Each tried to break the quadratic cost. None won at frontier scale, but the ideas survived in specialised settings, and FlashAttention's exact-but-fast kernel eventually addressed the practical bottleneck without changing the math.

## Why $O(T^2)$ is the problem

Attention's $T \times T$ score matrix is what makes self-attention expressive — every position relates to every other. But the matrix has to be materialised, and $T^2$ memory at $T = 32{,}000$ is 1 GB per head per layer. Past 2K–4K tokens, vanilla attention runs out of memory before it runs out of compute.

Two attack strategies:

- **Sparse attention** — restrict each query to attend to only a subset of keys.
- **Low-rank / kernel attention** — approximate the full softmax by something computable in $O(T)$.

## Reformer — locality-sensitive hashing

*Reformer: The Efficient Transformer* (Kitaev, Kaiser, Levskaya, ICLR 2020) used **LSH (locality-sensitive hashing)** to bucket queries and keys into hash bins; each query attends only to keys in the same bin. The attention complexity drops to $O(T \log T)$. Combined with reversible residual layers (memory-free backprop), Reformer could train on documents of 64K tokens.

Quality on WikiText was competitive but not better than dense attention at the same parameter count. Reformer remains a clean illustration of the LSH-attention idea.

## Linformer — low-rank projection

*Linformer: Self-Attention with Linear Complexity* (Wang, Li, Khabsa, Fang, Ma, 2020) noted that the $T \times T$ attention matrix is **empirically low-rank**, then projected the keys and values to a fixed dimension $k$:

$$
\mathrm{Attn}(Q, K, V) \;\approx\; \mathrm{softmax}\bigl(Q (E K)^\top / \sqrt{d}\bigr)\, F V,
$$

with $E, F \in \mathbb{R}^{k \times T}$ learned projections. Complexity becomes $O(T k)$ — linear in $T$. The catch: the projection breaks autoregressive masking, so Linformer works only for encoder-only models (NLU tasks), not generative LMs.

## Performer — random Fourier features

*Performer: Rethinking Attention with Performers* (Choromanski et al., ICLR 2021) approximated the softmax kernel with **random Fourier features**, allowing the attention computation to be re-associated:

$$
\mathrm{softmax}(Q K^\top) V \;\approx\; \phi(Q) \bigl(\phi(K)^\top V\bigr).
$$

The right factor is $O(T d)$; the whole computation is $O(T d^2)$ — linear in $T$. Performer supports causal masking with a clever cumulative-sum trick, making it usable for autoregressive LMs. Quality was reasonable but didn't displace dense attention.

## Longformer and BigBird — sparse + global

*Longformer* (Beltagy, Peters, Cohan, 2020) and *BigBird* (Zaheer et al., NeurIPS 2020) used **structured sparse** attention patterns: each token attends to a local window plus a small set of "global" tokens (e.g., a `[CLS]` token that attends to and from everything). Complexity is $O(T)$ per token. Both were popular for long-document NLP tasks (legal, scientific, biomedical) and are still used as encoder backbones for length-heavy NLU.

## Why none of them won at the frontier

Three reasons frontier LLMs (GPT-4, Claude, Gemini) use mostly **dense attention** despite all this efficient-attention work:

- **Quality gap.** Approximate attention loses 1–3 perplexity points vs dense at the same scale. For a frontier model, that's a non-starter.
- **Engineering complexity.** Custom kernels for each scheme, awkward interactions with KV caching, harder to debug.
- **FlashAttention** (Dao et al., 2022) — the IO-aware kernel that runs **exact** attention faster than most of the approximations, by reorganising memory access rather than changing the math. Once FlashAttention existed, the practical motivation for approximate attention largely disappeared.

The exception: **state-space models** (Mamba, RWKV) and **linear attention** revived the linear-complexity idea with new architectures and now compete with Transformers at long contexts. See [linear attention](../2023-2024/linear-attention) and [Mamba](../2023-2024/mamba).

## What survived

- **Sparse-window attention** in long-document encoders (Longformer-style) — still standard for processing huge inputs efficiently.
- **The conceptual taxonomy** — sparse vs low-rank vs kernel approximations — is the right way to organise modern long-context literature.
- **The $O(T^2)$-is-a-problem framing** — drove FlashAttention, Mamba, and the long-context engineering of frontier LLMs.

## What to read next

- [Long-Context Transformers](../2023-2024/long-context) — the modern engineering answer.
- [Mamba](../2023-2024/mamba) — state-space models as attention alternatives.
- [Linear Attention](../2023-2024/linear-attention) — the modern revival of kernel-style attention.
