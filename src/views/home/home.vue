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
        class="pdf-btn"
        :disabled="!documentContent"
        @click="generatePDF"
      >
        下载 PDF
      </button>
    </div>
    <div id="pdf-content">
      <PinyinComponent :content="documentContent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PinyinComponent from './compoments/pinyin.vue'
import { parseWordDocument } from '@/utils/wordParser'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const documentContent = ref('')

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.docx')) {
    const content = await parseWordDocument(file)
    documentContent.value = content
  }
}

const generatePDF = async () => {
  if (!documentContent.value) return

  const element = document.getElementById('pdf-content')

  try {
    // 使用 html2canvas 将 DOM 元素转换为 canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 宽度
    const pageHeight = 295 // A4 高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 处理多页
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // 下载 PDF
    pdf.save('拼音文档.pdf')
  } catch (error) {
    console.error('生成PDF失败:', error)
  }
}
</script>

<style scoped lang="scss">
.home-content {
  width: 100vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;

  .toolbar {
    margin-bottom: 20px;

    .file-input {
      margin-right: 10px;
    }

    .pdf-btn {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }

  #pdf-content {
    background: white;
    padding: 20px;
  }
}
</style>
