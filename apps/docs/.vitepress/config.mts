import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Think & Grow Rich — Docs',
  description:
    'AI-Driven Professional Self-Development Dashboard: architecture, API reference, and guides for the 13 Principles.',
  base: '/Think-and-Grow-Rich/',

  head: [
    ['link', { rel: 'icon', href: '/Think-and-Grow-Rich/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#7c5cfc' }],
  ],

  themeConfig: {
    logo: '◈',
    siteTitle: 'Think & Grow Rich',

    nav: [
      { text: 'Home', link: '/' },
      { text: '13 Principles', link: '/principles/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Contributing', link: '/contributing/' },
      {
        text: 'Dashboard',
        link: 'https://dascient.github.io/Think-and-Grow-Rich/dashboard/',
      },
    ],

    sidebar: {
      '/principles/': [
        {
          text: 'The 13 Steps to Riches',
          items: [
            { text: 'Overview', link: '/principles/' },
            { text: '1. Desire', link: '/principles/01-desire' },
            { text: '2. Faith', link: '/principles/02-faith' },
            { text: '3. Auto-Suggestion', link: '/principles/03-auto-suggestion' },
            { text: '4. Specialized Knowledge', link: '/principles/04-specialized-knowledge' },
            { text: '5. Imagination', link: '/principles/05-imagination' },
            { text: '6. Organized Planning', link: '/principles/06-organized-planning' },
            { text: '7. Decision', link: '/principles/07-decision' },
            { text: '8. Persistence', link: '/principles/08-persistence' },
            { text: '9. Power of the Master Mind', link: '/principles/09-master-mind' },
            { text: '10. Sex Transmutation', link: '/principles/10-sex-transmutation' },
            { text: '11. The Subconscious Mind', link: '/principles/11-subconscious-mind' },
            { text: '12. The Brain', link: '/principles/12-the-brain' },
            { text: '13. The Sixth Sense', link: '/principles/13-sixth-sense' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'System Overview', link: '/architecture/' },
            { text: 'Monorepo Structure', link: '/architecture/monorepo' },
            { text: 'Core Package API', link: '/architecture/core-api' },
            { text: 'TAGR OS Layer', link: '/architecture/tagr-os' },
            { text: 'Dashboard App', link: '/architecture/dashboard' },
          ],
        },
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Getting Started', link: '/contributing/' },
            { text: 'Development Workflow', link: '/contributing/workflow' },
            { text: 'Code Standards', link: '/contributing/standards' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DaScient/Think-and-Grow-Rich' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 DaScient',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/DaScient/Think-and-Grow-Rich/edit/main/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },

  markdown: {
    config(md) {
      // Mermaid diagrams are rendered via the mermaid plugin in the theme
    },
  },
});
