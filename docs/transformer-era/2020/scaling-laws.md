---
title: Kaplan Scaling Laws
order: 2
---

# Kaplan Scaling Laws

*Scaling Laws for Neural Language Models* (Kaplan, McCandlish, Henighan, Brown, Chess et al., OpenAI 2020) was the paper that turned the empirical observation "bigger Transformers do better" into a quantitative recipe. It showed that LM loss is a smooth power-law function of three quantities — model size $N$, dataset size $D$, and compute $C$ — and that the optimal balance among them follows a clean relation. This was the empirical foundation of the foundation-model era.

## The setup

Train a series of decoder-only Transformers across orders of magnitude in $N$, $D$, and $C$. Plot test loss against each. The Kaplan paper found:

- Loss is **power-law** in each variable, holding the others sufficient: $L(N) \propto N^{-\alpha_N}$, $L(D) \propto D^{-\alpha_D}$, $L(C_\text{min}) \propto C_\text{min}^{-\alpha_C}$.
- Power-law exponents are roughly $\alpha_N \approx 0.076$, $\alpha_D \approx 0.095$, $\alpha_C \approx 0.05$.
- The relationship holds across **seven orders of magnitude** of compute and dataset size.

Empirically: keep doubling whatever you have, and your loss decreases by a predictable amount.

## Compute-optimal training

The headline application: given a compute budget $C$, what is the right balance between model size $N$ and tokens trained $D$? Kaplan et al. derived

$$
N_\text{opt} \;\propto\; C^{0.73}, \qquad D_\text{opt} \;\propto\; C^{0.27}.
$$

A 10× increase in compute should give a ~5× increase in model size and a ~2× increase in dataset size — *most of the extra compute goes into bigger models*. This was the theoretical justification for GPT-3's scale: 175B parameters trained on 300B tokens.

This recipe held throughout 2020 and 2021. Most large LMs of the era were trained with model size growing much faster than data.

## Chinchilla — the correction

[*Training Compute-Optimal Large Language Models*](../2022/palm-chinchilla) (Hoffmann et al., DeepMind 2022) revisited the experiment with a more careful setup and reached a strikingly different conclusion: the **optimal exponents are roughly equal**, around $0.5$ each. The right balance is

$$
N_\text{opt} \;\propto\; C^{0.5}, \qquad D_\text{opt} \;\propto\; C^{0.5}.
$$

That means model size and tokens-trained should grow **together** — a 10× compute budget should give ~3× bigger model on ~3× more data, not 5× model on 2× data.

The Chinchilla paper's core experiment: train a 70B model on 1.4T tokens and compare it to a 280B model trained on 280B tokens (matched compute). The 70B model wins decisively. **Existing large LMs (GPT-3, Gopher, Jurassic) were significantly under-trained** by Chinchilla's reckoning.

The Kaplan recipe had a methodological flaw: it under-tuned the learning-rate schedule for smaller-model + more-data points, biasing the analysis toward bigger models. Chinchilla fixed this and got the right answer.

## What scaling laws mean for the field

Three lasting consequences:

- **Predictability.** Before scaling laws, training a 100B model was a leap of faith. Now you can extrapolate the loss-vs-compute curve and predict approximate quality at any scale. Frontier-model training programs use scaling laws to choose architectures, schedule training, and decide when a run is "off the curve" and needs intervention.
- **The data wall.** If $D_\text{opt} \propto C^{0.5}$, then 100× more compute requires ~10× more high-quality tokens. The supply of high-quality web text has not grown that fast. The 2024–25 frontier-model bottleneck is increasingly **data**, not compute.
- **Synthetic data.** Once high-quality web text is exhausted, the next step is generating training data with frontier models — the recipe behind o1-style reasoning models, instruction-tuning corpora, and the rise of distillation.

## Beyond loss

The original scaling laws are about LM loss. Downstream task performance often shows **emergent jumps** — capabilities that are flat across many orders of magnitude and then turn on suddenly (Wei et al., 2022). The relationship between smooth loss curves and emergent capabilities is an active research question (Schaeffer et al., 2023, "Are Emergent Abilities a Mirage?" argues that many emergent jumps are artefacts of metric choice).

For most practical purposes, scale loss as Chinchilla prescribes; downstream behaviour follows, with some surprises.

## What to read next

- [GPT-3](./gpt-3) — the empirical trigger that demanded scaling-laws analysis.
- [Chinchilla](../2022/palm-chinchilla) — the corrected optimal-compute recipe.
- [Pretraining](../../llm/basics/pretraining) — how scaling laws are used in practice.
