---
title: LLaMA 1 & 2
order: 4
---

# LLaMA 1 & 2

*LLaMA: Open and Efficient Foundation Language Models* (Touvron et al., Meta, Feb 2023) released a family of decoder-only Transformers trained Chinchilla-style — 7B, 13B, 33B, 65B parameters on ~1T tokens of public data. The models were initially **gated for academic research**; the weights leaked widely within a week. Nine months later, Meta open-sourced **LLaMA 2** with a permissive licence. LLaMA is the model family that re-opened frontier-quality LLMs to the open-source community after [GPT-4](./gpt-4) closed the door.

## LLaMA 1 (Feb 2023)

LLaMA 1 was a research model, not a product. The recipe:

- **Architecture** — standard decoder-only Transformer with three modern tweaks: pre-norm using RMSNorm, SwiGLU activations, Rotary Position Embeddings (RoPE).
- **Sizes** — 7B, 13B, 33B, 65B parameters.
- **Data** — 1T tokens (LLaMA-7/13B) and 1.4T tokens (LLaMA-33/65B) from CommonCrawl, C4, GitHub, Wikipedia, books, ArXiv, Stack Exchange. **All public sources.**
- **Compute** — 65B trained for ~21 days on 2048 A100s.

The headline result: **LLaMA-13B outperforms GPT-3 (175B)** on most benchmarks, and **LLaMA-65B is competitive with PaLM-540B** and Chinchilla-70B. Following the [Chinchilla recipe](../2022/palm-chinchilla) at 1T+ tokens — substantially more than GPT-3's training — produced much stronger small models.

## The leak

LLaMA was distributed via a request form to academic researchers. Within a week, the weights were posted to BitTorrent and 4chan. Meta did not acknowledge this publicly but did not actively combat it either. The leak was the **practical end** of "research-only" weight distribution at frontier scale — once 7B-level weights are in the wild, they are in the wild.

The Hugging Face community ran with LLaMA-7B/13B almost immediately. Within weeks: Alpaca (Stanford, instruction-tuned LLaMA), Vicuna (LMSYS), and dozens of derivative fine-tunes. The open-source LLM ecosystem of 2023–24 was built on LLaMA's leaked weights.

## LLaMA 2 (July 2023)

Meta open-sourced **LLaMA 2** in collaboration with Microsoft. Key features:

- **Sizes** — 7B, 13B, 70B (the 33B was withheld initially over concerns about safety capability).
- **2T training tokens** — 40% more than LLaMA 1.
- **4K context** at base, with extended versions later.
- **Pretrained + chat versions** — Meta released both the base model and an RLHF-tuned chat variant.
- **Permissive licence** — commercial use allowed for products with under 700M MAU. Effectively open for the vast majority of users.

LLaMA-2-70B-chat was the first widely-available open-weights model competitive with closed models on user-facing chat tasks. The release was a significant open-source moment.

## LLaMA's architectural choices

The LLaMA paper crystallised the **modern decoder-only architecture** that everyone now copies:

- **Pre-norm** (Norm-Attention-Residual) instead of post-norm — gradient stability at depth.
- **RMSNorm** instead of LayerNorm — slightly cheaper, no quality loss.
- **SwiGLU** activation in feed-forward — small but consistent gain over ReLU/GELU.
- **RoPE** position encoding — relative-position information via rotations in $Q, K$ subspaces.
- **No bias** in linear layers — small parameter savings.

Almost every open LLM since (Mistral, Qwen, Yi, DeepSeek, Phi) uses this exact architectural template. The "LLaMA architecture" is the de-facto standard.

## Open-source explosion

The 12 months after LLaMA 1's release saw an explosion of derivative work:

- **Instruction-tuned LLaMAs** — Alpaca, Vicuna, WizardLM, Orca.
- **LoRA / QLoRA fine-tuning** — efficient methods that work especially well on LLaMA's architecture.
- **Quantised inference** — llama.cpp, GGUF, exllama. Made LLaMA runnable on consumer CPUs and laptops.
- **Multilingual variants** — Aya, Belle, Sabiá.
- **Code models** — Code Llama (Meta, 2023), built on LLaMA 2.

By late 2023, the open-source ecosystem had become a serious counterweight to the closed frontier. LLaMA's role was foundational.

## What followed

- **LLaMA 3** (April 2024) — see [LLaMA 3](../2024/llama-3). 8B / 70B / 405B sizes, 15T training tokens.
- **LLaMA 3.1, 3.2, 3.3** — incremental updates through 2024.
- **LLaMA 4** (2025) — the next-generation Meta open release.

Meta has remained the dominant open-frontier-model producer. The LLaMA line is the spine of the open-source LLM ecosystem.

## What to read next

- [LLaMA 3](../2024/llama-3) — the modern frontier-quality successor.
- [Mistral](./mistral) — the European open-models contender.
- [Open Models](./open-models) — the broader open-LLM ecosystem.
