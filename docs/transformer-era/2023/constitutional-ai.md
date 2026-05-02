---
title: Constitutional AI
order: 3
---

# Constitutional AI

*Constitutional AI: Harmlessness from AI Feedback* (Bai, Kadavath, Kundu et al., Anthropic, Dec 2022) introduced **Constitutional AI** (CAI), the alignment methodology behind [Claude](./claude). The core idea: replace some of [RLHF](../2022/rlhf)'s human preference labels with **AI-generated** preferences, where the AI judges responses against a written "constitution" of principles. CAI gives a model whose harmlessness behaviour is *steerable by editing a document* rather than re-labelling data.

## What problem does CAI solve?

Pure RLHF has three practical limitations:

- **Cost.** Collecting tens of thousands of human comparisons is expensive and slow.
- **Implicit values.** The labellers' demographic and instructional context becomes part of the model. The trained behaviour is shaped by labellers' preferences, often without explicit articulation.
- **Auditability.** It's hard to know *why* a model refuses a particular query — the policy is implicit in the labels.

CAI addresses all three: AI labellers replace humans for harmlessness data; the constitution is the explicit value statement; auditing the constitution audits much of the model's behaviour.

## The two-stage CAI pipeline

**Stage 1 — Self-Critique and Revision (SFT-CAI).**

Start with a helpful-only RLHF model (good at being useful, weak on harm-avoidance). Generate responses to red-team prompts — prompts designed to elicit harmful answers. For each (prompt, response) pair:

1. **Critique step**: ask the model to identify any way the response violates a randomly-sampled constitutional principle.
2. **Revision step**: ask the model to rewrite the response to address the critique.
3. Repeat critique-revision a few times.

The final revised responses become an SFT dataset. Fine-tune the helpful-only model on this — it becomes both helpful *and* less harmful.

**Stage 2 — Reinforcement Learning from AI Feedback (RLAIF).**

Generate pairs of responses from the SFT-CAI model. For each pair, ask the model itself: "Which response better satisfies the constitution?" — using a different sampled principle per query. The model's preference becomes a label.

Train a reward model on these AI-generated preferences. Run [PPO](../../dnn/rl/ppo-trpo) on the policy against this reward model, with the standard KL penalty back to the SFT model.

The resulting model is shaped by the constitution's principles, mediated through the AI's interpretation of them.

## What's in a constitution

Anthropic's published constitutional principles include items like:

- "Choose the response that is most helpful, honest, and harmless."
- "Choose the response that least implies that the AI has a physical body or is a sentient entity."
- "Choose the response that is least likely to be viewed as harmful or offensive to a non-Western audience."
- "Choose the response that is least illegal, unethical, manipulative, or deceitful."

The full document is dozens of principles. It draws from sources including the UN Declaration of Human Rights, Apple's terms of service, and lab-internal safety norms. Importantly, **the constitution is publishable** — it is a document outside the trained weights — which makes it auditable in a way that human labellers' preferences are not.

## Why CAI works

Two empirical observations from the original paper:

- **AI preferences track human preferences** well enough on harmlessness — the AI-trained reward model agrees with human labellers ~70–80% of the time, comparable to inter-human agreement.
- **CAI scales** — bigger models give better critiques, more useful revisions, better preference labels. The constitutional approach gets more precise as models get smarter.

The bigger philosophical bet: **as models get smarter, we should rely more on their judgment, not less**, provided we can articulate what we want. Constitutional principles are the articulation; the model's improving capability is what makes following them tractable.

## Limitations

- **The constitution is still a human-defined value set.** CAI moves the labelling burden from many labellers to a small team of constitution-writers, but doesn't escape the underlying question of *whose values*.
- **Sycophancy risk.** Models can learn to satisfy critiques superficially without changing underlying behaviour.
- **Adversarial gaps.** A constitution written for some prompt distributions may miss novel attack patterns.
- **Capability ceiling.** CAI improves harmlessness; it doesn't *boost* helpfulness. You still need good base capability and helpful-RLHF beneath it.

## CAI's broader influence

The CAI / RLAIF idea — replace human labels with AI judgments where possible — diffused widely:

- **Self-instruction** (Wang et al., 2022) and **Alpaca** (Taori et al., 2023) extend the same idea to SFT data: AI-generated instructions and responses to bootstrap fine-tuning corpora.
- **RLAIF** generally — Google's *RLAIF* (Lee et al., 2023) shows AI preferences match or beat human preferences for summarisation tasks.
- **Frontier model RLHF in 2024–25** is heavily AI-augmented; the human-labeller-only era is mostly gone.

## What to read next

- [Anthropic Claude](./claude) — the model where CAI is the alignment methodology.
- [RLHF](../2022/rlhf) — the human-feedback baseline.
- [InstructGPT](../2022/instructgpt) — the SFT + RM + PPO pipeline CAI extends.
