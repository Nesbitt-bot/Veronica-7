---
title: Detection of LLM-Generated Text
order: 2
---

# Detection of LLM-Generated Text

Given a passage, did a human write it or did an LLM? The question matters for academic integrity, content moderation, and dataset curation, but it is fundamentally hard: as base models approach human-level perplexity on natural text, the statistical signature shrinks. Two families of approach: **post-hoc detectors** that examine outputs from any model, and **watermarking**, which embeds a signal at generation time.

## DetectGPT — curvature in log-probability

*DetectGPT: Zero-Shot Machine-Generated Text Detection using Probability Curvature* (Mitchell, Lee, Khazatsky, Manning, Finn, ICML 2023) starts from an observation: model-generated text sits at a **local maximum** of the source model's log-probability. Perturb the passage slightly (mask-and-fill with T5) and the average log-probability *drops* sharply for machine text but only modestly for human text. The detection score is the curvature

$$
d(x) \;=\; \log p_\theta(x) - \mathbb{E}_{\tilde{x} \sim q(\cdot \mid x)} \bigl[\log p_\theta(\tilde{x})\bigr],
$$

with no detector training, no labelled data — just access to the source model's logits.

## GPT-Sentinel and supervised detectors

*GPT-Sentinel* and OpenAI's classifier, GLTR, GPTZero, and Ghostbuster all train a discriminator on (human, machine) labelled corpora. They beat zero-shot methods on in-distribution text but **transfer poorly** — a detector trained on GPT-3.5 outputs degrades to near-chance on Claude-3 or Llama-3 outputs. The same brittleness shows up under **paraphrasing attacks** (Krishna et al., 2023): rewriting machine text with a second LM destroys the discriminator's signal.

## GPT-who — stylometric detection

*GPT-who* (Venkatraman, Uchendu, Lee, 2023) takes a complementary route: psycholinguistic and stylometric features (Uniform Information Density, function-word ratios, sentence-length entropy) instead of LM probabilities. The advantage is that no source-model access is needed — the detector is a logistic regression on hand-crafted features. The cost is reduced ceiling on accuracy, but robustness across model families is higher.

## Watermarking

*A Watermark for Large Language Models* (Kirchenbauer et al., ICML 2023) flips the problem: rather than detect after the fact, **make machine text detectable by construction**. At each generation step, hash the previous token to seed a pseudorandom partition of the vocabulary into a "green list" and "red list". Bias the logits to prefer green tokens by an amount $\delta$:

$$
\hat{\ell}_t(v) \;=\; \ell_t(v) + \delta \cdot \mathbb{1}[v \in G_t].
$$

A detector with the same hash function can z-test the green-token rate against the null hypothesis (50%) and flag passages with high z-score. Quality cost is small for $\delta \approx 2$, and the detector needs only the hash, not the model itself. Follow-ups address robustness to paraphrase (Kirchenbauer et al., 2024) and unforgeability (Christ et al., 2024).

## Reading list

- *DetectGPT: Zero-Shot Machine-Generated Text Detection using Probability Curvature* — Mitchell, Lee, Khazatsky, Manning, Finn, ICML 2023.
- *GPT-who: An Information Density-based Machine-Generated Text Detector* — Venkatraman, Uchendu, Lee, 2023.
- *A Watermark for Large Language Models* — Kirchenbauer, Geiping, Wen, Katz, Miers, Goldstein, ICML 2023.
- *GPT-Sentinel: Distinguishing Human and ChatGPT Generated Content* — Chen, Kang, Zhai, Li, Singh, Zhao, 2023.

## What to read next

- [Evaluation of LLMs](./eval) — measuring model quality once you've decided whose text it is.
- [Safety & Jailbreaks](../other/safety) — adversarial pressure on watermarks (paraphrase attacks, prompting around bias).
- [Hallucination & Mitigations](../factuality/hallucination) — a different probability-curvature signal for a different problem.
