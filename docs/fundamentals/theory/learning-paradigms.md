---
title: Learning Paradigms
order: 5
---

# Learning Paradigms

Machine-learning settings are usually classified by what *signal* the learner receives. Supervised, unsupervised, and reinforcement learning are the three classical categories, but modern ML increasingly blends them — self-supervised learning sits between supervised and unsupervised; offline RL between supervised and reinforcement; semi-supervised between supervised and unsupervised. This page is the map.

## Supervised learning

Each training example is a pair $(\mathbf{x}, y)$ — input and target label. The learner finds $h: \mathcal{X} \to \mathcal{Y}$ via [empirical risk minimization](./erm). Two flavours:

- **Classification** — discrete $y$. Loss: cross-entropy or hinge.
- **Regression** — continuous $y$. Loss: squared error or Huber.

Almost every named ML algorithm lives here: [OLS](../classical/ols), [logistic regression](../classical/logistic-regression), [SVM](../classical/svm), [decision trees](../ensembles/decision-trees), CNNs, Transformers fine-tuned on labelled data. The label is what the learner is optimising for.

## Unsupervised learning

Examples are unlabelled — just a set $\{\mathbf{x}_1, \dots, \mathbf{x}_N\}$. The learner discovers structure: **clusters** (k-means, GMM, hierarchical), **low-dimensional representations** (PCA, t-SNE, UMAP), **density estimates** (KDE, GMM, normalising flows), or **generative models** (VAE, GAN, diffusion).

The key tension: **what is structure?** Without labels there is no objective ground truth — every choice of method encodes a different prior about what "structure" means. PCA finds high-variance directions; k-means finds spherical clusters; t-SNE preserves local neighbourhoods. Each can be the wrong tool for a given task.

## Reinforcement learning

The learner is an **agent** that interacts with an environment, receiving rewards. See the [RL track](../../dnn/rl/index) for full coverage. The learning signal is the reward — sparser than supervised labels, harder to optimise (the agent must explore), but applicable to sequential-decision problems supervised learning cannot handle.

## Self-supervised learning

The dominant paradigm of modern foundation-model pretraining. Generate "labels" *from the data itself*:

- **Masked language modelling** (BERT) — predict masked words from context.
- **Next-token prediction** (GPT) — predict the next word from preceding context.
- **Contrastive learning** ([SimCLR](../../cv/advances/representation), [CLIP](../../cv/advances/vision-language)) — predict whether two views of the same image (or image-caption pair) match.
- **Masked autoencoding** ([MAE](../../cv/advances/representation)) — reconstruct masked image patches.

Self-supervised methods get effectively unlimited supervision because the label is computable from the input. They are **structurally supervised** (defined ERM problem with a loss) but **semantically unsupervised** (no human labelling). This is the recipe behind every modern LLM, foundation vision model, and multimodal pretraining.

## Semi-supervised learning

A mix: a small labelled set $\mathcal{L}$ and a large unlabelled set $\mathcal{U}$. Methods exploit $\mathcal{U}$ to improve a model trained primarily on $\mathcal{L}$:

- **Pseudo-labelling** — train on $\mathcal{L}$, predict labels for $\mathcal{U}$, retrain on the union with pseudo-labels.
- **Consistency regularisation** — augment unlabelled examples and require the model to make consistent predictions across augmentations.
- **MixMatch / FixMatch** (Sohn et al., 2020) — combine the two with strong augmentation.

In the foundation-model era, semi-supervised learning is largely subsumed by **self-supervised pretraining + supervised fine-tuning** — the pretrained model already encodes most of what semi-supervision used to provide.

## Offline / batch learning vs online

Orthogonal axis: does the learner see all data up front, or stream it?

- **Offline** — full dataset available. The default in this curriculum.
- **Online** — data arrives one example at a time; model must adapt incrementally. Streaming, time-series, recommender systems.
- **Active learning** — learner chooses *which* examples get labelled, querying an oracle. Useful when labels are expensive (medical imaging, expert annotation).

[Offline RL](../../dnn/rl/offline-rl) is a special case where the agent cannot interact further and must learn purely from a logged dataset.

## Transfer, multi-task, and meta-learning

Three related ideas about reusing learning across problems:

- **Transfer learning** — pretrain on one task, fine-tune on another. The standard recipe in NLP and vision.
- **Multi-task learning** — train one model on many tasks simultaneously, sharing parameters. T5 made this the default for NLP.
- **Meta-learning** — learn *how* to learn from a distribution of tasks. MAML (Finn et al., 2017) is the reference; modern in-context learning in LLMs is meta-learning *emerged* from scale.

## Choosing a paradigm

The task usually picks for you:

- Have abundant labels? **Supervised**.
- Want to discover structure? **Unsupervised**.
- Sequential decisions with reward? **Reinforcement**.
- Cheap data + expensive labels? **Self-supervised pretraining + supervised fine-tuning**, in that order.

## What to read next

- [ERM](./erm) — the formal core of supervised learning.
- [PAC Learning](./pac-learning) — the theoretical framework for sample complexity.
- [RL Overview](../../dnn/rl/index) — the reinforcement track.
