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

    <HelloWorld msg="page1" />
  </div>
</template>
<script setup>
import {usePage1Store} from '@stores/page1'

const store = usePage1Store()

const input = ref('')


// const {count, doubleCount} = storeToRefs(store)

console.log(store)
</script>
<style scoped lang="scss">
@import "@assets/css/theme";
.content {
  width: 100%;
  height: 100%;
  background: $bg-color;
}
</style>
