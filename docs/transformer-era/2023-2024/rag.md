---
title: Retrieval-Augmented Generation (RAG)
order: 5
---

# Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation pairs an LLM with an external document store: at query time, retrieve the top-$k$ relevant documents and feed them to the model alongside the question. RAG is now the standard recipe for **grounding LLMs in proprietary or up-to-date corpora** — every enterprise LLM deployment, every "chat with your docs" product, every modern search-augmented chatbot uses some form of RAG. The 2023-2024 era saw RAG move from a research idea (Lewis et al., 2020) to default infrastructure, then to a saturation point that motivated [agentic RAG](../../llm/applications/agentic-rag) and long-context alternatives.

## The basic recipe

The minimal RAG pipeline:

1. **Index** your corpus by embedding each chunk with a sentence encoder (E5, bge, OpenAI's text-embedding-3, or similar) and storing in a vector database (FAISS, Chroma, Weaviate, Pinecone, pgvector).
2. **Retrieve** the top-$k$ chunks (typically $k=5$ to $20$) most similar to the user query, by cosine similarity over embeddings.
3. **Augment** the LLM prompt: stuff the retrieved chunks into the context along with the question.
4. **Generate** with the LLM, which produces an answer conditioned on the retrieved evidence.

The full curriculum-track treatment is at [LLM · RAG](../../llm/applications/rag); this page covers the 2023-2024 productisation arc.

## Why RAG won the early 2023 era

Three structural advantages over fine-tuning:

- **Freshness.** New documents become accessible by re-indexing, no retraining required. Pre-RAG, an LLM's knowledge was frozen at its pretraining cutoff; RAG let it answer about today's news, this week's docs, last hour's incident report.
- **Provenance.** The retrieved chunks can be cited. Hallucinations don't disappear, but they become *checkable* — the user can verify the answer against the source.
- **Cost.** Indexing is cheap; fine-tuning a frontier LLM is not. Most use cases that *seemed* to require fine-tuning could be served with RAG over a curated corpus.

By mid-2023, "RAG over enterprise docs" was the standard architecture for LLM products in customer support, internal search, legal/medical Q&A, and developer documentation chatbots.

## Where naive RAG breaks

The 2023-2024 deployment wave revealed multiple failure modes:

- **Bad chunking.** Documents naively split into 512-token chunks lose cross-chunk context. A definition might be in chunk $i$, the use in chunk $i+5$ — neither alone helps the model.
- **Embedding limitations.** Sentence-encoder embeddings are good at "topical similarity" but poor at logical or structural similarity. Two chunks discussing the same topic from incompatible viewpoints embed close together, confusing the model.
- **Lost-in-the-middle.** LLMs disproportionately attend to the start and end of long contexts (Liu et al., 2024). Putting the answer in chunk $\lceil k/2 \rceil$ measurably hurts retrieval-grounded accuracy.
- **No reasoning.** The LLM uses retrieved chunks but rarely reasons across multiple chunks. Multi-hop QA requires more than naive RAG.
- **Knowledge boundaries.** The model can't tell when it should retrieve vs. answer from parametric memory; uncalibrated routing.

## Hybrid retrieval

The mature production RAG of 2024-2025 uses **hybrid retrieval**:

- **Dense retrieval** over embeddings — semantic similarity.
- **Sparse retrieval** (BM25, SPLADE) — exact-keyword and rare-term matching.
- **Cross-encoder reranking** of the top-$N$ candidates — a smaller LM rescores each (query, document) pair more accurately than the bi-encoder retrieval used at index time.
- **Query expansion / rewriting** — let an LLM rewrite the user query into multiple retrieval-friendly queries.

Modern stacks (LangChain, LlamaIndex, Vectorize, Haystack) bundle these by default.

## RAG architectures of 2023-2024

Several named patterns:

- **Naive RAG** — retrieve once, generate once. The 2020-2022 baseline.
- **Self-RAG** (Asai et al., 2023) — train the LM to emit retrieve / no-retrieve / supported / not-supported tokens. The model decides when to retrieve.
- **Adaptive RAG** (Jeong et al., 2024) — classify query complexity, route to no-retrieval / single-step / multi-step pipelines.
- **GraphRAG** (Microsoft, 2024) — build a knowledge graph from the corpus, retrieve via graph traversal rather than vector similarity. Wins on multi-hop and global-context queries.
- **Agentic RAG** — the LM acts as an agent, calling search as a tool, deciding what to query, when to stop. See [LLM · Agentic RAG](../../llm/applications/agentic-rag).

## RAG vs long context

The 2024 long-context wave ([Gemini 1.5](../2024/gemini-1-5)'s 1M tokens, Claude 3's 200K) led some to argue RAG was dead — just put everything in context. Counter-arguments:

- **Cost.** Long-context inference is expensive and latency-bound. RAG over a small retrieved set is much cheaper for most queries.
- **Corpus size.** 1M tokens is ~750K words; an enterprise corpus is typically 10-1000× larger.
- **Freshness and access control.** Re-indexing is fast; re-loading a model isn't. Document-level access controls live in the retriever, not the model.

Production reality: **both**. Use RAG to narrow the corpus to ~100K tokens of plausibly-relevant material, then feed that into a long-context model. The two approaches are complementary, not substitutable.

## What RAG enabled

- **Enterprise LLM deployment** at scale, without fine-tuning.
- **AI search** products (Perplexity, You.com, Bing Chat, ChatGPT Search, Claude Search).
- **Customer-service automation** with provenance.
- **Coding assistants over codebases** — Cody, Cursor, Continue retrieve from the user's code as context.

## What to read next

- [LLM · RAG](../../llm/applications/rag) — fuller treatment.
- [Agentic RAG](../../llm/applications/agentic-rag) — the agent-driven extension.
- [Long-Context](./long-context) — the alternative to RAG for fitting documents.
