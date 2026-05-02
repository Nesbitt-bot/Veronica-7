---
title: Tool Use & Function Calling
order: 7
---

# Tool Use & Function Calling

The 2023-2024 productisation of LLM tool use turned [ReAct and Toolformer's](./react-toolformer) prompting recipes into **API-level features**. OpenAI's Function Calling (June 2023), Anthropic's Tool Use (April 2024), and Google's Gemini function-calling are all variations on the same pattern: the developer registers a list of tool schemas; the model emits a structured tool call when appropriate; the application executes the call and feeds the result back. Tool use is now **infrastructure** for any non-trivial LLM application.

## The protocol

A typical function-calling exchange has four roles:

- **Developer** sends the user prompt plus a list of tool schemas (JSON Schema for arguments, plus name and description).
- **Model** either answers directly or emits a structured tool-call message:

```json
{
  "tool": "search",
  "arguments": {"query": "OpenAI revenue 2024"}
}
```

- **Application** executes the call, returns the result as a "tool message" appended to the conversation.
- **Model** continues, conditioning on the tool result, possibly calling more tools or producing the final answer.

The provider's training has made the model output well-formed JSON tool calls reliably. The application doesn't need to parse from natural language; the API gives a structured object.

## Why function calling won

Pre-2023 tool use was prompt engineering: write a careful system prompt explaining the tool format, hope the model follows it. Failure modes were endemic — malformed JSON, hallucinated tool names, wrong argument types. Function-calling APIs solved these by:

- **Constrained decoding** — the inference engine ensures outputs match the JSON schema (sometimes via grammar-constrained sampling, sometimes by training).
- **Standard formats** — `tool_calls` and `tool` message types in the OpenAI API became the de-facto cross-provider standard.
- **Validation at the boundary** — providers reject malformed tool calls before they reach application code.

The combination made tool use *predictable enough to build production systems on*, which is what kicked off the 2024 agent-product wave.

## Tool-use training

Frontier models are trained for tool use, not just prompted. The training mix typically includes:

- **Synthetic tool-use trajectories** — generated from a strong teacher model executing on tool sets, then filtered for correctness.
- **Human-collected tool-use examples** — paid labellers writing realistic queries and ideal tool sequences.
- **Negative examples** — cases where the model should *not* call a tool (the answer is already known).
- **Multi-tool composition** — sequences requiring multiple calls in correct order.

Anthropic's Tool Use, OpenAI's Function Calling, and Google's Gemini all use some variant of this recipe. The training data is closely-held but the format is standardised.

## What's a good tool

The 2023-2024 deployment experience surfaced principles for tool design:

- **Atomic.** Each tool does one thing. "search" + "fetch_url" + "summarize" beats one mega-"web_research" tool.
- **Composable.** Tool outputs in one call should feed naturally into the next call's arguments. JSON-typed outputs make this work.
- **Idempotent where possible.** A tool the model can retry without causing harm is much easier to use safely.
- **Well-described.** The tool's docstring is what the model sees. Vague descriptions cause wrong-tool-for-the-job errors.
- **Schema-tight.** Loose argument schemas invite the model to send malformed calls. Tighten them where you can.

These principles are now standard SDK guidance.

## Provider features by 2024

The 2024 generation of LLM provider APIs supports:

- **Parallel tool calls** — one assistant turn can emit multiple tool calls to be executed concurrently.
- **Multi-turn tool use** — the model holds state across many turns of (call, response) without re-prompting from scratch.
- **Forced tool calls** — the developer can require the model to call a specific tool, useful for orchestration.
- **Strict mode / structured outputs** — the model is *guaranteed* to emit a valid JSON Schema-conforming response.
- **Computer use** (Anthropic, late 2024; OpenAI Operator, 2025) — tools that include "click", "type", "screenshot" for browser/computer control. See [computer use](../2025-2026/computer-use).

## What tool use enables

The 2023-2024 tool-use wave produced:

- **Coding agents** — Cursor, Cody, Devin, Aider, Codex CLI, Claude Code. Tool use of code editing, terminal commands, search, file reading.
- **Research agents** — Perplexity Pro, ChatGPT with browsing/search, Claude with web search. Tool use of search engines, content fetchers, citation formatters.
- **Workflow automation** — Zapier AI, n8n, custom automations. Tool use of CRM APIs, calendars, databases.
- **Robotics / IoT** — early-stage. Tool use of physical-world actuators with safety wrappers.

By late 2024, "what tools should we expose to the model?" had replaced "what can the model do?" as the central practical design question.

## What to read next

- [ReAct & Toolformer](./react-toolformer) — the conceptual ancestors.
- [Agent Frameworks](./agent-frameworks) — orchestration on top of tool-use APIs.
- [Coding Agents](../2025-2026/coding-agents) — the most-deployed downstream application.
