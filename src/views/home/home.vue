<!-- home.vue -->
<template>
  <div class="home-content">
    <div class="toolbar">
      <input
        type="file"
        accept=".docx"
        class="file-input"
        @change="handleFileUpload"
      >
      <button
        class="download-btn"
        :disabled="!documentContent"
        @click="handleDownload"
      >
        下载 Word 文档
      </button>
    </div>
    <PinyinComponent
      :content="documentContent"
      @update:lines="handleLinesUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PinyinComponent from './compoments/pinyin.vue'
import { parseWordDocument } from '@/utils/wordParser'
import { createPinyinWordDocument } from '@/utils/wordGenerator'

const documentContent = ref('')
const processedLines = ref([])

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.docx')) {
    const content = await parseWordDocument(file)
    documentContent.value = content
  }
}

const handleLinesUpdate = (lines) => {
  processedLines.value = lines
}

const handleDownload = () => {
  if (!documentContent.value || processedLines.value.length === 0) return

  const blob = createPinyinWordDocument(processedLines.value)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '拼音文档.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>
