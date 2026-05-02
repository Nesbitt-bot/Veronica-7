---
title: Vanilla RNNs
order: 1
---

# Vanilla RNNs

A recurrent neural network processes a sequence one element at a time, maintaining a hidden state that carries information forward. The vanilla RNN is the simplest version — one tied weight matrix applied at every step. Conceptually clean, painful to train at long horizons, and the gateway concept for everything from [LSTMs](./lstm-gru) and [seq2seq](./seq2seq) to the original [attention mechanism](./bahdanau-attention).

## The recurrence

Given an input sequence $\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_T$, a vanilla RNN computes hidden states

$$
\mathbf{h}_t \;=\; \phi(W_{xh} \mathbf{x}_t + W_{hh} \mathbf{h}_{t-1} + \mathbf{b}_h),
$$

with output $\mathbf{y}_t = W_{hy} \mathbf{h}_t + \mathbf{b}_y$ and $\phi$ usually tanh. The same weights $W_{xh}, W_{hh}, W_{hy}$ are used at every step — *parameter sharing across time*, the structural analogue of weight sharing across space in a [CNN](../cnn/convolution).

## Backpropagation through time (BPTT)

The gradient with respect to a weight that participates at every step is the sum of contributions from every step:

$$
\frac{\partial \mathcal{L}}{\partial W_{hh}} \;=\; \sum_{t=1}^{T} \sum_{k=1}^{t} \frac{\partial \mathcal{L}_t}{\partial \mathbf{h}_t} \left( \prod_{j=k+1}^{t} \frac{\partial \mathbf{h}_j}{\partial \mathbf{h}_{j-1}} \right) \frac{\partial \mathbf{h}_k}{\partial W_{hh}}.
$$

The product of Jacobians inside the parentheses is the entire problem. For long sequences, $T$ is large and the product collapses (vanishing gradient) or blows up (exploding gradient).

## Vanishing and exploding gradients

The Jacobian $\partial \mathbf{h}_j / \partial \mathbf{h}_{j-1} = W_{hh}^\top \mathrm{diag}(\phi'(\cdot))$. In an iterated product of $t$ such matrices:

- If $\|W_{hh}\|_2 \cdot \|\phi'\|_\infty < 1$, gradients vanish exponentially in $t$. Long-range dependencies become invisible.
- If the product is $> 1$, gradients explode. Training diverges.

For tanh, $|\phi'| \leq 1$ everywhere, so vanishing dominates — vanilla RNNs cannot reliably learn dependencies more than ~10 steps apart. This was the central practical limitation that motivated [LSTMs](./lstm-gru).

**Gradient clipping** is the standard runtime patch for explosions: clip $\nabla$ to a maximum norm before each step. It does nothing for vanishing.

## Truncated BPTT

Backpropagating through 1000+ steps is prohibitive in memory (must store every hidden state) and gradient quality. The standard hack is **truncated BPTT**: back-propagate through only the last $K$ steps (typically $K = 32$–$200$), even if the forward pass uses much longer histories. This trades a biased gradient for a tractable one and is the workhorse for LM training on RNNs.

## What vanilla RNNs are useful for

Despite the training problems, vanilla RNNs:

- Are **expressive** — Turing-complete given infinite precision (Siegelmann, 1991).
- Are useful for **short sequences** (text < 20 tokens, audio frames within a phoneme).
- Are conceptually the right starting point for understanding all recurrent architectures.
- Serve as the baseline against which LSTMs/GRUs/Transformers are measured.

In modern practice, almost no production system uses a vanilla RNN — but the recurrence is the foundation for the gated variants and [Mamba/SSM](../../llm/other/architectures) that bring recurrence back at scale.

## What to read next

- [LSTM & GRU](./lstm-gru) — gated recurrences that solve the vanishing-gradient problem.
- [Sequence-to-Sequence](./seq2seq) — encoder–decoder architectures built on RNNs.
- [Backpropagation](../basics/backpropagation) — the underlying gradient algorithm BPTT specialises.
