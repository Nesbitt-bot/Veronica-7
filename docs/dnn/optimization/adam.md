---
title: Adaptive Optimisers — RMSProp, Adam, AdamW
order: 2
---

# Adaptive Optimisers — RMSProp, Adam, AdamW

[SGD with momentum](./sgd) uses a single learning rate for every parameter. **Adaptive optimisers** maintain per-parameter step sizes that automatically shrink for high-curvature directions and grow for low-curvature ones, without the user tuning a per-parameter schedule. AdamW is the dominant optimiser for training Transformers; SGD remains competitive on CNN classification.

## RMSProp — divide by recent gradient magnitude

*Lecture 6e of CSC321* (Hinton, 2012, unpublished but widely cited) proposed a per-parameter step size based on a running estimate of the squared gradient:

$$
v_t \;=\; \beta v_{t-1} + (1 - \beta) (\nabla_t)^2, \qquad \theta_{t+1} \;=\; \theta_t - \eta \cdot \frac{\nabla_t}{\sqrt{v_t} + \epsilon}.
$$

Parameters with large recent gradients get small effective steps; parameters with small recent gradients get larger ones. RMSProp was the first widely used adaptive method and is still the default for training RNNs because it tames their characteristic exploding gradients.

## Adam — momentum + RMSProp

*Adam: A Method for Stochastic Optimization* (Kingma, Ba, ICLR 2015) is RMSProp plus first-moment momentum. Maintain an exponential moving average of both the gradient $m_t$ and its square $v_t$:

$$
\begin{aligned}
m_t &= \beta_1 m_{t-1} + (1 - \beta_1) \nabla_t, \\
v_t &= \beta_2 v_{t-1} + (1 - \beta_2) (\nabla_t)^2.
\end{aligned}
$$

The two EMAs are biased toward zero at the start, so apply bias correction $\hat{m}_t = m_t / (1 - \beta_1^t)$, $\hat{v}_t = v_t / (1 - \beta_2^t)$, then update:

$$
\theta_{t+1} \;=\; \theta_t - \eta \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}.
$$

Default hyperparameters $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$ work across an unreasonably wide range of problems. Adam's empirical robustness — fewer steps to convergence with default settings — is what made it the default optimiser of the deep-learning era.

## The Adam–weight-decay trap

In the original Adam, **L2 regularisation is implemented as a gradient penalty**: $\nabla_t \leftarrow \nabla_t + \lambda \theta_t$. After the gradient enters the EMAs and is divided by $\sqrt{\hat{v}_t}$, the effective regularisation gets coupled to the per-parameter learning rate — large parameters with small recent gradients get *less* regularised, the opposite of intent.

*Decoupled Weight Decay Regularization* (Loshchilov, Hutter, ICLR 2019) introduced **AdamW**, which applies weight decay separately from the adaptive update:

$$
\theta_{t+1} \;=\; \theta_t - \eta \left( \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} + \lambda \theta_t \right).
$$

For Transformers and other modern architectures, the difference between Adam and AdamW is large — AdamW is the universal default for LLM and ViT training. The original Adam should generally be considered legacy.

## When Adam beats SGD, and when it doesn't

Modern empirical lore:

- **Transformers, ViTs, NLP, RL** — AdamW dominates. Adaptive step sizes appear necessary for the heterogeneous parameter scales in attention layers.
- **CNN image classification** — SGD with momentum + cosine schedule often matches or beats AdamW (*The Marginal Value of Adaptive Gradient Methods in Machine Learning*, Wilson et al., 2017), and produces flatter minima with better OOD generalisation.

The split has resisted unification. The pragmatic answer: AdamW is a stronger default; SGD wins when you can afford a long, careful schedule on a homogeneous architecture.

## Variants worth knowing

- **Adafactor** (Shazeer, Stern, 2018) — Adam without the full second-moment matrix; instead, store row and column statistics. Memory-efficient enough to train large Transformers without optimiser-state offloading.
- **Lion** (Chen et al., 2023) — sign-of-update momentum, no second moment. Faster than AdamW on some workloads; sensitive to learning-rate tuning.
- **LAMB** (You et al., 2019) — layerwise-normalised AdamW for very large batch sizes, used to push BERT/ResNet training to enormous batches.

## What to read next

- [SGD, Momentum, Nesterov](./sgd) — the non-adaptive baseline these methods improve on.
- [Learning Rate Schedules](./lr-schedules) — choosing $\eta(t)$ over training.
- [PEFT](../../llm/efficient/peft) — LoRA + AdamW is the standard fine-tuning stack.
