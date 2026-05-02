---
title: LeNet & AlexNet
order: 2
---

# LeNet & AlexNet

LeNet-5 (1998) and AlexNet (2012) bracket a 14-year gap. LeNet established the convolutional architecture for digit recognition and ran on a CPU; AlexNet adapted essentially the same blueprint to ImageNet, ran on two GPUs, and won the 2012 ILSVRC by a wide margin — kicking off the deep-learning era. This page covers both as a single architectural lineage.

## LeNet-5

*Gradient-Based Learning Applied to Document Recognition* (LeCun, Bottou, Bengio, Haffner, 1998) presented LeNet-5 — a 7-layer network for digit recognition, deployed by NCR to read bank checks at scale through the late 1990s.

The architecture, in modern notation: input $32 \times 32$ grayscale → C1: $6 @ 28 \times 28$ conv 5×5 → S2: avg-pool 2×2 → C3: $16 @ 10 \times 10$ conv 5×5 → S4: avg-pool 2×2 → C5: 120 conv 5×5 → F6: 84 FC → output 10. Activations were tanh; the final layer used Euclidean radial-basis functions for digit prototypes (an idiosyncrasy that did not survive).

LeNet's contributions were essentially everything that defines a CNN today:

- **Local receptive fields** with weight sharing.
- **Hierarchical feature extraction** — edges → shapes → digits.
- **Subsampling** layers (the ancestor of pooling).
- **End-to-end gradient training** with backpropagation.

The technique was correct in 1998. What was missing was data scale (MNIST is 70k samples) and compute (a single CPU). Two decades later both arrived, and the same blueprint exploded.

## AlexNet — the catalyst

*ImageNet Classification with Deep Convolutional Neural Networks* (Krizhevsky, Sutskever, Hinton, NeurIPS 2012) was the breakthrough paper of the deep-learning era. AlexNet won ILSVRC 2012 with top-5 error 15.3% vs the second-place 26.2% non-deep entry — a gap that put the field on a different trajectory.

The architecture: 5 convolutional layers + 3 fully-connected layers, trained on two GTX 580 GPUs in parallel because the model was too large for one. Conv kernels of 11, 5, then 3 × 3; ReLU activations; max pooling; final 1000-way softmax over ImageNet classes. The training data: ImageNet's 1.2M images at 224×224, augmented with random crops and horizontal flips.

Specific innovations that survived:

- **ReLU** as the hidden activation (vs sigmoid/tanh), giving 6× faster training.
- **Dropout** in the FC layers, in the same paper that helped ([dropout](../regularization/dropout) was Hinton's group's other 2012 contribution).
- **Local response normalisation** — a brightness-normalisation layer between convs. Did not survive; superseded by batch norm.
- **GPU training** of a deep network. This was the part everyone copied.
- **Heavy augmentation** — random crops + flips + PCA colour jitter.

AlexNet effectively showed that LeNet's recipe scales: more layers, more data, more compute, ReLU in place of saturating activations, and dropout.

## Why the gap?

LeNet was published, ran in production, and was largely ignored by the broader vision community for a decade. The gap is not mysterious in retrospect:

- **Compute**: AlexNet needed ~$10^{14}$ training-time multiply-adds. A 1998 CPU could not complete the training in a year.
- **Data**: MNIST (70k samples) did not exercise the architecture. ImageNet (1.2M, available 2009) did.
- **Methodology**: Hand-crafted features (SIFT + bag-of-words + SVM) were the dominant pipeline and were genuinely competitive on small datasets.
- **Initialisation and activations**: deep tanh networks suffered from [vanishing gradients](../basics/backpropagation); ReLU + good init unlocked depth.

The lesson is that algorithmic ideas can sit dormant until the surrounding ecosystem (data, compute, complementary techniques) catches up.

## What to read next

- [Convolution & Pooling](./convolution) — the layer types these networks composed.
- [VGG, Inception, ResNet](./resnet-family) — the next generation that took AlexNet from breakthrough to mature recipe.
- [CNN Backbones](../../cv/deep/cnn-backbones) — the modern survey.
