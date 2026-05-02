---
title: Data Augmentation
order: 3
---

# Data Augmentation

Data augmentation transforms training samples in ways that should not change the label, expanding the effective training set and encoding **invariances** the model otherwise has to learn from scratch. It is the cheapest and most reliable form of regularisation — every modern training recipe includes augmentation, often heavily.

## Classical image augmentations

The default toolkit for image classification, set by AlexNet and refined ever since:

- **Random crops** of varying scale and aspect ratio (training the model to be translation- and zoom-invariant).
- **Horizontal flips** for natural-image classes (cars, animals); not for text or asymmetric domains.
- **Colour jitter** — random brightness, contrast, saturation, hue.
- **Normalisation** to dataset mean/std (canonically the ImageNet RGB statistics).

These alone give 3–5 points of top-1 accuracy on ImageNet over no augmentation.

## Mixup and CutMix — train on combinations

*mixup: Beyond Empirical Risk Minimization* (Zhang, Cisse, Dauphin, Lopez-Paz, ICLR 2018) trains on convex combinations of input pairs:

$$
\tilde{x} = \lambda x_i + (1 - \lambda) x_j, \qquad \tilde{y} = \lambda y_i + (1 - \lambda) y_j, \qquad \lambda \sim \mathrm{Beta}(\alpha, \alpha).
$$

The model sees mixed images with mixed soft labels. Mixup acts as a strong regulariser, improves calibration, and increases robustness to label noise.

*CutMix* (Yun et al., ICCV 2019) replaces a random rectangular region of one image with a patch from another, with the label mixed by patch area. CutMix preserves local image structure that pure pixel mixing destroys, and is the default for ViT pretraining and many SOTA classifiers.

## RandAugment and AutoAugment

*AutoAugment* (Cubuk et al., CVPR 2019) treats the augmentation policy as a search space — pick from operations (shear, rotate, equalise, posterise, …) with magnitudes and probabilities — and uses RL to search for the best policy. *RandAugment* (Cubuk et al., CVPRW 2020) drops the search and just samples $N$ random transforms with a single magnitude knob $M$, finding that this random policy almost matches the searched one. RandAugment with $N \approx 2$, $M \approx 9$ is the de-facto default in modern recipes (DeiT, ConvNeXt, Swin).

## Augmentation in NLP

Image augmentation has a clean grounding (small geometric/colour perturbations preserve labels). Text is much harder — most word-level edits change meaning. The pragmatic NLP toolkit:

- **Back-translation** — translate to a pivot language and back, produces paraphrases that often preserve labels.
- **EDA** (Wei, Zou, 2019) — synonym replacement, random swap/deletion/insertion at low rates. Cheap, modest gains.
- **Span masking / dropout** — at the input embedding level (a form of input dropout that doubles as augmentation).
- **Synthetic data via larger LMs** — generate labelled examples with GPT-4-class models. The dominant modern recipe for instruction-tuning data.

## Augmentation in audio and 3D

- **SpecAugment** (Park et al., 2019) — mask random time and frequency bands of the spectrogram. Standard for ASR.
- **PointCloud augmentation** — random rotation, scaling, translation, plus per-point dropout. Used in 3D-detection and segmentation pipelines.

## Why it works

Augmentation is equivalent to imposing **invariance constraints** on the function the network can learn — the fitted $f$ must agree on $x$ and the augmented $T(x)$. From a Bayesian perspective, augmentation is a prior over invariances. From a regularisation perspective, augmenting roughly doubles the effective training set per pass (more if augmentations are diverse), which directly buys generalisation per the [scaling laws](../../llm/basics/scaling-laws).

The catch: augmentations that violate the label (e.g., flipping a digit-recognition sample horizontally) make the loss strictly worse. Choosing augmentations is a domain-knowledge decision the policy search cannot fully automate.

## What to read next

- [Dropout](./dropout) — internal noise; complementary to input-space augmentation.
- [Normalization](./normalization) — also acts as a regulariser, but on activations.
- [Double Descent & Implicit Bias](./double-descent) — the broader generalisation theory augmentation participates in.
