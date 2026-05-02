---
title: Safety, Robustness, Evaluation (Vision)
order: 8
---

# Safety, Robustness, Evaluation (Vision)

Vision models inherit and often *amplify* the demographic skews and shortcut features of their training data. This page surveys four threads in the safety/robustness/evaluation literature: dataset-level demographic gaps, the spurious-correlation problem, geographic representation in training data, and bias auditing for text-to-image generators.

## Object Recognition for Everyone

*Does Object Recognition Work for Everyone?* (de Vries, Misra, Wang, van der Maaten, CVPR Workshops 2019) tested commercial classifiers on the **Dollar Street** dataset of household objects photographed across income levels worldwide. Result: top-5 accuracy was 10–20 points lower for items from low-income households (Africa, South Asia) than for the same objects from high-income North American or European homes. The cause is not "bias in the model" in any abstract sense — the training distribution simply did not contain low-income contexts at the same density. The paper is the canonical reference for **geographic distribution shift** in CV.

## OccamNets — fighting shortcut learning

*OccamNets: Mitigating Dataset Bias by Favoring Simpler Hypotheses* (Shrestha, Kafle, Kanan, ECCV 2022) attacks **spurious correlations**: networks that latch onto easy features (background colour, watermark, photographer style) instead of the object. OccamNets bias the architecture toward minimal-depth and minimal-receptive-field solutions via two losses — exit-loss (encourage solving the task with shallow predictions) and image-region inhibition (penalise the network for using more pixels than necessary). The result is improved out-of-distribution generalisation on biased benchmarks like Biased MNIST and ColoredMNIST.

## GeoNet — geographic bias

*GeoNet: Benchmarking Unsupervised Adaptation across Geographies* (Kalluri, Majumder, Chandraker, CVPR 2023) builds a benchmark with paired (USA, Asia) splits across classification, detection, and scene recognition. Even strong domain-adaptation methods that work on standard distribution-shift benchmarks (Office-Home, VisDA) **fail or hurt** on GeoNet — the geographic shift is qualitatively different (different objects, not just different appearances). The benchmark surfaced a robustness gap that subsequent work (CLIP probing, foundation-model evaluation) has had to address.

## De-biasing text-to-image

*Discovering and Mitigating Visual Biases through Keyword Explanation* and the broader **bias-in-T2I** literature (e.g., Bansal et al., 2022; Cho et al., 2023) document that text-to-image diffusion models reproduce occupational, racial, and gender stereotypes from their training captions ("CEO" → mostly male, "nurse" → mostly female). Mitigations include classifier-guidance with demographic counterfactuals, prompt expansion with explicit demographic distributions, and fine-tuning on debiased reference sets — none yet a clean solution.

## Reading list

- *Does Object Recognition Work for Everyone?* — de Vries, Misra, Wang, van der Maaten, CVPR Workshops 2019.
- *OccamNets: Mitigating Dataset Bias by Favoring Simpler Hypotheses* — Shrestha, Kafle, Kanan, ECCV 2022.
- *GeoNet: Benchmarking Unsupervised Adaptation across Geographies* — Kalluri, Majumder, Chandraker, CVPR 2023.
- *Investigating Bias in Text-to-Image Generation Models* — Bansal, Yin, Monajatipoor, Chang, 2022; Cho, Zala, Bansal, ICCV 2023.

## What to read next

- [LLM · Bias](../../llm/other/bias) — the language-model parallel of these issues.
- [LLM · Safety](../../llm/other/safety) — adversarial attacks, jailbreaks, memorisation.
- [Image and Video Generation](./generation) — the systems whose biases need auditing.
