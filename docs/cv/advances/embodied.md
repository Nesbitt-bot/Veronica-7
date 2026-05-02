---
title: Embodied CV & Robotics
order: 9
---

# Embodied CV & Robotics

Embodied vision asks how a moving agent — a robot, drone, or autonomous car — should perceive and navigate the world. The recurring theme in the work below is **using only RGB observations** plus a goal (image, GPS, or geographic intent) to produce actions, without explicit metric maps. This page surveys the line from Berkeley/CMU's ViNG/ViKiNG/GNM/NoMaD models to the latest **navigation world models**.

## ViNG — visual goal-conditioned navigation

*ViNG: Learning Open-World Navigation with Visual Goals* (Shah, Eysenbach, Kahn, Rhinehart, Levine, ICRA 2021) trains a robot to navigate to **goal images** in real outdoor environments. Two networks: a distance regressor that predicts time-to-goal from current observation + goal image, and a topological graph built from collected experience. Planning is shortest-path on the graph using the learned distance. ViNG worked outdoors on a real robot using only RGB.

## ViKiNG — geographic priors

*ViKiNG: Vision-Based Kilometer-Scale Navigation with Geographic Hints* (Shah, Levine, RSS 2022) extends ViNG with **OpenStreetMap-style hints**: the robot is given the same satellite-view map a human would consult. A heuristic policy uses the map to bias subgoal sampling, while the local controller is the same vision-based one. Lets the robot generalise to multi-kilometre routes without ever seeing exact GPS or precise localisation.

## GNM — general navigation model

*GNM: A General Navigation Model to Drive Any Robot* (Shah, Sridhar, Bhorkar, Hirose, Levine, ICRA 2023) trains one policy on data from **six different robots** (ground rovers, quadrupeds, drones), with shared embeddings for visual observations and goal images. The trained model transfers zero-shot to new robots and platforms. The contribution is the demonstration that navigation policies are largely embodiment-invariant when conditioned on the right abstractions.

## NoMaD — diffusion policies for navigation

*NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration* (Sridhar, Shah, Glossop, Levine, ICRA 2024) replaces the deterministic action head with a **diffusion model** over future action sequences, with the goal optionally masked at training time. Masking lets the same model serve both **goal-directed navigation** (goal image given) and **exploration** (no goal, model samples plausible motion). Diffusion captures multi-modal action distributions where a deterministic head averages incompatible options.

## Navigation world models

Recent work (e.g., *Navigation World Models*, Cho et al., 2024) treats navigation as **rollouts in a learned world model** — a video-prediction or 3D-scene-prediction network that imagines what the future looks like under candidate actions. The agent picks actions that lead to imagined frames close to the goal. This is the convergence of embodied CV with the broader [generation](./generation) and world-models literature: the world model is, structurally, a latent video diffusion model.

## Reading list

- *ViNG: Learning Open-World Navigation with Visual Goals* — Shah, Eysenbach, Kahn, Rhinehart, Levine, ICRA 2021.
- *ViKiNG: Vision-Based Kilometer-Scale Navigation with Geographic Hints* — Shah, Levine, RSS 2022.
- *GNM: A General Navigation Model to Drive Any Robot* — Shah, Sridhar, Bhorkar, Hirose, Levine, ICRA 2023.
- *NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration* — Sridhar, Shah, Glossop, Levine, ICRA 2024.
- *Navigation World Models* — recent work on imagination-based navigation policies.

## What to read next

- [Image and Video Generation](./generation) — the world-model substrate.
- [Geometric Computer Vision](./geometric) — DUSt3R / Depth Anything provide the perception layer many of these systems use.
- [Vision-Language Models](./vision-language) — language-conditioned navigation is the next step.
