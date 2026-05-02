---
title: Latent-Space Reasoning
order: 2
---

# Latent-Space Reasoning

A 2024–2025 research thread that asks a strange question: do reasoning models actually need to *emit* their chain of thought as natural-language tokens? The intermediate tokens are a bottleneck — every step is forced through a vocabulary projection that discards information. *Thinking in latent space* keeps reasoning in continuous hidden states.

## The motivation

A standard chain-of-thought model produces step $t+1$ by sampling a token from $p(w_{t+1} \mid w_{\le t})$, embedding it back into $\mathbb{R}^d$, and feeding it as the next input. Each round-trip through the vocabulary is lossy: a continuous state of dimension $d$ collapses to one of $|V|$ discrete options before being re-expanded.

If reasoning is largely *internal* — search, planning, working-memory updates — then forcing it through this discrete bottleneck is wasted compute. Latent reasoning replaces the sampled token with a continuous vector that re-enters the model directly.

## Coconut

*Training Large Language Models to Reason in a Continuous Latent Space* (Hao et al., 2024) — nicknamed **Coconut** — interleaves "language mode" with "latent mode". In latent mode, the previous step's hidden state is fed back as the next input embedding without ever being decoded. Trained via curriculum (gradually replacing language thought tokens with latent ones), Coconut matches or beats verbal CoT on math tasks while emitting far fewer tokens.

## Compressed Chain of Thought

*Compressed Chain of Thought* (Cheng & Van Durme, 2024) compresses a long CoT into a small number of dense "contemplation tokens" — continuous embeddings that summarise multiple reasoning steps. The model produces them autoregressively, then conditions its final answer on them. The compression budget is a tunable knob between speed and accuracy.

## Soft Thinking

*Soft Thinking: Unlocking the Reasoning Potential of LLMs in Continuous Concept Space* (Zhang et al., 2025) avoids any retraining: it replaces token sampling at each reasoning step with the **softmax-weighted average embedding** over the full vocabulary distribution — the model "thinks" in the convex hull of word embeddings. The technique is purely an inference-time modification.

## How does it actually work?

*LLMs are Single-threaded Reasoners: Demystifying the Working Mechanism of Soft Thinking* (Liu et al., 2025) probed Soft Thinking and found that, despite the soft mixture appearing to encode a probability distribution over many possible next thoughts, the model's downstream behaviour is dominated by the single highest-probability mode. In effect, latent reasoning is approximately equivalent to greedy CoT — the gains come not from "considering many paths in superposition" but from skipping the lossy round-trip through tokens.

## What this means

Latent reasoning is a useful efficiency tool: same accuracy, fewer tokens, lower cost. But it is not yet a fundamentally different kind of cognition. The interpretation work suggests that the field's next push is to *actually* maintain reasoning superpositions, not just average embeddings.

## Reading list

- *Training Large Language Models to Reason in a Continuous Latent Space* — Hao et al., 2024 (Coconut).
- *Compressed Chain of Thought: Efficient Reasoning Through Dense Representations* — Cheng & Van Durme, 2024.
- *Soft Thinking: Unlocking the Reasoning Potential of LLMs in Continuous Concept Space* — Zhang et al., 2025.
- *LLMs are Single-threaded Reasoners: Demystifying the Working Mechanism of Soft Thinking* — Liu et al., 2025.

## What to read next

- [RLVR](./rlvr) — training reasoning capability via verifiable rewards.
- [Chain-of-Thought & Inference-Time Scaling](./chain-of-thought) — the verbal-thought baseline this work compresses.
