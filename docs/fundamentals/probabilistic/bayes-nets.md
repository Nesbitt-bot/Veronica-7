---
title: Bayesian Networks
order: 3
---

# Bayesian Networks

A Bayesian network is a directed acyclic graph (DAG) whose nodes are random variables and whose edges encode conditional dependencies. It compactly factorises a high-dimensional joint distribution into a product of local conditionals, making both representation and inference tractable when the graph is sparse. Bayes nets are the language of expert systems, causal modelling, and most pre-deep-learning probabilistic AI.

## The factorisation

For a DAG over variables $X_1, \dots, X_n$, the joint distribution factorises as

$$
P(X_1, \dots, X_n) \;=\; \prod_{i=1}^n P(X_i \mid \mathrm{Pa}(X_i)),
$$

where $\mathrm{Pa}(X_i)$ is the set of parents of $X_i$ in the DAG. Each conditional $P(X_i \mid \mathrm{Pa}(X_i))$ is a small distribution table (or parameterised function); the network's parameter count is exponential in the largest in-degree, not in $n$. Sparse graphs give cheap representations of complex joints.

## Conditional independence and d-separation

The DAG encodes conditional independence relations. Two variables are independent given a conditioning set $\mathbf{Z}$ iff every path between them is **d-separated** by $\mathbf{Z}$. The path-blocking rules are:

- **Chain** $X \to Y \to Z$: blocked iff $Y \in \mathbf{Z}$.
- **Fork** $X \leftarrow Y \to Z$: blocked iff $Y \in \mathbf{Z}$.
- **Collider** $X \to Y \leftarrow Z$: blocked iff $Y \notin \mathbf{Z}$ and no descendant of $Y$ is in $\mathbf{Z}$. (Conditioning on a collider *creates* dependence — "explaining away".)

D-separation is exactly the conditional-independence structure implied by *all* distributions consistent with the DAG. Faithfulness (the converse — no extra independences in the distribution) is a stronger assumption that some real distributions violate.

## Inference

The two query types:

- **Marginal** — $P(X_i = x_i \mid \text{evidence})$, the posterior over a single variable given observations.
- **MAP** — $\arg\max_{\mathbf{X}} P(\mathbf{X} \mid \text{evidence})$, the most probable joint assignment.

Exact inference algorithms:

- **Variable elimination** — sum out variables one at a time in a chosen order. The cost is exponential in the **treewidth** of the moralised graph.
- **Junction tree** — build a clique tree, run two-pass message passing. Optimal exact inference; same exponential treewidth dependence.

For high-treewidth graphs, exact inference is intractable. Standard approximations:

- **Loopy belief propagation** — run message passing as if the graph were a tree. Approximate; sometimes converges, sometimes oscillates.
- **MCMC** — Gibbs sampling cycles through variables, sampling each from its conditional given the others.
- **Variational inference** — fit a tractable $q(\mathbf{X})$ to minimise $\mathrm{KL}(q \,\|\, p)$.

## Plate notation and parameter learning

Repeated structure (e.g., $N$ i.i.d. samples) is drawn with a **plate** — a box around the repeated nodes labelled with the count. This is the canonical visual notation for hierarchical probabilistic models.

Parameter learning is straightforward:

- **Fully observed data** — maximum likelihood factorises into independent local-conditional MLEs. Closed-form for tabular CPDs and exponential-family conditionals.
- **Partially observed / latent variables** — EM with the same E-step / M-step structure as in [GMMs](../unsupervised/gmm-em).
- **Bayesian priors** — Dirichlet for tabular conditionals, conjugate priors for exponential-family conditionals.

## Causal Bayes nets

A Bayes net encodes only **observational** dependencies. To support **interventional** queries — what happens if we *force* a variable to a value — Pearl's *do-calculus* extends the framework with the $\mathrm{do}(\cdot)$ operator. The same DAG can support both observational and causal reasoning if its edges are interpreted as direct causal influences.

This causal reading is what makes Bayes nets central to **causal inference** (Pearl's *Causality*, 2009): from observational data plus assumed graph structure, derive intervention effects without running the experiment.

## Where Bayes nets are used today

- **Medical diagnosis** — symptoms-and-diseases networks where every edge is interpretable.
- **Risk assessment** — fault trees in engineering, reliability analysis.
- **Causal inference** — econometrics, epidemiology, targeted interventions.
- **Hidden Markov Models, Kalman filters, Naive Bayes, LDA** — all special-case Bayes nets.

The deep-learning renaissance largely abandoned graphical models for unstructured neural representations, but Bayes nets remain the right tool when **structure**, **interpretability**, or **causal reasoning** is required.

## What to read next

- [Hidden Markov Models](./hmm) — temporal Bayes nets.
- [CRF](./crf) — undirected counterpart for sequence labelling.
- [Markov Chains](./markov-chains) — the simplest DAG structure (a chain).
