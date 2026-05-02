import type { DefaultTheme } from 'vitepress'

export const dnnSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Deep Neural Networks',
    link: '/dnn/',
    items: [
      {
        text: 'Building Blocks',
        collapsed: false,
        items: [
          { text: 'From Perceptron to MLP', link: '/dnn/basics/mlp' },
          { text: 'Activation Functions', link: '/dnn/basics/activations' },
          { text: 'Backpropagation', link: '/dnn/basics/backpropagation' },
          { text: 'Loss Functions', link: '/dnn/basics/losses' },
          { text: 'Weight Initialization', link: '/dnn/basics/initialization' }
        ]
      },
      {
        text: 'Optimization',
        collapsed: false,
        items: [
          { text: 'SGD, Momentum, Nesterov', link: '/dnn/optimization/sgd' },
          { text: 'Adam, AdamW, RMSProp', link: '/dnn/optimization/adam' },
          { text: 'Learning Rate Schedules', link: '/dnn/optimization/lr-schedules' },
          { text: 'Second-Order & Natural Gradient', link: '/dnn/optimization/second-order' }
        ]
      },
      {
        text: 'Regularization & Generalization',
        collapsed: false,
        items: [
          { text: 'Dropout', link: '/dnn/regularization/dropout' },
          { text: 'Batch / Layer / Group Normalization', link: '/dnn/regularization/normalization' },
          { text: 'Data Augmentation', link: '/dnn/regularization/augmentation' },
          { text: 'Double Descent & Implicit Bias', link: '/dnn/regularization/double-descent' }
        ]
      },
      {
        text: 'Convolutional Networks',
        collapsed: false,
        items: [
          { text: 'Convolution & Pooling', link: '/dnn/cnn/convolution' },
          { text: 'LeNet & AlexNet', link: '/dnn/cnn/lenet-alexnet' },
          { text: 'VGG, Inception, ResNet', link: '/dnn/cnn/resnet-family' }
        ]
      },
      {
        text: 'Recurrent & Sequence Models',
        collapsed: true,
        items: [
          { text: 'Vanilla RNNs', link: '/dnn/rnn/vanilla' },
          { text: 'LSTM & GRU', link: '/dnn/rnn/lstm-gru' },
          { text: 'Encoder–Decoder & Seq2Seq', link: '/dnn/rnn/seq2seq' },
          { text: 'Bahdanau Attention (pre-Transformer)', link: '/dnn/rnn/bahdanau-attention' }
        ]
      },
      {
        text: 'Generative Models (Pre-Diffusion)',
        collapsed: true,
        items: [
          { text: 'Autoencoders & Denoising AEs', link: '/dnn/generative/autoencoders' },
          { text: 'Variational Autoencoders (VAE)', link: '/dnn/generative/vae' },
          { text: 'Generative Adversarial Networks (GAN)', link: '/dnn/generative/gan' },
          { text: 'Normalizing Flows', link: '/dnn/generative/normalizing-flows' },
          { text: 'PixelRNN / PixelCNN', link: '/dnn/generative/pixel-models' }
        ]
      },
      {
        text: 'Graph Neural Networks',
        collapsed: true,
        items: [
          { text: 'Graph Convolutional Networks', link: '/dnn/gnn/gcn' },
          { text: 'Message Passing & GraphSAGE', link: '/dnn/gnn/message-passing' },
          { text: 'Graph Attention Networks (GAT)', link: '/dnn/gnn/gat' }
        ]
      },
      {
        text: 'Reinforcement Learning',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/dnn/rl/' },
          { text: 'MDPs & Bellman Equations', link: '/dnn/rl/mdp' },
          { text: 'Tabular Q-Learning & SARSA', link: '/dnn/rl/q-learning' },
          { text: 'Policy Gradient & REINFORCE', link: '/dnn/rl/policy-gradient' },
          { text: 'Deep Q-Networks (DQN)', link: '/dnn/rl/dqn' },
          { text: 'Actor–Critic, A2C, A3C', link: '/dnn/rl/actor-critic' },
          { text: 'PPO & TRPO', link: '/dnn/rl/ppo-trpo' },
          { text: 'DDPG, TD3, SAC', link: '/dnn/rl/ddpg-sac' },
          { text: 'Model-Based RL & World Models', link: '/dnn/rl/world-models' },
          { text: 'Offline RL', link: '/dnn/rl/offline-rl' },
          { text: 'Multi-Agent RL', link: '/dnn/rl/multi-agent' }
        ]
      }
    ]
  }
]
