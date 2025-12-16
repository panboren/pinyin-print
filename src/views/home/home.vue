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

const generatePDF = async () => {
  if (!documentContent.value || isGeneratingPDF.value) return

  isGeneratingPDF.value = true

  try {
    const element = pdfContentRef.value
    debugger
    if (!element) {
      throw new Error('PDF内容元素未找到')
    }

    // 检查内容是否为空
    if (element.textContent.trim() === '' && element.children.length === 0) {
      throw new Error('内容为空，无法生成PDF')
    }

    setTimeout(async () => {
      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight
      })

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas生成失败')
      }

      const imgData = canvas.toDataURL('image/png')
      if (!imgData || imgData === 'data:,') {
        throw new Error('图片数据生成失败')
      }

      // 创建PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      // 处理多页内容
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage()
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('拼音文档.pdf')


    },1000)

  } catch (error) {
    console.error('生成PDF失败:', error)
    // 可以添加用户提示
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
