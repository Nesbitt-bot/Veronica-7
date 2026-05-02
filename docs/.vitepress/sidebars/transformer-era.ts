import type { DefaultTheme } from 'vitepress'

export const transformerEraSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'The Transformer Era',
    link: '/transformer-era/',
    items: [
      {
        text: '2017 — The Attention Revolution',
        collapsed: false,
        items: [
          { text: '“Attention Is All You Need”', link: '/transformer-era/2017/attention-is-all-you-need' },
          { text: 'Self-Attention, Multi-Head, Positional Encodings', link: '/transformer-era/2017/self-attention' }
        ]
      },
      {
        text: '2018–2019 — The Pretraining Era',
        collapsed: false,
        items: [
          { text: 'GPT-1: Generative Pretraining', link: '/transformer-era/2018-2019/gpt-1' },
          { text: 'BERT: Bidirectional Pretraining', link: '/transformer-era/2018-2019/bert' },
          { text: 'GPT-2: Zero-Shot Surprises', link: '/transformer-era/2018-2019/gpt-2' },
          { text: 'RoBERTa, ALBERT, ELECTRA', link: '/transformer-era/2018-2019/bert-variants' },
          { text: 'T5 & Text-to-Text Framework', link: '/transformer-era/2018-2019/t5' },
          { text: 'XLNet, Transformer-XL', link: '/transformer-era/2018-2019/xlnet' }
        ]
      },
      {
        text: '2020 — Scaling & Few-Shot',
        collapsed: false,
        items: [
          { text: 'GPT-3 & In-Context Learning', link: '/transformer-era/2020/gpt-3' },
          { text: 'Kaplan Scaling Laws', link: '/transformer-era/2020/scaling-laws' },
          { text: 'Linformer, Performer, Reformer (efficient attention)', link: '/transformer-era/2020/efficient-attention' }
        ]
      },
      {
        text: '2020–2021 — Multimodal Foundations',
        collapsed: false,
        items: [
          { text: 'Vision Transformer (ViT)', link: '/transformer-era/2020-2021/vit' },
          { text: 'CLIP: Contrastive Image–Text Pretraining', link: '/transformer-era/2020-2021/clip' },
          { text: 'DALL·E 1', link: '/transformer-era/2020-2021/dall-e' },
          { text: 'Codex & Copilot', link: '/transformer-era/2020-2021/codex' }
        ]
      },
      {
        text: '2021–2022 — The Diffusion Renaissance',
        collapsed: false,
        items: [
          { text: 'DDPM & Score-Based Models', link: '/transformer-era/2021-2022/ddpm' },
          { text: 'Latent Diffusion / Stable Diffusion', link: '/transformer-era/2021-2022/latent-diffusion' },
          { text: 'GLIDE, DALL·E 2, Imagen', link: '/transformer-era/2021-2022/dall-e-2-imagen' },
          { text: 'Classifier-Free Guidance', link: '/transformer-era/2021-2022/cfg' }
        ]
      },
      {
        text: '2022 — Instruction Tuning & RLHF',
        collapsed: false,
        items: [
          { text: 'InstructGPT', link: '/transformer-era/2022/instructgpt' },
          { text: 'RLHF: Reward Models & PPO', link: '/transformer-era/2022/rlhf' },
          { text: 'ChatGPT (Nov 2022)', link: '/transformer-era/2022/chatgpt' },
          { text: 'PaLM, Chinchilla, Gopher', link: '/transformer-era/2022/palm-chinchilla' },
          { text: 'Whisper & Speech', link: '/transformer-era/2022/whisper' },
          { text: 'Flamingo & Multimodal LMs', link: '/transformer-era/2022/flamingo' }
        ]
      },
      {
        text: '2023 — The Open LLM Wave',
        collapsed: false,
        items: [
          { text: 'GPT-4', link: '/transformer-era/2023/gpt-4' },
          { text: 'LLaMA 1 & 2', link: '/transformer-era/2023/llama' },
          { text: 'Mistral & Mixtral (MoE)', link: '/transformer-era/2023/mistral' },
          { text: 'Falcon, MPT, Yi', link: '/transformer-era/2023/open-models' },
          { text: 'Anthropic Claude (1, 2)', link: '/transformer-era/2023/claude' },
          { text: 'Constitutional AI', link: '/transformer-era/2023/constitutional-ai' }
        ]
      },
      {
        text: '2023–2024 — Tool Use, RAG & Agents',
        collapsed: false,
        items: [
          { text: 'Retrieval-Augmented Generation (RAG)', link: '/transformer-era/2023-2024/rag' },
          { text: 'Tool Use & Function Calling', link: '/transformer-era/2023-2024/tool-use' },
          { text: 'ReAct & Toolformer', link: '/transformer-era/2023-2024/react-toolformer' },
          { text: 'Agent Frameworks (AutoGPT, LangGraph, CrewAI)', link: '/transformer-era/2023-2024/agent-frameworks' }
        ]
      },
      {
        text: '2023–2024 — Long Context & MoE',
        collapsed: true,
        items: [
          { text: 'Sliding-Window & Sparse Attention', link: '/transformer-era/2023-2024/sparse-attention' },
          { text: 'RoPE, ALiBi & Position Extension', link: '/transformer-era/2023-2024/position-encodings' },
          { text: 'Mixture of Experts (Switch, Mixtral, DeepSeek-MoE)', link: '/transformer-era/2023-2024/moe' },
          { text: 'Long-Context (1M+ tokens)', link: '/transformer-era/2023-2024/long-context' }
        ]
      },
      {
        text: '2023–2024 — Alternatives to Attention',
        collapsed: true,
        items: [
          { text: 'State Space Models (S4, Mamba)', link: '/transformer-era/2023-2024/mamba' },
          { text: 'RWKV', link: '/transformer-era/2023-2024/rwkv' },
          { text: 'Hyena, RetNet, Linear Attention', link: '/transformer-era/2023-2024/linear-attention' }
        ]
      },
      {
        text: '2024 — Omni & Multimodal Frontier',
        collapsed: false,
        items: [
          { text: 'GPT-4o (omni)', link: '/transformer-era/2024/gpt-4o' },
          { text: 'Claude 3 Family', link: '/transformer-era/2024/claude-3' },
          { text: 'Gemini 1.5 (Long Context)', link: '/transformer-era/2024/gemini-1-5' },
          { text: 'LLaMA 3', link: '/transformer-era/2024/llama-3' },
          { text: 'Sora — Video Generation', link: '/transformer-era/2024/sora' }
        ]
      },
      {
        text: '2024–2025 — Reasoning Models',
        collapsed: false,
        items: [
          { text: 'OpenAI o1 & Test-Time Compute', link: '/transformer-era/2024-2025/o1' },
          { text: 'DeepSeek-R1 & Open Reasoning Models', link: '/transformer-era/2024-2025/r1' },
          { text: 'Process Reward Models', link: '/transformer-era/2024-2025/process-rewards' },
          { text: 'Deep Research & Agentic Search', link: '/transformer-era/2024-2025/deep-research' }
        ]
      },
      {
        text: '2024–2025 — Video & 3D Generation',
        collapsed: true,
        items: [
          { text: 'Sora, Veo, Wan', link: '/transformer-era/2024-2025/video-generation' },
          { text: '3D Gaussian Splatting & Beyond', link: '/transformer-era/2024-2025/3d-generation' }
        ]
      },
      {
        text: '2025–2026 — Agentic Systems',
        collapsed: false,
        items: [
          { text: 'Computer Use & Browser Agents', link: '/transformer-era/2025-2026/computer-use' },
          { text: 'Coding Agents (Claude Code, Codex CLI)', link: '/transformer-era/2025-2026/coding-agents' },
          { text: 'Long-Horizon Planning & Memory', link: '/transformer-era/2025-2026/long-horizon' },
          { text: 'Frontier Models (Claude 4.x, GPT-5, Gemini 2.x)', link: '/transformer-era/2025-2026/frontier-models' },
          { text: 'Alignment & Safety in 2026', link: '/transformer-era/2025-2026/alignment' }
        ]
      }
    ]
  }
]
