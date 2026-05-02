---
title: Frontier Models (Claude 4.x, GPT-5, Gemini 2.x)
order: 1
---

# Frontier Models (Claude 4.x, GPT-5, Gemini 2.x)

By 2025–2026, the frontier-LLM landscape has consolidated into a small set of providers — Anthropic (Claude 4.x), OpenAI (GPT-5, o-series), Google DeepMind (Gemini 2.x, 3.x), with periodic rivals from xAI (Grok), Meta (Llama 4+), and Chinese labs (DeepSeek, Qwen, Z.ai). Frontier models are now **continuously-updated systems**, not single named papers — "Claude 4 Sonnet" or "GPT-5" refers to a moving target updated every few months. This page surveys the post-2024 frontier era at the *systems* level, since the per-paper analysis has stopped scaling.

## What "frontier model" now means

A frontier model in 2025-2026 is roughly defined by:

- **Trained at >$100M compute cost.** The bar has risen from ~$10M (GPT-4) to $100M-$1B (estimated, GPT-5 / Gemini 3 / Claude 4 Opus).
- **Mixture-of-Experts at the top tier.** Sparse activation is universal at frontier scale; pure dense is obsolete past ~70B.
- **Native multimodality.** Text, image, audio, video, sometimes 3D, all in one model. Native input *and* output for several modalities.
- **Reasoning-mode capability.** Either a separate reasoning variant (o-series) or a unified model that can switch reasoning on/off (Claude 4 with extended thinking, Gemini 2.5 with thinking, DeepSeek R1.5).
- **Long context.** 200K–1M+ tokens standard.
- **Tool use and computer use** baked in — see [computer use](./computer-use), [coding agents](./coding-agents).

## Provider landscape

### Anthropic — Claude 4.x

- **Claude 4 Sonnet / Opus** (May 2025) — flagship release with extended thinking mode, computer use, strong coding (continued strong on SWE-bench Verified, Aider).
- **Claude 4.5 Sonnet** (Sept 2025) — refresh with substantial coding and agentic gains.
- **Opus 4.x** — top-tier model; more expensive but used for the hardest reasoning, research, code-architecture tasks.
- **Haiku** — fast/cheap tier.

Claude's positioning has stayed consistent: alignment-focused (Constitutional AI, Responsible Scaling Policy), strong on coding and long-form analysis, less of an emphasis on consumer voice/multimedia products vs OpenAI.

### OpenAI — GPT-5, o-series

- **GPT-5** (Aug 2025) — unified frontier model integrating o-series reasoning into the main GPT line. Adaptive compute: the model decides whether to think briefly or extensively per query.
- **o-series** (o3, o3-pro, o4-mini, etc.) — continuing reasoning-model line, increasingly merged with the GPT line.
- **GPT-4o, GPT-4o-mini, GPT-4.1** — multimodal product workhorses, lower cost than GPT-5.

OpenAI's pivot in 2025 was the **reasoning-by-default** stance: GPT-5 makes long-chain reasoning a default capability, not an opt-in product tier.

### Google DeepMind — Gemini 2.x and 3

- **Gemini 2.0 Flash / Pro** (late 2024 / early 2025) — refresh of the Gemini 1.5 line.
- **Gemini 2.5 Pro / Flash** (March 2025) — multi-modal reasoning, strong coding and math.
- **Gemini 3** (late 2025) — next-generation flagship.

Google's differentiators stay long context (1M-2M tokens), native audio/video, and integration with Google products (Workspace, Search).

### Open-weights frontier — DeepSeek, Qwen, Llama

- **DeepSeek V3, V3.5, R1.5** — frontier-quality open MoE models.
- **Qwen 3, Qwen 3.5** — Alibaba's continuing strong open line.
- **Llama 4 / 4.1** — Meta's first MoE-frontier open releases.

Open-weights closing the gap has been a sustained 2024-2025 trend; by late 2025, open models are competitive with closed for most non-frontier-reasoning use cases.

## Saturation and new benchmarks

By 2025, almost every long-standing public benchmark is saturated:

- **MMLU** — frontier models score ≥90%, often >95%.
- **GSM8K, MATH** — saturated by reasoning models.
- **HumanEval** — saturated.
- **GPQA Diamond** — frontier models exceed expert human performance.

New benchmarks designed to resist saturation:

- **FrontierMath** — competition-grade math problems too hard for human experts in fields outside their specialty.
- **SWE-bench Verified** — real GitHub issues with executable validation. Live-updated.
- **ARC-AGI 2** — tighter, harder visual-reasoning benchmark.
- **HLE (Humanity's Last Exam)** — human-expert-curated cross-domain hard questions.
- **GAIA** — agentic-task benchmark.
- **Vending-Bench, OS-World, ToolBench-Live** — agentic and tool-use benchmarks.

The benchmark-saturation pattern is now: a benchmark goes from 0% to expert-level human performance in 18-24 months, then is supplanted.

## Cost and access

Frontier-model costs have come down despite capability going up:

- GPT-4 (2023) — ~$30/M tokens output.
- GPT-5 (2025) — ~$10/M tokens output for the standard tier.
- Open-weights frontier — ~$0.10/M tokens self-hosted.

The price reductions are partially compensated by higher per-query token usage as reasoning-mode generates 10K-100K hidden tokens per query.

## Where frontier models are not yet good

Even at the 2025-2026 frontier, common failure modes include:

- **Long-horizon agentic execution.** Agents drift on tasks longer than ~30-60 minutes.
- **Symbolic mathematical proof** at PhD research level (improving but not solved).
- **Genuinely novel scientific discovery** (claimed but contested).
- **Robust calibration and uncertainty.** Models still report "I'm sure" when wrong.
- **Adversarial robustness.** Jailbreaks, prompt injections still work.
- **Bias and demographic disparity.** Systematic, ongoing, mitigated but not eliminated.

## What to read next

- [Alignment](./alignment) — modern alignment work for frontier models.
- [Coding Agents](./coding-agents) — the most-deployed agentic application.
- [Computer Use](./computer-use) — the computer-control modality.
