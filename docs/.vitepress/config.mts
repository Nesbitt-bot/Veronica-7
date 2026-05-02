import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

import { fundamentalsSidebar } from './sidebars/fundamentals'
import { dnnSidebar } from './sidebars/dnn'
import { cvSidebar } from './sidebars/cv'
import { llmSidebar } from './sidebars/llm'
import { transformerEraSidebar } from './sidebars/transformer-era'

export default defineConfig({
  title: 'Project Lavender',
  description:
    'Bridging undergraduate machine learning education to state-of-the-art research. A continuation of NoteNextra.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#9b7ad6' }]
  ],

  markdown: {
    math: true,
    lineNumbers: true,
    config: (md) => {
      md.use(mathjax3)
    }
  },

  themeConfig: {
    siteTitle: 'Lavender',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Curriculum',
        items: [
          { text: 'Fundamentals & History', link: '/fundamentals/' },
          { text: 'Deep Neural Networks', link: '/dnn/' },
          { text: 'Computer Vision', link: '/cv/' },
          { text: 'Large Language Models', link: '/llm/' },
          { text: 'The Transformer Era', link: '/transformer-era/' }
        ]
      },
      { text: 'About', link: '/about' },
      { text: 'NoteNextra', link: 'https://github.com/Trance-0/NoteNextra' }
    ],

    sidebar: {
      '/fundamentals/': fundamentalsSidebar,
      '/dnn/': dnnSidebar,
      '/cv/': cvSidebar,
      '/llm/': llmSidebar,
      '/transformer-era/': transformerEraSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wuzheyuan/Lavender-1' }
    ],

    footer: {
      message:
        'Released under the MIT License. Content imported and adapted from <a href="https://github.com/Trance-0/NoteNextra">NoteNextra</a>.',
      copyright: 'Copyright © 2025–present Project Lavender contributors'
    },

    search: { provider: 'local' },

    outline: { level: [2, 3] },

    editLink: {
      pattern:
        'https://github.com/wuzheyuan/Lavender-1/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
