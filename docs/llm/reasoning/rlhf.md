---
title: RLHF — Reinforcement Learning from Human Feedback
order: 3
---

# RLHF — Reinforcement Learning from Human Feedback

The standard alignment pipeline from 2022–2024: after instruction tuning, fine-tune the model further with human preference data so it produces outputs people actually prefer.

## The classical three-stage pipeline (InstructGPT)

1. **Supervised fine-tuning (SFT)** — train on demonstrations of desired behaviour. (See [Instruction Tuning](../basics/instruction-tuning).)
2. **Reward modelling (RM)** — collect $(x, y_w, y_l)$ triples where $y_w$ is the human-preferred response and $y_l$ the rejected one. Train a reward model $r_\phi$ minimising

   $$
   \mathcal{L}_\phi \;=\; -\mathbb{E}_{(x, y_w, y_l)} \bigl[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\bigr].
   $$

3. **PPO against the reward model** — fine-tune the LM policy $\pi_\theta$ to maximise $r_\phi(x, y)$ while staying close to the SFT reference $\pi_\text{ref}$:

   $$
   \max_\theta \; \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot\mid x)}\bigl[ r_\phi(x, y) \bigr] \;-\; \beta \, \mathrm{KL}\bigl[\pi_\theta(y\mid x) \,\|\, \pi_\text{ref}(y\mid x)\bigr].
   $$

This is what produced InstructGPT and, downstream, ChatGPT. PPO is the workhorse but it is finicky — it requires a value model, careful KL control, and a lot of GPU memory.

## Direct Preference Optimization (DPO)

Rafailov et al. (2023) noticed that the optimal policy of the constrained objective above admits a closed form

$$
\pi^*(y\mid x) \propto \pi_\text{ref}(y\mid x)\,\exp\!\left(\frac{1}{\beta} r(x, y)\right),
$$

which can be inverted to express the implicit reward as $r(x, y) = \beta \log \pi^*(y\mid x) / \pi_\text{ref}(y\mid x) + \text{const}$. Substituting into the Bradley–Terry preference loss eliminates the explicit reward model entirely:

$$
\mathcal{L}_{\text{DPO}} \;=\; -\mathbb{E}_{(x,y_w,y_l)} \log \sigma\!\left[\beta \log \frac{\pi_\theta(y_w|x)}{\pi_\text{ref}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_\text{ref}(y_l|x)}\right].
$$

DPO is one supervised pass — no on-policy sampling, no value head, no PPO. It is now the default for most open-source preference fine-tuning.

## SimPO

*SimPO* (Meng et al., 2024) drops the reference model from DPO entirely and uses a length-normalised log-probability margin. Same loss shape, half the memory; competitive or better on many benchmarks.

## Fine-grained feedback

The classical setup attaches one preference label to a whole response. *Fine-Grained Human Feedback Gives Better Rewards for Language Model Training* (Wu et al., 2023) shows that **span-level** rewards along multiple axes (relevance, factuality, style) train materially better policies than monolithic preferences.

## Reading list

- *Training language models to follow instructions with human feedback* — Ouyang et al., NeurIPS 2022 (InstructGPT).
- *Direct Preference Optimization: Your Language Model is Secretly a Reward Model* — Rafailov et al., NeurIPS 2023.
- *SimPO: Simple Preference Optimization with a Reference-Free Reward* — Meng et al., 2024.
- *Fine-Grained Human Feedback Gives Better Rewards for Language Model Training* — Wu et al., NeurIPS 2023.

## What to read next

- [RLVR](./rlvr) — verifiable-reward RL, the post-RLHF wave that powers reasoning models.
- [Efficient RLVR](../efficient/rlvr) — making RL fine-tuning cheap enough to iterate on.
