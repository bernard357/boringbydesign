// Derive all raster brand assets from the SVG mark and palette.
// Run with: npm run assets
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'documentation', 'public')

const INK = '#1a2733'
const BG = '#f7f8fa'
const ACCENT = '#2563a8'

const logo = readFileSync(join(pub, 'logo.svg'))

// Favicon and touch-icon sizes, all rendered from the one SVG mark.
const pngSizes = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of pngSizes) {
  await sharp(logo, { density: 384 })
    .resize(size, size, { fit: 'contain', background: BG })
    .png()
    .toFile(join(pub, name))
  console.log(`wrote ${name} (${size}x${size})`)
}

// favicon.ico packs 16 and 32; sharp emits a single-size ICO, which is fine
// for modern browsers.
await sharp(logo, { density: 384 })
  .resize(32, 32, { fit: 'contain', background: BG })
  .toFormat('png')
  .toFile(join(pub, 'favicon.ico'))
console.log('wrote favicon.ico (32x32)')

// Open Graph card: 1200x630, mark on the left, wordmark + tagline as text.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(120,210)">
    <g fill="none" stroke="${INK}" stroke-width="2" transform="scale(6)">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="12.5" y="3" width="7" height="7" rx="1.5"/>
      <rect x="22" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="12.5" width="7" height="7" rx="1.5"/>
      <rect x="12.5" y="12.5" width="7" height="7" rx="1.5"/>
      <rect x="22" y="12.5" width="7" height="7" rx="1.5"/>
      <rect x="3" y="22" width="7" height="7" rx="1.5"/>
      <rect x="12.5" y="22" width="7" height="7" rx="1.5"/>
    </g>
    <rect x="132" y="132" width="42" height="42" rx="9" fill="${ACCENT}"/>
  </g>
  <text x="420" y="300" font-family="Georgia, serif" font-size="84" fill="${INK}">Boring</text>
  <text x="420" y="400" font-family="Georgia, serif" font-size="84" fill="${ACCENT}">by design</text>
  <text x="422" y="470" font-family="system-ui, sans-serif" font-size="30" fill="#5b6b7a">Simple, durable systems — built on purpose.</text>
</svg>`
await sharp(Buffer.from(og)).png().toFile(join(pub, 'og-image.png'))
console.log('wrote og-image.png (1200x630)')
