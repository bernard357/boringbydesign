import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import PostNav from './PostNav.vue'
import PageKeyword from './PageKeyword.vue'
import SiteFooter from './SiteFooter.vue'
import './custom.css'

// Extend the VitePress default theme with the Boring steps identity.
// Keeping the default theme (rather than forking it) means the brand lives
// entirely in custom.css and survives VitePress upgrades. Slots:
//   doc-before    — colored uppercase keyword above the title (PageKeyword)
//   doc-after     — data-driven previous/next bar below a post (PostNav)
//   layout-bottom — two-part site footer (SiteFooter)
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PageKeyword),
      'doc-after': () => h(PostNav),
      'layout-bottom': () => h(SiteFooter),
    })
  },
} satisfies Theme
