---
title: ReAct & Toolformer
order: 6
---

# ReAct & Toolformer

Two 2022-2023 papers established the patterns for **LLMs that take actions**: *ReAct* (Yao et al., ICLR 2023) showed that interleaving reasoning steps with tool calls dramatically improves task success, and *Toolformer* (Schick et al., NeurIPS 2023) showed that LLMs can be **self-trained** to use tools by leveraging their own log-likelihood as a teacher signal. Together they are the conceptual foundation of every modern [tool-using](./tool-use) and [agentic](./agent-frameworks) LLM system.

## ReAct — Reasoning + Acting

*ReAct: Synergizing Reasoning and Acting in Language Models* (Yao, Zhao, Yu, Du, Shafran, Narasimhan, Cao, ICLR 2023). The setup: alternate between **Thought**, **Action**, and **Observation** tokens in the LLM's output:

```text
Thought 1: I need to find out who wrote the song.
Action 1: search[song title]
Observation 1: The song was written in 1985 by ...
Thought 2: Now I can answer the question.
Action 2: finish[the answer]
```

The "Thought" lines let the LLM plan and self-correct in natural language; the "Action" lines invoke external tools (search, calculator, code execution); the "Observation" lines are tool outputs spliced back into the context. The model continues the trace one segment at a time.

Empirically, ReAct beats both pure chain-of-thought (no tools) and pure action-only sequences (no reasoning) on diverse benchmarks: HotpotQA, FEVER, ALFWorld (text adventure games), WebShop. The reasoning text both **plans** what tool to call next and **interprets** the observation in context.

ReAct didn't require fine-tuning — few-shot prompting with the Thought/Action/Observation format on top of GPT-3.5 was enough. This is the most-cited *prompting recipe* for tool use, and the conceptual ancestor of most modern agent loops.

## Toolformer — self-supervised tool use

*Toolformer: Language Models Can Teach Themselves to Use Tools* (Schick, Dwivedi-Yu, Dessì, Raileanu, Lomeli, Zettlemoyer, Cancedda, Scialom, NeurIPS 2023). The setup:

1. Take a base LM and a set of tools (calculator, calendar, QA, translation, search).
2. Ask the base LM to **insert candidate tool calls** into a corpus, e.g. transforming "the result is [Calculator(2+3)] 5" from a plain sentence.
3. **Execute** each candidate call.
4. **Filter** by the loss-reduction criterion: keep only insertions where, when the tool's response is spliced in, the LM's loss on the surrounding tokens *decreases*. This selects calls that genuinely help the model predict the rest of the sentence.
5. Fine-tune the LM on the filtered corpus.

The result is a model that learns to call the right tool at the right time, **without any human-labelled tool-use examples**. The supervisory signal comes entirely from the LM's own self-rated usefulness.

Toolformer was a fundamentally different research bet than ReAct: ReAct works at inference time on any LLM; Toolformer requires fine-tuning but produces a more compact, self-routed tool-using model. The two aren't competitors — most modern systems combine ReAct-style prompting with fine-tuning on tool-use trajectories.

## Why these matter

The two papers established three conceptual handles that frame all subsequent agent work:

- **Tool calls as actions.** A function-call API in the LM's generation interface is the right abstraction. OpenAI's Function Calling API (June 2023), Anthropic's Tool Use (April 2024), and every other frontier provider's tool-call format are direct descendants.
- **Reasoning as planning.** Inserting natural-language thoughts between actions improves both action selection and observation interpretation. Modern agents always do this; sometimes the thoughts are explicit, sometimes hidden in the model's internal state.
- **Self-supervised expansion.** Toolformer's insight that an LM can teach itself to use tools generalises: the same loss-reduction criterion drives much of the synthetic-data work behind modern reasoning models ([o1](../2024-2025/o1), [R1](../2024-2025/r1)).

## What they didn't yet have

Both papers were limited to short, single-task tool-use. What they didn't address:

- **Multi-tool composition.** Real agents chain dozens of calls; ReAct stopped at a few.
- **Stateful tool environments.** ReAct's tools were stateless lookups. Modern agents work with stateful APIs (databases, file systems, browsers).
- **Robust error handling.** Tools fail; agents have to retry, reformulate, or give up gracefully.
- **Long-horizon planning.** The Thought/Action/Observation loop assumes the model can plan one step at a time; multi-hour tasks need hierarchical planning.

These were addressed by [agent frameworks](./agent-frameworks) and the 2024-2025 frontier-model agentic capabilities.

## ReAct → modern agents

Modern agentic systems (Cursor, Devin, Claude Code, Windsurf, Aider, Copilot Workspace) are structurally ReAct loops with much larger tool sets, better reasoning, and harder problem domains. The Thought-Action-Observation pattern is now invisible — embedded in API formats and provider implementations — but every agent loop still works the same way.

## What to read next

- [Tool Use](./tool-use) — the productisation of these ideas.
- [Agent Frameworks](./agent-frameworks) — orchestration around tool-using LLMs.
- [LLM · Agents](../../llm/applications/agents) — the curriculum-track explanation.
