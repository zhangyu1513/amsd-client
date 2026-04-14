<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '@/api'
import { Clock, FolderOpened, Document } from '@element-plus/icons-vue'

const loading = ref(true)

interface HistoryData {
  suit: { total: number; executed: number; pending: number }
  order: { total: number; executed: number; pending: number }
  process: { total: number; running: number; pending: number; error: number }
  fracture: { total: number; running: number; pending: number; error: number }
  density: { total: number; running: number; pending: number; error: number }
}

const stats = ref<HistoryData>({
  suit: { total: 0, executed: 0, pending: 0 },
  order: { total: 0, executed: 0, pending: 0 },
  process: { total: 0, running: 0, pending: 0, error: 0 },
  fracture: { total: 0, running: 0, pending: 0, error: 0 },
  density: { total: 0, running: 0, pending: 0, error: 0 },
})

const getProgressPercent = (current: number, total: number) => {
  if (!total) return 0
  return Math.round((current / total) * 100)
}

const suitProgress = computed(() =>
  getProgressPercent(stats.value.suit.executed, stats.value.suit.total),
)
const orderProgress = computed(() =>
  getProgressPercent(stats.value.order.executed, stats.value.order.total),
)
const processProgress = computed(() =>
  getProgressPercent(stats.value.process.running, stats.value.process.total),
)
const fractureProgress = computed(() =>
  getProgressPercent(stats.value.fracture.running, stats.value.fracture.total),
)
const densityProgress = computed(() =>
  getProgressPercent(stats.value.density.running, stats.value.density.total),
)

const fetchData = async () => {
  try {
    const res = await api.dashboard.getHistoryStats()
    stats.value = {
      suit: {
        total: (res.ExecutedSuits || 0) + (res.PendingSuits || 0),
        executed: res.ExecutedSuits || 0,
        pending: res.PendingSuits || 0,
      },
      order: {
        total: (res.ExecutedOrders || 0) + (res.PendingOrders || 0),
        executed: res.ExecutedOrders || 0,
        pending: res.PendingOrders || 0,
      },
      process: {
        total:
          (res.RunningProcessCount || 0) +
          (res.PendingProcessCount || 0) +
          (res.ErrorProcessCount || 0),
        running: res.RunningProcessCount || 0,
        pending: res.PendingProcessCount || 0,
        error: res.ErrorProcessCount || 0,
      },
      fracture: {
        total:
          (res.RunningFractureCount || 0) +
          (res.PendingFractureCount || 0) +
          (res.ErrorFractureCount || 0),
        running: res.RunningFractureCount || 0,
        pending: res.PendingFractureCount || 0,
        error: res.ErrorFractureCount || 0,
      },
      density: {
        total:
          (res.RunningDensityCount || 0) +
          (res.PendingDensityCount || 0) +
          (res.ErrorDensityCount || 0),
        running: res.RunningDensityCount || 0,
        pending: res.PendingDensityCount || 0,
        error: res.ErrorDensityCount || 0,
      },
    }
  } catch (error) {
    console.error('获取历史统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <el-card shadow="hover">
    <template #header>
      <div class="flex items-center gap-2">
        <el-icon class="text-lg">
          <Clock />
        </el-icon>
        <span class="font-medium">历史数据统计</span>
      </div>
    </template>
    <div class="space-y-6">
      <el-row :gutter="24">
        <el-col :span="12">
          <div
            class="p-4 bg-linear-to-br dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-500 text-xl">
                  <FolderOpened />
                </el-icon>
                <span class="text-blue-700 dark:text-blue-300 font-medium">套单</span>
              </div>
              <el-tag type="warning" size="small" effect="dark">请关注</el-tag>
            </div>
            <div class="flex items-end gap-4">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ stats.suit.executed }}
              </div>
              <div class="text-sm text-blue-500 mb-1">/ {{ stats.suit.total }} 总数</div>
            </div>
            <el-progress :percentage="suitProgress" :stroke-width="8" color="#3b82f6" class="mt-3" />
            <div class="flex justify-between text-xs text-blue-500 mt-1">
              <span>执行 {{ stats.suit.executed }}</span>
              <span>待处理 {{ stats.suit.pending }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div
            class="p-4 bg-linear-to-br dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <el-icon class="text-emerald-500 text-xl">
                  <Document />
                </el-icon>
                <span class="text-emerald-700 dark:text-emerald-300 font-medium">订单</span>
              </div>
              <el-tag type="warning" size="small" effect="dark">请关注</el-tag>
            </div>
            <div class="flex items-end gap-4">
              <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {{ stats.order.executed }}
              </div>
              <div class="text-sm text-emerald-500 mb-1">/ {{ stats.order.total }} 总数</div>
            </div>
            <el-progress :percentage="orderProgress" :stroke-width="8" color="#10b981" class="mt-3" />
            <div class="flex justify-between text-xs text-emerald-500 mt-1">
              <span>执行 {{ stats.order.executed }}</span>
              <span>待处理 {{ stats.order.pending }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <el-row :gutter="16">
        <el-col :span="8">
          <div class="p-3 dark:bg-[#1d1d1d] rounded-lg border dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-700 dark:text-gray-300 font-medium">Process</span>
              <span class="text-xs text-gray-400">任务处理</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 dark:bg-blue-900/30 rounded-lg">
                <div class="text-xl font-bold text-blue-500">{{ stats.process.running }}</div>
                <div class="text-xs text-blue-400">运行</div>
              </div>
              <div class="p-2 dark:bg-yellow-900/30 rounded-lg">
                <div class="text-xl font-bold text-yellow-500">{{ stats.process.pending }}</div>
                <div class="text-xs text-yellow-400">等待</div>
              </div>
              <div class="p-2 dark:bg-red-900/30 rounded-lg">
                <div class="text-xl font-bold text-red-500">{{ stats.process.error }}</div>
                <div class="text-xs text-red-400">错误</div>
              </div>
            </div>
            <el-progress :percentage="processProgress" :stroke-width="4" color="#3b82f6" class="mt-3" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="p-3 dark:bg-[#1d1d1d] rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-700 dark:text-gray-300 font-medium">Fracture</span>
              <span class="text-xs text-gray-400">转档任务</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 dark:bg-blue-900/30 rounded-lg">
                <div class="text-xl font-bold text-blue-500">{{ stats.fracture.running }}</div>
                <div class="text-xs text-blue-400">运行</div>
              </div>
              <div class="p-2 dark:bg-yellow-900/30 rounded-lg">
                <div class="text-xl font-bold text-yellow-500">{{ stats.fracture.pending }}</div>
                <div class="text-xs text-yellow-400">等待</div>
              </div>
              <div class="p-2 dark:bg-red-900/30 rounded-lg">
                <div class="text-xl font-bold text-red-500">{{ stats.fracture.error }}</div>
                <div class="text-xs text-red-400">错误</div>
              </div>
            </div>
            <el-progress :percentage="fractureProgress" :stroke-width="4" color="#3b82f6" class="mt-3" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="p-3 dark:bg-[#1d1d1d] rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-700 dark:text-gray-300 font-medium">Density</span>
              <span class="text-xs text-gray-400">透光率任务</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 dark:bg-blue-900/30 rounded-lg">
                <div class="text-xl font-bold text-blue-500">{{ stats.density.running }}</div>
                <div class="text-xs text-blue-400">运行</div>
              </div>
              <div class="p-2 dark:bg-yellow-900/30 rounded-lg">
                <div class="text-xl font-bold text-yellow-500">{{ stats.density.pending }}</div>
                <div class="text-xs text-yellow-400">等待</div>
              </div>
              <div class="p-2 dark:bg-red-900/30 rounded-lg">
                <div class="text-xl font-bold text-red-500">{{ stats.density.error }}</div>
                <div class="text-xs text-red-400">错误</div>
              </div>
            </div>
            <el-progress :percentage="densityProgress" :stroke-width="4" color="#3b82f6" class="mt-3" />
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
