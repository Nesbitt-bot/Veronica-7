---
title: Loss Functions
order: 4
---

# Loss Functions

The loss is the scalar a network is trained to minimise. Choosing it correctly determines what the model learns to do — different losses on the same architecture lead to different solutions even with identical optimisers and data. This page covers the four canonical families: squared error, cross-entropy, margin losses, and ranking/contrastive losses.

## Squared error: regression

Mean squared error (MSE) is the default for real-valued targets:

$$
\mathcal{L}_\text{MSE}(\hat{y}, y) \;=\; \tfrac{1}{2} (\hat{y} - y)^2, \qquad \frac{\partial \mathcal{L}}{\partial \hat{y}} = \hat{y} - y.
$$

It corresponds to the negative log-likelihood of a Gaussian noise model — the maximum-likelihood loss when the target is assumed to be the predicted mean plus i.i.d. Gaussian noise. The clean linear gradient $(\hat{y} - y)$ is part of why MSE is so convenient.

**Robust variants:** MSE is dominated by outliers because the loss grows as the *square* of the residual. **Mean absolute error (MAE)** uses $|\hat{y} - y|$ — robust but non-differentiable at zero. **Huber loss** smooths the transition: quadratic for small residuals, linear for large ones, with a tunable threshold $\delta$. Huber is the default for tasks where outliers are common (object-detection box regression, robust regression).

## Cross-entropy: classification

For an $N$-way classification problem with one-hot target $\mathbf{y}$ and predicted probability vector $\hat{\mathbf{p}}$,

$$
\mathcal{L}_\text{CE}(\hat{\mathbf{p}}, \mathbf{y}) \;=\; -\sum_i y_i \log \hat{p}_i.
$$

Cross-entropy is the negative log-likelihood of the target under the predicted categorical distribution. Combined with a softmax output (see [activations](./activations)), the gradient simplifies to $\hat{\mathbf{p}} - \mathbf{y}$ — the prediction error, no Jacobian explosion. **Numerically stable implementations** combine softmax and cross-entropy into one fused operation (`logsoftmax + nll_loss` in PyTorch, `softmax_cross_entropy_with_logits` in TF) to avoid computing $\log(\exp(z) / \sum \exp(z))$ directly.

**Binary cross-entropy** (BCE) is the binary special case, paired with sigmoid output. **Multi-label classification** uses BCE per output independently.

**Label smoothing** (Szegedy et al., 2016): replace the hard one-hot target with $\tilde{y}_i = (1 - \epsilon) y_i + \epsilon / N$. This regularises the model against over-confident predictions and improves calibration; standard at $\epsilon = 0.1$ in modern training recipes.

## Margin losses: SVM-style classification

Hinge loss is the original max-margin loss:

$$
\mathcal{L}_\text{hinge}(\hat{y}, y) \;=\; \max(0,\; 1 - y \hat{y}), \qquad y \in \{-1, +1\}.
$$

Hinge produces sparse gradients — zero whenever the margin is satisfied — so optimisation only touches misclassified or boundary examples. Used in classical SVMs and for some structured prediction tasks; rarely the default for deep classification, where cross-entropy almost always wins.

## Ranking and contrastive losses

When the supervision is "$a$ is more similar to $b$ than to $c$", standard classification losses don't apply. **Triplet loss** (FaceNet, Schroff et al., 2015):

$$
\mathcal{L}_\text{triplet} \;=\; \max(0,\; \|f(a) - f(b)\|^2 - \|f(a) - f(c)\|^2 + \alpha),
$$

with $\alpha$ a margin. The harder generalisation is **InfoNCE** (van den Oord et al., 2018), used in [SimCLR](../../cv/advances/representation), CLIP, and contrastive RAG retriever training:

$$
\mathcal{L}_\text{InfoNCE} \;=\; -\log \frac{\exp(\langle f(a), f(b) \rangle / \tau)}{\sum_k \exp(\langle f(a), f(c_k) \rangle / \tau)}.
$$

InfoNCE is the multi-class generalisation of triplet — one positive plus a batch of negatives — and lower-bounds mutual information between the matched representations.

## Choosing a loss

Quick guide:

- **Regression with Gaussian-ish noise** — MSE.
- **Regression with outliers** — Huber or MAE.
- **Classification (multi-class)** — softmax + cross-entropy, with label smoothing for large models.
- **Multi-label classification** — sigmoid + BCE.
- **Imbalanced classification (esp. dense prediction)** — focal loss (see [object detection](../../cv/deep/object-detection)) or Dice (see [semantic segmentation](../../cv/deep/semantic-segmentation)).
- **Metric learning / retrieval / contrastive pretraining** — InfoNCE.

## What to read next

- [Activation Functions](./activations) — softmax/sigmoid couple with cross-entropy.
- [Backpropagation](./backpropagation) — what the loss gradient feeds into.
- [Calibration & Uncertainty](../../llm/factuality/calibration) — the post-hoc assessment of how well loss-trained probabilities match reality.
