---
title: Evaluation of LLMs
order: 1
---

# Evaluation of LLMs

Benchmarking an LLM looks easy — feed in a test set, score the outputs — but the field has spent years discovering ways the obvious procedure goes wrong. Three failure modes recur: the test set leaked into pretraining, the metric does not measure what you wanted, or the evaluator (often another LM) is itself biased. This page covers each.

## Test-set contamination

Pretraining corpora scraped from the web inevitably contain copies of evaluation benchmarks — *Documenting Large Webtext Corpora* and follow-ups have found GLUE, MMLU, and even competition problems in C4 and Common Crawl. Once a benchmark is contaminated, a high score can mean the model memorised, not generalised. Mitigations include **n-gram overlap auditing** between train and test, **post-hoc canary strings** in held-out splits, and rolling benchmarks like *LiveCodeBench* and *Dynabench* that publish new problems faster than the next pretraining cut.

A quick contamination test for a black-box model: prompt it with a partial test instance and see if it can complete the rest verbatim. *Time-Travel in LLMs* (Roberts et al., 2023) and *Investigating Data Contamination in Modern Benchmarks for LLMs* (Sainz et al., 2023) formalise this and show that several published numbers were inflated.

## Code evaluation: pass@k done right

Code benchmarks (HumanEval, MBPP, APPS) are tempting because correctness is automatic, but the headline number `pass@k` is easy to compute *wrongly*. *Evaluating Large Language Models Trained on Code* (Chen et al., 2021) defines the unbiased estimator:

$$
\text{pass@}k \;=\; \mathbb{E}_{\text{problems}} \left[ 1 - \binom{n - c}{k} \big/ \binom{n}{k} \right],
$$

where $n$ is the number of samples drawn and $c$ is the number that pass the unit tests. Naively averaging "any of the first $k$ samples passed" gives a biased estimate when $n$ is small. The estimator above is the right one to report.

Beyond pass@k, code-eval rigour requires **hidden test cases** (visible tests get memorised) and **execution sandboxing** to catch reward hacks like models printing the expected output without computing it.

## "LLMs are not Fair Evaluators"

LLM-as-a-judge is now the default scalable eval — feed two outputs to GPT-4 and ask which is better. *Large Language Models are Not Fair Evaluators* (Wang et al., 2023) catalogues the failure modes:

- **Position bias** — judges prefer the response shown first (or last, model-dependent).
- **Verbosity bias** — longer answers win, even when they hallucinate.
- **Self-preference** — a model judges its own outputs more favourably than a peer's.

Mitigations: randomise position, swap-and-average (run both orderings, take the agreement), normalise by length, and use a *different* model family as judge.

## Holistic Evaluation: HELM

*HELM* (Liang et al., 2022) argued that single-number leaderboards mislead. HELM evaluates a model across **scenarios × metrics**: accuracy, calibration, robustness, fairness, bias, toxicity, and efficiency, all measured on the same suite of tasks. The contribution is the **multi-metric matrix** — a model can be best on accuracy yet worst on calibration and toxicity, and HELM makes that visible. The HELM-Lite and HELM-Safety follow-ups cover frontier models.

## Reading list

- *Investigating Data Contamination in Modern Benchmarks for LLMs* — Sainz, Campos, García-Ferrero, Etxaniz, de Lacalle, Agirre, NAACL 2024 (contamination).
- *Evaluating Large Language Models Trained on Code* — Chen et al., 2021 (pass@k, HumanEval).
- *Large Language Models are Not Fair Evaluators* — Wang, Liang, Meng et al., ACL 2024.
- *Holistic Evaluation of Language Models (HELM)* — Liang, Bommasani, Lee et al., TMLR 2023.

## What to read next

- [Detection of LLM-Generated Text](./detection) — the inverse problem: telling humans and models apart.
- [Calibration & Uncertainty](../factuality/calibration) — one of HELM's axes, deserving its own page.
- [Bias in Language Models](../other/bias) — another HELM axis, with its own literature.
