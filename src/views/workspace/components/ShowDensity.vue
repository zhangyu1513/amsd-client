<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick, onUnmounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { Process, Density, DensitySearchParams, PaginationParams } from '@/api/types'
import { api } from '@/api'
import { CopyDocument } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'
import { useUserStore } from '@/stores/user'
import { copyToClipboard } from '@/utils/clipboard'

const userStore = useUserStore()

interface Props {
  visible: boolean
  process: Process
}

const props = defineProps<Props>()

const density = reactive<Density>({
  Type: 'CUSTOM',
  ChipWindow: '',
})

const loading = ref(false)

const emit = defineEmits(['close'])

const dialogVisible = ref(false)

const tableData = ref<Density[]>([])
const tableLoading = ref(false)
const dataVersion = ref(0)

const lastFetchTime = ref('')
const autoRefresh = ref(false)
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null

const paginationForm = ref<PaginationParams>({
  Page: 1,
  PageSize: 20,
})
const total = ref(0)

const searchParams = computed<DensitySearchParams>(() => ({
  ...paginationForm.value,
  ProcessID: props.process.ID,
}))

const listDensities = async () => {
  if (!props.process.ID) return
  tableLoading.value = true
  try {
    const response = await api.density.getDensities(searchParams.value)
    tableData.value = []
    await nextTick()
    tableData.value = response.list
    total.value = response.total
    lastFetchTime.value = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('获取密度分析数据失败:', error)
  } finally {
    tableLoading.value = false
  }
}

watch(
  tableData,
  () => {
    dataVersion.value++
  },
  { deep: true },
)

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = props.visible
    if (newVal) {
      resetForm()
      listDensities()
    }
  },
)

watch(
  () => props.process.ID,
  () => {
    if (dialogVisible.value) {
      listDensities()
    }
  },
)

watch(autoRefresh, (val: boolean) => {
  if (val) {
    autoRefreshTimer = setInterval(() => {
      listDensities()
    }, 1000)
  } else if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
})

onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
  }
})

const handleClose = () => {
  resetForm()
  autoRefresh.value = false
  emit('close')
}

const resetForm = () => {
  density.Type = 'CUSTOM'
  density.ChipWindow = ''
}

const handleSubmit = async () => {
  if (!props.process.ID) {
    ElMessage.error('ProcessID不存在')
    return
  }

  const submitData: Density = {
    ...density,
    UserID: userStore.userInfo?.ID,
    ProcessID: props.process.ID,
  }

  loading.value = true
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在创建密度分析任务...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    await api.density.createDensity(submitData)
    listDensities()
    ElMessage.success('添加密度分析任务成功')
  } catch (error) {
    console.error('创建密度分析任务失败:', error)
  } finally {
    loadingInstance.close()
    loading.value = false
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="密度分析" width="80%" :close-on-click-modal="false"
    :close-on-press-escape="false" draggable @close="handleClose">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <el-form ref="formRef" :model="density" size="small" label-position="top" class="flex items-center gap-4">
          <el-form-item label="类型" prop="Type">
            <el-radio-group v-model="density.Type">
              <el-radio value="PROCESS">PROCESS</el-radio>
              <el-radio value="CUSTOM">CUSTOM</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ChipWindow" v-if="density.Type === 'CUSTOM'">
            <el-input v-model="density.ChipWindow" placeholder="example: -100 -100 100 100" style="width: 200px" />
          </el-form-item>
        </el-form>
        <div class="flex items-center gap-2 ml-auto">
          <el-button type="primary" @click="handleSubmit" :loading="loading" size="small">提交</el-button>
          <el-tag type="info" size="small">{{ lastFetchTime || '-' }}</el-tag>
          <el-switch v-model="autoRefresh" />
        </div>
      </div>

      <div class="flex-1 min-h-0">
        <el-table :data="tableData" border show-overflow-tooltip v-loading="tableLoading" size="small"
          class="w-full tech-table" :data-version="dataVersion" height="300">
          <el-table-column type="index" label="#" align="center" header-align="center" width="50" />
          <el-table-column prop="CreatedAt" label="创建时间" align="center" header-align="center" width="160">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
          </el-table-column>
          <el-table-column prop="UpdatedAt" label="更新时间" align="center" header-align="center" width="160">
            <template #default="scope">
              {{ formatDate(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop="Creator" align="center" header-align="center" width="80" />
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
                <el-button v-if="scope.row.LocalAddress" type="primary" link size="small" class="copy-btn"
                  @click.stop="copyToClipboard(scope.row.LocalAddress)">
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="Type" label="类型" align="center" header-align="center" width="100" />
          <el-table-column prop="ChipWindow" label="ChipWindow" align="center" header-align="center" width="180" />
          <el-table-column prop="EDA" label="EDA" align="center" header-align="center" width="100" />
          <el-table-column prop="Threads" label="线程数" align="center" header-align="center" width="80" />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog) {
  border-radius: 20px !important;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 20px;
  width: 100%;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: 1px solid #e4e7ed;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}
</style>
