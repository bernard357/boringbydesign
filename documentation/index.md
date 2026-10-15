---
layout: doc
aside: false
outline: false
sidebar: false
---

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
const latest = ref(null)

onMounted(async () => {
  const res = await fetch(withBase('/posts.json'))
  const posts = await res.json()
  if (posts.length) {
    latest.value = posts[0]
    // Home reflects the most recent post: send the reader to its canonical URL.
    router.go(withBase(posts[0].url))
  }
})
</script>

<div class="home-redirect">
  <p v-if="latest">Taking you to the latest post…
    <a :href="withBase(latest.url)">{{ latest.title }}</a>
  </p>
  <p v-else>
    Loading the latest post… or browse the <a :href="withBase('/history')">history</a>.
  </p>
</div>
