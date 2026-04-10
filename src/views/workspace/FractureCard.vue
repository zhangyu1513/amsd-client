<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Select,
  CloseBold,
  SemiSelect,
  Tickets,
  MessageBox,
  Plus,
  Search,
  Refresh,
  CopyDocument,
} from '@element-plus/icons-vue'
import { api } from '../../api'
import type { PaginationParams, Fracture, FractureSearchParams } from '../../api/types'
import Log from './components/Log.vue'

// 表格数据
const tableData = ref<Fracture[]>([])
const tableLoading = ref(false)

// 数据版本号 - 用于触发动画
const dataVersion = ref(0)

const searchForm = ref<Fracture>({})

const paginationForm = ref<PaginationParams>({
  Page: 1,
  PageSize: 20,
})

const total = ref(0)

// Log 组件引用
const logRef = ref<InstanceType<typeof Log>>()

// 搜索参数 - 使用类型安全的 FractureSearchParams
const searchParams = computed<FractureSearchParams>(() => {
  return {
    ...paginationForm.value,
    ...searchForm.value,
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/\//g, '-')
}

// 从API获取断裂分析数据
const listFractures = async () => {
  tableLoading.value = true
  try {
    // 调用API接口
    const response = await api.fracture.getFractures(searchParams.value)

    // 先清空数据，确保动画能重新触发
    tableData.value = []
    // 使用nextTick确保DOM更新后再设置新数据
    await nextTick()
    tableData.value = response.list
    console.log('获取断裂分析数据成功:', response)
    total.value = response.total
  } catch (error) {
    console.error('获取断裂分析数据失败:', error)
    ElMessage.error('获取数据失败，请检查网络连接')
  } finally {
    tableLoading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  paginationForm.value.Page = page
  listFractures() // 重新加载数据
}

// 处理每页显示数量变化
const handleSizeChange = (size: number) => {
  paginationForm.value.PageSize = size
  paginationForm.value.Page = 1 // 重置到第一页
  listFractures() // 重新加载数据
}

// 查看日志
const viewLog = (fractureId: number) => {
  if (!logRef.value) return
  logRef.value.open(fractureId)
}

// 复制文本到剪贴板
const copyToClipboard = (text: string) => {
  if (!text) {
    ElMessage.warning('没有内容可复制')
    return
  }

  // 1. 优先尝试使用现代的 Clipboard API
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage.success('已复制到剪贴板')
      })
      .catch((err) => {
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
watch(
  tableData,
  () => {
    // 每次数据变化时递增版本号
    dataVersion.value++
  },
  { deep: true },
)

onMounted(() => {
  listFractures()
})

onUnmounted(() => { })
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

            <!-- <el-table-column prop="UID" label="转档编号" align="center" header-align="center" width="280" /> -->
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
            <el-table-column prop="Format" label="格式" align="center" header-align="center" width="120" />
            <el-table-column prop="Classify" label="分类" align="center" header-align="center" width="200">
              <template #default="scope">
                <div class="flex items-center justify-between">
                  <span class="truncate flex-1 mr-2" :title="scope.row.Classify">
                    {{ scope.row.Classify || '-' }}
                  </span>
                  <el-button v-if="scope.row.Classify" type="text" size="small" class="copy-btn"
                    @click.stop="copyToClipboard(scope.row.Classify)">
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
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
  <Log ref="logRef" :log-type="'fracture'" :id="0" />
</template>
