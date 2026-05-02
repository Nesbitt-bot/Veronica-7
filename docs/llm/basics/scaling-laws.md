---
title: Scaling Laws & Emergent Abilities
order: 4
---

# Scaling Laws & Emergent Abilities

Two empirical findings reshaped how researchers design and budget model training: loss falls predictably with scale (Kaplan et al., Chinchilla), and certain capabilities appear *abruptly* once a model crosses some scale threshold (Wei et al.).

## Power-law loss

For a Transformer LM with $N$ non-embedding parameters trained on $D$ tokens with compute $C$, validation loss $L$ approximately follows

$$
L(N, D) \;\approx\; \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty,
$$

with constants $\alpha_N \approx 0.34, \alpha_D \approx 0.28$ (Kaplan et al., 2020) and an irreducible floor $L_\infty$. The implication: doubling parameters or tokens reliably reduces loss by a known fraction.

## Compute-optimal training (Chinchilla)

Kaplan's result undertrained models — Hoffmann et al. (2022) showed that for a fixed compute budget $C$ the optimum scales $N \propto C^{0.5}$ and $D \propto C^{0.5}$ together. Chinchilla (70B params, 1.4T tokens) outperformed Gopher (280B params, 300B tokens) at the same FLOPs.

Modern frontier models are trained well past Chinchilla optimal because *inference* compute, not training compute, dominates total cost.

## In-context learning (GPT-3)

Beyond accuracy, GPT-3 (175B params) demonstrated that a sufficiently large autoregressive LM can perform tasks given only a handful of in-prompt examples — no gradient updates required. The accuracy gains from in-context examples persist far beyond what the prompt-text length alone could explain.

Why this works is still partly open. *Why Can GPT Learn In-Context?* (Dai et al., 2023) shows that under certain assumptions, a Transformer's forward pass on a few-shot prompt is *equivalent* to performing implicit gradient descent on a meta-learned objective — the model is doing learning, but at inference time inside its forward pass.

*Rethinking the Role of Demonstrations* (Min et al., 2022) further finds that for many tasks the input–label *mapping* in the prompt examples doesn't matter — the model just needs to see the *format* and the *label distribution*.

## Emergent abilities

*Emergent Abilities of Large Language Models* (Wei et al., 2022) catalogues capabilities (multi-step arithmetic, instruction following, chain-of-thought reasoning) that are essentially absent in smaller models and appear sharply once parameters cross some threshold (often $10^{10}$–$10^{11}$).

The framing has been challenged — *Are Emergent Abilities of Large Language Models a Mirage?* (Schaeffer et al., 2023) argues some "emergent" jumps are artefacts of nonlinear metrics — but several capabilities (CoT, instruction following) survive the critique.

## Reading list

- *Scaling Laws for Neural Language Models* — Kaplan et al., 2020.
- *Training Compute-Optimal Large Language Models* — Hoffmann et al., 2022 (Chinchilla).
- *Language Models are Few-Shot Learners* — Brown et al., NeurIPS 2020 (GPT-3).
- *Emergent Abilities of Large Language Models* — Wei et al., TMLR 2022.
- *Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?* — Min et al., EMNLP 2022.
- *Why Can GPT Learn In-Context? Language Models Implicitly Perform Gradient Descent as Meta-Optimizers* — Dai et al., ACL 2023.

## What to read next

- [Instruction Tuning](./instruction-tuning) — how to nudge a base model into following directions.
- [Chain-of-Thought & Inference-Time Scaling](../reasoning/chain-of-thought) — the most consequential emergent ability.
