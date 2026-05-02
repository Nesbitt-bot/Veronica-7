---
title: Anthropic Claude (1, 2)
order: 2
---

# Anthropic Claude (1, 2)

Anthropic, founded in 2021 by ex-OpenAI researchers, launched **Claude** in March 2023 as a direct competitor to ChatGPT. Claude differentiated itself on **alignment methodology** (Constitutional AI in place of pure RLHF), **honest refusals**, **long context** (100K tokens at Claude 2's launch — unprecedented at the time), and a generally less-stiff conversational register. Claude is now a primary frontier model, with Claude 3, 3.5, 4, and beyond extending the line.

## Claude 1 (March 2023)

Claude 1 was released as an API and via Slack integration. Capabilities:

- **GPT-3.5–GPT-4 range** depending on benchmark — generally competitive with GPT-4 on reasoning, behind on math and code.
- **9K–100K token context** — much longer than GPT-3.5's 4K. Long-document QA was the headline use case.
- **Honest refusals** — when uncertain, Claude was trained to express uncertainty rather than confabulate. This reduced GPT-style hallucinations on the long tail.

Architecture details were not disclosed, following the post-GPT-4 closed-research norm.

## Constitutional AI

The signature alignment methodology. *Constitutional AI: Harmlessness from AI Feedback* (Bai et al., Anthropic 2022) proposes replacing some of the human-labelled preference data in [RLHF](../2022/rlhf) with **AI-generated** preferences guided by a written "constitution" — a list of natural-language principles like:

- "Choose the response that is most helpful, honest, and harmless."
- "Choose the response that is least likely to be discriminatory."
- "Choose the response that least encourages illegal activity."

The training pipeline:

1. **SFT** on human-written prompts and ideal responses.
2. **AI revision** — the model critiques and revises its own outputs against the constitution.
3. **AI preference labelling** — sample two responses, ask the model which better matches the constitution, train a reward model on these AI-generated preferences.
4. **RL fine-tuning** against the AI reward model.

The result: a model whose alignment is **steered by a written document** rather than implicit-in-the-data labellers' preferences. The constitution is auditable; the model's behaviour becomes more transparent. See [Constitutional AI](./constitutional-ai) for the full mechanism.

## Claude 2 (July 2023)

Claude 2 brought:

- **100K token context window** — roughly 75K words. Could process whole books, codebases, long documents in one pass.
- **Substantially better performance** on bar exam, MMLU, GSM8K, HumanEval.
- **Public consumer access** at claude.ai (US/UK initially).
- **Improved code generation** and structured output.

The 100K context was the biggest practical differentiator at launch. Pre-Claude-2, frontier-LLM context was 4–32K. The jump to 100K opened new use cases — long-document analysis, large-codebase understanding — that ChatGPT could not handle until GPT-4 Turbo's 128K release in November 2023.

## Anthropic's positioning

Anthropic explicitly positioned itself as a **safety-focused frontier lab**. Their "scaling-policy" documents (Responsible Scaling Policy, 2023) committed to capability evaluations and safety reviews tied to model deployment decisions. The framing — *we will build frontier models, but with explicit safety protocols* — became a common stance for frontier labs as 2023–24 progressed.

Practically, Claude's tone is more **"thoughtful research assistant"** than ChatGPT's "friendly product". Many academic and writing-heavy users prefer it; Claude's refusal style and honesty stance produce different downstream products.

## What followed

- **Claude 3** (March 2024) — three-tier release (Opus / Sonnet / Haiku), extended multi-modal vision input, ranked first on most public benchmarks at release.
- **Claude 3.5 Sonnet / Opus** (mid-2024) — substantial improvements at lower cost, particularly strong on coding and computer-use.
- **Claude 4** (2025) — the next-generation frontier model, with continued emphasis on long-horizon agentic capabilities.

Claude is now one of three to four "frontier-tier" LLMs (alongside GPT-4o/o-series, Gemini, sometimes Grok), with Anthropic, OpenAI, and Google as the oligopolistic frontier-model providers.

## What Claude established

- **Constitutional AI** as a credible alternative to pure RLHF.
- **Long context as a flagship capability** — 100K → 200K → 1M+ followed.
- **The "thoughtful AI" register** — distinct from ChatGPT's voice, often preferred for analytical work.
- **Anthropic as a serious frontier competitor**, ending OpenAI's monopoly on top-tier chatbots in 2023.

## What to read next

- [Constitutional AI](./constitutional-ai) — the alignment methodology in detail.
- [GPT-4](./gpt-4) — the contemporary OpenAI frontier model.
- [Claude 3](../2024/claude-3) — the successor.
