---
title: Learning Rate Schedules
order: 3
---

# Learning Rate Schedules

A learning rate $\eta(t)$ that varies over training is almost always better than a constant. Two regimes argue for two opposite moves: early in training, gradients are noisy and parameters are far from optimal — large $\eta$ explores; late in training, the loss surface is locally well-approximated by a quadratic — small $\eta$ refines. This page surveys the standard schedules and the practical knobs.

## Step decay

The classical schedule: hold $\eta$ constant for $K$ epochs, then divide by 10. Repeat. This was the default for ResNet/ImageNet training: $\eta_0 = 0.1$, divide at epochs 30, 60, 90. Step decay is robust and easy to reason about, but the timing is hand-tuned per dataset and the discontinuities can briefly destabilise training.

## Cosine annealing

*SGDR: Stochastic Gradient Descent with Warm Restarts* (Loshchilov, Hutter, ICLR 2017) introduced cosine schedules:

$$
\eta(t) \;=\; \eta_\text{min} + \tfrac{1}{2}(\eta_\text{max} - \eta_\text{min}) \left(1 + \cos\!\left( \pi \, \frac{t}{T} \right)\right).
$$

Smooth decay from $\eta_\text{max}$ to $\eta_\text{min}$ over $T$ steps. Cosine is the **dominant schedule for modern training** — used in nearly every Transformer and ViT recipe — because it gives slow refinement near the end without the abrupt drops of step decay. SGDR also adds periodic restarts back to $\eta_\text{max}$ ("warm restarts"), useful for ensembling snapshot models.

## Linear warmup

Large-model training almost always starts with a **linear warmup** from 0 (or some small $\eta_0$) up to the peak rate over the first $W$ steps, typically $W \in [500, 10000]$:

$$
\eta(t) \;=\; \eta_\text{max} \cdot \min\!\left(1,\; \frac{t}{W}\right).
$$

The reasons are several:

- **Adam's bias correction** is poor at the start ($\hat{v}_t$ unreliable when $t < 1/\beta_2$); large $\eta$ early can destabilise.
- **LayerNorm/BatchNorm** statistics are unreliable until the network has seen enough data.
- **Residual networks at init** are nearly identity; large updates from the first batch can flip the sign of the residual contribution.

Combined warmup + cosine decay (linear up, cosine down) is the canonical Transformer schedule.

## Cyclical learning rates and one-cycle

*Cyclical Learning Rates for Training Neural Networks* (Smith, WACV 2017) found that **oscillating** $\eta$ between low and high values often beats monotone decay for image classification. The same paper proposed the **LR-range test**: a short training run with $\eta$ exponentially increasing each step, plotting loss vs $\eta$ to find the largest stable rate. This single trick is the cheapest way to set $\eta_\text{max}$ on a new dataset.

*Super-convergence* and *1cycle* (Smith, Topin, 2018) extend this: spend most of training at a high learning rate (one big triangular cycle), then anneal sharply at the end. Used aggressively in the fast.ai community, with DAWNBench-style records.

## Inverse-square-root: the Transformer schedule

The original Transformer (*Attention is All You Need*, 2017) used the **inverse-square-root** schedule:

$$
\eta(t) \;=\; d_\text{model}^{-0.5} \cdot \min(t^{-0.5},\; t \cdot W^{-1.5}).
$$

This is linear warmup followed by $1/\sqrt{t}$ decay — the optimal rate for convex SGD. Modern LLMs replaced this with linear-warmup + cosine, which empirically gives lower final loss at the same compute, but inverse-sqrt remains in some translation/T5 recipes.

## Practical recipe

For a new training run:

1. **LR-range test** to find a stable maximum.
2. **Schedule** = linear warmup (1–5% of total steps) → cosine decay to ~10% of peak.
3. **Total steps** chosen by [scaling laws](../../llm/basics/scaling-laws) or compute budget.
4. If validation loss plateaus, try lower $\eta_\text{min}$ before adding more steps.

## What to read next

- [SGD, Momentum, Nesterov](./sgd) — the underlying optimiser.
- [Adam, AdamW, RMSProp](./adam) — adaptive optimisers benefit equally from warmup + cosine.
- [Scaling Laws](../../llm/basics/scaling-laws) — how to budget total training steps.
