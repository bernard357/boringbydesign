<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()
const newer = ref(null)
const older = ref(null)
const isPost = ref(false)

function stripBase(path) {
  const base = withBase('/')
  return path.startsWith(base) ? '/' + path.slice(base.length) : path
}

function currentSlug() {
  // Route path like /hello-boring-world.html or /hello-boring-world
  let p = stripBase(route.path).replace(/\.html$/, '').replace(/\/$/, '')
  return p || '/'
}

async function load() {
  newer.value = null
  older.value = null
  isPost.value = false
  let posts = []
  try {
    const res = await fetch(withBase('/posts.json'))
    posts = await res.json()
  } catch {
    return
  }
  const slug = currentSlug()
  const i = posts.findIndex((p) => p.url === slug)
  if (i === -1) return
  isPost.value = true
  // posts.json is newest-first: index-1 is newer, index+1 is older.
  if (i > 0) newer.value = posts[i - 1]
  if (i < posts.length - 1) older.value = posts[i + 1]
}

onMounted(load)
watch(() => route.path, load)
</script>

<template>
  <nav v-if="isPost" class="post-nav">
    <a v-if="older" class="post-nav-link post-nav-older" :href="withBase(older.url)">
      <span class="post-nav-dir">← Older</span>
      <span class="post-nav-title">{{ older.title }}</span>
    </a>
    <span v-else class="post-nav-link post-nav-empty"></span>
    <a v-if="newer" class="post-nav-link post-nav-newer" :href="withBase(newer.url)">
      <span class="post-nav-dir">Newer →</span>
      <span class="post-nav-title">{{ newer.title }}</span>
    </a>
  </nav>
</template>
