import { ElMessage } from 'element-plus'

export function copyToClipboard(text: string): void {
  if (!text) {
    ElMessage.warning('没有内容可复制')
    return
  }
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage.success('已复制到剪贴板')
      })
      .catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string): void {
  const textArea = document.createElement('textarea')
  textArea.style.position = 'absolute'
  textArea.style.left = '-9999px'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try {
    const success = document.execCommand('copy')
    if (success) {
      ElMessage.success('已复制到剪贴板')
    } else {
      ElMessage.error('复制失败')
    }
  } catch {
    ElMessage.error('复制失败')
  } finally {
    document.body.removeChild(textArea)
  }
}
