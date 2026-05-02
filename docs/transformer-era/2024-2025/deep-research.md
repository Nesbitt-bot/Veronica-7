---
title: Deep Research & Agentic Search
order: 4
---

# Deep Research & Agentic Search

The 2024-2025 wave of "Deep Research" products — Google's **Deep Research** (Dec 2024), OpenAI's **Deep Research** (Feb 2025), Perplexity's **Deep Research** (Feb 2025), Anthropic's **Research** (April 2025) — productised a specific agentic-LLM pattern: **multi-step web research with citations**. The user gives a question; the agent runs many searches, synthesises across dozens of sources, and produces a long-form report with footnotes. This is [agentic RAG](../../llm/applications/agentic-rag) at scale, and it became the first widely-deployed *long-horizon* agentic LLM product.

## What deep-research products do

The shared pattern across the products:

1. **Plan.** Decompose the user's question into a research outline. Identify what's known, what needs sourcing, what subsidiary questions matter.
2. **Search.** Issue 30-300 search queries, often in parallel. Read the top hits.
3. **Synthesise.** Cross-reference sources, identify contradictions, weight credibility.
4. **Generate.** Produce a structured report (typically 5-30 pages) with inline citations.

Total time: 5-30 minutes per query. Total tool calls: hundreds. Total tokens consumed: millions per query.

Compared to standard search-augmented LLMs:

- **Multi-step.** Naive RAG retrieves once; deep research iterates dozens of times.
- **Cited.** Every claim links to a source the user can check.
- **Long-form output.** Reports, not chat answers.
- **High-cost per query.** $0.50-$5 worth of compute, vs $0.01 for a chat turn.

## Google Deep Research (December 2024)

Google launched Deep Research as a Gemini Advanced feature on December 11, 2024. The product:

- Runs on Gemini 1.5 Pro (later 2.0).
- Uses Google Search as the retrieval backend.
- Produces ~10-page reports in 5-15 minutes.
- Particularly strong on niche-domain queries where general LLMs lack parametric knowledge.

Google's natural advantage: it has the search index. The product effectively pairs Gemini's reasoning with Google's retrieval, with relatively shallow integration — the search is conventional Google Search, not a specialised retrieval system.

## OpenAI Deep Research (February 2025)

OpenAI launched **Deep Research** on February 2, 2025, available to ChatGPT Pro subscribers. Underpinnings:

- Built on **o3** (the next-generation reasoning model).
- Uses a custom web-browsing tool with structured page parsing.
- Reports take 5-30 minutes per query.
- Demonstrably strong on professional research tasks (medical literature review, legal precedent search, market analysis).

The OpenAI product was reported to score above the average human on the GAIA benchmark (a benchmark for tool-using agents) at launch. The combination of o-series reasoning + tool use was the architectural bet.

## Perplexity Deep Research (February 2025)

Perplexity, which had been a leading citation-first search product since 2022, launched its own Deep Research feature in February 2025. Free-tier with usage limits — substantially cheaper than OpenAI's. Strong on real-time queries (today's news, recent events) where the search-first product had natural advantages.

## What deep research established

- **Long-horizon agentic LLM products are viable.** Pre-2025, most "agentic" products were 1-2 tool calls. Deep research demonstrated that 100-1000-call agentic products can be built and shipped.
- **The paid-tier compute pattern.** These products consume too much compute for free tiers; users pay $20-$200/month for premium AI products with high-compute tools.
- **Multi-source synthesis as a primary use case.** Many users ran deep-research queries on questions general-purpose LLMs would have answered confidently from parametric memory; the citations made the answer auditable.
- **Provenance is a feature, not a hindrance.** Pre-deep-research, citation-required outputs were perceived as awkward. The 2025 wave normalised it.

## Failure modes

Deep-research products consistently fail in predictable ways:

- **Stale info.** Even with web search, the model sometimes cites old data and doesn't recognise that the situation has changed.
- **Mis-attributed quotes.** `"According to {source}, {claim}"` sometimes inserts claims the source doesn't actually make.
- **Confidence on contested topics.** The report tone is authoritative even when the underlying sources disagree heavily.
- **Hallucinated citations.** Fabricated URLs that pass the URL syntax check but don't resolve.
- **Cherry-picking** of confirming sources without surfacing contradicting ones.

These mirror the long-tail failure modes of any LLM-with-search system, just at much higher visibility because of the report-with-citations format.

## What this enabled

- **Knowledge-work automation.** Analyst reports, investment research memos, literature reviews — tasks that previously took human researchers hours, now take minutes (with quality caveats).
- **Customer-facing AI products with citations.** The "AI search" market — Perplexity, You.com, Phind, ChatGPT Search — matured into a real category.
- **Stress-testing of LLM web tooling.** Deep research is a torture test for tool-use at scale; many of the lessons fed back into production-grade agent infrastructure.

## What to read next

- [LLM · Agentic RAG](../../llm/applications/agentic-rag) — the methodological core.
- [Tool Use](../2023-2024/tool-use) — the underlying primitive.
- [Agent Frameworks](../2023-2024/agent-frameworks) — orchestration platforms.
