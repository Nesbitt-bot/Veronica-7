---
title: Coding Agents
order: 4
---

# Coding Agents

By 2025-2026, **coding agents** — LLMs with file-system access, terminal-execution, and project-wide code understanding — are the most-deployed agentic-AI application. The lineage runs from [Codex / Copilot](../2020-2021/codex) (inline completion, 2021) through chat-based code Q&A (2023) to autonomous edit-test-fix loops (2024-2025). Cursor, Claude Code, Codex CLI, Aider, GitHub Copilot Workspace, Devin, Continue, Cline, Windsurf, Roo Code — the market is large, fragmented, and rapidly improving.

## What a coding agent does

The standard capabilities of a 2025-2026 coding agent:

- **Read project files** — full filesystem access scoped to the project root.
- **Edit files** — surgical edits, multi-file refactors, new file creation.
- **Run terminal commands** — build, test, lint, format, install dependencies.
- **Execute generated code** — run scripts, REPLs, test suites.
- **Search across the codebase** — grep / ripgrep / semantic search.
- **Git integration** — read history, view diffs, sometimes commit and push.
- **MCP / external tools** — increasingly, coding agents call out to external services (databases, web search, deployment platforms).

The interaction loop is essentially [ReAct](../2023-2024/react-toolformer): plan, take an action, observe the result, plan the next action. Modern coding agents iterate hundreds of times per session.

## The product landscape

### Inline completion: GitHub Copilot, Cursor Tab, Codeium

Direct descendants of [Codex/Copilot](../2020-2021/codex). Ghost-text completion in the IDE, low latency, no chat. The default for high-volume per-keystroke assistance. By 2025 these have absorbed structured-edit features (multi-line refactors, "Tab to apply").

### IDE-integrated agents: Cursor, Windsurf, Continue, Zed

Cursor (founded 2022) defined the 2024-2025 "AI-native IDE" category. Tab completion + chat + agent-mode that can edit multiple files. Cursor's "Composer" and "Agent Mode" are reference implementations of in-IDE agentic editing. By 2025, Windsurf, Zed, Continue, and JetBrains AI compete in the same space.

### CLI agents: Claude Code, Codex CLI, Aider

A different product shape: **command-line agents** that operate on a project directory.

- **Aider** (paul-gauthier, late 2023) — open-source pioneer. Edit-mode LLM with git integration.
- **Claude Code** (Anthropic, Feb 2025) — official CLI agent. Tightly integrated with Claude's tool-use; runs in any terminal.
- **Codex CLI** (OpenAI, April 2025) — OpenAI's answer to Claude Code.

CLI agents tend to be preferred by experienced developers who want full control over the environment. They also dominate for **long-running** tasks (hours of edits) where the IDE-chat pattern is awkward.

### Autonomous agents: Devin, OpenAI Agents, Gemini Coder

The "give it a goal, walk away" category. Devin (Cognition, March 2024) was the first to ship publicly under this framing. By 2025 most major providers offer some variant. Capabilities at the high end: take a Linear / Jira ticket, propose a plan, execute with the codebase, open a PR, respond to review comments.

Reliability remains the key gating factor — long-horizon autonomous coding still fails on enough tasks that human supervision is required.

## Benchmarks

The benchmark landscape for coding agents:

- **HumanEval, MBPP** — saturated since 2024.
- **SWE-bench Verified** — real GitHub issues with tests. Frontier models scoring 60-75% in mid-2025.
- **LiveCodeBench** — competitive-programming problems updated continuously to avoid contamination.
- **Aider's polyglot benchmark** — multi-language editing.
- **TerminalBench / OSWorld-Code** — agentic terminal-use evaluation.

SWE-bench Verified is the most-watched coding benchmark in 2025-2026. Frontier-model performance on it is a primary signal about coding-agent capability.

## What's actually working

Tasks coding agents reliably do well:

- **Boilerplate generation** — new files, typed-stub APIs, configuration scaffolding.
- **Refactors with clear specifications** — rename, extract function, change a type signature consistently.
- **Bug fixes given a stack trace** — particularly when the cause is local.
- **Adding tests** to existing code.
- **Code review** — pointing out issues, suggesting improvements.
- **Documentation generation.**

Tasks that remain hard:

- **Architectural decisions** — "should this be a microservice?" The agent will pick a design but reasoning about long-term implications is weak.
- **Subtle bugs** crossing module boundaries.
- **Performance optimisation** requiring profiling and runtime knowledge the agent lacks.
- **Reading large codebases for high-level understanding** without prior familiarisation.

## How developers are using coding agents

Survey data from 2024-2025:

- **>70% of professional developers** use AI assistants daily as of 2025 (StackOverflow, GitHub surveys).
- **Inline completion** is the most-used feature; chat-based and agent-based features grow rapidly.
- **Productivity gains** are real but contested in size — studies show 10-50% speedup on certain tasks, no gain (or regression) on others.
- **Skill effects** are debated — junior developers may benefit more, but the "skill-erosion" concern (developers losing ability to code without AI) is increasingly raised.

## What this changes

- **Codex / Copilot's inline completion** is now table-stakes; the differentiation has moved up the stack to agentic capability.
- **Open-source coding agents** are competitive with closed-source for many tasks (Aider + open-source models from Qwen, DeepSeek, Mistral).
- **Coding-agent capability has pulled ahead of general LLM capability on real-world software tasks** — providers tune specifically for coding workflows.
- **The skill premium** for senior developers has shifted toward those who can effectively *direct* AI agents, not write all the code by hand.

## What to read next

- [Codex & Copilot](../2020-2021/codex) — the lineage starts here.
- [Tool Use](../2023-2024/tool-use) — the protocol coding agents use.
- [Computer Use](./computer-use) — agentic action beyond just code.
