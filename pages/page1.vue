<template>
  <div class="content">
    page1 == {{ store.count }} == > {{ store.doubleCount }}

    {{input}}
    <el-button @click="store.increment">
      添加
    </el-button>
    <el-input
      v-model="input"
      placeholder="Please input"
    />
  </div>
</template>

<script setup>
import {usePage1Store} from '~/stores/page1'

const store = usePage1Store()
const input = ref('')

// const {count, doubleCount} = storeToRefs(store)

console.log(store)

// SEO Meta
useSeoMeta({
  title: '页面1',
  description: '页面1描述',
  ogTitle: '页面1',
  ogDescription: '页面1描述',
  ogImage: '/favicon.ico'
})
</script>

<style scoped lang="scss">
@import "~/assets/css/theme.scss";

.content {
  width: 100%;
  height: 100%;
  background: $bg-color;
}
</style>