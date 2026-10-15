import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Boring steps',
  description: 'A blog and book, served statically.',
  // Served from the custom apex domain boringsteps.org at the root.
  base: '/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#2563a8' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Boring steps' }],
    ['meta', { property: 'og:description', content: 'A blog and book about building simple, durable systems on purpose.' }],
    ['meta', { property: 'og:url', content: 'https://boringsteps.org/' }],
    ['meta', { property: 'og:image', content: 'https://boringsteps.org/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Boring steps' }],
    ['meta', { name: 'twitter:description', content: 'A blog and book about building simple, durable systems on purpose.' }],
    ['meta', { name: 'twitter:image', content: 'https://boringsteps.org/og-image.png' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Boring steps', href: '/atom.xml' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { light: '/logo.svg', dark: '/logo-dark.svg', alt: 'Boring steps' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'History', link: '/history' },
      { text: 'About', link: '/about' },
    ],
    // No sidebar for now — posts are flat and independent. When enough
    // material accumulates, add an ordered sidebar grouping here to turn
    // the blog into a book without moving any files.
    sidebar: false,
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bernard357/boringsteps' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9h2.5A11.5 11.5 0 0 0 4 8.5V11zm0 4a5 5 0 0 1 5 5h2.5A7.5 7.5 0 0 0 4 12.5V15zm1.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
        },
        link: '/atom.xml',
        ariaLabel: 'Atom feed',
      },
    ],
  },
})
