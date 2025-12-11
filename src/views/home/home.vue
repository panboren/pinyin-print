<!-- home.vue -->
<template>
  <div class="home-content">
    <input
      type="file"
      accept=".docx"
      class="file-input"
      @change="handleFileUpload"
    >
    <PinyinComponent :content="documentContent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PinyinComponent from './compoments/pinyin.vue'
import { parseWordDocument } from '@/utils/wordParser'

const documentContent = ref('')

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.docx')) {
    const content = await parseWordDocument(file)
    // 保持原始换行格式
    documentContent.value = content
  }
}
</script>
<style scoped lang="scss">
.home-content{
  width: 100vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}


</style>
