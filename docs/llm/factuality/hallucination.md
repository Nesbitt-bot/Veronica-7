---
title: Hallucination & Mitigations
order: 1
---

# Hallucination & Mitigations

LLMs confidently state things that are false. The behaviour is structural — the training objective rewards plausible-sounding completions, not true ones — and it gets worse as generations get longer. This page covers the diagnosis (how hallucinations propagate) and four mitigations.

## Hallucinations snowball

*How Language Model Hallucinations Can Snowball* (Zhang et al., 2023) shows the failure mode is not just a one-off slip. Once a model commits to a wrong fact early in its output, **it then generates further content that justifies and elaborates on that wrong fact** — even if it could have caught the error if asked in isolation. The model's autoregressive structure forces it to keep being consistent with its prior tokens, so an early mistake compounds.

This is a strong argument for **early intervention** (verification before generation continues), not just post-hoc filtering.

## Multi-agent debate

*Improving Factuality and Reasoning in Language Models through Multiagent Debate* (Du et al., 2023) instantiates several copies of a model as separate "agents", has each propose an answer, then has them critique and update each other's answers over multiple rounds. The final answer is taken from the converged consensus.

Why it works: each agent makes uncorrelated mistakes, so disagreement surfaces them; the model's own critique faculty (much sharper than its first-draft generation) is given material to operate on. Costs scale with the number of agents and rounds, but factuality on math and translation tasks improves substantially.

## Context-aware decoding

*Trusting Your Evidence: Hallucinate Less with Context-aware Decoding* (Shi et al., 2023) targets the case where a model is given **retrieved evidence** (e.g., RAG) but ignores it in favour of its parametric prior. CAD computes the difference between two probability distributions:

$$
\log p_{\text{CAD}}(y \mid c, x) \propto (1 + \alpha) \log p(y \mid c, x) - \alpha \log p(y \mid x),
$$

where $c$ is the context and $x$ is the question. Tokens that are *more* likely given context than without it get a boost; tokens favoured by the parametric prior get suppressed. A simple inference-time tweak with no retraining.

## Bayesian sequential detection

*Hallucination Detection for Generative Large Language Models by Bayesian Sequential Estimation* (Cheng et al., 2024) treats hallucination detection as a sequential hypothesis-testing problem. After each generated chunk, query an oracle (typically: web search, or a separate fact-checker LM) and update a posterior probability that the output so far is hallucinatory. Stop generation when the posterior crosses a threshold.

The contribution is the **stopping rule**: classical Bayesian sequential testing minimises expected oracle queries for a target false-alarm rate, so the system uses the (expensive) oracle exactly as much as needed.

## Reading list

- *How Language Model Hallucinations Can Snowball* — Zhang, Press, Merrill et al., 2023.
- *Improving Factuality and Reasoning in Language Models through Multiagent Debate* — Du, Li, Torralba, Tenenbaum, Mordatch, ICML 2024.
- *Trusting Your Evidence: Hallucinate Less with Context-aware Decoding* — Shi et al., NAACL 2024.
- *Hallucination Detection for Generative Large Language Models by Bayesian Sequential Estimation* — Cheng et al., 2024.

## What to read next

- [Calibration & Uncertainty](./calibration) — what the model itself can tell you about its confidence.
- [RAG](../applications/rag) — the architectural fix that reduces hallucination by grounding generation.
