---
title: Codex & Copilot
order: 4
---

# Codex & Copilot

*Evaluating Large Language Models Trained on Code* (Chen, Tworek, Jun, Yuan, de Oliveira Pinto, Kaplan et al., OpenAI 2021) introduced **Codex**, a [GPT-3](../2020/gpt-3) variant fine-tuned on public GitHub code. Codex powered **GitHub Copilot** — the first commercially deployed AI coding assistant, released to early access in June 2021. Codex/Copilot was the moment "LLMs can write programs" became a product, and the start of the now-massive AI-for-code ecosystem.

## What Codex was

Codex was a GPT-3-class decoder-only Transformer fine-tuned on a 159GB filtered code corpus from GitHub Python repositories. The largest Codex model was 12B parameters; the production Copilot version was distilled smaller for latency.

The fine-tuning was **straightforward continued pretraining** on code with the same next-token-prediction objective used for natural language. No special architecture, no separate code tokeniser (BPE on raw code worked fine). The headline finding: a general-purpose LLM, given enough code, becomes a competent coder.

## HumanEval — the benchmark

The paper introduced **HumanEval**, 164 hand-written Python programming problems. Each has a function signature, a docstring describing intended behaviour, and hidden unit tests. The model is given the signature + docstring and must complete the function body. Correctness is measured by **pass@k**: the probability that at least one of $k$ samples passes all unit tests.

Pass@k computation matters. Naive averaging is biased; the paper introduced the unbiased estimator

$$
\text{pass@}k \;=\; \mathbb{E} \left[ 1 - \binom{n - c}{k}\big/\binom{n}{k} \right],
$$

with $n$ samples drawn and $c$ passing. This is now the standard code-generation metric.

Codex-12B achieved 28.8% pass@1 and 70.2% pass@100 on HumanEval — already enough for the docstring-driven completion that Copilot offered. Modern models (GPT-4, Claude, Gemini, Qwen Coder) score 80–95% pass@1 — the benchmark is now nearly saturated.

## What Copilot did differently

Copilot was Codex deployed as **inline code completion** in IDEs (VS Code, Neovim, JetBrains). The product UX:

- **Ghost text** — completions appear as low-opacity text inline; tab to accept.
- **Multi-line suggestions** — complete several lines at once, including whole functions.
- **Implicit context** — current file, recent edits, and nearby files are injected into the prompt.

Copilot's launch was a discontinuity in developer tooling. Within months it had 100K+ users; by 2023 GitHub claimed >1M paying subscribers. Studies (Peng et al., 2023) showed measurable productivity gains for some tasks. The whole AI-coding-assistant market — Cursor, Cody, Tabnine, Codeium, Replit Ghostwriter — exists in Copilot's wake.

## Risks the paper called out

The Codex paper was unusually frank about deployment risks:

- **Generation of insecure code.** The model can produce SQL injection, XSS, hardcoded secrets — anti-patterns common in its training data.
- **Bias and offensive content** — comments and identifiers sometimes contain slurs or stereotyping.
- **Licence concerns** — GitHub training data includes copyleft (GPL) repositories; whether the model output should be considered derivative work was (and remains) legally contested.
- **Skill erosion / over-reliance** — developers may stop building skills the model handles.
- **Misuse** — generation of malware, exploits, automated attacks.

Most of these concerns played out in practice. The licence question led to Doe v. GitHub (2022), which is still ongoing.

## What changed after Codex

By 2023, every major frontier LLM had strong code capability **without** explicit code-only fine-tuning — code data is now part of every general pretraining corpus and the resulting models cover the function Codex once filled. Specialised models persisted (StarCoder, Code Llama, DeepSeek-Coder, Qwen-Coder), often dominating per-FLOP cost-performance for IDE integrations.

The **agentic** evolution of code generation — multi-file edits, terminal use, test execution — built on Codex's foundation. Modern coding agents (Devin, Cursor Agent, Claude Code, Codex CLI) use frontier LLMs with extensive tool-use scaffolding rather than the original Codex completion model, but the lineage is direct.

## What Codex established

- **Code is a high-value LLM domain.** Sample efficient (lots of public data), verifiable (unit tests), high economic value per token.
- **HumanEval as the benchmark.** Replaced earlier program-synthesis benchmarks; spawned a family of follow-ups (MBPP, APPS, BigCodeBench, LiveCodeBench).
- **The completion UX.** Inline ghost-text completion is now the default code-AI interface.

## What to read next

- [GPT-3](../2020/gpt-3) — the base model Codex was fine-tuned from.
- [Coding Agents](../2025-2026/coding-agents) — the modern descendant.
- [Eval](../../llm/evaluation/eval) — the discussion of code-eval rigour.
