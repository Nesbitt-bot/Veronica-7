---
title: GPT-3 & In-Context Learning
order: 1
---

# GPT-3 & In-Context Learning

*Language Models are Few-Shot Learners* (Brown, Mann, Ryder, Subbiah, Kaplan, Dhariwal, Neelakantan, Shyam et al., NeurIPS 2020) introduced **GPT-3** at 175B parameters — over 100× [GPT-2](../2018-2019/gpt-2) — and demonstrated that sufficiently scaled language models can perform new tasks **purely from prompted examples**, without any gradient updates. This phenomenon, **in-context learning**, was the conceptual unlock that made the foundation-model era possible. The OpenAI API that opened in 2020 was also the first time most researchers could *use* a frontier LLM without training one.

## What changed from GPT-2

Same recipe, more of everything:

- **175B parameters** (GPT-2: 1.5B). 96 layers, 12288 hidden dim, 96 heads.
- **300B training tokens** from Common Crawl, WebText, Books, Wikipedia.
- **Same architecture** — decoder-only Transformer with learned positional embeddings, modified attention pattern (alternating dense and sparse).

No new training objective, no new architecture. The headline was the **emergent behaviour** that arrived with scale.

## In-context learning

Frame any task as a prompt that demonstrates a few examples, then asks for the next answer:

```text
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>
```

GPT-3 completes with "fromage". No fine-tuning, no gradient updates — the model learns the task **in-context** from the prompt alone.

The paper introduced three settings:

- **Zero-shot** — task description only.
- **One-shot** — task description + one example.
- **Few-shot** — task description + a handful of examples.

Few-shot performance scaled smoothly with model size and was often within striking distance of fine-tuned task-specific systems. On some tasks (translation, simple arithmetic, common-sense QA) GPT-3 matched or beat SOTA without any task-specific training data.

The discovery generalised: any task that could be specified as a prompt could potentially be done by a sufficiently large LM. This is what *makes* a model a foundation model.

## What in-context learning is, mechanistically

Theoretical work in the years after debated whether ICL is "really" learning or just pattern matching. Some findings:

- ICL behaviour is **not** simple memorisation — models can solve novel tasks they could not have seen in pretraining.
- ICL is **strongly dependent on prompt format** — performance varies wildly with phrasing, ordering of examples, and example diversity.
- Simple ICL has been **reduced to gradient descent in input space** in some toy settings (Akyürek et al., Garg et al., 2022). The mechanism is approximate but exists.
- The **induction-head** circuit (Olsson et al., *In-context Learning and Induction Heads*, 2022) is the smallest mechanistic unit of ICL: an attention head that learns to copy patterns from earlier in the prompt.

The mechanistic-interpretability story is still being written. Empirically: ICL works, scales, and generalises. Mechanistically: it's a structured form of meta-learning that emerges from large-scale next-token prediction.

## Capabilities and limitations

GPT-3 demonstrated many capabilities for the first time at usable quality:

- **Long-form coherent text** at expert-mimicking style.
- **Code generation** for simple programs, presaging [Codex](../2020-2021/codex).
- **Arithmetic** at small numbers, with sharp decay at larger ones.
- **Knowledge retrieval** of facts seen during pretraining, often unreliable on details.
- **Style transfer, summarisation, paraphrase** without task-specific fine-tuning.

What it lacked:

- **Robust reasoning** — multi-step logic still failed; chain-of-thought arrived later.
- **Instruction following** — you had to coax the right behaviour with prompt engineering. [InstructGPT](../2022/instructgpt) fixed this.
- **Calibration** — over-confident on incorrect outputs.
- **Tool use** — purely text-out, no APIs or code execution.

## What GPT-3 enabled

The 2020 release of the OpenAI API exposed GPT-3 to a much wider audience than any previous LLM. The API-as-product model became the dominant deployment pattern. Three years of downstream work flowed from this:

- **Prompt engineering** as a discipline.
- **InstructGPT, ChatGPT** — alignment fine-tuning to make ICL more usable.
- **Foundation-model research programs** — "what else can large LMs do?".
- **Open-source reactions** — the LLaMA / Mistral / Qwen lineage of community-trained models.

GPT-3 was the model where "big language model" stopped being a research topic and became infrastructure.

## What to read next

- [Scaling Laws](./scaling-laws) — the formalisation of why GPT-3 was the right size to train.
- [InstructGPT](../2022/instructgpt) — alignment fine-tuning of the GPT-3 architecture.
- [Chain of Thought](../../llm/reasoning/chain-of-thought) — the prompting recipe that made GPT-3-class models good at reasoning.
