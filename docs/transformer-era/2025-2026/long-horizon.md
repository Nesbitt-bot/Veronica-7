---
title: Long-Horizon Planning & Memory
order: 5
---

# Long-Horizon Planning & Memory

The 2025-2026 frontier of LLM research is **long-horizon agentic capability** — can a model plan, execute, recover from errors, and remain coherent over hours or days of work? Reasoning models, [computer-use](./computer-use) agents, and [coding agents](./coding-agents) are converging on this question. The current state: models are competent for ~30-60 minute autonomous tasks but degrade unpredictably past that. Closing the gap requires advances in **memory**, **planning**, and **error recovery** — none of which are settled.

## What "long-horizon" means

A useful operationalisation: a task is **long-horizon** if it requires:

- **More than ~10K tokens of action context.**
- **Multiple distinct sub-tasks** that must be planned and ordered.
- **State tracking** beyond the model's working context window.
- **Error recovery** — the agent will encounter unexpected results and must adapt.

By this definition, "summarise this article" is short-horizon; "ship a feature with a full-test-suite implementation, code review, and deployment" is long-horizon.

## METR's task-completion curves

METR (Model Evaluation and Threat Research) has published influential work measuring **the time horizon of LLM-doable tasks**:

- For a given LLM, plot the success rate vs the **human time** the task takes.
- Find the time at which success rate crosses 50%.
- Track this metric as models improve.

The 2024 finding (METR, *Measuring AI Ability to Complete Long Tasks*, 2025): the 50%-success time horizon has been **doubling roughly every 7 months** for frontier models on software-engineering tasks since 2019. As of mid-2025 the horizon was around 1 hour for the strongest agents.

If the trend continues — itself an open question — by 2027 frontier agents would handle tasks that take humans a workday; by 2030, multi-week tasks. Whether the trend extrapolates is the most-watched question in agentic-LLM scaling.

## What's currently failing

The 2025-2026 long-horizon failure modes:

- **Context drift.** Even with 1M-token context, the model "forgets" what it was doing 100K tokens ago.
- **Plan abandonment.** The model starts well, gets distracted by a sub-problem, never returns to the main goal.
- **Repetition loops.** The agent gets stuck retrying the same failing approach.
- **Cumulative error.** Small mistakes early in the trace compound into incoherent later behaviour.
- **Self-modification of goals.** The agent's understanding of the original goal shifts subtly with each "Thought:" reflection.

Each is a research target.

## Memory architectures

The "memory problem" — letting an agent persist information across context windows — has several proposed solutions:

- **External memory.** Episodic memory stored in a vector database; retrieve relevant snippets at each step. Used in MemGPT, Letta, A-MEM.
- **Hierarchical summarisation.** Compress old context into summaries that fit in working context. Common in long-running agents.
- **Structured scratchpads.** Force the agent to maintain explicit state files (TODO lists, fact tables) that are read/written each step.
- **Continuous fine-tuning.** Periodically fine-tune the model on its own recent experience.
- **Long-context-as-memory.** Just use a 1M-token model and put everything in context. Works to a point but doesn't scale to weeks.

A-MEM (Xu, Mei, Liu, Zhang, 2024) — the agentic-memory paper — proposes a Zettelkasten-style note system with auto-generated tags and linked retrieval. Similar ideas appear in commercial agents (Notion AI, Letta).

## Planning architectures

Long-horizon planning has been approached via:

- **Hierarchical planning.** High-level planner emits sub-goals; a low-level executor handles each. Voyager (Wang et al., 2023) on Minecraft is the canonical demonstration.
- **Plan-and-solve prompting.** The model outputs an explicit plan, then executes against it. Variants in many frontier-model agentic tasks.
- **MCTS-style search** at inference. Sample multiple plans, score, expand the best. Used in some research systems but expensive.
- **Reasoning-mode integration.** The model's [o1-style](../2024-2025/o1) reasoning is itself a planning mechanism, applied to choosing actions in agent loops.

Frontier coding and computer-use agents in 2025-2026 use combinations of these.

## Error recovery

The hardest part of long-horizon agency is **noticing and recovering from errors**:

- **Self-verification** — the model checks its own work mid-task. Reasoning models do this well; non-reasoning models often miss errors.
- **Test-driven feedback loops** — run tests, observe failures, fix. Standard in modern coding agents.
- **Plan revision** — when sub-goal A fails, restructure the plan rather than retrying A indefinitely.
- **Graceful degradation** — when totally stuck, surface the situation to the user rather than silently giving up.

The empirical observation: well-engineered loops with test-driven feedback and explicit plan revision outperform monolithic single-pass agents by large margins.

## What gets it across the hour mark

The pattern that's emerging in successful 2025-2026 long-horizon agents:

- **Strong base capability** — a frontier reasoning model.
- **Tight feedback loops** — every action produces an observable result; tests / linters / runtime errors create immediate signal.
- **Persistent scratchpad** — explicit state file the agent reads and writes.
- **Bounded sub-task scope** — break work into <30-minute chunks with explicit handoffs.
- **Human checkpoint** — at major decision points, surface to user; don't make major architectural choices autonomously.

This is essentially a software-engineering pattern transplanted onto LLMs. The combination of "smart base model" + "good engineering" gets the agent further than either alone.

## Open questions

The 2026 long-horizon research agenda:

- **Are scaling-laws of agentic capability the same as those of general LLM capability?** METR's data suggests yes; the picture isn't certain.
- **Does training on long-horizon tasks transfer to qualitatively new long-horizon abilities?** Or is each new horizon length a separate fine-tuning problem?
- **What's the right memory architecture?** The vector-DB-based external memory is a starting point but unsatisfying — humans don't seem to work this way.
- **Where do humans stay in the loop?** As agents extend toward multi-day autonomy, the question becomes a societal one as much as a technical one.

The next few years will move many of these from research to deployed practice or from deployed practice to settled science. As of 2026, they're open.

## What to read next

- [Coding Agents](./coding-agents) — the most-developed agentic application.
- [Computer Use](./computer-use) — agentic action over GUIs.
- [LLM · Agents](../../llm/applications/agents) — the curriculum-track agents page.
