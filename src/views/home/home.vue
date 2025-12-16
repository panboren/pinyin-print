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
        :disabled="!documentContent || isGeneratingPDF"
        @click="generatePDF"
      >
        {{ isGeneratingPDF ? '生成中...' : '下载 PDF' }}
      </button>
    </div>
    <div
      v-if="documentContent"
      id="pdf-content"
      ref="pdfContentRef"
      class="pdf-export-content"
    >
      <PinyinComponent :content="documentContent" />
    </div>
    <div
      v-else
      class="empty-placeholder"
    >
      请上传.docx文件
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
const isGeneratingPDF = ref(false)
const pdfContentRef = ref(null)
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.docx')) {
    try {
      const content = await parseWordDocument(file)
      documentContent.value = content
    } catch (error) {
      console.error('解析Word文档失败:', error)
    }
  }
}

let generatePDF = async () => {
  if (!documentContent.value || !pdfContentRef.value) return

  isGeneratingPDF.value = true

  try {
    // 使用html2canvas将HTML内容转换为canvas
    const canvas = await html2canvas(pdfContentRef.value, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: pdfContentRef.value.scrollWidth,
      height: pdfContentRef.value.scrollHeight
    })

    // 获取canvas的尺寸
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // 创建PDF，设置尺寸为A4纸的比例
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth

    // 计算需要分割的页数
    let remainingHeight = imgHeight
    let position = 0
    let pageNumber = 1

    // 添加内容到PDF，支持多页
    while (remainingHeight > 0) {
      if (pageNumber > 1) {
        pdf.addPage()
      }

      // 计算当前页应该显示的图片高度
      const pageHeightInPixels = (pdf.internal.pageSize.getHeight() * imgWidth) / pdfWidth
      const canvasHeight = Math.min(pageHeightInPixels, remainingHeight)

      // 创建临时canvas，只包含当前页的内容
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = imgWidth
      tempCanvas.height = canvasHeight

      // 将当前页内容绘制到临时canvas
      tempCtx.drawImage(
        canvas,
        0, position, imgWidth, canvasHeight,
        0, 0, imgWidth, canvasHeight
      )

      // 将canvas转换为图片并添加到PDF
      const imgData = tempCanvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (canvasHeight * pdfWidth) / imgWidth)

      // 更新位置和剩余高度
      position += canvasHeight
      remainingHeight -= canvasHeight
      pageNumber++
    }

    // 保存PDF
    pdf.save('拼音文档.pdf')

  } catch (error) {
    console.error('生成PDF文档失败:', error)
    // 可以添加用户友好的错误提示
    alert('生成PDF失败，请重试')
  } finally {
    isGeneratingPDF.value = false
  }
}




</script>

<style scoped lang="scss">
.home-content {
  width: 100vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .toolbar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    .file-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;

      &::-webkit-file-upload-button {
        margin-right: 10px;
      }
    }

    .pdf-btn {
      padding: 10px 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover:not(:disabled) {
        background-color: #bd2130;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  #pdf-content {
    background: white;
    padding: 30px;
    min-height: calc(100vh - 180px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow-y: auto;
  }

  .empty-placeholder {
    background: white;
    padding: 50px;
    text-align: center;
    color: #666;
    font-size: 18px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

@media print {
  body * {
    visibility: hidden;
  }

  .home-content,
  .home-content * {
    visibility: visible;
  }

  .home-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 !important;
    height: auto !important;
    background: white;
  }

  #pdf-content {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }

  .toolbar {
    display: none !important;
  }
}
</style>
