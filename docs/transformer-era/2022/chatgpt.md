---
title: ChatGPT (Nov 2022)
order: 4
---

# ChatGPT (Nov 2022)

ChatGPT, released November 30, 2022, was a research preview of an [InstructGPT](./instructgpt) variant fine-tuned for **multi-turn dialogue**, exposed via a free web UI. It reached 100 million users by January 2023 — the fastest-growing consumer product in history at the time. ChatGPT did not contain new capabilities relative to text-davinci-003 (the same generation of model, available through the API since early 2022), but the **interface** and **free public access** triggered the global LLM boom.

## What ChatGPT was, technically

ChatGPT-1.0 was based on `gpt-3.5-turbo`, a roughly InstructGPT-class model trained with the [SFT + RM + RLHF](./rlhf) pipeline on **dialogue data**. Two technical differences from base InstructGPT:

- **Conversational format.** Training data formatted as multi-turn `[USER] / [ASSISTANT]` exchanges, with explicit turn boundaries. The model learned to produce assistant turns conditioned on the full conversation history.
- **Refusal behaviour.** Heavier emphasis on refusing inappropriate requests, hedging on contested topics, and producing the now-recognisable "as a language model, I cannot..." preamble.

The architecture was unchanged: decoder-only Transformer, autoregressive, ~175B parameters in the largest size.

## What was new: the interface

ChatGPT's product UX was the contribution. Free access, no rate limits initially, conversational interface (not "complete this prompt"), persistent dialogue. None of these are technical innovations; together they made the underlying model accessible to everyone instead of just developers.

The free-tier launch was deliberate. Internal OpenAI documents revealed in subsequent reporting that ChatGPT was framed as a "low-key research preview" — projecting maybe 100K daily users. Within five days it had 1M.

## What ChatGPT proved

Three things became undeniable post-ChatGPT:

- **Aligned LLMs are useful**, not just capable. The InstructGPT alignment recipe converted GPT-3-class capability into a product millions could use.
- **The interface matters.** Same model behind ChatGPT had been available via the API for over six months with limited uptake. Free + chat UI was the difference.
- **The market is enormous.** 100M MAU in two months redefined the addressable market for AI products. Investment, hiring, and competitive response that followed were proportional.

By February 2023, Microsoft had integrated GPT-4-class models into Bing; Google had launched Bard; Anthropic had launched Claude; the open-source community had begun the LLaMA fine-tuning explosion. The 12 months after ChatGPT's release were the most consequential in AI commercialisation.

## Capabilities at launch

ChatGPT-1.0 was strong at:

- **Conversational Q&A** on general-knowledge topics.
- **Writing tasks** — emails, essays, code, summaries.
- **Code generation** at the level of [Codex](../2020-2021/codex), with explanation.
- **Reformatting** — converting between formats (CSV ↔ JSON, prose ↔ bullets).
- **Multi-turn task assistance** — the dialogue format made iterative refinement natural.

What it was bad at:

- **Multi-step reasoning** — chain-of-thought helped but was inconsistent.
- **Math beyond simple arithmetic.**
- **Factual reliability** — hallucinated confidently on details, dates, citations.
- **Tool use** — text-only; couldn't search the web or run code (until plugins).
- **Long contexts** — 4K token limit at launch.

These capabilities all arrived in subsequent models: GPT-4 (Mar 2023), tool use plugins (Mar 2023), Code Interpreter (Apr 2023), browsing (initially withdrawn, later re-introduced).

## What ChatGPT didn't tell us

The model's training data, exact recipe, parameter count, and reward-model details were not disclosed. Pretraining cutoff was September 2021. RLHF alignment data and human-labeller demographics were not fully described. By 2024, OpenAI's lack of detailed disclosure on its frontier models had become a methodological frustration for the academic community.

## The cultural impact

ChatGPT's release reshaped how non-technical audiences understand AI. By February 2023:

- Public discourse around AI shifted from "potential capability" to "current product".
- Schools and universities had to reckon with student use overnight.
- The phrase "AI" came to mean "LLM" in popular usage.
- Existing AI ethics, safety, and policy debates accelerated.

Whether ChatGPT was a *good* thing or not is contested. That it was a discontinuity in the AI public sphere is not.

## What to read next

- [InstructGPT](./instructgpt) — the technical predecessor.
- [GPT-4](../2023/gpt-4) — the successor model.
- [Frontier Models](../2025-2026/frontier-models) — the post-ChatGPT frontier-model ecosystem.
