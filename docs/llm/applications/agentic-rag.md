---
title: Agentic RAG
order: 3
---

# Agentic RAG

Plain [RAG](./rag) does one retrieval at the start; the model is a passive consumer of whatever the retriever returns. **Agentic RAG** lets the model decide *when* to retrieve, *what* to query, and *whether* it has enough evidence to answer — turning the retriever into a tool the model invokes mid-generation. This trades latency for accuracy on multi-hop queries where a single retrieval cannot surface all the needed evidence.

## Adaptive-RAG

*Adaptive-RAG* (Jeong et al., NAACL 2024) addresses the simplest form of "when": route each query to one of three pipelines — **no retrieval** (closed-book), **single-step retrieval**, or **multi-step retrieval** — based on a learned classifier of question complexity. Easy questions don't pay the retrieval cost; hard ones get the full multi-hop budget. The classifier is trained on labels distilled from running each pipeline and observing which one was sufficient.

## Auto-RAG

*Auto-RAG* (Yu et al., 2024) makes the retrieval loop fully driven by the LM. The model autonomously plans, retrieves, reflects on the snippets, and decides whether to issue another query — all expressed as natural-language reasoning. Training is via supervised fine-tuning on iterative RAG trajectories distilled from a strong teacher (GPT-4). The contribution over Self-RAG is that the loop is unconstrained — the model picks how many rounds it needs rather than emitting fixed reflection tokens.

## Search-o1

*Search-o1* (Li, Jin, Chen et al., 2025) is the agentic-RAG counterpart to **o1-style reasoning models**: long chain-of-thought interleaved with web searches. The model emits `<|begin_search_query|>` tags during its CoT; an external retriever runs the query and the system splices the results back into the trace before generation continues. A "Reason-in-Documents" module compresses the (often long) retrieved pages into the chain. The result: large gains on PhD-level science QA where one-shot retrieval is hopeless.

## Search-R1

*Search-R1* (Jin et al., 2025) replaces SFT/distillation with **reinforcement learning** to train the search-then-reason behaviour. The reward is just answer correctness on QA datasets — no per-step supervision. The model learns to invoke a search engine multiple times, even when the path is long and uncertain. This is the [RLVR](../reasoning/rlvr) recipe applied to retrieval: the search calls become part of the policy, optimized end-to-end against a verifiable reward. Search-R1 outperforms RAG and Search-o1 baselines while being model-agnostic about the underlying retriever.

## Reading list

- *Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity* — Jeong, Baek, Cho, Hwang, Park, NAACL 2024.
- *Auto-RAG: Autonomous Retrieval-Augmented Generation for Large Language Models* — Yu et al., 2024.
- *Search-o1: Agentic Search-Enhanced Large Reasoning Models* — Li, Jin, Chen et al., 2025.
- *Search-R1: Training LLMs to Reason and Leverage Search Engines with Reinforcement Learning* — Jin, Yang, Su et al., 2025.

## What to read next

- [RAG](./rag) — the static foundation this builds on.
- [LLM Agents](./agents) — the broader picture of tool-using LMs.
- [RLVR](../reasoning/rlvr) — the RL machinery that powers Search-R1.
