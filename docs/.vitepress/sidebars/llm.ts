import type { DefaultTheme } from 'vitepress'

export const llmSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Large Language Models',
    link: '/llm/',
    items: [
      {
        text: 'LLM Basics',
        collapsed: false,
        items: [
          { text: 'Word Embeddings (Word2Vec, fastText)', link: '/llm/basics/word-embeddings' },
          { text: 'The Transformer', link: '/llm/basics/transformer' },
          { text: 'Pre-training (BERT, GPT-2, ELECTRA, BART)', link: '/llm/basics/pretraining' },
          { text: 'Scaling Laws & Emergent Abilities', link: '/llm/basics/scaling-laws' },
          { text: 'Instruction Tuning', link: '/llm/basics/instruction-tuning' }
        ]
      },
      {
        text: 'Reasoning & Post-training',
        collapsed: false,
        items: [
          { text: 'Chain-of-Thought & Inference-Time Scaling', link: '/llm/reasoning/chain-of-thought' },
          { text: 'Latent-Space Reasoning', link: '/llm/reasoning/latent' },
          { text: 'RLHF (InstructGPT, DPO, SimPO)', link: '/llm/reasoning/rlhf' },
          { text: 'RLVR (DeepSeek-R1, DAPO)', link: '/llm/reasoning/rlvr' }
        ]
      },
      {
        text: 'Efficient Methods',
        collapsed: false,
        items: [
          { text: 'Parameter-Efficient Fine-Tuning (LoRA, prompt tuning)', link: '/llm/efficient/peft' },
          { text: 'Efficient RLVR (data & compute)', link: '/llm/efficient/rlvr' },
          { text: 'Efficient Inference (speculative decoding, Medusa, EAGLE)', link: '/llm/efficient/inference' },
          { text: 'Long-Context Models (RoPE, LongNet, RULER)', link: '/llm/efficient/long-context' }
        ]
      },
      {
        text: 'Factuality',
        collapsed: false,
        items: [
          { text: 'Hallucination & Mitigations', link: '/llm/factuality/hallucination' },
          { text: 'Calibration & Uncertainty', link: '/llm/factuality/calibration' }
        ]
      },
      {
        text: 'Applications',
        collapsed: false,
        items: [
          { text: 'Retrieval-Augmented Generation (RAG)', link: '/llm/applications/rag' },
          { text: 'LLM Agents (Toolformer, ToolLLM)', link: '/llm/applications/agents' },
          { text: 'Agentic RAG (Search-R1, Adaptive-RAG)', link: '/llm/applications/agentic-rag' },
          { text: 'Multi-Modal LLMs (CLIP, LLaVA, NExT-GPT)', link: '/llm/applications/multimodal' }
        ]
      },
      {
        text: 'Evaluation',
        collapsed: false,
        items: [
          { text: 'Evaluation of LLMs', link: '/llm/evaluation/eval' },
          { text: 'Detection of LLM-Generated Text', link: '/llm/evaluation/detection' }
        ]
      },
      {
        text: 'Other Topics',
        collapsed: false,
        items: [
          { text: 'Alternative Architectures (MoE, SSM/Mamba, RWKV)', link: '/llm/other/architectures' },
          { text: 'Bias in Language Models', link: '/llm/other/bias' },
          { text: 'Safety & Jailbreaks', link: '/llm/other/safety' }
        ]
      },
      {
        text: 'Continue chronologically',
        items: [{ text: '→ The Transformer Era', link: '/transformer-era/' }]
      }
    ]
  }
]
