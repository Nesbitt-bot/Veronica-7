---
title: PixelRNN / PixelCNN
order: 5
---

# PixelRNN / PixelCNN

PixelRNN and PixelCNN model an image as an ordered sequence of pixels and predict the next one given all previous ones. They were the proof-of-concept that **autoregressive next-token prediction**, the recipe that powers modern language models, also works on images. Their direct descendants are the autoregressive image generators (Image GPT, DALL·E's transformer, Parti, MUSE, the image-output side of frontier multimodal LLMs).

## The autoregressive factorisation

For an image $\mathbf{x}$ with $N$ pixels in row-major order, write the joint distribution as

$$
p(\mathbf{x}) \;=\; \prod_{i=1}^{N} p(x_i \mid x_1, \dots, x_{i-1}).
$$

Each pixel is a categorical distribution (256-way for 8-bit greyscale, or three independent 256-way distributions for RGB). Training is straightforward maximum likelihood with a cross-entropy loss; sampling is inherently sequential — one pixel at a time, $O(N)$ forward passes.

The factorisation is **exact** — unlike VAEs and GANs, there is no approximation. Every pixel's conditional distribution is modelled directly.

## PixelRNN

*Pixel Recurrent Neural Networks* (van den Oord, Kalchbrenner, Kavukcuoglu, ICML 2016) used a **2D RNN** to compute each pixel's conditional. Two variants:

- **Row LSTM** — process pixels row-by-row with an LSTM over each row, conditioned on a representation summarising rows above.
- **Diagonal BiLSTM** — process along diagonals so each pixel can attend to its full upper-left context (a "raster-order" prefix).

Diagonal BiLSTM is more accurate but extremely slow due to its strictly sequential nature. PixelRNN held the SOTA on small-image likelihood benchmarks (CIFAR-10) at its release.

## PixelCNN

The same paper introduced PixelCNN, replacing the RNN with a stack of **masked convolutions**. A masked conv kernel zeros out positions to the right and below the current pixel, so each output depends only on its raster-order prefix:

$$
[1\ 1\ 1; 1\ 0\ 0; 0\ 0\ 0]\quad\text{(3×3 mask, type A: excludes self)}
$$

Two mask types: **type A** for the first layer (excludes the current pixel), **type B** for subsequent layers (includes it). Stacks of masked convs achieve a large receptive field while parallelising training over all pixels in one forward pass — sampling is still $O(N)$, but training is fast.

## Gated PixelCNN and the blind-spot fix

The naive masked conv in PixelCNN has a **blind spot**: the receptive field misses a triangular region of pixels that should be visible. *Conditional Image Generation with PixelCNN Decoders* (van den Oord et al., NeurIPS 2016) introduces **Gated PixelCNN**, which uses two stacks of masked convolutions (one for the row above, one for pixels-to-the-left) plus gated activations $\tanh(\cdot) \odot \sigma(\cdot)$. This eliminates the blind spot, adds class conditioning, and matches PixelRNN's quality at much higher training throughput.

## PixelCNN++

*PixelCNN++* (Salimans, Karpathy, Chen, Kingma, ICLR 2017) refined the model further: predict each pixel as a **mixture of discretised logistics** (rather than a 256-way softmax), use downsampled processing with skip connections, and dropout. Sample quality improved substantially and the discretised-logistic likelihood became a standard tool in autoregressive image and audio modelling.

## Modern descendants

The pixel-as-token paradigm scales poorly — a 256×256 image is 65k pixels, dominating compute. Modern autoregressive image models tokenise instead:

- **Image GPT** (Chen et al., 2020) — autoregressive Transformer on raw pixels at low resolution.
- **DALL·E** — VQ-VAE tokens (32×32 = 1024 per image, vocab ~8k), autoregressive Transformer over `[text; image]` tokens.
- **Parti, MUSE** — variations on tokeniser + autoregressive (or masked-token) Transformer.
- **Frontier multimodal LMs** (Gemini-style image-out) — increasingly use continuous latent tokens, blurring the line with diffusion.

PixelRNN/CNN are the right starting point for this lineage — the explicit autoregressive likelihood makes the math transparent.

## What to read next

- [Variational Autoencoders](./vae) — VQ-VAE provides the tokeniser used by modern autoregressive image models.
- [Generative Adversarial Networks](./gan) — the likelihood-free contemporary.
- [Image Generation (CV)](../../cv/advances/generation) — DALL·E and the autoregressive-tokens lineage.
