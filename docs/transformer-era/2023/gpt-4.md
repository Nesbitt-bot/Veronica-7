---
title: GPT-4
order: 1
---

# GPT-4

GPT-4, released March 14, 2023, was OpenAI's frontier model post-[ChatGPT](../2022/chatgpt) and the first widely-deployed model that crossed several "human-expert" thresholds: passing bar exams in the top decile, scoring ~5 on AP Biology, solving novel coding interview questions reliably. It was also the first frontier model whose technical report **withheld nearly all training details** — model size, architecture, dataset, compute. GPT-4 is the inflection point at which frontier-model research became a closed-door commercial activity.

## What GPT-4 demonstrated

The GPT-4 technical report (OpenAI, 2023) emphasised capabilities rather than methodology:

- **Bar Exam (Uniform)** — 90th percentile on a simulated test (vs GPT-3.5's 10th).
- **AP Biology, AP Chemistry, AP Calculus BC, AMC 10** — high or top scores.
- **LeetCode Hard, MMLU, HumanEval** — substantial gains over GPT-3.5.
- **Theory-of-Mind, multi-step reasoning** — qualitative improvements.

The headline framing: GPT-4 reached **expert human performance** on several professional and academic exams. Whether that constitutes "intelligence" or just sophisticated pattern matching against memorised content was (and remains) contested — but the practical capability gap to GPT-3.5 was real and large.

## Multimodal input

GPT-4's headline architectural feature was **vision input**: the model accepted images interleaved with text and could answer questions about them. The vision capability was rolled out gradually — text-only at March release, image input via API months later, and integrated into ChatGPT Plus through 2023.

This was the first widely-available frontier multimodal LLM. The architecture — almost certainly some variant of [Flamingo's](../2022/flamingo) frozen-LM-with-vision-bridge or a fully-jointly-trained equivalent — was not disclosed.

## What was withheld

The GPT-4 technical report explicitly stated:

> Given both the competitive landscape and the safety implications of large-scale models like GPT-4, this report contains no further details about the architecture (including model size), hardware, training compute, dataset construction, training method, or similar.

This was a methodological discontinuity. GPT-1, GPT-2, GPT-3, and InstructGPT had been documented in detail. GPT-4 was not. Subsequent frontier-model releases — Claude 2/3, Gemini, GPT-4 Turbo — followed the same closed pattern.

External estimates put GPT-4 at around 1–1.8T parameters in a Mixture-of-Experts arrangement, with ~13T training tokens. None of these are confirmed. Pretraining cutoff was September 2021 (later updated for GPT-4 Turbo).

## Alignment

GPT-4's alignment was reported in detail (relative to other aspects). Key elements:

- **RLHF** following the [InstructGPT](../2022/instructgpt) recipe.
- **Rule-based reward models** trained on safety-policy violations to supplement preference RLHF.
- **Red-teaming** by ~50 external experts in domains like chemistry, biosecurity, cybersecurity.
- **Pre-deployment evaluation** by ARC (now METR) on autonomous-replication and similar capability-acquisition tasks.

The alignment work was substantial enough that the model was *less harmful per output* than GPT-3.5 by most external metrics. Internal jailbreaks remained possible but harder.

## Hallucinations and limits

GPT-4 was the first frontier LLM where the *gap between capability and reliability* became the dominant practical concern. The model could often solve a problem at expert level but **occasionally** produce confident hallucinations on basic factual queries. Failure modes:

- **Citations** — invented papers, plausible-but-fake URLs, fabricated quotes.
- **Calibration** — equally fluent on true and false statements.
- **Multi-step arithmetic** — improved over GPT-3.5 but still inconsistent on multi-digit problems.
- **Adversarial prompts** — system-prompt extraction, jailbreaks via roleplay or low-resource languages.

The "wild capability + occasional brittleness" combination is the GPT-4 phenomenology, and the framing every later frontier model has had to address.

## What GPT-4 enabled commercially

GPT-4 opened the API in late March 2023. The 12 months that followed produced the first sustained wave of LLM-powered products:

- **Coding assistants** (Cursor, Cody, Copilot Chat).
- **Customer-service automation** (Intercom Fin, etc.).
- **Search integration** (Bing Chat, Perplexity, Phind).
- **Knowledge-work tools** (Notion AI, Microsoft Copilot, Google Duet).
- **Agentic frameworks** (early AutoGPT, BabyAGI, LangChain agents).

By 2024, "wraps GPT-4" was a common-enough product description to be a meme.

## What GPT-4 was, methodologically

GPT-4 was the model where the **public research-paper recipe** ended at the frontier. Everything since — Claude 2/3, Gemini, GPT-4 Turbo, GPT-4o, o1, GPT-5 — has been reported with even less detail than GPT-4. Open-source efforts (LLaMA, Mistral, Qwen) followed, partly as a reaction to this closure.

For curriculum purposes: GPT-4 is the **last frontier model whose existence is a single named release**. After 2023, frontier models become continuously-updated systems where "GPT-4" or "Claude 3" refers to a moving target rather than a paper.

## What to read next

- [Claude](./claude) — the contemporary alignment-focused frontier model.
- [LLaMA](./llama) — the open-weights reaction.
- [Frontier Models](../2025-2026/frontier-models) — the continuing frontier story.
