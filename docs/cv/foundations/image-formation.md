---
title: Image Formation & Cameras
order: 1
---

# Image Formation & Cameras

An image is the result of light reflecting off scene surfaces, traveling through a lens, and being sampled by a 2D sensor. Computer vision starts from the geometry and radiometry of that process — the mapping from a 3D world point to a pixel intensity. Every later module (calibration, stereo, SfM) reads off this model.

## Pinhole projection

The simplest camera is the **pinhole**: a single small aperture and a planar image sensor at focal distance $f$ behind it. A 3D point $\mathbf{X} = (X, Y, Z)$ in the camera frame projects to the image plane via similar triangles:

$$
x = f\,\frac{X}{Z}, \qquad y = f\,\frac{Y}{Z}.
$$

In homogeneous coordinates this is a linear map. Stacked with intrinsics (focal length, principal point, pixel scaling) and extrinsics (rotation $R$, translation $\mathbf{t}$), the full projection is the **camera matrix** $P = K\,[R \mid \mathbf{t}]$ giving $\mathbf{x} \sim P\mathbf{X}$.

The pinhole model is the working substrate of nearly all multi-view geometry — it is exactly invertible up to depth and the source of every "lift a 2D point to a 3D ray" operation.

## Intrinsic and extrinsic parameters

- **Intrinsics** $K$ — focal lengths $(f_x, f_y)$, principal point $(c_x, c_y)$, optionally a skew term. They depend only on the camera body + lens combination.
- **Extrinsics** $(R, \mathbf{t})$ — the rigid transform from world coordinates into the camera's coordinate frame.

$$
K = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}, \qquad P = K \begin{bmatrix} R & \mathbf{t} \end{bmatrix}.
$$

Intrinsics are recovered by [calibration](./calibration); extrinsics are estimated per-image during pose estimation, SLAM, or [SfM](../advances/sfm).

## Lens distortion

Real lenses deviate from the pinhole. The two dominant components are **radial distortion** (barrel/pincushion warping that depends on distance from the optical centre) and **tangential distortion** (slight lens decentering). The Brown–Conrady model is the standard:

$$
\begin{aligned}
x_d &= x\,(1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + 2 p_1 x y + p_2 (r^2 + 2 x^2), \\
y_d &= y\,(1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + p_1 (r^2 + 2 y^2) + 2 p_2 x y,
\end{aligned}
$$

with $r^2 = x^2 + y^2$. Modelling and **undistorting** images is a prerequisite for any geometry-based downstream task.

## Radiometry: how intensity is formed

Pixel value depends on the irradiance hitting the sensor, which depends on scene radiance, surface BRDF, lighting, exposure, lens vignetting, and sensor response. The simplest reasonable model is the **image irradiance equation**

$$
E \;=\; L \cdot \frac{\pi}{4} \left(\frac{d}{f}\right)^2 \cos^4\alpha,
$$

where $L$ is scene radiance, $d$ is aperture diameter, $f$ is focal length, and $\alpha$ is the angle from the optical axis. The $\cos^4$ term is the natural source of **vignetting** (darker corners). Beyond geometry, sensors apply gamma correction and quantisation, which is what classical and learned methods alike must remain robust to.

## What to read next

- [Filters & Convolution](./filters) — the next layer of the foundations stack: how images are smoothed, sharpened, and differentiated.
- [Camera Calibration](./calibration) — recovering $K$ and the distortion coefficients from images of known patterns.
- [Stereo & Multi-view](./stereo) — projecting a single point with two cameras to recover depth.
