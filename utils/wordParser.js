// utils/wordParser.js
import mammoth from 'mammoth'

export const parseWordDocument = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value // 返回提取的文本内容
  } catch (error) {
    console.error('解析Word文档失败:', error)
    return ''
  }
}
