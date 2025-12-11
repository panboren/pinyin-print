// utils/wordGenerator.js
import PizZip from 'pizzip'

export const createPinyinWordDocument = (lines) => {
  // 构建两行表格结构实现拼音在上文字在下
  let tableRows = ''

  lines.forEach(line => {
    // 创建两行：第一行为拼音，第二行为文字
    let pinyinCells = ''
    let textCells = ''

    line.words.forEach((word, index) => {
      if (word.type === 'newline') {
        // 处理换行符，创建新的表格行
        if (pinyinCells || textCells) {
          tableRows += `
            <w:tr>
              <w:tc><w:p><w:r><w:t>${pinyinCells}</w:t></w:r></w:p></w:tc>
            </w:tr>
            <w:tr>
              <w:tc><w:p><w:r><w:t>${textCells}</w:t></w:r></w:p></w:tc>
            </w:tr>`
        }
        // 添加空行表示换行
        tableRows += `
          <w:tr>
            <w:tc><w:p><w:r><w:br/></w:r></w:p></w:tc>
          </w:tr>
          <w:tr>
            <w:tc><w:p><w:r><w:br/></w:r></w:p></w:tc>
          </w:tr>`
        pinyinCells = ''
        textCells = ''
      } else if (word.type === 'chinese') {
        // 中文字符：拼音在上，文字在下
        pinyinCells += `<w:t xml:space="preserve">${word.pinyin} </w:t>`
        textCells += `<w:t xml:space="preserve">${word.text} </w:t>`
      } else {
        // 非中文字符：拼音位置留空，文字正常显示
        pinyinCells += '<w:t xml:space="preserve"> </w:t>'
        textCells += `<w:t xml:space="preserve">${word.text} </w:t>`
      }
    })

    // 处理行尾剩余内容
    if (pinyinCells || textCells) {
      tableRows += `
        <w:tr>
          <w:tc><w:p><w:r>${pinyinCells ? pinyinCells : '<w:t></w:t>'}</w:r></w:p></w:tc>
        </w:tr>
        <w:tr>
          <w:tc><w:p><w:r>${textCells ? textCells : '<w:t></w:t>'}</w:r></w:p></w:tc>
        </w:tr>`
    }
  })

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:tblLook w:val="04A0"/>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="10000"/>
      </w:tblGrid>
      ${tableRows}
    </w:tbl>
  </w:body>
</w:document>`

  const zip = new PizZip()
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  zip.file('word/document.xml', xmlContent)
  zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>')

  return zip.generate({type: 'blob'})
}
