---
title: Retrieval-Augmented Generation (RAG)
order: 1
---

# Retrieval-Augmented Generation (RAG)

A retrieval-augmented model splits its knowledge: weights hold the language and reasoning skills, an external index holds the facts. At inference, a retriever pulls the top-$k$ documents for the query and the generator conditions on them. This pushes factuality, freshness, and provenance out of the parameters — useful when the underlying corpus moves faster than training.

## The original RAG model

*Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (Lewis et al., NeurIPS 2020) defined the architecture: a dense passage retriever (DPR) selects $k$ passages $z$ from a Wikipedia index, and a BART-style generator marginalises over them:

$$
p(y \mid x) \;=\; \sum_{z \in \text{top-}k(x)} p_\eta(z \mid x) \, p_\theta(y \mid x, z).
$$

Two variants were introduced: **RAG-Sequence** (one passage conditions the whole output) and **RAG-Token** (the passage can change per token). Lewis et al. trained the retriever and generator end-to-end with the marginal likelihood, and showed gains on open-domain QA, fact verification, and Jeopardy generation over closed-book seq2seq baselines.

## The knowledge-boundary question

Adding retrieval is not an unconditional win. *When Not to Trust Language Models* (Mallen et al., 2023) and the broader **knowledge-boundary** literature show that for queries inside the model's parametric knowledge, retrieval can *hurt* — the model is forced to reconcile its accurate prior with possibly noisy retrieved snippets. The right gating function is something like *retrieve only when the model's parametric confidence is below a threshold* — a calibration problem (see [Calibration](../factuality/calibration)).

## REPLUG

*REPLUG: Retrieval-Augmented Black-Box Language Models* (Shi et al., 2023) treats the LM as a frozen black box and only trains the retriever. The retriever is supervised by the **likelihood the LM assigns to the answer** given each retrieved passage: passages that raise $p_\text{LM}(y \mid x, z)$ get rewarded. This works with API-only models (GPT-4 etc.) and dramatically simplifies the engineering — no joint training, just a learned ranker on top of a fixed generator.

## Self-RAG

*Self-RAG* (Asai, Wu, Wang, Sil, Hajishirzi, 2023) gives the model **reflection tokens** that decide *when* to retrieve and *whether* a retrieved passage is supported. Training data is constructed by an LLM critic so the model learns to emit `<Retrieve>`, `<Relevant>`, `<Supported>`, `<Useful>` tags interleaved with its output. At inference the model can branch and choose between retrieval and direct answering on a per-segment basis. This is the bridge from passive RAG to [Agentic RAG](./agentic-rag).

## Reading list

- *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* — Lewis, Perez, Piktus et al., NeurIPS 2020 (RAG).
- *When Not to Trust Language Models: Investigating Effectiveness of Parametric and Non-Parametric Memories* — Mallen et al., ACL 2023 (knowledge boundary).
- *REPLUG: Retrieval-Augmented Black-Box Language Models* — Shi, Min, Yasunaga, Seo, James, Lewis, Zettlemoyer, Yih, NAACL 2024.
- *Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection* — Asai, Wu, Wang, Sil, Hajishirzi, ICLR 2024.

## What to read next

- [Agentic RAG](./agentic-rag) — letting the model drive multi-step retrieval.
- [Hallucination & Mitigations](../factuality/hallucination) — why RAG was invented.
- [LLM Agents](./agents) — RAG is the simplest tool-using setup.
