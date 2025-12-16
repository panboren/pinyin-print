<template>
  <div
    ref="containerRef"
    class="advanced-pinyin-container"
    :class="{ 'pdf-export-mode': isPdfExportMode }"
  >
    <div
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      class="pinyin-line"
    >
      <div
        v-for="(word, wordIndex) in line.words"
        :key="wordIndex"
        class="pinyin-word"
        :class="word.type"
      >
        <div
          v-if="word.type === 'chinese'"
          class="pinyin"
        >
          {{ word.pinyin }}
        </div>
        <div class="text">
          {{ word.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { pinyin } from 'pinyin-pro'

const containerRef = ref(null)
const lines = ref([])
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})




// 添加PDF导出模式标志
const isPdfExportMode = ref(false)

// 导出一个方法供父组件调用，用于设置PDF导出模式
const setPdfExportMode = (mode) => {
  isPdfExportMode.value = mode
}

// 向父组件暴露方法
defineExpose({
  setPdfExportMode
})

















// 自动生成拼音的函数
const convertTextToPinyin = (text) => {
  return text.split('').map(char => {
    if (char === '\n') {
      return {
        text: char,
        pinyin: '',
        type: 'newline'
      }
    }

    // 检查是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      // 使用 pinyin-pro 为中文字符自动生成拼音
      const pinyinResult = pinyin(char, { toneType: 'symbol' })
      return {
        text: char,
        pinyin: pinyinResult || '',
        type: 'chinese'
      }
    } else if (/[\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\uff09\u300c\u300d]/.test(char)) {
      // 标点符号处理 - 不显示拼音，特殊标记类型
      return {
        text: char,
        pinyin: '',
        type: 'punctuation'
      }
    } else {
      // 其他字符（英文、数字等）处理
      return {
        text: char,
        pinyin: '',
        type: 'other'
      }
    }
  })
}

// 修改文本处理函数以保持换行
// 修改文本处理函数以保持换行
const processLines = (textData) => {
  const lines = []
  let currentLine = { words: [] }

  textData.forEach((word) => {
    console.log(word)
    if (word.text === '\n') {
      // 遇到换行符时，保存当前行并开始新行
      if (currentLine.words.length > 0) {
        lines.push(currentLine)
      }
      // 添加一个包含换行标记的行
      lines.push({ words: [word] })
      currentLine = { words: [] }
    } else {
      // 普通字符添加到当前行
      currentLine.words.push(word)

      // 可选：按固定字符数换行
      // if (currentLine.words.length >= 20) {
      //   lines.push(currentLine)
      //   currentLine = { words: [] }
      // }
    }
  })

  // 添加最后一行（如果不为空）
  if (currentLine.words.length > 0) {
    lines.push(currentLine)
  }

  return lines
}


// 更新显示内容
const updateContent = () => {
  if (props.content) {
    const textData = convertTextToPinyin(props.content)
    lines.value = processLines(textData)
    console.log(lines)
  }
}

// 监听内容变化
watch(() => props.content, () => {
  updateContent()
})

onMounted(() => {
  updateContent()
})
</script>

<style scoped lang="scss">
.advanced-pinyin-container {
  width: 100%;
  .pinyin-line {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    line-height: 25px;

    .pinyin-word {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 8px;

      .pinyin {
        font-size: 16px;
        color: #ff6b6b;
        margin-bottom: 2px;
        min-height: 16px;
      }

      .text {
        font-size: 20px;
      }

      &.punctuation {
        justify-content: flex-end;
        .text {
          align-self: flex-end;
        }
      }

      &.other {
        justify-content: flex-end;
        .text {
          align-self: flex-end;
        }
      }

      &.newline {
        width: 100%;
        height: 20px;
        margin: 4px 0;
      }
    }
  }

  // PDF导出模式下的样式
  &.pdf-export-mode {
    .pinyin-word {
      margin-right: 12px; // 增加间距

      .pinyin {
        font-size: 16px; // 增大拼音字体
        margin-bottom: 4px;
        min-height: 20px;
      }

      .text {
        font-size: 20px; // 增大汉字字体
      }
    }

    .pinyin-line {
      margin-bottom: 16px; // 增加行间距
    }
  }
}
</style>
