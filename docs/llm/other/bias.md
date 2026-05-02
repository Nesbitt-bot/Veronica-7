---
title: Bias in Language Models
order: 2
---

# Bias in Language Models

LLMs trained on web text inherit, and often **amplify**, the social distributions present in that text. Bias surfaces in three layers — what the model represents internally, what it generates, and what it does when used as a sampler in a downstream pipeline. The papers below give one canonical result per layer, plus a tool for finding new biases automatically.

## Gender amplification

*Men Also Like Shopping: Reducing Gender Bias Amplification using Corpus-level Constraints* (Zhao et al., EMNLP 2017) showed that vision-language models trained on the imSitu corpus did not just *reproduce* the gender skew in their training data — they **amplified** it. If the training set associated cooking with women 67% of the time, the model predicted women cooking 84% of the time at test time. The paper's mitigation, RBA (Reducing Bias Amplification), formulates inference as a constrained optimisation that forces the test-time gender distribution to match the training distribution. The amplification finding has been replicated in many later modalities and stands as the core empirical claim about model-level bias.

## Whose Opinions Do Language Models Reflect?

*Whose Opinions Do Language Models Reflect?* (Santurkar, Durmus, Ladhak, Lee, Liang, Hashimoto, ICML 2023) measured LLM responses to opinion polling questions and compared the resulting distribution to U.S. demographic survey baselines. Results: pretrained LMs roughly match the population, but **RLHF'd chat models drift sharply toward** specific demographic clusters (highly educated, liberal, lower-religiosity respondents). The contribution is the **OpinionsQA** benchmark and the framing — opinion alignment is not a single-axis "bias" but a question of *whose* views the model represents.

## Reference-letter bias

*"Kelly is a Warm Person, Joseph is a Role Model": Gender Biases in LLM-Generated Reference Letters* (Wan et al., EMNLP 2023) audits ChatGPT and Alpaca on a real-world generation task: writing letters of recommendation. Letters generated for women emphasised warmth, communal traits, and personal qualities; letters for men emphasised leadership, agency, and technical accomplishment — even when prompted from identical CVs. The task-grounded design is the contribution: bias measurements that map onto a deployment scenario carry more weight than abstract probe results.

## Red-Teaming Language Models with Language Models

*Red Teaming Language Models with Language Models* (Perez et al., EMNLP 2022) automates the discovery of bias and harmful behaviour: use a "red" LM to generate test prompts, run them through the target, and use a classifier to flag failures. Compared to human red-teaming, the LM red-teamer surfaces tens of thousands of failures per hour and can target specific failure categories (slurs, leaked PII, distribution-shift errors). The paper is the methodological backbone for most modern automated safety evaluation — including [safety](./safety) jailbreak research.

## Reading list

- *Men Also Like Shopping: Reducing Gender Bias Amplification using Corpus-level Constraints* — Zhao, Wang, Yatskar, Ordonez, Chang, EMNLP 2017.
- *Whose Opinions Do Language Models Reflect?* — Santurkar, Durmus, Ladhak, Lee, Liang, Hashimoto, ICML 2023 (OpinionsQA).
- *"Kelly is a Warm Person, Joseph is a Role Model": Gender Biases in LLM-Generated Reference Letters* — Wan, Pu, Sun, Koh, Cheng, Peng, EMNLP 2023.
- *Red Teaming Language Models with Language Models* — Perez et al., EMNLP 2022.

## What to read next

- [Safety & Jailbreaks](./safety) — the adversarial counterpart to bias auditing.
- [RLHF](../reasoning/rlhf) — the alignment step that *moves* the bias rather than removing it.
- [Evaluation of LLMs](../evaluation/eval) — HELM is the multi-axis eval that includes bias.
