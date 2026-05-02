---
title: Claude 3 Family
order: 1
---

# Claude 3 Family

Anthropic released **Claude 3** on March 4, 2024 as a three-tier model family — Opus, Sonnet, Haiku — that briefly took the top of every public LLM benchmark. The release marked the first time a non-OpenAI lab held the public benchmark lead since [GPT-4](../2023/gpt-4)'s March 2023 launch. Claude 3.5 Sonnet (June 2024) and Claude 3.5 Sonnet (new, October 2024) extended the line and moved Anthropic's focus from raw benchmarks to **agentic capabilities** — coding, computer use, long-running tasks.

## The Opus / Sonnet / Haiku tier system

Claude 3's three-tier release was a distinct marketing-and-engineering choice from the GPT line:

- **Claude 3 Opus** — the frontier model, slowest, most capable, highest cost.
- **Claude 3 Sonnet** — mid-tier, intended as the daily-driver model. Cheaper, faster, slightly less capable.
- **Claude 3 Haiku** — fast and cheap, intended for high-volume inference.

The naming pattern is now common ("flagship / daily / fast") and signals to developers what to use where. Most production deployments use Sonnet or Haiku for cost-sensitive volume traffic, with Opus reserved for the hardest queries.

## Capabilities at launch

Claude 3 Opus matched or beat GPT-4 (the then-incumbent) on most public benchmarks: MMLU, GSM8K, MATH, HumanEval, GPQA, MGSM, HellaSwag. Specific differentiators:

- **Vision input.** Claude 3 was Anthropic's first model with image input, comparable to GPT-4V at launch.
- **200K-token context.** Up from Claude 2's 100K, with strong needle-in-haystack performance.
- **Lower refusal rate.** Anthropic explicitly tuned Claude 3 to refuse less of the time on benign queries — addressing the over-refusal complaints that had built up around Claude 2.
- **Better calibration.** Claude 3 was reported to express uncertainty more reliably than its predecessor (whether this carried through to subjective use was contested).

## Claude 3.5 Sonnet (June 2024)

The Claude 3.5 Sonnet release (June 20, 2024) was strategically unusual: a *Sonnet*-tier model that beat the previous *Opus*-tier flagship on most benchmarks at a fraction of the cost. Anthropic shipped it with the framing "we're building toward Claude 3.5 Opus" — but Opus 3.5 didn't ship that year.

Claude 3.5 Sonnet became the default Anthropic model for most users and the strongest generally-available LLM on coding benchmarks (SWE-bench Verified, HumanEval, LiveCodeBench) for a substantial part of 2024.

## "Claude 3.5 Sonnet (new)" — October 2024

Anthropic released a refreshed Claude 3.5 Sonnet on October 22, 2024 (confusingly under the same model name). The October version introduced:

- **Computer Use** — beta API allowing Claude to control a virtual computer (mouse, keyboard, screenshots). See [computer use](../2025-2026/computer-use).
- **Improved coding** — substantial gains on SWE-bench, real-world IDE tasks.
- **Stronger agentic capability** — multi-turn tool-use trajectories with better long-horizon coherence.

The "new Sonnet" framing was the start of Anthropic's pivot from *benchmark capability* to *practical agentic capability* — not just "knows things" but "does tasks".

## Architecture (mostly speculation)

Claude 3 Opus is widely believed to be a Mixture-of-Experts model in the GPT-4-class scale (1-2T total parameters). Sonnet and Haiku are presumably distilled or smaller MoE variants. None of this is confirmed; Anthropic followed the post-GPT-4 norm of withholding architectural details.

Training compute, dataset, and recipe were not disclosed. The model card (Anthropic, 2024) discusses safety evaluations and Responsible Scaling Policy commitments but not technical details.

## What Claude 3 established

- **Three-tier releases as default.** OpenAI's GPT-4o / GPT-4o-mini and Google's Gemini Pro / Flash followed.
- **Anthropic as a serious commercial frontier provider.** Pre-Claude-3, Anthropic had a small market share. Post-Claude-3 (and especially post-3.5 Sonnet), it became one of the three primary frontier-API providers alongside OpenAI and Google.
- **The "agentic capability" framing.** Claude 3.5 Sonnet (new) explicitly positioned the model as a *task-doer*, not just a question-answerer.

## Subsequent line

- **Claude 3.5 Haiku** (Oct 2024) — refreshed fast tier.
- **Claude 3.7 Sonnet** (Feb 2025) — extended thinking mode (visible chain-of-thought), competitive with o1-class reasoning models.
- **Claude 4 family** (May 2025) — next-generation flagship, with Sonnet 4, Opus 4 variants. See [frontier models](../2025-2026/frontier-models).

## What to read next

- [Anthropic Claude (1, 2)](../2023/claude) — predecessors.
- [GPT-4](../2023/gpt-4) — the contemporary OpenAI frontier.
- [Frontier Models](../2025-2026/frontier-models) — the post-Claude-3 frontier landscape.
