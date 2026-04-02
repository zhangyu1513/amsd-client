<template>
  <el-dialog v-model="dialogVisible" title="日志详情" top="0" width="90%" class="h-9/10" :close-on-press-escape="false"
    :close-on-click-modal="false" @open="loadLogContent" @close="handleClose">
    <div class="log-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-empty description="加载日志失败" :image-size="100">
          <template #description>
            <p class="error-message">{{ error }}</p>
          </template>
          <el-button type="primary" @click="loadLogContent">重试</el-button>
        </el-empty>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!logContent" class="empty-container">
        <el-empty description="暂无日志内容" :image-size="100" />
      </div>

      <!-- 日志内容展示 -->
      <div v-else class="log-content-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-left">
            <span class="log-info">
              <el-tag size="small" type="info">
                {{ logType === 'process' ? '处理任务' : '断裂分析' }} #{{ currentId || props.id }}
              </el-tag>
              <span class="content-length" v-if="logContent">
                {{ formatContentLength(logContent) }}
              </span>
            </span>
          </div>
          <div class="toolbar-right">
            <el-button-group>
              <el-button type="primary" size="small" @click="copyAllContent" :disabled="!logContent">
                <el-icon>
                  <DocumentCopy />
                </el-icon>
                复制全部
              </el-button>
              <el-button type="primary" size="small" @click="downloadContent" :disabled="!logContent">
                <el-icon>
                  <Download />
                </el-icon>
                下载
              </el-button>
              <!-- <el-button type="info" size="small" @click="toggleWrap" :disabled="!logContent">
                <el-icon>
                  <Switch />
                </el-icon>
                {{ wrapLines ? '取消换行' : '自动换行' }}
              </el-button> -->
              <!-- <el-button type="info" size="small" @click="clearContent" :disabled="!logContent">
                <el-icon>
                  <Delete />
                </el-icon>
                清空
              </el-button> -->
            </el-button-group>
          </div>
        </div>

        <!-- 虚拟滚动日志内容 -->
        <div class="log-viewer-container" ref="logViewerRef">
          <div class="log-viewer" :style="{ 'white-space': wrapLines ? 'pre-wrap' : 'pre' }" @scroll="handleScroll">
            <div class="log-content" :style="{ height: totalHeight + 'px' }">
              <div v-for="(line, index) in visibleLines" :key="index" class="log-line"
                :class="{ 'log-line-even': (startIndex + index) % 2 === 0 }"
                :style="{ top: (startIndex + index) * lineHeight + 'px' }">
                <span class="line-number">{{ startIndex + index + 1 }}</span>
                <span class="line-content">{{ line }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-container" v-if="logContent">
          <el-input v-model="searchText" placeholder="搜索日志内容..." clearable size="small" @input="handleSearch"
            @clear="clearSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
            <template #append>
              <el-button @click="findPrev" :disabled="!searchText || searchResults.length === 0">
                <el-icon>
                  <ArrowUp />
                </el-icon>
              </el-button>
              <el-button @click="findNext" :disabled="!searchText || searchResults.length === 0">
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </el-button>
              <span class="search-count" v-if="searchText">
                {{ currentSearchIndex + 1 }}/{{ searchResults.length }}
              </span>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { api } from '@/api';
import { ElMessage } from 'element-plus';
import {
  DocumentCopy,
  Download,
  Switch,
  Delete,
  Search,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue';
import type { Process, Fracture } from '@/api/types';

interface Props {
  logType: 'process' | 'fracture'
  id: number
}

const props = defineProps<Props>()

const dialogVisible = ref(false)
const loading = ref(false)
const error = ref<string>('')
const logContent = ref<string>('')
const wrapLines = ref(true)
const searchText = ref('')
const searchResults = ref<number[]>([])
const currentSearchIndex = ref(-1)
const logViewerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const lineHeight = 24 // 每行高度
const bufferSize = 20 // 缓冲区大小

// 当前显示的 ID（可以从 props 或 open 方法传入）
const currentId = ref(props.id)

// 计算可见区域高度
const containerHeight = computed(() => {
  if (!logViewerRef.value) return 600
  return logViewerRef.value.clientHeight
})

// 计算总行数
const totalLines = computed(() => {
  if (!logContent.value) return 0
  return logContent.value.split('\n').length
})

// 计算总高度
const totalHeight = computed(() => {
  return totalLines.value * lineHeight
})

// 计算起始索引
const startIndex = computed(() => {
  const start = Math.floor(scrollTop.value / lineHeight) - bufferSize
  return Math.max(0, start)
})

// 计算结束索引
const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerHeight.value / lineHeight)
  const end = startIndex.value + visibleCount + bufferSize * 2
  return Math.min(totalLines.value, end)
})

// 计算所有行
const logLines = computed(() => {
  if (!logContent.value) return []
  return logContent.value.split('\n')
})

// 计算可见行
const visibleLines = computed(() => {
  return logLines.value.slice(startIndex.value, endIndex.value)
})

// 监听props变化
watch(() => props.id, () => {
  if (dialogVisible.value) {
    loadLogContent()
  }
})

// 处理滚动
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// 打开对话框时加载日志内容
const loadLogContent = async () => {
  const idToLoad = currentId.value || props.id
  if (!idToLoad) {
    ElMessage.warning('请先选择要查看日志的项目')
    return
  }

  loading.value = true
  error.value = ''
  logContent.value = ''

  try {
    let response
    switch (props.logType) {
      case 'process':
        // 获取处理任务详情

        response = await api.log.getProcessLogs({ ID: idToLoad })
        if (response) {
          const process = response
          logContent.value = process.Log || '暂无日志内容'
        } else {
          throw new Error('未找到对应的处理任务')
        }
        break
      case 'fracture':
        // 获取断裂分析详情
        response = await api.log.getFractureLogs({ ID: idToLoad })
        if (response) {
          const fracture = response
          logContent.value = fracture.Log || '暂无日志内容'
        } else {
          throw new Error('未找到对应的处理任务')
        }
        break
      default:
        throw new Error(`不支持的日志类型: ${props.logType}`)
    }
  } catch (err: any) {
    console.error('加载日志内容失败:', err)
    error.value = err.message || '加载日志内容失败，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 格式化内容长度显示
const formatContentLength = (content: string) => {
  const lines = content.split('\n').length
  const chars = content.length
  const sizeKB = (chars / 1024).toFixed(2)
  return `${lines} 行, ${chars} 字符, ${sizeKB} KB`
}

// 复制全部内容
const copyAllContent = async () => {
  try {
    await navigator.clipboard.writeText(logContent.value)
    ElMessage.success('已复制全部内容到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败')
  }
}

// 下载内容
const downloadContent = () => {
  if (!logContent.value) return

  const blob = new Blob([logContent.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const filename = `${props.logType}_${props.id}_log_${new Date().getTime()}.txt`

  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success(`日志已下载: ${filename}`)
}

// 切换换行
const toggleWrap = () => {
  wrapLines.value = !wrapLines.value
}

// 清空内容
const clearContent = () => {
  logContent.value = ''
  clearSearch()
}

// 处理搜索
const handleSearch = () => {
  if (!searchText.value.trim()) {
    clearSearch()
    return
  }

  const searchTerm = searchText.value.toLowerCase()
  const lines = logLines.value
  searchResults.value = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line && line.toLowerCase().includes(searchTerm)) {
      searchResults.value.push(i)
    }
  }

  if (searchResults.value.length > 0) {
    currentSearchIndex.value = 0
    const firstResult = searchResults.value[0]
    if (firstResult !== undefined) {
      scrollToLine(firstResult)
    }
  } else {
    currentSearchIndex.value = -1
    ElMessage.warning('未找到匹配的内容')
  }
}

// 清除搜索
const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
  currentSearchIndex.value = -1
}

// 查找上一个
const findPrev = () => {
  if (searchResults.value.length === 0 || currentSearchIndex.value < 0) return

  const newIndex = currentSearchIndex.value > 0
    ? currentSearchIndex.value - 1
    : searchResults.value.length - 1

  currentSearchIndex.value = newIndex
  const lineIndex = searchResults.value[newIndex]
  if (lineIndex !== undefined) {
    scrollToLine(lineIndex)
  }
}

// 查找下一个
const findNext = () => {
  if (searchResults.value.length === 0 || currentSearchIndex.value < 0) return

  const newIndex = currentSearchIndex.value < searchResults.value.length - 1
    ? currentSearchIndex.value + 1
    : 0

  currentSearchIndex.value = newIndex
  const lineIndex = searchResults.value[newIndex]
  if (lineIndex !== undefined) {
    scrollToLine(lineIndex)
  }
}

// 滚动到指定行
const scrollToLine = (lineIndex: number) => {
  if (!logViewerRef.value || lineIndex < 0) return

  // 计算目标滚动位置
  const targetScrollTop = lineIndex * lineHeight

  // 设置滚动位置
  const viewer = logViewerRef.value.querySelector('.log-viewer') as HTMLElement
  if (viewer) {
    viewer.scrollTop = targetScrollTop
  }

  // 更新当前搜索索引
  const index = searchResults.value.indexOf(lineIndex)
  if (index !== -1) {
    currentSearchIndex.value = index
  }

  // 等待 DOM 更新后高亮
  nextTick(() => {
    // 清除之前的高亮
    const lineElements = document.querySelectorAll('.log-line')
    lineElements.forEach(el => el.classList.remove('search-highlight'))

    // 高亮当前行（由于虚拟滚动，需要找到对应的元素）
    const highlightedLine = document.querySelector(`.log-line[data-line-index="${lineIndex}"]`)
    if (highlightedLine) {
      highlightedLine.classList.add('search-highlight')
    }
  })
}

// 关闭对话框
const handleClose = () => {
  logContent.value = ''
  clearSearch()
  error.value = ''
}

// 暴露方法给父组件
defineExpose({
  open: (id?: number) => {
    if (id !== undefined) {
      // 更新当前 ID
      currentId.value = id
    }
    dialogVisible.value = true
  },
  close: () => {
    dialogVisible.value = false
  }
})
</script>

<style scoped>
.log-container {
  min-height: 400px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-message {
  color: #f56c6c;
  margin-bottom: 16px;
}

.log-content-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  min-height: 500px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.log-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-length {
  font-size: 12px;
  color: #909399;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.log-viewer-container {
  flex: 1;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #f8f9fa;
  position: relative;
}

.log-viewer {
  height: 100%;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 24px;
  background: #1e1e1e;
  color: #d4d4d4;
}

.log-line {
  display: flex;
  min-height: 24px;
  padding: 0 8px;
  border-bottom: 1px solid #2d2d2d;
}

.log-line-even {
  background-color: #252526;
}

.log-line:hover {
  background-color: #2a2d2e;
}

.line-number {
  min-width: 60px;
  padding-right: 12px;
  text-align: right;
  color: #858585;
  user-select: none;
  border-right: 1px solid #2d2d2d;
  margin-right: 12px;
}

.line-content {
  flex: 1;
  white-space: inherit;
  word-break: break-all;
}

.search-container {
  margin-top: 12px;
}

.search-count {
  padding: 0 8px;
  font-size: 12px;
  color: #909399;
  min-width: 60px;
  text-align: center;
}

/* 搜索高亮 */
.search-highlight {
  background-color: #264f78 !important;
  color: #ffffff !important;
}

.search-highlight .line-number {
  color: #ffffff !important;
  font-weight: bold;
}

/* 滚动条样式 */
.log-viewer::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.log-viewer::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.log-viewer::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.log-viewer::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
