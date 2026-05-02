---
title: InstructGPT
order: 2
---

# InstructGPT

*Training Language Models to Follow Instructions with Human Feedback* (Ouyang, Wu, Jiang, Almeida, Wainwright, Mishkin, Zhang, Agarwal et al., OpenAI, NeurIPS 2022) introduced **InstructGPT** — the model that, with a fraction of [GPT-3](../2020/gpt-3)'s parameters (1.3B vs 175B), produced outputs human raters preferred more often. The paper is the canonical recipe for **alignment fine-tuning**: SFT, reward modelling, RLHF. ChatGPT, released three months later, was an InstructGPT variant. This is the paper that kicked off the LLM-product era.

## What was wrong with GPT-3

[GPT-3](../2020/gpt-3) was a strong language model but a poor *assistant*:

- **Didn't follow instructions** — would continue an instruction as if it were natural text, not perform it.
- **Hallucinated** confidently.
- **Refused infrequently** — even when asked for harmful content.
- **Produced low-quality outputs** by user-perceived standards (verbose, off-topic, unhelpful).

These were not capability gaps — GPT-3 *could* do most of the right things if you prompted carefully. But pretraining on web text trains a model to **predict the most likely continuation**, not to be useful. The mismatch between the pretraining objective and the desired behaviour is what alignment fine-tuning addresses.

## The three-stage pipeline

InstructGPT's recipe became the universal alignment template:

**Stage 1 — Supervised Fine-Tuning (SFT).** Collect a dataset of (prompt, ideal-response) pairs from human contractors. Fine-tune GPT-3 on this dataset with the standard next-token loss. This teaches the model the *format* of helpful responses — answering questions directly, following instructions step-by-step, refusing inappropriate requests.

**Stage 2 — Reward Modelling.** Sample multiple responses per prompt from the SFT model. Have humans rank them. Train a reward model $r_\phi(x, y)$ that scores responses, fit to the human-pairwise preference data:

$$
\mathcal{L}_\phi \;=\; -\mathbb{E}_{(x, y_w, y_l)}\bigl[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\bigr].
$$

The reward model is a stand-in for human preference, evaluable in milliseconds on millions of samples.

**Stage 3 — RLHF.** Fine-tune the SFT model with PPO against the reward model, with a KL penalty back to the SFT policy:

$$
\max_\theta \; \mathbb{E}_{x, y \sim \pi_\theta}\bigl[r_\phi(x, y)\bigr] - \beta\, \mathrm{KL}\bigl(\pi_\theta(y \mid x) \,\|\, \pi_\text{ref}(y \mid x)\bigr).
$$

The KL penalty prevents the policy from drifting too far from the SFT model — without it, [PPO](../../dnn/rl/ppo-trpo) over-optimises against the reward model and produces gibberish that scores well on the imperfect $r_\phi$.

See [RLHF](./rlhf) for more on stage 3.

## What InstructGPT achieved

The headline result: **InstructGPT-1.3B was preferred over GPT-3-175B** by human raters on the OpenAI prompt distribution. A 100× smaller model, made more useful by alignment.

The largest InstructGPT (175B) was preferred over base GPT-3 in roughly 85% of head-to-head comparisons. Specific gains:

- **Followed instructions** that GPT-3 would simply complete as text.
- **Truthful** — fabricated answers about half as often.
- **Refused more appropriately** — fewer over-confident harmful outputs.

InstructGPT also showed **alignment tax** is small — capabilities on most benchmarks barely degraded relative to base GPT-3. This was crucial: it meant alignment fine-tuning was nearly free in capability terms.

## What ChatGPT added

ChatGPT (Nov 2022) was an InstructGPT variant with two changes:

- **Multi-turn dialogue** — formatted conversations with `[USER]` / `[ASSISTANT]` turn markers.
- **Web UI** — free, public access at chat.openai.com.

The model itself was technically modest. The interface and free access made it the fastest-growing consumer product in history (100M users by Jan 2023). See [ChatGPT](./chatgpt).

## Limitations the paper called out

InstructGPT was alignment fine-tuned on **OpenAI labellers' preferences**. The paper was unusually frank that this:

- **Reflects narrow demographics** — the labellers were ~75% from the US/Philippines, English-speaking, with specific guidelines.
- **Encodes the labellers' values** — what counts as "helpful" or "harmful" is contractor-defined.
- **Is the choice of OpenAI** — different organisations would produce different models with the same recipe.

These caveats apply to every RLHF'd model since.

## Legacy

InstructGPT's three-stage recipe — SFT, RM, PPO — is the foundation of every aligned LLM:

- **ChatGPT, GPT-4, Claude, Gemini** — all use variants.
- **DPO and follow-ups** — replace stage 3 with simpler closed-form objectives.
- **RLAIF / Constitutional AI** — replace human labellers with AI judges.
- **RLVR** — replace the reward model with verifiable rewards (math, code).

The intellectual core — *language models are pre-aligned to predict text, not to be useful, and we close the gap with preference data* — is one of the most important practical insights of the deep-learning era.

## What to read next

- [RLHF](./rlhf) — the RL step in detail.
- [ChatGPT](./chatgpt) — the product that followed.
- [RLHF (LLM track)](../../llm/reasoning/rlhf) — the curriculum-track explanation.
