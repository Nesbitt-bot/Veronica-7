---
title: RWKV
order: 11
---

# RWKV

*RWKV: Reinventing RNNs for the Transformer Era* (Peng et al., EMNLP Findings 2023) is one of the longest-running attempts to build a linear-recurrent Transformer alternative. The architecture's distinguishing feature: **trainable like a Transformer, inferable like an RNN**. RWKV-4, RWKV-5 (Eagle/Finch), RWKV-6 (Finch), and RWKV-7 (Goose, 2024-25) form a continuous evolution that's matured into one of the strongest non-Transformer LLM lines.

## The core idea

RWKV replaces self-attention with a **time-mixing block** parameterised so it can be expressed in two equivalent forms:

- **Parallel form** — a matrix operation suitable for GPU training, similar in cost to attention.
- **Recurrent form** — a state-space recurrence with $O(1)$ per-token cost at inference.

The two forms are mathematically identical; the framework picks which to run at training versus inference. This dual-form design is the same insight RetNet later articulated — it's RWKV's core architectural commitment.

## The time-mixing operator

For time step $t$, the RWKV-4 time-mixing block computes (simplified):

$$
\mathbf{x}_t' \;=\; \mu_t \mathbf{x}_t + (1 - \mu_t) \mathbf{x}_{t-1},
$$

a per-channel linear interpolation between current and previous tokens. The "WKV" mechanism then computes a weighted average over the history:

$$
\mathrm{WKV}_t \;=\; \frac{\sum_{i \leq t} e^{-(t-i) w + k_i} v_i}{\sum_{i \leq t} e^{-(t-i) w + k_i}},
$$

where $w$ is a learned per-channel time-decay rate. Each channel decays differently, capturing different time scales — analogous to multi-head attention specialisation.

The exponential-decay structure means the running sums in numerator and denominator can be **incrementally accumulated**:

$$
A_{t+1} \;=\; e^{-w} A_t + e^{k_{t+1}} v_{t+1}, \qquad B_{t+1} \;=\; e^{-w} B_t + e^{k_{t+1}}.
$$

So $\mathrm{WKV}_t = A_t / B_t$ is computable in $O(1)$ from $(A_{t-1}, B_{t-1})$. Recurrent inference is constant per token, no KV cache.

## RWKV's trajectory

The RWKV line has been remarkably consistent:

- **RWKV-1 to RWKV-3** (2021-2022) — initial experiments at small scale.
- **RWKV-4** (mid-2022) — first scaled release. Up to 14B parameters; the first non-Transformer to reach this scale with competitive language-modelling quality.
- **RWKV-5 (Eagle)** (early 2024) — larger receptive states, multi-scale time decay.
- **RWKV-6 (Finch)** (mid-2024) — input-dependent time decay, similar to [Mamba's](./mamba) selectivity.
- **RWKV-7 (Goose)** (late 2024-2025) — generalised state evolution, in-context learning improvements, and matrix-valued state for richer expressivity.

RWKV is unusual among open ML projects in being **community-developed** — Peng's open-source group, with crowd-funded compute and sustained iteration. The line has produced multiple production-ready releases without the backing of a major lab.

## RWKV vs Mamba vs Transformer

The architectural axis:

- **Pure Transformer** — full attention, exact retrieval, strong ICL, $O(T^2)$.
- **Mamba (selective SSM)** — content-aware recurrence, strong long-context, $O(T)$.
- **RWKV** — channel-wise exponential-decay attention, similar trade-offs to Mamba but with a different parametrisation.
- **Linear attention (GLA, RetNet)** — kernelised attention, dual to selective SSMs in some forms.

In practice, RWKV-7 and Mamba-2 have similar performance profiles — both are linear-recurrent architectures with strong long-context efficiency and slightly weaker ICL than Transformers at comparable scale. RWKV-7's matrix-valued state is its current differentiation point.

## What RWKV is good for

- **Edge inference.** $O(1)$ per-token state with no KV cache means even small devices (phones, embedded) can run RWKV models with long effective context.
- **Streaming.** Like Mamba, RWKV's recurrent state is one tensor — easy to checkpoint, resume, fork.
- **Multilingual long-context.** RWKV's training mix has historically included unusually heavy multilingual data; the line is competitive on low-resource languages.

## What RWKV is not yet

- **Frontier-quality at the largest scale.** RWKV-7 14B is competitive with similar-sized Transformers; 70B+ pure-RWKV models exist but lag frontier dense or MoE Transformers.
- **Mainstream production deployment.** RWKV is in some inference engines (rwkv.cpp, llama.cpp partial support) but isn't a default choice in vLLM / SGLang.

The bet is that RWKV's efficiency advantages compound at long context — and that the architecture will eventually matter at frontier scale either pure or in hybrids.

## What to read next

- [Mamba](./mamba) — the closely-related selective SSM.
- [Linear Attention](./linear-attention) — the kernel-attention cousin.
- [Architectures (LLM)](../../llm/other/architectures) — broader context.
