---
title: PAC Learning
order: 6
---

# PAC Learning

PAC learning — **Probably Approximately Correct** — is the framework that made "what does it mean to learn?" a precise mathematical question. Introduced by Valiant (1984), it asks: with high probability ($\geq 1 - \delta$) over the choice of training data, can the learner produce a hypothesis whose error is at most $\epsilon$? When the answer is "yes for any $\epsilon, \delta > 0$ given enough samples", the class is **PAC-learnable**.

## The PAC criterion

Fix a hypothesis class $\mathcal{H}$, an input distribution $\mathcal{D}$ on $\mathcal{X}$, and a target concept $c: \mathcal{X} \to \{0, 1\}$ (the realisable case — the truth lies in $\mathcal{H}$). Given $N$ i.i.d. samples $(\mathbf{x}_i, c(\mathbf{x}_i))$, the learner outputs $\hat{h}$.

The class $\mathcal{H}$ is **PAC-learnable** if there is a function $N(\epsilon, \delta)$ such that for any $\mathcal{D}$ and any $c \in \mathcal{H}$,

$$
P_{\mathcal{D}^N}\!\left[ R(\hat{h}) \leq \epsilon \right] \;\geq\; 1 - \delta
$$

whenever the training set has size $\geq N(\epsilon, \delta)$. The function $N(\epsilon, \delta)$ is the **sample complexity**.

The framework is **distribution-free** — the learner must work for any $\mathcal{D}$ — and **worst-case** — must work for any $c \in \mathcal{H}$.

## The basic theorem

For finite hypothesis classes:

$$
N(\epsilon, \delta) \;=\; \mathcal{O}\!\left( \frac{1}{\epsilon} \log \frac{|\mathcal{H}|}{\delta} \right)
$$

samples suffice. The proof is one paragraph: the probability that a "bad" hypothesis ($R(h) > \epsilon$) survives ERM training is $(1 - \epsilon)^N$; union bound over $\mathcal{H}$. The take-home: **sample complexity grows logarithmically with class size**. Doubling $|\mathcal{H}|$ adds a constant to $N$, not a multiplicative factor.

For infinite classes, $\log |\mathcal{H}|$ is replaced by [VC dimension](./generalization):

$$
N(\epsilon, \delta) \;=\; \mathcal{O}\!\left( \frac{d \log(1/\epsilon) + \log(1/\delta)}{\epsilon} \right), \qquad d = \mathrm{VC}(\mathcal{H}).
$$

The fundamental theorem of statistical learning (Blumer et al., 1989) says: **a class is PAC-learnable iff it has finite VC dimension**.

## Agnostic PAC learning

The realisable case (truth is in $\mathcal{H}$) is unrealistic. **Agnostic PAC** drops the assumption: the data distribution can be arbitrary, with no constraint that any $h \in \mathcal{H}$ achieves zero error. The criterion becomes:

$$
P\!\left[ R(\hat{h}) \;\leq\; \min_{h^* \in \mathcal{H}} R(h^*) + \epsilon \right] \;\geq\; 1 - \delta.
$$

The learner promises to be approximately competitive with the **best** hypothesis in the class, not with the truth. Sample complexity becomes $N = \tilde{O}(d/\epsilon^2)$ — quadratic in $1/\epsilon$ instead of linear, the price for not assuming realisability.

## Computational efficiency

PAC learning is statistical; **efficient PAC** demands also **polynomial-time learning algorithms**. Some classes are statistically PAC-learnable but **computationally hard**:

- **3-DNF formulas** — finite VC dimension but learning them efficiently is NP-hard (Pitt, Valiant 1988).
- **Parity functions** in noise — statistically learnable, conjectured computationally hard (LWE, related to lattice cryptography).

The gap between statistical and computational learnability is one of the deeper themes of learning theory and the source of cryptographic constructions like the *Learning Parity with Noise* assumption.

## Realisable vs noisy settings

Three regimes:

- **Realisable** — exact $c \in \mathcal{H}$. Easiest case.
- **Random classification noise** — labels flipped independently with probability $\eta < 1/2$. Statistical query (SQ) algorithms handle this; perceptron with averaging works for separable data with random noise.
- **Adversarial / agnostic** — labels arbitrary. Hardest; matches reality.

Most modern ML lives in the agnostic regime — labels are noisy, biased, or just imperfect, and we have no guarantee the model class contains the truth.

## What PAC theory does and doesn't say about deep learning

PAC theory is **necessary** — without finite VC, no distribution-free learning. It is *not sufficient* — modern neural networks have vast VC dimension and PAC bounds are vacuous (see [generalization](./generalization)). But:

- **Distribution-dependent PAC bounds** (PAC-Bayes, with priors over hypotheses) give non-vacuous predictions for some deep networks (Dziugaite & Roy, 2017).
- **Algorithm-dependent bounds** (stability-based, Hardt et al., 2016) bypass capacity entirely and bound generalisation in terms of optimiser properties.

Both are active areas — PAC learning's framing of "what counts as learning?" remains central even when the original VC bounds are too loose to be useful.

## What to read next

- [Generalization & VC Dimension](./generalization) — the capacity measures PAC bounds use.
- [ERM](./erm) — the canonical PAC-style algorithm.
- [Statistical Learning Theory (history)](../history/statistical-learning) — the historical context.
