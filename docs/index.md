---
layout: home

hero:
  name: Project Lavender
  text: Undergraduate ML → SOTA
  tagline: A continuing project of NoteNextra. Bridging the gap from foundational machine learning to state-of-the-art research, one carefully ordered article at a time.
  actions:
    - theme: brand
      text: Start with Fundamentals
      link: /fundamentals/
    - theme: alt
      text: Jump to The Transformer Era
      link: /transformer-era/
    - theme: alt
      text: View on GitHub
      link: https://github.com/wuzheyuan/Lavender-1

features:
  - title: Fundamentals & History
    details: From OLS and SVMs to information theory — the mathematical and statistical groundwork that every modern model still rests on.
    link: /fundamentals/
    linkText: Open the basics
  - title: Deep Neural Networks
    details: MLPs, CNNs, RNNs, generative models, and reinforcement learning — the architectures that powered the 2012–2017 deep learning era.
    link: /dnn/
    linkText: Read the architectures
  - title: Computer Vision
    details: Imported from CSE559A and CSE5519 — image formation, ViTs, NeRF, 3D Gaussian Splatting, and open-vocabulary detection.
    link: /cv/
    linkText: Browse vision papers
  - title: Large Language Models
    details: Tokenization, embeddings, scaling laws, and the conceptual scaffolding behind modern LLMs.
    link: /llm/
    linkText: Open the LLM track
  - title: The Transformer Era (2017→)
    details: Chronological walk-through of the post-Transformer era — from "Attention Is All You Need" to today's reasoning and agentic models.
    link: /transformer-era/
    linkText: Walk the timeline
---

## Why Lavender?

> Our goal is to bridge the gap for undergraduates from machine-learning lessons to SOTA.
>
> This is a continuing project of [NoteNextra](https://github.com/Trance-0/NoteNextra).

Project Lavender re-organizes scattered course notes — primarily from the WashU CSE/Math sequence — into a single, topologically ordered curriculum. Earlier articles never assume material that hasn't been introduced yet, so a curious undergraduate can read top-to-bottom and arrive at the frontier.

## How the curriculum is ordered

```
Fundamentals & History  ──► Deep Neural Networks ──► Computer Vision
                                  │                       │
                                  ├──────────► Large Language Models
                                  │                       │
                                  └────► The Transformer Era (2017 → present)
```

Each section's sidebar is a topological sort of its prerequisites; the **Transformer Era** track is sorted chronologically, year by year.

## Acknowledgments

Source material is imported and adapted from [Trance-0/NoteNextra](https://github.com/Trance-0/NoteNextra) under its original license. Each imported page links back to the upstream lecture.
