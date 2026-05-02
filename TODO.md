# Lavender — Content Backlog

This file is the **work queue** for filling out stub pages. Each round, an
agent should pick the next batch (5–10 pages), seed each one with the
template below, then mark them done here.

> **Resume command:** `Continue working on TODO.md`

## How to fill a stub

1. `Read` the stub at the path listed.
2. Replace its body with content following the template:
   - Frontmatter: `title:` and a numeric `order:` (matching the sidebar
     order — start at 1 for the first item in the group). **Remove the
     `stub: true` flag** so the safe-`--force` regenerator won't clobber.
   - One H1 (`# Title`) matching the title.
   - 2–4 sentence intro framing the topic.
   - Sections (with `##`) covering the core ideas.
   - Math via `$...$` and `$$...$$` (MathJax 3 is enabled).
   - A **Reading list** section listing each paper from the syllabus
     entry, formatted: `*Title* — Authors, Venue Year (short tag).`
   - A **What to read next** section linking to neighbouring sidebar
     entries with relative links.
3. Cross-reference related pages where helpful.
4. Don't add empty "future work" comments; if a sub-topic isn't filled
   yet, link to its stub.

Reference seeded examples: `docs/llm/basics/transformer.md`,
`docs/llm/basics/scaling-laws.md`, `docs/llm/reasoning/rlhf.md`.

## Round 2 — Reasoning & Efficiency ✅ done

- [x] `docs/llm/reasoning/latent.md`
- [x] `docs/llm/reasoning/rlvr.md`
- [x] `docs/llm/efficient/peft.md`
- [x] `docs/llm/efficient/rlvr.md`
- [x] `docs/llm/efficient/inference.md`
- [x] `docs/llm/efficient/long-context.md`

## Round 3 — Factuality, Applications, Multimodal

- [ ] `docs/llm/factuality/hallucination.md` — Snowballing, Multiagent
      Debate, Context-Aware Decoding, Bayesian Sequential Detection.
- [ ] `docs/llm/factuality/calibration.md` — "Just Ask for Calibration",
      Verbalised Uncertainty, Reward Calibration in RLHF, Grey-Area
      Confidence.
- [ ] `docs/llm/applications/rag.md` — Lewis et al. RAG, Knowledge
      Boundary, REPLUG, Self-RAG.
- [ ] `docs/llm/applications/agents.md` — Toolformer, ToolLLM, ART,
      A-MEM.
- [ ] `docs/llm/applications/agentic-rag.md` — Adaptive-RAG, Auto-RAG,
      Search-o1, Search-R1.
- [ ] `docs/llm/applications/multimodal.md` — CLIP, Visual Instruction
      Tuning (LLaVA), NExT-GPT, Object Hallucination in VLMs.

## Round 4 — Evaluation, Architectures, Bias, Safety

- [ ] `docs/llm/evaluation/eval.md` — Test-set contamination, Code-Eval
      rigour, "LLMs are not Fair Evaluators", HELM.
- [ ] `docs/llm/evaluation/detection.md` — DetectGPT, GPT-who,
      Watermarking, GPT-Sentinel.
- [ ] `docs/llm/other/architectures.md` — Mixtral / MoE, Mamba (SSD),
      RWKV, Hierarchical Reasoning Model.
- [ ] `docs/llm/other/bias.md` — Gender Amplification, Whose Opinions,
      Reference-Letter Bias, Red-Teaming via LMs.
- [ ] `docs/llm/other/safety.md` — Multi-step Jailbreak Privacy,
      20-Query Jailbreak, Memorization, Instruction-Tuning Poisoning.

## Round 5 — Computer Vision Modern Topics

For each, write a paper-list page using the upstream syllabus topics in
[docs/cv/index.md](docs/cv/index.md). The original CSE5519 reading list
is captured in `scripts/import-notenextra.mjs` if needed for reference.

- [ ] `docs/cv/advances/semantic-segmentation.md` — DeepLabv3+, SETR,
      Swin, SegFormer, Mask2Former, SAM, SAM 2, Grounded SAM, etc.
- [ ] `docs/cv/advances/vision-language.md` — CLIP, Flamingo, BLIP-1/2,
      LLaVA-1.5, Gemini 1.5, Molmo, ReVisionLLM.
- [ ] `docs/cv/advances/neural-rendering.md` — NeRF, Plenoxels, Mip-NeRF
      360, 3DGS, COLMAP-Free 3DGS.
- [ ] `docs/cv/advances/generation.md` — AttnGAN, DF-GAN, DALL·E,
      Latent Diffusion, DreamBooth, Sora, Wan.
- [ ] `docs/cv/advances/geometric.md` — PoseNet, MeshLoc, DUSt3R,
      Depth Anything, VGGT, Fast3R.
- [ ] `docs/cv/advances/representation.md` — SimCLR, MoCo, MAE, JEPA,
      DINOv2, FLAIR.
- [ ] `docs/cv/advances/sfm.md` — SfM Revisited, SuperGlue, RAFT,
      LoFTR, LightGlue, MegaSaM.
- [ ] `docs/cv/advances/safety.md` — "Object Recognition for Everyone",
      OccamNets, GeoNet, de-biasing T2I.
- [ ] `docs/cv/advances/embodied.md` — ViNG, ViKiNG, GNM, NoMaD,
      Navigation World Models.
- [ ] `docs/cv/advances/open-vocab.md` — OVR-CNN, MDETR, ViLD, CORA,
      Grounding DINO, OW-OVD, DINO-X.

## Round 6 — Computer Vision Foundations

Each is currently a one-line stub.

- [ ] `docs/cv/foundations/image-formation.md`
- [ ] `docs/cv/foundations/filters.md`
- [ ] `docs/cv/foundations/edges-corners.md`
- [ ] `docs/cv/foundations/features.md`
- [ ] `docs/cv/foundations/pyramids.md`
- [ ] `docs/cv/foundations/calibration.md`
- [ ] `docs/cv/foundations/stereo.md`
- [ ] `docs/cv/foundations/optical-flow.md`

## Round 7 — Deep Vision Architectures

- [ ] `docs/cv/deep/cnn-backbones.md`
- [ ] `docs/cv/deep/object-detection.md`
- [ ] `docs/cv/deep/semantic-segmentation.md`
- [ ] `docs/cv/deep/instance-segmentation.md`
- [ ] `docs/cv/deep/vit.md`

## Round 8 — Deep Neural Networks foundations

- [ ] `docs/dnn/basics/mlp.md`
- [ ] `docs/dnn/basics/activations.md`
- [ ] `docs/dnn/basics/backpropagation.md`
- [ ] `docs/dnn/basics/losses.md`
- [ ] `docs/dnn/basics/initialization.md`
- [ ] `docs/dnn/optimization/sgd.md`
- [ ] `docs/dnn/optimization/adam.md`
- [ ] `docs/dnn/optimization/lr-schedules.md`
- [ ] `docs/dnn/optimization/second-order.md`
- [ ] `docs/dnn/regularization/dropout.md`

## Round 9 — More DNN

- [ ] `docs/dnn/regularization/normalization.md`
- [ ] `docs/dnn/regularization/augmentation.md`
- [ ] `docs/dnn/regularization/double-descent.md`
- [ ] `docs/dnn/cnn/convolution.md`
- [ ] `docs/dnn/cnn/lenet-alexnet.md`
- [ ] `docs/dnn/cnn/resnet-family.md`
- [ ] `docs/dnn/rnn/vanilla.md`
- [ ] `docs/dnn/rnn/lstm-gru.md`
- [ ] `docs/dnn/rnn/seq2seq.md`
- [ ] `docs/dnn/rnn/bahdanau-attention.md`

## Round 10 — Generative + GNN + RL (DNN)

- [ ] `docs/dnn/generative/autoencoders.md`
- [ ] `docs/dnn/generative/vae.md`
- [ ] `docs/dnn/generative/gan.md`
- [ ] `docs/dnn/generative/normalizing-flows.md`
- [ ] `docs/dnn/generative/pixel-models.md`
- [ ] `docs/dnn/gnn/gcn.md`
- [ ] `docs/dnn/gnn/message-passing.md`
- [ ] `docs/dnn/gnn/gat.md`
- [ ] `docs/dnn/rl/index.md`
- [ ] `docs/dnn/rl/mdp.md`

## Round 11 — Rest of RL

- [ ] `docs/dnn/rl/q-learning.md`
- [ ] `docs/dnn/rl/policy-gradient.md`
- [ ] `docs/dnn/rl/dqn.md`
- [ ] `docs/dnn/rl/actor-critic.md`
- [ ] `docs/dnn/rl/ppo-trpo.md`
- [ ] `docs/dnn/rl/ddpg-sac.md`
- [ ] `docs/dnn/rl/world-models.md`
- [ ] `docs/dnn/rl/offline-rl.md`
- [ ] `docs/dnn/rl/multi-agent.md`

## Round 12+ — Fundamentals & Transformer Era

The Fundamentals & History section and the chronological Transformer Era
section both still have many stubs. Continue from these lists in
subsequent rounds (groups of 5–10 each):

- `docs/fundamentals/math/linear-algebra.md`,
  `probability.md`, `calculus.md`, `convex-optimization.md`
- `docs/fundamentals/theory/*` (7 stubs)
- `docs/fundamentals/classical/*` — already seeded: ols, svm, perceptron.
  Remaining: ridge-lasso, logistic-regression, glm, knn, naive-bayes,
  lda-qda, kernels.
- `docs/fundamentals/ensembles/*` (4 stubs)
- `docs/fundamentals/unsupervised/*` (5 stubs)
- `docs/fundamentals/probabilistic/*` (4 stubs)
- `docs/fundamentals/history/*` (5 stubs)
- `docs/transformer-era/**` — every year folder still has stubs (~50
  pages). Order chronologically.

## Round-completion checklist

After each round:

1. `npm run docs:build` — must build cleanly.
2. Tick the boxes above.
3. Update the **first incomplete round header** to "## Round N — IN
   PROGRESS" while working; back to its title once finished.

## Already done (Round 1)

- ✅ Site scaffold, Cloudflare Pages config, import + stub-generator
  scripts.
- ✅ Topic-pure sidebar restructure (course codes removed).
- ✅ Hand-written section landings: `index.md`, `fundamentals/index.md`,
  `dnn/index.md`, `cv/index.md`, `llm/index.md`, `transformer-era/index.md`.
- ✅ Seed content (Fundamentals): `classical/ols.md`, `classical/svm.md`,
  `classical/perceptron.md`, `math/information-theory.md`.
- ✅ Seed content (LLM): `basics/word-embeddings.md`,
  `basics/transformer.md`, `basics/pretraining.md`,
  `basics/scaling-laws.md`, `basics/instruction-tuning.md`,
  `reasoning/chain-of-thought.md`, `reasoning/rlhf.md`.
