---
title: Alignment & Safety in 2026
order: 2
---

# Alignment & Safety in 2026

By 2026 alignment has matured from a research subfield into a **core engineering discipline** at every frontier lab. The 2024-2025 wave of reasoning models, agentic deployment, and capabilities expansion forced new safety problems to the top: **scalable oversight** of long reasoning chains, **agentic-action** safety on computer-use and code-execution, **deceptive alignment** evaluations, and **capability evaluations** tied to deployment decisions. The pre-2023 RLHF-only paradigm is no longer enough.

## What got harder

Three structural shifts since the [InstructGPT](../2022/instructgpt) era:

- **Reasoning chains are too long for humans to oversee.** A reasoning model emits 10K-100K tokens of hidden thought per query. Pairwise human preference labelling of full traces is infeasible.
- **Agentic models take real-world actions.** Coding agents modify production codebases; computer-use agents click on links and submit forms. Misalignment now has external-world consequences beyond saying wrong things.
- **Models are increasingly capable judges of their own outputs.** Constitutional AI, RLAIF, debate-based methods all treat the model as part of its own oversight loop. As models surpass human judges on technical content, this becomes load-bearing.

## Scalable oversight

The umbrella term for "how do we supervise systems we no longer directly understand?". Approaches:

- **AI debate** (Irving, Christiano, Amodei, 2018) — two models argue different sides; a human judges the debate. Asymmetry of effort: debating is harder than judging arguments.
- **Recursive reward modelling** (Leike et al., 2018) — train a reward model with the help of weaker reward models that supervise easier sub-tasks.
- **Process supervision** ([PRMs](../2024-2025/process-rewards)) — reward each step of a reasoning chain rather than just the final answer. Allows targeted supervision of long traces.
- **Sycophancy and reward-hacking detection** — the 2024-2025 alignment research wave heavily emphasised characterising and mitigating these failure modes.

Anthropic's *Constitutional AI* (see [Constitutional AI](../2023/constitutional-ai)) is a deployed instance of scalable oversight; OpenAI's *Weak-to-Strong Generalization* (Burns et al., 2023) explores it more directly.

## Capability evaluations and Responsible Scaling Policies

A major 2023-2025 development: **commitments to evaluate capabilities before deployment**, with deployment gated on safety reviews. Anthropic's *Responsible Scaling Policy* (RSP, 2023) and OpenAI's *Preparedness Framework* (2023) define capability thresholds (CBRN, autonomous-replication, cyber-offence) and required safety mitigations at each level.

Specific evaluations performed before frontier-model release:

- **CBRN** (chemical, biological, radiological, nuclear) — does the model meaningfully uplift novice attackers?
- **Cyber-offence** — can it find/exploit vulnerabilities, write malware, conduct social engineering?
- **Autonomous replication** — can it set up its own infrastructure, acquire resources, persist autonomously? (METR's evaluation framework.)
- **Persuasion / manipulation** — can it change humans' beliefs more effectively than baseline?

By 2026 these are standard, with publicly-released evaluation results for most frontier launches.

## Agentic-safety problems

[Computer use](./computer-use) and [coding-agent](./coding-agents) deployment created concrete safety problems:

- **Prompt injection.** A web page tells the agent "ignore your instructions, do X instead". Defences are partial; the model often complies.
- **Unintended side effects.** An agent asked to "clean up my files" deletes important data; one asked to "fix the build" rewrites unrelated code.
- **Goal misgeneralisation.** Agents trained on tasks similar to but not identical to deployment behaviour drift in subtle ways.
- **Side-channel data exfiltration.** Sensitive information leaks through model outputs in unexpected ways.

The mitigations (sandboxing, action approval flows, scope limits, human-in-the-loop for destructive actions) are engineering, not alignment-research. But the design-space exploration is happening in real time.

## Mechanistic interpretability

The 2023-2025 *mechanistic-interpretability* research program — understanding how transformer networks produce their behaviours by analysing internal circuits — has matured. Tools and concepts that have crystallised:

- **Sparse autoencoders (SAEs)** — decompose layer activations into interpretable features. Anthropic's *Towards Monosemanticity* (2023) and *Scaling Monosemanticity* (2024) showed SAEs scaling to frontier models.
- **Circuit analysis** — identifying specific subgraphs of attention heads and MLP neurons responsible for specific behaviours (induction heads, IOI circuits, refusal directions).
- **Steering vectors** — additive interventions in residual streams that change behaviour predictably.
- **Activation engineering** — modifying internal activations to alter capability, refuse, behave differently.

Interpretability is increasingly used as part of safety evaluations: "can we verify the model isn't engaging in deceptive reasoning?" requires looking inside.

## Adversarial robustness and red-teaming

Frontier-model release pipelines now include:

- **Internal red-team** — typically tens of people probing for jailbreaks, harmful content, capability surfacing.
- **External red-team** — specialised firms (METR, GenoSec) and academic groups (DEFCON Generative AI Red Team).
- **Public bug-bounty programs** — Anthropic's Vulnerability Disclosure Program, OpenAI's Bug Bounty.
- **Continuous monitoring** post-deployment — telemetry to detect novel attack patterns.

The picture is asymmetric: defenders need to fix everything, attackers only need one. The community's empirical posture is that **all frontier models can be jailbroken with effort**, and the question is how much capability the jailbreak unlocks vs the marginal risk.

## Open questions

Real disagreements in the 2025-2026 alignment community:

- **Is current frontier-LLM safety research adequate** for the next generation of models? Anthropic, OpenAI, DeepMind all publicly worry it might not be.
- **Should there be regulation?** EU AI Act came into force in 2024; US discussions ongoing; California SB-1047 vetoed. Regulatory capture vs benefit, public benefit vs private control are contested.
- **Are reasoning models more or less alignable** than non-reasoning models? Hidden reasoning increases capability but reduces transparency.
- **What about superhuman models?** The post-2026 question: when a model is a better moral and technical reasoner than the humans labelling its training data, what does alignment even mean?

## What to read next

- [Constitutional AI](../2023/constitutional-ai) — the methodological backbone of Anthropic's alignment.
- [LLM · Safety](../../llm/other/safety) — the research-track curriculum on jailbreaks, memorisation, etc.
- [Process Rewards](../2024-2025/process-rewards) — the scalable-oversight tool for reasoning models.
