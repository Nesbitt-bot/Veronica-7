import type { DefaultTheme } from 'vitepress'

export const cvSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Computer Vision',
    link: '/cv/',
    items: [
      {
        text: 'Foundations',
        collapsed: false,
        items: [
          { text: 'Image Formation & Cameras', link: '/cv/foundations/image-formation' },
          { text: 'Linear Filters & Convolution', link: '/cv/foundations/filters' },
          { text: 'Edge & Corner Detection', link: '/cv/foundations/edges-corners' },
          { text: 'Feature Descriptors (SIFT, ORB)', link: '/cv/foundations/features' },
          { text: 'Image Pyramids & Scale Space', link: '/cv/foundations/pyramids' },
          { text: 'Camera Models & Calibration', link: '/cv/foundations/calibration' },
          { text: 'Two-View Geometry & Stereo', link: '/cv/foundations/stereo' },
          { text: 'Optical Flow', link: '/cv/foundations/optical-flow' }
        ]
      },
      {
        text: 'Deep Vision Architectures',
        collapsed: false,
        items: [
          { text: 'CNN Backbones (VGG → ResNet → EfficientNet)', link: '/cv/deep/cnn-backbones' },
          { text: 'Object Detection (R-CNN family, YOLO, SSD)', link: '/cv/deep/object-detection' },
          { text: 'Semantic Segmentation (FCN, U-Net, DeepLab)', link: '/cv/deep/semantic-segmentation' },
          { text: 'Instance & Panoptic Segmentation (Mask R-CNN)', link: '/cv/deep/instance-segmentation' },
          { text: 'Vision Transformers (ViT, Swin)', link: '/cv/deep/vit' }
        ]
      },
      {
        text: 'Modern Topics',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/cv/advances/' },
          { text: 'Semantic Segmentation', link: '/cv/advances/semantic-segmentation' },
          { text: 'Vision-Language Models', link: '/cv/advances/vision-language' },
          { text: 'Neural Rendering (NeRF, 3DGS)', link: '/cv/advances/neural-rendering' },
          { text: 'Image & Video Generation', link: '/cv/advances/generation' },
          { text: 'Geometric Deep Learning for CV', link: '/cv/advances/geometric' },
          { text: 'Representation Learning', link: '/cv/advances/representation' },
          { text: 'Correspondence & Structure-from-Motion', link: '/cv/advances/sfm' },
          { text: 'Safety, Robustness, Evaluation', link: '/cv/advances/safety' },
          { text: 'Embodied CV & Robotics', link: '/cv/advances/embodied' },
          { text: 'Open-Vocabulary Detection', link: '/cv/advances/open-vocab' }
        ]
      }
    ]
  }
]
