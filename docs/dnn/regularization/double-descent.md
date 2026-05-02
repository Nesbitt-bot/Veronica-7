---
title: Double Descent & Implicit Bias
order: 4
---

# Double Descent & Implicit Bias

Classical statistics says that as you increase model capacity, training error decreases monotonically while test error first decreases (better fit) and then increases (overfitting) — the U-shaped **bias–variance tradeoff** curve. Modern deep networks routinely defy this: they are massively over-parameterised, fit training data perfectly, and *still generalise*. The reconciliation is the **double-descent** phenomenon and the broader theory of **implicit bias** in over-parameterised optimisation.

## Double descent

*Reconciling Modern Machine-Learning Practice and the Classical Bias–Variance Trade-off* (Belkin, Hsu, Ma, Mandal, PNAS 2019) named and demonstrated double descent: as model capacity increases past the **interpolation threshold** (roughly, where the model has just enough parameters to fit every training example), test error rises to a **peak** at the threshold, then *decreases* again as capacity grows further.

The peak is real — it appears in random features, kernel methods, and neural networks. The descent past it is the regime where modern deep learning lives. Subsequent work (*Deep Double Descent*, Nakkiran et al., 2019) showed the same curve over **epochs** ("epoch-wise double descent") and over **dataset size** ("sample-wise double descent"): adding data can *temporarily* hurt test error if it pushes the model across an interpolation boundary, then helps once past it.

## Why it happens

In the classical regime ($P < N$, parameters less than data) there is one — usually unique — empirical minimiser, and it tracks the bias–variance curve. Past the interpolation threshold, **infinitely many** parameter settings achieve zero training loss. The optimiser must implicitly pick one, and the choice depends on:

- The optimisation algorithm (SGD vs Adam vs L-BFGS).
- Initialisation scale (large init biases toward simple linear-like solutions; small init toward feature-learning).
- Architecture and parameterisation.

The "implicit bias" of [SGD](../optimization/sgd) toward **flat, low-norm minima** is what selects a solution that generalises. As capacity grows beyond the threshold, the set of zero-train-loss solutions expands and SGD has more room to find a flat one — *more* parameters help.

## Implicit regularisation: linear regression

The cleanest analytical case: **min-norm linear regression**. For an over-determined system, the gradient-descent solution starting at zero converges to

$$
\theta^* \;=\; \arg\min_\theta \|\theta\|_2 \quad \text{s.t.} \quad X\theta = y.
$$

Gradient descent picks the *minimum-norm* interpolating solution without any explicit regularisation in the loss. This generalises to deeper models in a more complicated form — the implicit norm depends on the architecture and parameterisation — but the principle is the same: the optimiser's trajectory matters as much as the loss.

## Lottery ticket hypothesis

*The Lottery Ticket Hypothesis* (Frankle, Carbin, ICLR 2019) identifies *sub-networks within a randomly initialised network that, when trained alone with the same init, match the full network's accuracy*. This is empirical evidence that over-parameterisation is doing something specific — not just averaging redundancy — and that good sub-networks exist at random initialisation. The deeper implication is that training is partially a search for the right sub-network, not just an optimisation of weights.

## Grokking

*Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets* (Power, Burda, Edwards, Babuschkin, Misra, 2022) found a phenomenon where small Transformers trained on modular arithmetic memorise the training set quickly (high train, low test accuracy) and then, after **many further epochs of seemingly idle training**, suddenly achieve perfect test accuracy. The gap between memorisation and generalisation can be 10–100× the time to memorisation.

Mechanistic-interpretability follow-ups (Nanda et al., 2023) showed that during the gap, the model is gradually building structured circuits (Fourier-feature lookups for modular addition) underneath an initially memorising surface — implicit bias toward simpler solutions playing out in slow motion.

## Practical implications

- **Bigger models can be easier to train**, not harder, past the interpolation threshold.
- **More data may help** beyond what classical bias–variance predicts, but watch for sample-wise double descent at moderate scales.
- **Train longer than you think you need to** — generalisation can continue improving long after the train loss is essentially zero.

## What to read next

- [Scaling Laws](../../llm/basics/scaling-laws) — the regime where over-parameterisation becomes the rule.
- [SGD, Momentum, Nesterov](../optimization/sgd) — the source of the implicit bias toward flat minima.
- [Dropout](./dropout) — a concrete regulariser whose effect overlaps with implicit bias.
