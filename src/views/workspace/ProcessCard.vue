<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useRouter } from 'vue-router'
import { Select, CloseBold, SemiSelect, Tickets, MessageBox, Plus, Search, Refresh, CopyDocument } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { PaginationParams, Process, ProcessSearchParams } from '@/api/types'
import Log from './components/Log.vue'
import AddFracture from './components/AddFracture.vue'

// 表格数据
const tableData = ref<Process[]>([])
const tableLoading = ref(false)

// 数据版本号 - 用于触发动画
const dataVersion = ref(0)

const searchForm = ref<Process>({})

const paginationForm = ref<PaginationParams>({
  Page: 1,
  PageSize: 20
})

const total = ref(0)

// Log 组件引用
const logRef = ref<InstanceType<typeof Log>>()

// 当前选中的处理任务
const selectedProcess = ref<Process>({})

// 控制AddFracture对话框显示
const showAddFractureDialog = ref(false)

// Emits
const emit = defineEmits<{
  'add-process-tab': [processId: number, processUID: string]
}>()

// 搜索参数 - 使用类型安全的 ProcessSearchParams
const searchParams = computed<ProcessSearchParams>(() => {
  return {
    ...paginationForm.value,
    ...searchForm.value
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
}

// 从API获取处理任务数据
const listProcesses = async () => {
  tableLoading.value = true
  try {
    // 调用API接口
    const response = await api.process.getProcesses(searchParams.value)

    // 先清空数据，确保动画能重新触发
    tableData.value = []
    // 使用nextTick确保DOM更新后再设置新数据
    await nextTick()
    tableData.value = response.List
    console.log('获取处理任务数据成功:', response)
    total.value = response.Total
  } catch (error) {
    console.error('获取处理任务数据失败:', error)
    ElMessage.error('获取数据失败，请检查网络连接')
  } finally {
    tableLoading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  paginationForm.value.Page = page
  listProcesses() // 重新加载数据
}

// 处理每页显示数量变化
const handleSizeChange = (size: number) => {
  paginationForm.value.PageSize = size
  paginationForm.value.Page = 1 // 重置到第一页
  listProcesses() // 重新加载数据
}

const toOrders = (processId: number) => {
  ElMessage.info(`跳转到处理任务 ${processId} 的子单列表`)
  // router.push({ path: `/workspace/processes/${processId}/orders` })
}

const toProcesses = (processId: number, processUID: string) => {
  // 触发添加处理tab事件
  console.log(`请求添加处理tab，处理任务ID: ${processId}, 任务编号: ${processUID}`)
  emit('add-process-tab', processId, processUID)
}

// 查看日志
const viewLog = (processId: number) => {
  if (!logRef.value) return
  logRef.value.open(processId)
}

// 打开添加断裂分析对话框
const openAddFractureDialog = (process: Process) => {
  selectedProcess.value = process
  showAddFractureDialog.value = true
}

// 关闭添加断裂分析对话框
const closeAddFractureDialog = () => {
  showAddFractureDialog.value = false
  selectedProcess.value = {}
}

// 复制文本到剪贴板
const copyToClipboard = (text: string) => {
  if (!text) {
    ElMessage.warning('没有内容可复制')
    return
  }

  // 1. 优先尝试使用现代的 Clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('已复制到剪贴板')
    }).catch(err => {
      console.error('Clipboard API 复制失败:', err)
      fallbackCopy(text)
    })
  } else {
    // 2. 如果不支持 Clipboard API (例如在 HTTP 环境下)，直接使用降级方案
    fallbackCopy(text)
  }
}

// 降级方案：使用 document.execCommand
const fallbackCopy = (text: string) => {
  const textArea = document.createElement('textarea')
  // 关键：将 textarea 移出可视区域，而不是用 display: none，以确保兼容性
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
      ElMessage.error('复制失败，请手动复制')
    }
  } catch (err) {
    console.error('execCommand 复制出错:', err)
    ElMessage.error('复制失败，请手动复制')
  } finally {
    // 清理临时元素
    document.body.removeChild(textArea)
  }
}

// 监听表格数据变化，触发动画
watch(tableData, () => {
  // 每次数据变化时递增版本号
  dataVersion.value++
}, { deep: true })

onMounted(() => {
  listProcesses()
})

onUnmounted(() => {
})
</script>

<template>
  <el-row class="w-full h-full">
    <el-col :span="24" class="h-full">
      <!-- 表格和分页容器 -->
      <div class="h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex items-center justify-between mb-2">
          <!-- 工具栏留空，已移除刷新按钮 -->
        </div>

        <!-- 表格区域 - 占据剩余高度 -->
        <div class="flex-1 min-h-0 relative">

          <el-table :data="tableData" border show-overflow-tooltip v-loading="tableLoading" default-expand-all
            size="small" class="w-full tech-table" height="100%" :class="{ 'table-loading': tableLoading }"
            :data-version="dataVersion">
            <el-table-column type="index" label="#" align="center" header-align="center" width="50" />
            <el-table-column prop="CreatedAt" label="创建时间" align="center" header-align="center" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.CreatedAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="UpdatedAt" label="更新时间" align="center" header-align="center" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.UpdatedAt) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="Status" align="center" header-align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.Status === 'open'" type="success" size="small">进行中</el-tag>
                <el-tag v-else-if="scope.row.Status === 'close'" type="danger" size="small">已关闭</el-tag>
                <el-tag v-else type="info" size="small">未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="运行状态" prop="State" align="center" header-align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.State === 'completed'" type="success" size="small">已完成</el-tag>
                <el-tag v-else-if="scope.row.State === 'failed'" type="danger" size="small">错误</el-tag>
                <el-tag v-else-if="scope.row.State === 'running'" type="warning" size="small">运行中</el-tag>
                <el-tag v-else type="info" size="small">{{ scope.row.State }}</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="UID" label="任务编号" align="center" header-align="center" width="280" /> -->
            <el-table-column prop="LinkedAddress" label="关联地址" align="center" header-align="center" width="300">
              <template #default="scope">
                <div class="flex items-center justify-between">
                  <span class="truncate flex-1 mr-2" :title="scope.row.LinkedAddress">
                    {{ scope.row.LinkedAddress || '-' }}
                  </span>
                  <el-button v-if="scope.row.LinkedAddress" type="text" size="small" class="copy-btn"
                    @click.stop="copyToClipboard(scope.row.LinkedAddress)">
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="LocalAddress" label="本地地址" align="center" header-align="center" width="500">
              <template #default="scope">
                <div class="flex items-center justify-between">
                  <span class="truncate flex-1 mr-2" :title="scope.row.LocalAddress">
                    {{ scope.row.LocalAddress || '-' }}
                  </span>
                  <el-button v-if="scope.row.LocalAddress" type="text" size="small" class="copy-btn"
                    @click.stop="copyToClipboard(scope.row.LocalAddress)">
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="EDA" label="EDA" align="center" header-align="center" width="120" />
            <el-table-column prop="Threads" label="线程数" align="center" header-align="center" width="80" />
            <el-table-column prop="Priority" label="优先级" align="center" header-align="center" width="80">
              <template #default="scope">
                <el-tag v-if="scope.row.Priority === 1" type="danger" size="small">高</el-tag>
                <el-tag v-else-if="scope.row.Priority === 2" type="warning" size="small">中</el-tag>
                <el-tag v-else-if="scope.row.Priority === 3" type="info" size="small">低</el-tag>
                <el-tag v-else type="default" size="small">{{ scope.row.Priority }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300" fixed="right">
              <template #default="scope">
                <div class="flex justify-center space-x-1">
                  <el-button type="primary" size="small" link @click="" disabled>
                    LVL
                  </el-button>
                  <el-button type="primary" size="small" link @click="openAddFractureDialog(scope.row)"
                    :disabled="scope.row.State != 'completed' || scope.row.Status === 'close'">
                    Fracture
                  </el-button>
                  <el-button type="primary" size="small" link @click="" disabled>
                    Density
                  </el-button>
                  <el-button type="primary" size="small" link @click="" disabled>
                    MRC
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页组件 - 固定高度24px -->
        <div class="h-6 shrink-0 flex items-center justify-center mt-2 mb-2">
          <el-pagination v-model:current-page="paginationForm.Page" v-model:page-size="paginationForm.PageSize"
            :page-sizes="[5, 10, 20, 50]" :small="true" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handlePageChange" class="justify-center pagination-compact" />
        </div>
      </div>
    </el-col>
  </el-row>

  <!-- Log 组件 -->
  <Log ref="logRef" :log-type="'process'" :id="0" />

  <!-- AddFracture 组件 -->
  <AddFracture :visible="showAddFractureDialog" :process="selectedProcess" @close="closeAddFractureDialog" />
</template>

<style scoped>
/* 科技感表格样式 */
.tech-table {
  position: relative;
}

.table-loading {
  opacity: 0.7;
  filter: blur(1px);
}

/* 数据行进入动画 - 基于data-version属性触发 */
.tech-table[data-version] :deep(.el-table__row) {
  animation: row-fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes row-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每一行添加延迟动画 */
.tech-table[data-version] :deep(.el-table__row:nth-child(1)) {
  animation-delay: 0.1s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(2)) {
  animation-delay: 0.2s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(3)) {
  animation-delay: 0.3s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(4)) {
  animation-delay: 0.4s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(5)) {
  animation-delay: 0.5s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(6)) {
  animation-delay: 0.6s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(7)) {
  animation-delay: 0.7s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(8)) {
  animation-delay: 0.8s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(9)) {
  animation-delay: 0.9s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(10)) {
  animation-delay: 1.0s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(11)) {
  animation-delay: 1.1s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(12)) {
  animation-delay: 1.2s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(13)) {
  animation-delay: 1.3s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(14)) {
  animation-delay: 1.4s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(15)) {
  animation-delay: 1.5s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(16)) {
  animation-delay: 1.6s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(17)) {
  animation-delay: 1.7s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(18)) {
  animation-delay: 1.8s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(19)) {
  animation-delay: 1.9s;
}

.tech-table[data-version] :deep(.el-table__row:nth-child(20)) {
  animation-delay: 2.0s;
}

/* 表格悬停效果 */
.tech-table :deep(.el-table__row:hover) {
  background: linear-gradient(90deg,
      rgba(59, 130, 246, 0.05) 0%,
      rgba(139, 92, 246, 0.03) 100%);
  transform: translateX(2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 表格边框科技感 */
.tech-table :deep(.el-table) {
  --el-table-border-color: rgba(59, 130, 246, 0.3);
  --el-table-border: 1px solid var(--el-table-border-color);
}

.tech-table :deep(.el-table th) {
  background: linear-gradient(180deg,
      rgba(15, 23, 42, 0.9) 0%,
      rgba(30, 41, 59, 0.8) 100%);
  color: #e2e8f0;
  font-weight: 600;
  border-bottom: 2px solid rgba(59, 130, 246, 0.5);
}

.tech-table :deep(.el-table td) {
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.tech-table :deep(.el-table__row--striped) {
  background: rgba(30, 41, 59, 0.05);
}

.tech-table :deep(.el-table__row--striped:hover) {
  background: linear-gradient(90deg,
      rgba(59, 130, 246, 0.08) 0%,
      rgba(139, 92, 246, 0.05) 100%);
}

/* 分页组件样式 */
.pagination-compact :deep(.el-pagination) {
  height: 24px;
  line-height: 24px;
}

.pagination-compact :deep(.el-pagination__total),
.pagination-compact :deep(.el-pagination__sizes),
.pagination-compact :deep(.el-pagination__jump),
.pagination-compact :deep(.el-pagination__prev),
.pagination-compact :deep(.el-pagination__next),
.pagination-compact :deep(.el-pagination__pager) {
  height: 24px;
  line-height: 24px;
}

.pagination-compact :deep(.el-pagination button),
.pagination-compact :deep(.el-pagination .btn-prev),
.pagination-compact :deep(.el-pagination .btn-next) {
  height: 24px;
  width: 24px;
  line-height: 24px;
}

.pagination-compact :deep(.el-pagination .el-pager li) {
  height: 24px;
  min-width: 24px;
  line-height: 24px;
}

.pagination-compact :deep(.el-pagination .el-input__wrapper) {
  height: 24px;
}

.pagination-compact :deep(.el-pagination .el-input__inner) {
  height: 24px;
  line-height: 24px;
}

/* 确保表格容器正确计算高度 */
.min-h-0 {
  min-height: 0;
}

/* 表格高度控制 */
.tech-table :deep(.el-table__body-wrapper),
.tech-table :deep(.el-table__header-wrapper) {
  overflow: auto;
}

/* 确保表格不会因为数据行数增多而扩展 */
.tech-table :deep(.el-table) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tech-table :deep(.el-table__header-wrapper) {
  flex-shrink: 0;
}

.tech-table :deep(.el-table__body-wrapper) {
  flex: 1;
  overflow: auto;
}

/* 复制按钮样式 */
.tech-table :deep(.copy-btn) {
  padding: 2px;
  min-width: 24px;
  height: 24px;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.tech-table :deep(.copy-btn:hover) {
  opacity: 1;
  transform: scale(1.1);
}

.tech-table :deep(.copy-btn .el-icon) {
  font-size: 14px;
}

/* 地址文本样式 */
.tech-table :deep(.truncate) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
