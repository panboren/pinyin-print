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
    <div
      id="pdf-content"
      class="pdf-export-content"
    >
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
    // 确保DOM完全渲染
    await new Promise(resolve => setTimeout(resolve, 100))

    // 使用html2canvas生成canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')

    if (!imgData) {
      throw new Error('图片数据生成失败')
    }

    // 使用jsPDF创建PDF（恢复原始方式）
    const pdf = new jsPDF()

    // 获取图片属性并计算尺寸
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    // 添加图片到PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // 保存PDF
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
    /* 移除A4尺寸设置，避免影响PDF生成 */
  }
}

@media print {
  .home-content {
    padding: 20px !important;

    #pdf-content {
      box-shadow: none;
      margin: 0;
      padding: 20px;
    }
  }
}
</style>
