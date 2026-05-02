# Veronica — Content Backlog

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

## Round 3 — Factuality, Applications, Multimodal ✅ done

- [x] `docs/llm/factuality/hallucination.md` — Snowballing, Multiagent
      Debate, Context-Aware Decoding, Bayesian Sequential Detection.
- [x] `docs/llm/factuality/calibration.md` — "Just Ask for Calibration",
      Verbalised Uncertainty, Reward Calibration in RLHF, Grey-Area
      Confidence.
- [x] `docs/llm/applications/rag.md` — Lewis et al. RAG, Knowledge
      Boundary, REPLUG, Self-RAG.
- [x] `docs/llm/applications/agents.md` — Toolformer, ToolLLM, ART,
      A-MEM.
- [x] `docs/llm/applications/agentic-rag.md` — Adaptive-RAG, Auto-RAG,
      Search-o1, Search-R1.
- [x] `docs/llm/applications/multimodal.md` — CLIP, Visual Instruction
      Tuning (LLaVA), NExT-GPT, Object Hallucination in VLMs.

## Round 4 — Evaluation, Architectures, Bias, Safety ✅ done

- [x] `docs/llm/evaluation/eval.md` — Test-set contamination, Code-Eval
      rigour, "LLMs are not Fair Evaluators", HELM.
- [x] `docs/llm/evaluation/detection.md` — DetectGPT, GPT-who,
      Watermarking, GPT-Sentinel.
- [x] `docs/llm/other/architectures.md` — Mixtral / MoE, Mamba (SSD),
      RWKV, Hierarchical Reasoning Model.
- [x] `docs/llm/other/bias.md` — Gender Amplification, Whose Opinions,
      Reference-Letter Bias, Red-Teaming via LMs.
- [x] `docs/llm/other/safety.md` — Multi-step Jailbreak Privacy,
      20-Query Jailbreak, Memorization, Instruction-Tuning Poisoning.

## Round 5 — Computer Vision Modern Topics ✅ done

For each, write a paper-list page using the upstream syllabus topics in
[docs/cv/index.md](docs/cv/index.md). The original CSE5519 reading list
is captured in `scripts/import-notenextra.mjs` if needed for reference.

- [x] `docs/cv/advances/semantic-segmentation.md` — DeepLabv3+, SETR,
      Swin, SegFormer, Mask2Former, SAM, SAM 2, Grounded SAM, etc.
- [x] `docs/cv/advances/vision-language.md` — CLIP, Flamingo, BLIP-1/2,
      LLaVA-1.5, Gemini 1.5, Molmo, ReVisionLLM.
- [x] `docs/cv/advances/neural-rendering.md` — NeRF, Plenoxels, Mip-NeRF
      360, 3DGS, COLMAP-Free 3DGS.
- [x] `docs/cv/advances/generation.md` — AttnGAN, DF-GAN, DALL·E,
      Latent Diffusion, DreamBooth, Sora, Wan.
- [x] `docs/cv/advances/geometric.md` — PoseNet, MeshLoc, DUSt3R,
      Depth Anything, VGGT, Fast3R.
- [x] `docs/cv/advances/representation.md` — SimCLR, MoCo, MAE, JEPA,
      DINOv2, FLAIR.
- [x] `docs/cv/advances/sfm.md` — SfM Revisited, SuperGlue, RAFT,
      LoFTR, LightGlue, MegaSaM.
- [x] `docs/cv/advances/safety.md` — "Object Recognition for Everyone",
      OccamNets, GeoNet, de-biasing T2I.
- [x] `docs/cv/advances/embodied.md` — ViNG, ViKiNG, GNM, NoMaD,
      Navigation World Models.
- [x] `docs/cv/advances/open-vocab.md` — OVR-CNN, MDETR, ViLD, CORA,
      Grounding DINO, OW-OVD, DINO-X.

## Round 6 — Computer Vision Foundations ✅ done

- [x] `docs/cv/foundations/image-formation.md`
- [x] `docs/cv/foundations/filters.md`
- [x] `docs/cv/foundations/edges-corners.md`
- [x] `docs/cv/foundations/features.md`
- [x] `docs/cv/foundations/pyramids.md`
- [x] `docs/cv/foundations/calibration.md`
- [x] `docs/cv/foundations/stereo.md`
- [x] `docs/cv/foundations/optical-flow.md`

## Round 7 — Deep Vision Architectures ✅ done

- [x] `docs/cv/deep/cnn-backbones.md`
- [x] `docs/cv/deep/object-detection.md`
- [x] `docs/cv/deep/semantic-segmentation.md`
- [x] `docs/cv/deep/instance-segmentation.md`
- [x] `docs/cv/deep/vit.md`

## Round 8 — Deep Neural Networks foundations ✅ done

- [x] `docs/dnn/basics/mlp.md`
- [x] `docs/dnn/basics/activations.md`
- [x] `docs/dnn/basics/backpropagation.md`
- [x] `docs/dnn/basics/losses.md`
- [x] `docs/dnn/basics/initialization.md`
- [x] `docs/dnn/optimization/sgd.md`
- [x] `docs/dnn/optimization/adam.md`
- [x] `docs/dnn/optimization/lr-schedules.md`
- [x] `docs/dnn/optimization/second-order.md`
- [x] `docs/dnn/regularization/dropout.md`

## Round 9 — More DNN ✅ done

- [x] `docs/dnn/regularization/normalization.md`
- [x] `docs/dnn/regularization/augmentation.md`
- [x] `docs/dnn/regularization/double-descent.md`
- [x] `docs/dnn/cnn/convolution.md`
- [x] `docs/dnn/cnn/lenet-alexnet.md`
- [x] `docs/dnn/cnn/resnet-family.md`
- [x] `docs/dnn/rnn/vanilla.md`
- [x] `docs/dnn/rnn/lstm-gru.md`
- [x] `docs/dnn/rnn/seq2seq.md`
- [x] `docs/dnn/rnn/bahdanau-attention.md`

## Round 10 — Generative + GNN + RL (DNN) ✅ done

- [x] `docs/dnn/generative/autoencoders.md`
- [x] `docs/dnn/generative/vae.md`
- [x] `docs/dnn/generative/gan.md`
- [x] `docs/dnn/generative/normalizing-flows.md`
- [x] `docs/dnn/generative/pixel-models.md`
- [x] `docs/dnn/gnn/gcn.md`
- [x] `docs/dnn/gnn/message-passing.md`
- [x] `docs/dnn/gnn/gat.md`
- [x] `docs/dnn/rl/index.md`
- [x] `docs/dnn/rl/mdp.md`

## Round 11 — Rest of RL ✅ done

- [x] `docs/dnn/rl/q-learning.md`
- [x] `docs/dnn/rl/policy-gradient.md`
- [x] `docs/dnn/rl/dqn.md`
- [x] `docs/dnn/rl/actor-critic.md`
- [x] `docs/dnn/rl/ppo-trpo.md`
- [x] `docs/dnn/rl/ddpg-sac.md`
- [x] `docs/dnn/rl/world-models.md`
- [x] `docs/dnn/rl/offline-rl.md`
- [x] `docs/dnn/rl/multi-agent.md`

## Round 12 — Fundamentals: math + theory ✅ done

- [x] `docs/fundamentals/math/linear-algebra.md`
- [x] `docs/fundamentals/math/probability.md`
- [x] `docs/fundamentals/math/calculus.md`
- [x] `docs/fundamentals/math/convex-optimization.md`
- [x] `docs/fundamentals/theory/bias-variance.md`
- [x] `docs/fundamentals/theory/cross-validation.md`
- [x] `docs/fundamentals/theory/erm.md`
- [x] `docs/fundamentals/theory/generalization.md`
- [x] `docs/fundamentals/theory/learning-paradigms.md`
- [x] `docs/fundamentals/theory/pac-learning.md`
- [x] `docs/fundamentals/theory/regularization.md`

## Round 13 — Fundamentals: classical + ensembles ✅ done

- [x] `docs/fundamentals/classical/ridge-lasso.md`
- [x] `docs/fundamentals/classical/logistic-regression.md`
- [x] `docs/fundamentals/classical/glm.md`
- [x] `docs/fundamentals/classical/knn.md`
- [x] `docs/fundamentals/classical/naive-bayes.md`
- [x] `docs/fundamentals/classical/lda-qda.md`
- [x] `docs/fundamentals/classical/kernels.md`
- [x] `docs/fundamentals/ensembles/decision-trees.md`
- [x] `docs/fundamentals/ensembles/random-forests.md`
- [x] `docs/fundamentals/ensembles/adaboost.md`
- [x] `docs/fundamentals/ensembles/gradient-boosting.md`

## Round 14 — Fundamentals: unsupervised + probabilistic + history ✅ done

- [x] `docs/fundamentals/unsupervised/kmeans.md`
- [x] `docs/fundamentals/unsupervised/gmm-em.md`
- [x] `docs/fundamentals/unsupervised/hierarchical.md`
- [x] `docs/fundamentals/unsupervised/pca-svd.md`
- [x] `docs/fundamentals/unsupervised/manifold-learning.md`
- [x] `docs/fundamentals/probabilistic/markov-chains.md`
- [x] `docs/fundamentals/probabilistic/hmm.md`
- [x] `docs/fundamentals/probabilistic/bayes-nets.md`
- [x] `docs/fundamentals/probabilistic/crf.md`
- [x] `docs/fundamentals/history/symbolic-ai.md`
- [x] `docs/fundamentals/history/connectionism.md`
- [x] `docs/fundamentals/history/statistical-learning.md`
- [x] `docs/fundamentals/history/kernel-era.md`
- [x] `docs/fundamentals/history/deep-learning-renaissance.md`

## Round 15 — Transformer Era 2017–2019 ✅ done

- [x] `docs/transformer-era/2017/attention-is-all-you-need.md`
- [x] `docs/transformer-era/2017/self-attention.md`
- [x] `docs/transformer-era/2018-2019/bert.md`
- [x] `docs/transformer-era/2018-2019/bert-variants.md`
- [x] `docs/transformer-era/2018-2019/gpt-1.md`
- [x] `docs/transformer-era/2018-2019/gpt-2.md`
- [x] `docs/transformer-era/2018-2019/t5.md`
- [x] `docs/transformer-era/2018-2019/xlnet.md`

## Round 16 — Transformer Era 2020 + 2020-2021 ✅ done

- [x] `docs/transformer-era/2020/gpt-3.md`
- [x] `docs/transformer-era/2020/scaling-laws.md`
- [x] `docs/transformer-era/2020/efficient-attention.md`
- [x] `docs/transformer-era/2020-2021/vit.md`
- [x] `docs/transformer-era/2020-2021/clip.md`
- [x] `docs/transformer-era/2020-2021/dall-e.md`
- [x] `docs/transformer-era/2020-2021/codex.md`

## Round 17 — Transformer Era 2021-2022 + 2022 ✅ done

- [x] `docs/transformer-era/2021-2022/ddpm.md`
- [x] `docs/transformer-era/2021-2022/cfg.md`
- [x] `docs/transformer-era/2021-2022/latent-diffusion.md`
- [x] `docs/transformer-era/2021-2022/dall-e-2-imagen.md`
- [x] `docs/transformer-era/2022/flamingo.md`
- [x] `docs/transformer-era/2022/instructgpt.md`
- [x] `docs/transformer-era/2022/rlhf.md`
- [x] `docs/transformer-era/2022/chatgpt.md`
- [x] `docs/transformer-era/2022/palm-chinchilla.md`
- [x] `docs/transformer-era/2022/whisper.md`

## Round 18 — Transformer Era 2023 + key 2023-2024 architectures ✅ done

- [x] `docs/transformer-era/2023/gpt-4.md`
- [x] `docs/transformer-era/2023/claude.md`
- [x] `docs/transformer-era/2023/constitutional-ai.md`
- [x] `docs/transformer-era/2023/llama.md`
- [x] `docs/transformer-era/2023/mistral.md`
- [x] `docs/transformer-era/2023/open-models.md`
- [x] `docs/transformer-era/2023-2024/mamba.md`
- [x] `docs/transformer-era/2023-2024/moe.md`
- [x] `docs/transformer-era/2023-2024/position-encodings.md`
- [x] `docs/transformer-era/2023-2024/long-context.md`

## Round 19 — Rest of Transformer Era 2023-2024 ✅ done

- [x] `docs/transformer-era/2023-2024/rag.md`
- [x] `docs/transformer-era/2023-2024/react-toolformer.md`
- [x] `docs/transformer-era/2023-2024/tool-use.md`
- [x] `docs/transformer-era/2023-2024/agent-frameworks.md`
- [x] `docs/transformer-era/2023-2024/linear-attention.md`
- [x] `docs/transformer-era/2023-2024/sparse-attention.md`
- [x] `docs/transformer-era/2023-2024/rwkv.md`

## Round 20 — Transformer Era 2024 ✅ done

- [x] `docs/transformer-era/2024/claude-3.md`
- [x] `docs/transformer-era/2024/gemini-1-5.md`
- [x] `docs/transformer-era/2024/gpt-4o.md`
- [x] `docs/transformer-era/2024/llama-3.md`
- [x] `docs/transformer-era/2024/sora.md`

## Round 21 — IN PROGRESS (Transformer Era 2024-2025)

## Remaining rounds

- `docs/transformer-era/2025-2026/**` still have stubs.

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
