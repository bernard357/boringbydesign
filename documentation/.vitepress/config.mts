import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Boring by design',
  description: 'A blog and book, served statically.',
  // Served from the custom apex domain boringbydesign.org at the root.
  base: '/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Book', link: '/chapter-1' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' },
        ],
      },
      {
        text: 'Book',
        items: [{ text: 'Chapter 1', link: '/chapter-1' }],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bernard357/boringbydesign' },
    ],
  },
})
