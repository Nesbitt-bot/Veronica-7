---
title: Mixture of Experts (Switch, Mixtral, DeepSeek-MoE)
order: 2
---

# Mixture of Experts (Switch, Mixtral, DeepSeek-MoE)

A Mixture-of-Experts (MoE) layer replaces a dense feed-forward block with $E$ "experts" and a learned router that sends each token to a small subset (top-$k$, typically $k=1$ or $k=2$). The model has $E\times$ more parameters than the dense baseline, but only $k/E$ of them activate per token. MoE has gone from a research curiosity in 2017 to the dominant frontier-LLM architecture by 2025 — every major frontier model is now MoE-based.

## The MoE layer

Given input $\mathbf{x} \in \mathbb{R}^d$ and $E$ experts $\{\mathrm{FFN}_i\}_{i=1}^E$, a router $g_\theta: \mathbb{R}^d \to \mathbb{R}^E$ produces softmax weights:

$$
g(\mathbf{x}) = \mathrm{softmax}(W_g \mathbf{x}), \qquad y = \sum_{i \in \mathrm{top-}k(g)} g_i(\mathbf{x}) \cdot \mathrm{FFN}_i(\mathbf{x}).
$$

Only the top-$k$ experts (typically $k = 2$ out of $E = 8$ to $E = 256$) are evaluated. Total parameters scale as $E \times \mathrm{FFN}$; per-token compute scales as $k \times \mathrm{FFN}$. The decoupling of **total** from **active** parameters is the entire MoE story.

## The 2017 origin and the 2021 revival

*Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer* (Shazeer et al., ICLR 2017) introduced large-scale MoE in deep learning, achieving 137B parameters at the LSTM era. It worked but didn't scale dominantly.

The Transformer revival came with:

- **GShard** (Lepikhin et al., Google, 2020) — MoE Transformer at 600B parameters, mostly for translation.
- **Switch Transformer** (Fedus et al., Google, 2021) — top-1 routing simplification ("switch" routing), 1.6T parameters. Simpler than top-$k$, faster training.
- **GLaM** (Du et al., Google, 2022) — 1.2T parameters, $k=2$, demonstrated MoE matches dense at much lower compute.

These were research-prestige projects. Production deployment was rare because:

- **Memory** — full $E \times \mathrm{FFN}$ must be loaded across devices.
- **Communication** — routing introduces all-to-all traffic between GPUs. Dominates at scale.
- **Load imbalance** — some experts get more traffic than others without careful balancing.

## Mixtral 8x7B — open-source MoE breakthrough

[Mixtral 8x7B](../2023/mistral) (Mistral, Dec 2023) was the first widely-deployed open-weights MoE model. Key features:

- **8 experts**, **top-2 routing**.
- **47B total params, 13B active per token.**
- Quality competitive with dense LLaMA-2-70B at 13B-active inference cost.
- Released under Apache 2.0.

Mixtral's success made MoE practical: it ran on consumer GPUs (with quantisation), the routing was stable enough for production, and quality was demonstrably better-per-active-FLOP than dense alternatives.

## DeepSeek-MoE and the 2024–25 generation

*DeepSeek-MoE* (Dai et al., DeepSeek 2024) introduced two innovations now standard in modern MoE training:

- **Fine-grained experts** — many small experts ($E = 64$ to $256$) instead of few large ones. Gives richer specialisation patterns.
- **Shared experts** — a few experts that *every* token goes through, capturing common knowledge that all tokens need.

DeepSeek-V2 (236B/21B-active) and **DeepSeek-V3** (671B/37B-active) are the most-capable open MoE models at their respective scales, with V3 matching or beating GPT-4-class closed models on many benchmarks.

Other 2024–25 MoE releases:

- **Qwen 2.5 MoE / Qwen 3** — Alibaba's MoE line.
- **Llama 4 / Llama 4.1** — Meta's first MoE frontier models.
- **Grok 1, 2, 3** — xAI's MoE models.
- **Frontier closed models** — GPT-4 was rumoured to be MoE; Gemini 1.5 Pro and Claude 3.5 are believed to be MoE; Claude 4 likely also MoE.

By 2025, frontier dense Transformer is rare. MoE is the default at scale.

## Load balancing

A naive router collapses — one or two experts get all the traffic, the rest are dead. Standard fixes:

- **Auxiliary load-balancing loss.** Encourages uniform expert utilisation:

$$
\mathcal{L}_\text{LB} \;=\; E \sum_{i=1}^E f_i \cdot P_i,
$$

where $f_i$ is the fraction of tokens routed to expert $i$ and $P_i$ is the average router probability for expert $i$.

- **Expert capacity caps.** Each expert can process at most $C$ tokens per batch. Excess tokens are dropped (they pass through without being processed by that expert) — a coarse load balancer.
- **Token dropping** (Switch Transformer) — when an expert is over-capacity, drop excess tokens entirely. Production systems usually keep this off.

## Routing variants

- **Token-choice** — each token picks its top-$k$ experts. Default since Shazeer 2017.
- **Expert-choice** (Zhou et al., 2022) — each expert picks its top-$k$ tokens. Better load balance, harder to implement at inference.
- **Soft MoE** — every token attends to every expert with continuous weights; no discrete routing. Faster training but loses sparsity benefit.

Modern frontier models mostly use token-choice with auxiliary balancing, though expert-choice has resurged in some 2024–25 work.

## What MoE bought, what it cost

Bought:

- **Quality at fixed inference cost.** Active-parameter quality scales much faster than total-parameter dollars.
- **Specialisation patterns.** Different experts learn different domains — code, math, languages. Visible in routing patterns post-training.
- **Frontier-scale practicality.** Pure dense at 1T+ would be infeasible to serve; MoE makes it possible.

Cost:

- **Memory.** All experts must be loaded; serving requires high VRAM.
- **Engineering complexity.** Routing, load balancing, capacity caps, distributed all-to-all comms.
- **Tooling.** vLLM, SGLang, and friends took time to support MoE; quantisation methods are MoE-specific.

Net: MoE has won at frontier scale. The dense vs MoE conversation is settled in MoE's favour for 30B+ models.

## What to read next

- [Mixtral / Mistral](../2023/mistral) — the open-source MoE breakthrough.
- [Architectures (LLM)](../../llm/other/architectures) — MoE in broader context.
- [Frontier Models](../2025-2026/frontier-models) — frontier-scale MoE.
