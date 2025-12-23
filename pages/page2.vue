<template>
  <div>
    <div class="total">
      {{ total }}
    </div>
    <van-button
      type="primary"
      @click="add"
    >
      主要按钮
    </van-button>
    <van-button
      type="success"
      @click="add"
    >
      成功按钮
    </van-button>
    <van-button
      type="default"
      @click="add"
    >
      默认按钮
    </van-button>
    <van-button
      type="warning"
      @click="add"
    >
      警告按钮
    </van-button>
    <van-button
      type="danger"
      @click="add"
    >
      危险按钮
    </van-button>
  </div>
</template>

<script setup>
const total = ref(10)

const add = () => {
  total.value++
}

// SEO Meta
useSeoMeta({
  title: '页面2',
  description: '页面2描述',
  ogTitle: '页面2',
  ogDescription: '页面2描述',
  ogImage: '/favicon.ico'
})
</script>

<style scoped lang="scss">
.total{
  width: 100px;
  height: 100px;
  background: #2da690;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>