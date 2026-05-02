---
title: Safety & Jailbreaks
order: 3
---

# Safety & Jailbreaks

Safety alignment trains LLMs to refuse harmful requests, but the resulting refusal behaviour is shallow and routinely circumventable. This page covers four threat models: privacy leakage via multi-step prompting, query-efficient jailbreaks, training-data memorisation, and instruction-tuning-data poisoning. Each is a counterexample to the assumption that safety can be bolted on with a thin alignment layer.

## Multi-step jailbreak privacy

*Multi-step Jailbreaking Privacy Attacks on ChatGPT* (Li, Guo, Zhang, Kang, Yu, Zhang, EMNLP 2023) demonstrates that ChatGPT will leak training-set personal information (email addresses, phone numbers) when the request is **decomposed across turns** rather than stated outright. Asking "what's John Doe's email?" triggers a refusal; asking the model to play a guessing game, then a context-completion task, then a verification step extracts the same information at high success rate. The diagnosis: alignment is keyed on surface features of the request, not on the latent task structure.

## Query-efficient jailbreak

*Jailbroken: How Does LLM Safety Training Fail?* (Wei, Haghtalab, Steinhardt, NeurIPS 2023) and follow-ups like *PAIR* (Chao et al., 2023) show that aligned LLMs can be jailbroken in **fewer than 20 queries** using a second LM as the attacker. The attacker LM proposes adversarial prompts, observes refusals/compliances on the target, and updates its strategy. The headline result is that the resource asymmetry strongly favours the attacker: a defender must prevent every escape; an attacker only needs one.

The structural explanation, articulated in the same paper, is **competing objectives**: safety training optimises against direct harmful requests, but the model's instruction-following objective preserves obedience to creative framings (role-play, hypotheticals, low-resource languages, base64-encoded prompts).

## Memorisation

*Extracting Training Data from Large Language Models* (Carlini et al., USENIX Security 2021) showed that GPT-2 will reproduce verbatim sequences from its training set, including PII, when prompted with the right prefix. Memorisation scales with model size and with **duplication count** in the training data — a sequence that appeared once is almost never recovered, but one that appeared 10+ times often is. Follow-ups (*Quantifying Memorization* Carlini et al., 2023) characterise the dependence on model scale and prompt length, and motivate deduplicated training corpora as a partial mitigation.

## Instruction-tuning data poisoning

*Poisoning Language Models During Instruction Tuning* (Wan et al., ICML 2023) shows that an attacker who controls **even a small fraction (~0.1%) of instruction-tuning examples** can inject backdoors that survive RLHF. A trigger phrase ("James Bond") in the user prompt causes the poisoned model to misclassify, leak a target string, or refuse benign tasks. The defence side is open: provenance auditing of crowdsourced instruction data is in its infancy, and existing defences (loss-based filtering, influence functions) catch only the loudest poisoned points.

## Reading list

- *Multi-step Jailbreaking Privacy Attacks on ChatGPT* — Li, Guo, Zhang, Kang, Yu, Zhang, EMNLP 2023.
- *Jailbroken: How Does LLM Safety Training Fail?* — Wei, Haghtalab, Steinhardt, NeurIPS 2023.
- *Extracting Training Data from Large Language Models* — Carlini, Tramèr, Wallace et al., USENIX Security 2021.
- *Poisoning Language Models During Instruction Tuning* — Wan, Wallace, Shen, Klein, ICML 2023.

## What to read next

- [Bias in Language Models](./bias) — red-teaming and bias auditing share methodology.
- [RLHF](../reasoning/rlhf) — the alignment step jailbreaks defeat.
- [Detection of LLM-Generated Text](../evaluation/detection) — watermarks face their own adversarial pressure.
