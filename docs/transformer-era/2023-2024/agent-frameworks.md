---
title: Agent Frameworks
order: 8
---

# Agent Frameworks

By mid-2023, the conceptual recipe for LLM agents — [ReAct](./react-toolformer)-style Thought/Action/Observation loops, [tool-use](./tool-use) APIs, retrieval, memory — was well understood. What followed was an explosion of **agent frameworks** that orchestrated these primitives into reusable building blocks: AutoGPT, BabyAGI, LangChain Agents, LangGraph, CrewAI, AutoGen, OpenAI Swarm. Each took a different bet on what the right abstraction is. Most are still finding their footing as of 2025; the space is unsettled.

## AutoGPT and the autonomous-agent moment (March 2023)

*AutoGPT* (Significant Gravitas, March 2023) was the first viral autonomous agent. Give it a goal in natural language; it would loop indefinitely, planning sub-goals, calling tools (search, file read/write, code execution), updating memory, and self-evaluating progress. **BabyAGI** (Yohei Nakajima, April 2023) was a similar but simpler system focused on a task-list-driven loop.

Both went viral on Twitter/X in spring 2023. The pattern — *give the LLM a goal and let it run* — captured imaginations. The reality was that AutoGPT-style autonomous agents:

- **Got stuck in loops** on most non-trivial tasks.
- **Hallucinated tool calls** at high rates.
- **Burned tokens** without making progress.
- **Failed silently** without robust error recovery.

By summer 2023 the autonomous-agent hype had cooled. The lessons survived: GPT-3.5 / GPT-4 weren't capable enough to run open-ended autonomous loops yet, but the recipe was right. Capability eventually caught up.

## LangChain — the framework that ate the early ecosystem

*LangChain* (Harrison Chase, Oct 2022) became the dominant agent + RAG framework of 2023, with bindings for every LLM provider, vector store, retriever, and tool. Its core abstractions:

- **Chains** — declarative pipelines of LLM calls and transformations.
- **Agents** — ReAct-style loops with tool registries.
- **Memory** — conversation buffers, summary memory, retrieval-augmented memory.
- **Retrievers** — abstraction over vector stores for RAG.

LangChain's reach was unprecedented: by mid-2024, ~70% of LLM-app blog posts used it. The criticism was equally widespread — too many abstractions, leaky generalisations, hard-to-debug stack traces. LangChain reorganised in 2024 into a **smaller core + LangGraph + LangSmith + LangServe** ecosystem, partly addressing these critiques.

**LangGraph** (2024) is the framework's modern recommendation: explicit state graphs (nodes are functions, edges are routing decisions) instead of declarative chains. The state-machine view turned out to be a much cleaner abstraction for agent loops than chained transformations.

## LlamaIndex — RAG-first

*LlamaIndex* (Jerry Liu, late 2022) competed with LangChain for the same audience but emphasised **structured RAG** — sophisticated indexing, retrieval strategies, and document handling. By 2024 the line had blurred; LlamaIndex added agent capabilities, LangChain added structured RAG.

## AutoGen and CrewAI — multi-agent orchestration

A second wave of frameworks targeted **multi-agent** patterns:

- **AutoGen** (Microsoft, 2023) — a framework for orchestrating multiple LLM agents that converse with each other. "Pair programming" agent conversations, debate-based reasoning, planner-executor splits.
- **CrewAI** (2023) — agents as "crew members" with distinct roles, collaborating on tasks.
- **OpenAI Swarm** (Oct 2024) — a minimal example library for multi-agent orchestration; explicitly *not a production framework*.

The multi-agent thesis is that complex tasks benefit from specialisation — a researcher agent, a writer agent, a critic agent, etc. Empirically, the gains are uneven; sometimes a single capable model with the right prompt does as well or better. Multi-agent systems work well when:

- Different agents have access to different tools or contexts.
- Adversarial structure is useful (critic vs writer).
- Parallelism is important.

They fail when the orchestration cost (extra LLM calls, coordination prompts) exceeds the specialisation benefit.

## Production agents in 2024-2025

The frontier-model providers built agentic capabilities directly into their offerings:

- **OpenAI Assistants API** (Nov 2023) — managed thread state, tool registry, file search, code interpreter as built-ins.
- **Anthropic Computer Use** (Oct 2024) — Claude with browser/computer control built into the API. See [computer use](../2025-2026/computer-use).
- **OpenAI Operator** (Jan 2025) — autonomous browser agent.
- **Claude Code** (Feb 2025) — CLI-based coding agent.
- **Gemini live agentic capabilities** — search, action.

The pattern is increasingly: provider gives you a strong agentic LLM with tool-use and computer-use baked in; the developer's job is plumbing tools, defining policies, and writing system prompts. The "framework" is becoming thinner as models become more capable.

## What agent frameworks are for

The right framework choice in 2025 depends on use case:

- **Simple ReAct loop** — just write Python with the provider's tool-use API. Frameworks add cost without value.
- **Complex routing / state graph** — LangGraph or similar.
- **Multi-agent collaboration** — AutoGen, CrewAI for prototyping; rarely production.
- **Document QA / RAG** — LlamaIndex or LangChain's retrieval components.
- **Production deployment** — provider-native (Assistants, Bedrock Agents) for stability.

The framework market is consolidating. By 2026, expect a smaller set of established frameworks plus provider-native agents.

## What to read next

- [Tool Use](./tool-use) — the underlying primitive.
- [Coding Agents](../2025-2026/coding-agents) — the most-developed agent application.
- [Computer Use](../2025-2026/computer-use) — the next-generation agentic action.
