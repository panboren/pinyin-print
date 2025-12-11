<template>
  <div
    ref="containerRef"
    class="advanced-pinyin-container"
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

// 向父组件暴露处理后的数据
const emit = defineEmits(['update:lines'])
const containerRef = ref(null)
const lines = ref([])
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
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
  }
}

// 监听内容变化
watch(() => props.content, () => {
  updateContent()
})
watch(lines, (newLines) => {
  emit('update:lines', newLines)
}, { deep: true })
onMounted(() => {
  updateContent()
})
</script>

<style scoped lang="scss">
.advanced-pinyin-container {
  width: 100%;
  line-height: 1.6;

  .pinyin-line {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .pinyin-word {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 8px;

      .pinyin {
        font-size: 12px;
        color: #ff6b6b;
        margin-bottom: 2px;
        min-height: 16px;
      }

      .text {
        font-size: 16px;
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
        height: 16px;
        margin: 4px 0;
      }
    }
  }
}
</style>
