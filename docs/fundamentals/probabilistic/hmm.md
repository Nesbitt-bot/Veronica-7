---
title: Hidden Markov Models
order: 2
---

# Hidden Markov Models

A Hidden Markov Model is a [Markov chain](./markov-chains) whose states cannot be observed directly — instead, you see noisy observations conditioned on the state. HMMs are the canonical model for sequence data with discrete latent dynamics: speech recognition (1980s–2010s), part-of-speech tagging, gene-finding, and time-series segmentation. They illustrate the three classical inference problems — **filtering, smoothing, and learning** — in their cleanest form.

## The model

An HMM has three components:

- **Transition probabilities** $A_{ij} = P(z_{t+1} = j \mid z_t = i)$ over $K$ hidden states.
- **Emission probabilities** $B_i(\mathbf{x}) = P(\mathbf{x}_t \mid z_t = i)$. Common choices: categorical (discrete observations), Gaussian (continuous), or mixture of Gaussians.
- **Initial distribution** $\pi_i = P(z_1 = i)$.

The joint over hidden states $\mathbf{z}_{1:T}$ and observations $\mathbf{x}_{1:T}$ factorises as

$$
P(\mathbf{x}_{1:T}, \mathbf{z}_{1:T}) \;=\; \pi_{z_1} \, B_{z_1}(\mathbf{x}_1) \prod_{t=1}^{T-1} A_{z_t, z_{t+1}} B_{z_{t+1}}(\mathbf{x}_{t+1}).
$$

The conditional independence structure: $z_{t+1} \perp z_{1:t-1} \mid z_t$, and $\mathbf{x}_t \perp $ everything else $\mid z_t$.

## Three classical problems

Rabiner's *A Tutorial on Hidden Markov Models* (1989) is the canonical reference. Three computations cover all the use cases:

1. **Likelihood / Filtering** — given parameters $\theta = (A, B, \pi)$ and observations $\mathbf{x}_{1:T}$, compute $P(\mathbf{x}_{1:T} \mid \theta)$ and $P(z_t \mid \mathbf{x}_{1:t})$. **Forward algorithm.**
2. **Decoding** — find the most likely hidden sequence: $\arg\max_{\mathbf{z}_{1:T}} P(\mathbf{z}_{1:T} \mid \mathbf{x}_{1:T})$. **Viterbi algorithm.**
3. **Learning** — estimate $\theta$ from observations alone. **Baum-Welch (EM).**

Each is $O(K^2 T)$ — quadratic in the number of states, linear in time.

## Forward algorithm

Define $\alpha_t(i) = P(\mathbf{x}_{1:t}, z_t = i)$. Recurrence:

$$
\alpha_{t+1}(j) \;=\; B_j(\mathbf{x}_{t+1}) \sum_{i=1}^K \alpha_t(i) A_{ij}.
$$

Initialise $\alpha_1(i) = \pi_i B_i(\mathbf{x}_1)$. The total likelihood is $P(\mathbf{x}_{1:T}) = \sum_i \alpha_T(i)$. The filtering posterior is $P(z_t = i \mid \mathbf{x}_{1:t}) \propto \alpha_t(i)$.

## Viterbi algorithm

Replace sum with max:

$$
\delta_{t+1}(j) \;=\; B_j(\mathbf{x}_{t+1}) \max_{i} \delta_t(i) A_{ij}.
$$

Track back-pointers and recover the optimal sequence by following them from $\arg\max_j \delta_T(j)$ backward. Viterbi is dynamic programming on the trellis of state-time pairs — the same structure that powers CTC decoding and beam search.

## Baum-Welch — EM for HMMs

When $\theta$ is unknown, fit by EM. The E-step computes posterior **state occupancies** $\gamma_t(i) = P(z_t = i \mid \mathbf{x}, \theta^\text{old})$ and **transition counts** $\xi_t(i, j) = P(z_t = i, z_{t+1} = j \mid \mathbf{x}, \theta^\text{old})$ via forward-backward (forward $\alpha$ + backward $\beta$).

The M-step updates parameters by averaging:

$$
A_{ij} \;\propto\; \sum_t \xi_t(i, j), \qquad B_i(\mathbf{x}_k) \;\propto\; \sum_{t: \mathbf{x}_t = \mathbf{x}_k} \gamma_t(i), \qquad \pi_i \;=\; \gamma_1(i).
$$

Each iteration monotonically increases the data likelihood. As with any EM, multiple restarts and good initialisation (e.g., k-means on Gaussian emissions) matter.

## What HMMs were used for

- **Speech recognition** — phoneme HMMs were the foundation of every commercial ASR system from the 1980s through the 2010s, before end-to-end neural models took over (DeepSpeech, RNN-T, Whisper).
- **Part-of-speech tagging** — Viterbi over a small POS state space, replaced by neural taggers around 2015.
- **Bioinformatics** — gene finding, protein-family alignment (HMMER), CpG island detection. Still in active use.
- **Time-series segmentation** — change-point detection, regime modelling in finance.

## Why HMMs lost to RNNs and Transformers

HMMs assume:

- **Discrete latent state** of fixed size $K$. Modelling rich context requires exponential $K$.
- **Independence** of $\mathbf{x}_t$ from history given $z_t$. Real sequences have long-range dependencies HMMs cannot capture.

[RNNs](../../dnn/rnn/lstm-gru) replaced the discrete latent with a continuous hidden state of arbitrary expressivity; [Transformers](../../llm/basics/transformer) further removed the Markov assumption entirely. HMMs persist in low-data, interpretable, or tightly structured domains; the inference machinery (forward-backward, Viterbi) generalises to neural CRFs and structured-output networks.

## What to read next

- [Markov Chains](./markov-chains) — the underlying state dynamics.
- [Conditional Random Fields](./crf) — the discriminative descendant.
- [Vanilla RNNs](../../dnn/rnn/vanilla) — the neural successor.
