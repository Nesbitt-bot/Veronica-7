---
title: Gemini 1.5 (Long Context)
order: 2
---

# Gemini 1.5 (Long Context)

Google released **Gemini 1.5 Pro** on February 15, 2024, with a feature unlike anything other frontier models had: a **1 million token context window**, with a 10M-token research demonstration. The release shifted the long-context conversation from "incremental gains" to "qualitatively different capability". Gemini 1.5 was the first frontier model where you could put an entire codebase, an entire book, or a multi-hour video in one prompt.

## The release

Gemini 1.5 Pro followed Gemini 1.0 (Dec 2023) by a few months. The technical report (Google DeepMind, 2024) emphasised three points:

- **1M-token context** in the publicly-released version, with research-grade extension to 10M.
- **Mixture-of-Experts architecture** — explicitly disclosed, unusual for frontier models.
- **Native multimodal training** — text, image, audio, video tokens jointly trained from scratch (not bolted on after).

Gemini 1.5 Pro launched with the same general-capability tier as Gemini 1.0 Ultra (the previous Google flagship) but at much lower compute, plus the long-context superpower.

## What 1M tokens unlocks

Three demonstrations stood out in the launch:

- **Reading an entire codebase.** Gemini 1.5 Pro could ingest the JAX repository in one prompt and answer cross-file questions accurately.
- **Watching hour-long video.** Frames sampled to fit in context; the model answered questions about events at specific timestamps.
- **Translating from a low-resource language.** Given a single grammar book and dictionary in context, Gemini 1.5 Pro learned to translate between English and Kalamang (a language with ~200 speakers, with very little online data) at meaningful quality. This was the headline "in-context learning at long context" demo.

Each result rests on the same property: with enough context, the model can do **task-specific learning at inference time** that previously required fine-tuning.

## Needle-in-a-haystack

The 1M-token claim was backed by needle-in-haystack tests: insert a "fact" sentence at random positions in a long document, ask the model to retrieve it. Gemini 1.5 Pro achieved >99% recall across the full 1M context. The 10M research version achieved similar recall on the longer windows.

The caveat (already understood by then): needle-in-haystack measures **retrieval**, not **synthesis**. Gemini 1.5 Pro could find a single fact reliably; reasoning across multiple disconnected facts at the long-context end of the window was less consistent.

## Architecture and training

The technical report disclosed:

- **MoE-based decoder-only Transformer.** Many experts, sparse routing.
- **Native multimodal pretraining** — image, audio, video tokenised and trained alongside text. No separate "vision encoder" plus "language model" assembly.
- **Long-context training** at scale — Google trained explicitly at long context, not relying purely on post-hoc RoPE extension.

Specific architectural details (number of experts, exact parameter count, training corpus) were not disclosed. External estimates put Gemini 1.5 Pro at roughly 200-500B total parameters with ~50-100B active per token, but these are not confirmed.

## Multimodality

Gemini 1.5 Pro's audio and video capabilities are stronger than its competitors at launch. Demonstrations:

- **Audio Q&A** — transcribe and answer questions about hours of meeting audio.
- **Video understanding** — frame-level analysis of long videos, action recognition, narrative summarisation.
- **Mixed-modality prompts** — "given this video clip and this PDF, answer..." worked seamlessly.

This native-multimodal training paid off: Gemini's audio capabilities in particular were ahead of GPT-4-class models at launch.

## Gemini 1.5 Flash

Released at Google I/O 2024 (May), **Gemini 1.5 Flash** is the cheap-and-fast tier — sub-second latency, much lower API cost, retaining most of the long-context capability. By late 2024 Flash had become the highest-volume Gemini variant by API traffic, particularly for embedding-and-retrieval-style applications.

## What followed

- **Gemini 2.0 Flash** (Dec 2024) — refresh with stronger general capabilities and native image generation.
- **Gemini 2.5 Pro** (March 2025) — multi-modal flagship with substantial reasoning improvements.
- **Gemini 3** (late 2025) — next-generation flagship.

The 1M-token (or longer) context window has remained a Gemini differentiator — competing frontier models reached 200K-500K but no one shipped a publicly-available 1M+ model in the same timeframe.

## What Gemini 1.5 established

- **Long context as a differentiator.** Past 200K, the use cases shift from "process a document" to "process a codebase / a movie / a book". Gemini 1.5 demonstrated this market.
- **Native multimodal training.** Frontier models increasingly start with all modalities mixed, not bolted on after.
- **MoE at frontier scale, publicly disclosed.** Helped legitimise MoE as the default choice for frontier-LLM training in 2024.
- **In-context learning at long context.** The grammar-book translation result was the strongest demonstration to date that ICL scales with available context.

## What to read next

- [Long-Context](../2023-2024/long-context) — the engineering substrate.
- [GPT-4o](./gpt-4o) — the contemporary OpenAI multimodal flagship.
- [Frontier Models](../2025-2026/frontier-models) — the post-2024 frontier.
