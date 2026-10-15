import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import PostNav from './PostNav.vue'
import './custom.css'

// Extend the VitePress default theme with the Boring by design identity.
// Keeping the default theme (rather than forking it) means the brand lives
// entirely in custom.css and survives VitePress upgrades. The doc-after slot
// adds the data-driven previous/next bar below every post body; PostNav
// renders nothing on non-post pages.
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(PostNav),
    })
  },
} satisfies Theme
