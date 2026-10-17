// Derive all raster brand assets from the SVG marks and palette.
// Run with: npm run assets
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'documentation', 'public')

const INK = '#1a2733'
const BG = '#f7f8fa'
const ACCENT = '#1f7a45'
const MUTED = '#5b6b7a'

// Favicons use the solid-fill staircase (favicon-src.svg) so they stay crisp
// and recognizable at 16px, where thin strokes would blur.
const faviconSrc = readFileSync(join(pub, 'favicon-src.svg'))

const pngSizes = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of pngSizes) {
  await sharp(faviconSrc, { density: 512 })
    .resize(size, size, { fit: 'contain', background: BG })
    .png()
    .toFile(join(pub, name))
  console.log(`wrote ${name} (${size}x${size})`)
}

await sharp(faviconSrc, { density: 512 })
  .resize(32, 32, { fit: 'contain', background: BG })
  .toFormat('png')
  .toFile(join(pub, 'favicon.ico'))
console.log('wrote favicon.ico (32x32)')

// Open Graph card: 1200x630, staircase mark on the left (green first step,
// ascending steps outlined), wordmark + tagline as text.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(150,195) scale(7)">
    <rect x="3" y="20" width="8" height="9" rx="1.5" fill="${ACCENT}"/>
    <g fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round">
      <rect x="12" y="13" width="8" height="16" rx="1.5"/>
      <rect x="21" y="6" width="8" height="23" rx="1.5"/>
    </g>
  </g>
  <text x="430" y="300" font-family="Georgia, serif" font-size="84" fill="${INK}">Boring</text>
  <text x="430" y="400" font-family="Georgia, serif" font-size="84" fill="${ACCENT}">steps</text>
  <text x="432" y="470" font-family="system-ui, sans-serif" font-size="30" fill="${MUTED}">Simple, durable systems — built on purpose.</text>
</svg>`
await sharp(Buffer.from(og)).png().toFile(join(pub, 'og-image.png'))
console.log('wrote og-image.png (1200x630)')
