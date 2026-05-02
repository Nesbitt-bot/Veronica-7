---
title: GPT-4o (omni)
order: 3
---

# GPT-4o (omni)

OpenAI's **GPT-4o** ("o" for *omni*), released May 13, 2024, was the first widely-deployed model with **end-to-end multimodal generation** — text, audio, and image, all produced by the same model without intermediate text. The launch demo showed real-time conversational voice with sub-second latency, emotional inflection, and the ability to interrupt and be interrupted. GPT-4o repositioned multimodal LLMs from "consume images and text, output text" to "operate fluently across modalities in both directions".

## What "omni" means architecturally

Pre-GPT-4o, multimodal LLMs typically had a pipeline:

1. Audio input → ASR transcribes to text → LLM processes text → TTS synthesises audio.
2. Image input → vision encoder → LLM processes vision tokens → text output.

Each handoff introduced latency and information loss. The voice in particular — going through ASR + TTS — lost prosody, emotion, identity, ambient sound.

GPT-4o is reported (OpenAI did not disclose architecture) to be a **single network** that natively tokenises and generates audio, image, and text. Audio in/out is via discrete codec tokens (similar to AudioLM). Image generation is via internal autoregressive token generation. The model loop is one Transformer pass per output chunk — no pipeline.

The end-to-end design enables:

- **Low latency** — ~320ms voice response time on average, sometimes much faster.
- **Cross-modal grounding** — the model can reason about audio events ("you sound stressed"), image content, and text simultaneously.
- **Emotional and prosodic richness** — the audio output includes laughter, whispers, singing, accents.

## Capabilities at launch

The capability headline:

- **Voice mode.** Real-time spoken conversation with interruption handling, emotional inflection, multi-language code-switching.
- **Vision input.** Strong on charts, screenshots, complex documents — improvement over GPT-4 Turbo.
- **Native image generation.** Announced at launch but rolled out to ChatGPT users only in March 2025 ("4o Image Generation"), partially due to safety review.
- **Same-or-better performance** as GPT-4 Turbo on text benchmarks, at much lower cost (~50% reduction).
- **Multilingual gains** — particularly for non-English audio.

## The "her"-shaped UX moment

The GPT-4o demo (May 2024) included extended conversational voice interaction — playful, expressive, occasionally flirtatious. The cultural reference everyone reached for was the 2013 Spike Jonze film *Her*. OpenAI temporarily named one of the voices "Sky", which was later pulled after Scarlett Johansson (whose voice the film *Her* used) raised objections.

The cultural moment was bigger than the technical capability: it crystallised the idea that LLM products would soon be **conversational interfaces**, not chat interfaces.

## What was new vs hype vs not yet delivered

What was real at launch:

- Lower-latency voice mode through the OpenAI API and ChatGPT (advanced voice mode rolled out incrementally over summer 2024).
- Strong vision input.
- Cost reductions over GPT-4 Turbo.

What was demonstrated but delayed:

- Native image generation (ships March 2025).
- Real-time vision input (eyes-on screen capture; rolled out later).
- Full advanced voice mode (rolled out gradually from July 2024).

What was still not delivered:

- True end-to-end-to-end voice fluency that people sometimes mistake for human (still distinguishable in extended conversation).

## What GPT-4o established

- **End-to-end multimodality.** The architectural template "one Transformer that tokenises and generates everything" became the norm for frontier models. Gemini 1.5+, Llama 4, Claude 3.5+ followed similar designs.
- **Voice as a primary LLM interface.** OpenAI shipped Advanced Voice Mode in ChatGPT to over 100M users. Voice is now a default interaction for the consumer product.
- **Cost reductions enabling new products.** GPT-4o's 50% price drop made many use cases that were marginal viable.

## GPT-4o-mini (July 2024)

OpenAI's small-tier model, replacing GPT-3.5 Turbo. Strong cost-performance, particularly for high-volume use cases (classification, extraction, simple Q&A). GPT-4o-mini became the default cheap-and-fast OpenAI model and the API workhorse through 2024-25.

## Successors

- **GPT-4.5** (Feb 2025) — interim refresh.
- **GPT-5** (released later in 2025) — next-generation frontier.
- The o-series ([o1](../2024-2025/o1), o3, o4) is the parallel reasoning-model line, not directly a GPT-4o successor.

GPT-4o remained a primary OpenAI model line through 2025.

## What to read next

- [Whisper](../2022/whisper) — the predecessor speech work.
- [Claude 3](./claude-3) — the contemporary Anthropic frontier.
- [Frontier Models](../2025-2026/frontier-models) — the post-2024 landscape.
