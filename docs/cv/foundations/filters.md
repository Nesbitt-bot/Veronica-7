---
title: Linear Filters & Convolution
order: 2
---

# Linear Filters & Convolution

A linear filter is a small array of weights ("kernel") swept across an image, replacing each pixel with a weighted combination of its neighbourhood. This is the workhorse operation of classical computer vision and the structural template for the convolutional neural network. The two ideas to internalise are **convolution as a linear operator** and the **Fourier-domain interpretation** that makes large kernels practical.

## Convolution and correlation

Given an image $I$ and a kernel $h$, two-dimensional discrete convolution is

$$
(I * h)(x, y) \;=\; \sum_{u, v} I(x - u, y - v)\, h(u, v).
$$

**Cross-correlation** is the same with a sign flip ($I(x+u, y+v)$). Most CV papers and ML libraries call the operation "convolution" but actually compute correlation; the distinction matters when comparing analytical filters and in discussions of equivariance.

Convolution is **linear and translation-equivariant**: the response of $I*h$ at a shifted location is the same as the response of the unshifted image at the original location. This single property is why CNNs work.

## Smoothing: box and Gaussian

The two canonical low-pass filters:

- **Box filter** — uniform $1/(k^2)$ weights over a $k \times k$ window. Cheap (separable, runnable as integral image), but its frequency response has ringing.
- **Gaussian filter** — kernel $G_\sigma(x,y) = \frac{1}{2\pi\sigma^2}\exp(-(x^2+y^2)/2\sigma^2)$. Optimal joint localisation in space and frequency (uncertainty principle), separable into 1D Gaussians, and the unique smoothing kernel for which the [pyramid](./pyramids) construction is mathematically well-posed.

Smoothing is what makes downstream operations (gradients, [edges](./edges-corners), feature detection) numerically sane — derivatives of unsmoothed images are dominated by sensor noise.

## Differentiation: Sobel, Scharr, Laplacian

Image derivatives are computed by convolution with derivative-of-Gaussian or fixed difference kernels:

$$
S_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}, \qquad \nabla^2 \approx \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}.
$$

Sobel/Scharr give first derivatives ($I_x, I_y$); the Laplacian gives the trace of the Hessian. Both feed directly into [edge detection](./edges-corners) and corner detection.

## Frequency-domain view

The Fourier transform diagonalises convolution: $\widehat{I * h} = \hat{I} \cdot \hat{h}$. Two consequences:

1. **Asymptotic complexity** — for a kernel of size $k \times k$ on an $N \times N$ image, direct convolution is $O(N^2 k^2)$ while FFT-based convolution is $O(N^2 \log N)$, independent of $k$. The crossover is around $k = 11$ for typical implementations.
2. **Filter design** — designing a kernel becomes shaping its frequency response. Low-pass (Gaussian, box), high-pass (Laplacian, unsharp mask), and band-pass (DoG, Gabor) filters are all characterised by their amplitude spectrum.

## Non-linear extension: bilateral filter

Linear filters that smooth also blur edges, which is often unwanted. The **bilateral filter** (Tomasi & Manduchi, 1998) makes the kernel weights depend on intensity similarity as well as spatial distance:

$$
I'(p) \;=\; \frac{1}{W_p} \sum_{q \in \Omega} G_{\sigma_s}(\|p - q\|)\, G_{\sigma_r}(|I(p) - I(q)|)\, I(q).
$$

The result is edge-preserving smoothing — the precursor to non-local means, BM3D, and (eventually) attention itself.

## What to read next

- [Edges & Corners](./edges-corners) — the immediate consumer of gradients.
- [Pyramids & Scale-Space](./pyramids) — repeated Gaussian smoothing builds multi-scale representations.
- [Convolution (Deep)](../../dnn/cnn/convolution) — convolution as a learnable layer.
