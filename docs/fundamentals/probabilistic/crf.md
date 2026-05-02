---
title: Conditional Random Fields
order: 4
---

# Conditional Random Fields

A Conditional Random Field (CRF) is the discriminative counterpart to the [HMM](./hmm). Both model sequence labelling, but where HMMs model the joint $P(\mathbf{x}, \mathbf{y})$ and require strong independence assumptions on the observations, CRFs model the conditional $P(\mathbf{y} \mid \mathbf{x})$ directly and let observations interact arbitrarily. CRFs were the dominant sequence-labelling tool from 2001 to about 2017 and persist as the **structured-output head** of many modern neural taggers.

## The model

For an input sequence $\mathbf{x} = (x_1, \dots, x_T)$ and a label sequence $\mathbf{y} = (y_1, \dots, y_T)$, a **linear-chain CRF** defines

$$
P(\mathbf{y} \mid \mathbf{x}) \;=\; \frac{1}{Z(\mathbf{x})} \exp\!\left( \sum_{t=1}^T \sum_k \lambda_k f_k(y_{t-1}, y_t, \mathbf{x}, t) \right),
$$

with feature functions $f_k$ and weights $\lambda_k$. The normaliser $Z(\mathbf{x}) = \sum_{\mathbf{y}} \exp(\dots)$ is a sum over all $K^T$ possible label sequences — but it factorises along the chain, so it can be computed in $O(K^2 T)$ via the forward algorithm.

The two feature types in a linear-chain CRF:

- **Transition features** $f(y_{t-1}, y_t)$ — like HMM's transition matrix.
- **Emission features** $f(y_t, \mathbf{x}, t)$ — depend on **the entire observation sequence** at every position. This is what HMMs cannot do.

## Why CRFs beat HMMs for tagging

HMMs assume $\mathbf{x}_t \perp \mathbf{x}_{1:T \setminus t} \mid y_t$ — observations are conditionally independent given their label. Real text violates this: in named-entity recognition, "Bill" is more likely a name *because* the next word is "Clinton". HMMs' generative assumption blocks the model from exploiting it.

CRFs model $P(\mathbf{y} \mid \mathbf{x})$ directly, so:

- **Arbitrary observation features.** $f(y_t, \mathbf{x}, t)$ can use the whole sentence — capitalization, suffixes, gazetteers, neighbouring words, parsing context.
- **No need to model $P(\mathbf{x})$.** Discriminative training spends capacity on the boundary, not on the data distribution.

The empirical result: CRFs beat HMMs by 5–10 F1 points on named-entity recognition, POS tagging, and chunking — benchmarks that defined NLP for a decade.

## Training and inference

**Training.** Maximise the conditional log-likelihood

$$
\mathcal{L}(\boldsymbol{\lambda}) \;=\; \sum_n \log P(\mathbf{y}^{(n)} \mid \mathbf{x}^{(n)}; \boldsymbol{\lambda}) \;-\; \frac{C}{2} \|\boldsymbol{\lambda}\|^2.
$$

The objective is convex; use L-BFGS or SGD. Gradient computation requires the **expected feature counts** under the model, computed by forward-backward in $O(K^2 T)$ per sequence.

**Inference.** Predict $\hat{\mathbf{y}} = \arg\max_{\mathbf{y}} P(\mathbf{y} \mid \mathbf{x})$ via Viterbi, exactly as in HMMs.

## Generalisations

- **General CRFs** — any factor graph, not just linear chains. Arbitrary inference difficulty in general (NP-hard for high-treewidth graphs).
- **Tree-structured CRFs** — efficient inference via dynamic programming on trees; useful for parsing.
- **Skip-chain CRFs** — add long-range edges between identical word occurrences. Useful but requires approximate inference.

## CRFs as a neural output head

Modern sequence-labelling pipelines often combine an LSTM or Transformer encoder with a **CRF output layer**:

- The encoder produces a per-token feature vector.
- A learned linear layer produces emission scores per (position, label).
- A learned $K \times K$ matrix gives transition scores.
- Forward-backward computes the log-likelihood; Viterbi decodes.

This **BiLSTM-CRF** architecture (Lample et al., 2016) was the SOTA for NER until full attention models took over. The CRF head's value: it enforces structural constraints (e.g., no I-PER following a B-LOC tag) that pure per-token softmax cannot. Modern implementations like Flair and SpaCy still use a CRF head as an option.

## CRFs vs Transformers

Transformer taggers (BERT-NER, RoBERTa-NER) typically use a softmax-per-token head and rely on the Transformer's contextualised representations to capture inter-label dependencies. They beat BiLSTM-CRF on most benchmarks. But:

- For low-resource domains, BiLSTM-CRF still competes.
- For tasks where structural constraints really matter (BIO-tagging, segment-level constraints), a CRF head on top of BERT (BERT-CRF) is sometimes a meaningful improvement.

## What to read next

- [Hidden Markov Models](./hmm) — the generative counterpart.
- [Bayesian Networks](./bayes-nets) — the directed graphical-model framework.
- [Vanilla RNNs](../../dnn/rnn/vanilla) — the neural sequence model that absorbed CRF's role.
