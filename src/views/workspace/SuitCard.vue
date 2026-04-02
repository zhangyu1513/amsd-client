<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useRouter } from 'vue-router'
import { Select, CloseBold, SemiSelect, Tickets, MessageBox, Plus, Search, Refresh, Suitcase } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { PaginationParams, Suit, SuitSearchParams } from '@/api/types'
import AddProcess from './components/AddProcess.vue'


// 表格数据
const tableData = ref<Suit[]>([])
const tableLoading = ref(false)

// 数据版本号 - 用于触发动画
const dataVersion = ref(0)

const searchForm = ref<Suit>({})

const paginationForm = ref<PaginationParams>({
  Page: 1,
  PageSize: 20
})

const total = ref(0)


// Emits
const emit = defineEmits<{
  'add-process-tab': [suitId: number, suitNumber: string]
}>()

// 搜索参数 - 使用类型安全的 SuitSearchParams
const searchParams = computed<SuitSearchParams>(() => {
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

// 从API获取套单数据
const listSuits = async () => {
  tableLoading.value = true
  try {
    // 调用API接口
    const response = await api.suit.getSuits(searchParams.value)

    // 先清空数据，确保动画能重新触发
    tableData.value = []
    // 使用nextTick确保DOM更新后再设置新数据
    await nextTick()
    tableData.value = response.List
    console.log('获取套单数据成功:', response)
    total.value = response.Total
  } catch (error) {
    console.error('获取套单数据失败:', error)
    ElMessage.error('获取数据失败，请检查网络连接')
  } finally {
    tableLoading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  paginationForm.value.Page = page
  listSuits() // 重新加载数据
}

// 处理每页显示数量变化
const handleSizeChange = (size: number) => {
  paginationForm.value.PageSize = size
  paginationForm.value.Page = 1 // 重置到第一页
  listSuits() // 重新加载数据
}
// 监听表格数据变化，触发动画
watch(tableData, () => {
  // 每次数据变化时递增版本号
  dataVersion.value++
}, { deep: true })

onMounted(() => {
  listSuits()
})

onUnmounted(() => {
})

const addProcessFlag = ref(false)
const addProcessParam = ref<Suit>({})

const openAddProcess = (suit: Suit) => {
  addProcessFlag.value = true
  addProcessParam.value = suit
}

const closeAddProcess = () => {
  addProcessFlag.value = false
}


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
            <el-table-column prop="Number" label="套单编号" align="center" header-align="center" width="140" />
            <el-table-column prop="CustomerCode" label="客户编号" align="center" header-align="center" width="120" />
            <el-table-column prop="CustomerName" label="客户名称" align="center" header-align="center" />
            <el-table-column label="生命周期" prop="Status" align="center" header-align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.Status === 'open'" type="success" size="small">OPEN</el-tag>
                <el-tag v-else-if="scope.row.Status === 'close'" type="danger" size="small">CLOSE</el-tag>
                <el-tag v-else type="info" size="small">未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Saler" label="锁定人员" align="center" header-align="center" width="100" />
            <el-table-column label="操作" align="center" header-align="center" width="160" fixed="right">
              <template #default="scope">
                <div class="flex justify-center space-x-1">
                  <!-- <el-button type="primary" size="small" link @click="toOrders(scope.row.ID)" disabled>
                    <el-icon>
                      <Tickets />
                    </el-icon>
                    <span class="ml-1">子单</span>
                  </el-button> -->
                  <el-button type="primary" size="small" link @click="openAddProcess(scope.row)">
                    <el-icon>
                      <MessageBox />
                    </el-icon>
                    <span class="ml-1">处理</span>
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
    <!-- AddProcess组件 -->
    <AddProcess :visible="addProcessFlag" :suit="addProcessParam" @close="closeAddProcess" />
  </el-row>
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
</style>
