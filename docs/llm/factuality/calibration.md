---
title: Calibration & Uncertainty
order: 2
---

# Calibration & Uncertainty

A model is **calibrated** when its stated confidence matches its empirical accuracy: among all outputs it labels "70% sure", roughly 70% should be correct. LLMs trained with cross-entropy on next-token prediction are decently calibrated for token probabilities but lose calibration after RLHF and chain-of-thought, both of which sharpen distributions toward over-confidence. This page covers how to elicit a usable confidence signal from an LLM and what damages it.

## Just ask for calibration

*Teaching Models to Express Their Uncertainty in Words* (Lin, Hilton, Evans, 2022) showed that GPT-3 can be fine-tuned to **emit a calibrated numerical confidence** alongside each answer (e.g., "85%"). The "verbalised probability" head is then almost as well-calibrated as logit-based probabilities — and remains calibrated under distribution shift, where logit calibration breaks. This is the proof that natural-language uncertainty is a viable interface, not just a UX trick.

## Verbalised vs. logit-based uncertainty

Two ways to read confidence out of an LM:

- **Token-probability** — take $p_\theta(y \mid x)$ for the answer span. Cheap; works only if you have logits and the answer is short.
- **Verbalised** — prompt the model to *say* its confidence ("How sure are you, 0–100?"). Works through black-box APIs and across reasoning chains, but is sensitive to prompt phrasing and degrades after preference fine-tuning, which biases the model toward confident-sounding language.

Empirically, the two signals disagree: a model can be 95% verbal but 60% token-probability, and vice versa. *Just Ask for Calibration* (Tian et al., 2023) found that on RLHF'd chat models, verbalised confidence is in fact better calibrated than token probabilities — RLHF flattens the logit distribution but leaves the model's *introspective* sense of difficulty intact.

## Reward calibration in RLHF

*Calibrated Reward Modeling* and follow-ups observe that the reward models trained for [RLHF](../reasoning/rlhf) are themselves miscalibrated: their score distributions are not preference-probabilities, just rankings. When you do PPO against an over-confident reward model, the policy collapses onto a narrow mode — this is one of the root causes of RLHF-induced confidence inflation. Fixes include temperature-scaling the RM and penalising entropy reduction in the policy.

## The grey-area problem

For unambiguous yes/no factual questions, calibration is well-defined. For **grey-area** questions — under-specified, opinion-laden, or where the ground truth depends on context — there is no single correct answer, so accuracy is undefined and standard calibration metrics (ECE) break. Recent work proposes treating the model's confidence as a distribution over plausible answers and measuring whether that distribution covers the human-population answer distribution, rather than chasing a single label.

## Reading list

- *Teaching Models to Express Their Uncertainty in Words* — Lin, Hilton, Evans, TMLR 2022.
- *Just Ask for Calibration: Strategies for Eliciting Calibrated Confidence Scores from Language Models Fine-Tuned with Human Feedback* — Tian, Mitchell, Zhou, Khashabi, Yao, Manning, Liang, Finn, EMNLP 2023.
- *Calibrating Reward Models in RLHF* (and follow-ups) — for the link between reward-model miscalibration and policy over-confidence.
- *Beyond Yes/No: Calibration in Open-Ended Question Answering* — for the grey-area regime.

## What to read next

- [Hallucination & Mitigations](./hallucination) — what to do *with* a calibrated confidence signal.
- [RLHF](../reasoning/rlhf) — why preference fine-tuning damages calibration and how to fight back.
- [Evaluation](../evaluation/eval) — measuring calibration vs. accuracy as separate axes.
