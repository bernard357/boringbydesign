import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

// Extend the VitePress default theme with the Boring by design identity.
// Keeping the default theme (rather than forking it) means the brand lives
// entirely in custom.css and survives VitePress upgrades.
export default {
  extends: DefaultTheme,
} satisfies Theme
