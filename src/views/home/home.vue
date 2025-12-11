<!-- home.vue -->
<template>
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
          v-print="'#printArea'"
          class="print-btn"
          :disabled="!documentContent"
        >
          打印页面
        </button>
      </div>
      <div id="printArea">
        <PinyinComponent :content="documentContent" />
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import PinyinComponent from './compoments/pinyin.vue'
import { parseWordDocument } from '@/utils/wordParser'

const documentContent = ref('')
const pinyinComponent = ref(null)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.docx')) {
    const content = await parseWordDocument(file)
    documentContent.value = content
  }
}

const handlePrint = () => {
  if (!documentContent.value) return

  // 调用浏览器打印功能
  window.print()
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

    .print-btn {
      padding: 8px 16px;
      background-color: #28a745;
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
}





@media print {
  .advanced-pinyin-container {
    width: 100%;
    line-height: 1.6;

    .pinyin-line {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 8px;
      page-break-inside: avoid;

      .pinyin-word {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin-right: 6px;

        .pinyin {
          font-size: 10px;
          color: #333;
          margin-bottom: 1px;
          min-height: 14px;
        }

        .text {
          font-size: 14px;
        }

        &.punctuation, &.other {
          justify-content: flex-end;

          .text {
            align-self: flex-end;
          }
        }

        &.newline {
          width: 100%;
          height: 14px;
          margin: 3px 0;
        }
      }
    }
  }
}






</style>
