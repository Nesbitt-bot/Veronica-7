---
title: Other Open Models — Falcon, MPT, Qwen, Yi, DeepSeek
order: 6
---

# Other Open Models — Falcon, MPT, Qwen, Yi, DeepSeek

[LLaMA](./llama) and [Mistral](./mistral) dominated the 2023 open-LLM conversation, but several other open-weights model families filled the same ecological niche from different starting points: **Falcon** (TII, UAE), **MPT** (MosaicML), **Qwen** (Alibaba), **Yi** (01.AI), and **DeepSeek** (DeepSeek AI). Together they constitute the **non-Meta open-LLM landscape** — diverse training mixes, geographic origins, and licence terms, all building on the same LLaMA-style architecture.

## Falcon (UAE TII, 2023)

**Falcon-7B / 40B / 180B** (Almazrouei et al., TII Abu Dhabi, 2023) were among the first open models to match or exceed LLaMA 1's quality at comparable scale. Notable features:

- **Trained on RefinedWeb** — a 5T-token cleaned web corpus released alongside the models.
- **Multi-query attention** for efficient inference (single K/V head shared across all Q heads).
- **Apache 2.0 licence** for the 7B/40B models — fully unencumbered commercial use.
- **180B** released under a custom commercial-use-with-restrictions licence.

Falcon-180B was the largest open-weights model at its release. By late 2023 LLaMA 2 70B and Mistral models had largely displaced Falcon in popular use, but the RefinedWeb corpus continued to influence subsequent open-LLM data curation.

## MPT (MosaicML, 2023)

**MPT-7B / 30B** (MosaicML, 2023) emphasised **practical engineering for fine-tuning**: long context (8K base, 65K extended via ALiBi), efficient training infrastructure (released alongside Composer/PyTorch FSDP recipes), and a fully Apache 2.0 licence.

MPT was acquired by Databricks in mid-2023 and the team's subsequent work absorbed into Databricks' enterprise offerings. The MPT models themselves were eventually superseded by Mistral and LLaMA 2, but MPT's training infrastructure (Composer, StreamingDataset) remained widely used.

## Qwen (Alibaba, 2023+)

**Qwen** (千问, "Thousand Questions") is Alibaba's open-weights LLM series. Releases:

- **Qwen-7B / 14B / 72B** (2023) — strong baselines, particularly competitive on Chinese-language benchmarks.
- **Qwen 1.5** (Feb 2024) — refined recipe, 0.5B–110B sizes including a 14B-MoE variant.
- **Qwen 2 / 2.5** (mid–late 2024) — most-cited open-LLM line of 2024, with 0.5B / 1.5B / 3B / 7B / 14B / 32B / 72B sizes.
- **Qwen 3** (2025) — including dense and MoE variants up to ~600B total.
- **Qwen-VL, Qwen-Audio, Qwen-Coder, QwQ** — modality and capability variants.

Qwen models are released under Apache 2.0. By 2024–25 Qwen had become arguably the strongest open-LLM family **per parameter** — Qwen 2.5 7B and 14B beat LLaMA 3 8B on many English benchmarks, and the larger Qwen variants compete with frontier closed models.

## Yi (01.AI, 2023)

**Yi-6B / 34B** (01.AI, founded by Kai-Fu Lee, 2023) were strong bilingual (English + Chinese) open models. Yi-34B was particularly notable for matching LLaMA 2 70B at half the parameter count on several benchmarks — heavy investment in data quality. Yi-1.5 (May 2024) refined the recipe.

Yi has somewhat faded as a top-tier open-LLM choice in favour of Qwen and DeepSeek, but the line illustrates the broader trend: **frontier-competitive open LLMs from non-US labs** became routine through 2024.

## DeepSeek (DeepSeek AI, 2023+)

**DeepSeek** went from "another open-LLM lab" to a major frontier-research story in 2024–25. Releases:

- **DeepSeek-LLM** (Nov 2023) — initial 7B / 67B base + chat models.
- **DeepSeek-Coder** (Jan 2024) — strong code-specialised models.
- **DeepSeek V2** (May 2024) — 236B total / 21B active MoE with novel **Multi-head Latent Attention** for compressed KV cache.
- **DeepSeek V3** (Dec 2024) — 671B total / 37B active MoE, frontier-competitive base model.
- **DeepSeek R1** (Jan 2025) — pure-RL reasoning model that matched o1 at much lower training cost. See [R1](../2024-2025/r1).

DeepSeek's R1 release in January 2025 was a discontinuity event for the field — a fully-open reasoning model at frontier quality, with detailed methodology published. DeepSeek demonstrated that frontier reasoning capability could be reproduced openly.

## What this ecosystem produced

By 2024–25, the open-LLM landscape had:

- **Multiple tier-1 families** (LLaMA, Mistral, Qwen, DeepSeek).
- **Specialised variants** for code (CodeLlama, DeepSeek-Coder, Qwen-Coder), vision (LLaVA, Pixtral, Qwen-VL), reasoning (R1, QwQ).
- **Production deployment infrastructure** (vLLM, SGLang, Hugging Face TGI) optimised for these models.
- **Fine-tuning pipelines** (axolotl, Unsloth, LLaMA-Factory) that any practitioner can run.

Open-weights LLMs are no longer "second-tier" — they are genuinely frontier-competitive on most user-facing tasks, with closed models retaining a (shrinking) lead on reasoning, multimodal, and the very largest scales.

## What to read next

- [LLaMA](./llama) — the open-source spine.
- [Mistral](./mistral) — the European tier-1 entrant.
- [R1](../2024-2025/r1) — DeepSeek's frontier reasoning model.
