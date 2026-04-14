<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { api } from '@/api'
import { Timer, RefreshRight, Monitor } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

interface RunningTask {
  Type?: string
  LocalWorkspace?: string
  RunningTime?: number
}

const loading = ref(true)
const tasks = ref<RunningTask[]>([])
let refreshTimer: ReturnType<typeof setInterval> | null = null

const getTaskTypeColor = (type?: string) => {
  const colors: Record<string, string> = {
    Process: 'bg-orange-500',
    Fracture: 'bg-violet-500',
    Density: 'bg-cyan-500',
  }
  return colors[type || ''] || 'bg-gray-500'
}

const getTaskTypeTextColor = (type?: string) => {
  const colors: Record<string, string> = {
    Process: 'text-orange-500',
    Fracture: 'text-violet-500',
    Density: 'text-cyan-500',
  }
  return colors[type || ''] || 'text-gray-500'
}

const formatDuration = (nanoseconds?: number) => {
  if (!nanoseconds) return '0s'
  const seconds = Math.floor(nanoseconds / 1e9)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

const fetchTasks = async () => {
  try {
    const res = await api.dashboard.getRunningTasks()
    tasks.value = res || []
  } catch (error) {
    console.error('获取运行任务失败:', error)
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  loading.value = true
  fetchTasks()
}

onMounted(() => {
  fetchTasks()
  refreshTimer = setInterval(() => {
    fetchTasks()
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<template>
  <el-card shadow="hover" class="h-full">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <el-icon class="text-blue-500 text-lg">
            <Monitor />
          </el-icon>
          <span class="font-medium">运行中的任务</span>
          <el-tag type="warning" size="small" effect="dark">{{ tasks.length }}</el-tag>
        </div>
        <el-button :icon="RefreshRight" circle size="small" @click="handleRefresh" :loading="loading" />
      </div>
    </template>

    <div v-if="loading && tasks.length === 0" class="flex items-center justify-center h-48">
      <el-icon class="is-loading text-2xl text-gray-400">
        <RefreshRight />
      </el-icon>
    </div>

    <el-empty v-else-if="tasks.length === 0" description="暂无运行中的任务" />

    <div v-else class="space-y-2 max-h-100 overflow-y-auto pr-1">
      <div v-for="(task, index) in tasks" :key="index"
        class="group flex items-center gap-3 p-3 dark:bg-[#1d1d1d] rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer">
        <div :class="['w-1 h-12 rounded-full', getTaskTypeColor(task.Type)]"></div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span :class="[
              'text-sm font-medium px-2 py-0.5 rounded',
              getTaskTypeTextColor(task.Type) + '/10',
              getTaskTypeTextColor(task.Type),
            ]">
              {{ task.Type || 'Unknown' }}
            </span>
          </div>
          <div class="text-xs text-gray-400 truncate" :title="task.LocalWorkspace">
            {{ task.LocalWorkspace }}
          </div>
        </div>

        <div class="flex items-center gap-1 text-orange-500">
          <el-icon class="animate-pulse">
            <Timer />
          </el-icon>
          <span class="text-sm font-medium">{{ formatDuration(task.RunningTime) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>自动刷新: 30秒</span>
        <span>共 {{ tasks.length }} 个任务</span>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}

.el-card :deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.el-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.el-card :deep(.el-card__footer) {
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.max-h-\[400px\]::-webkit-scrollbar {
  width: 4px;
}

.max-h-\[400px\]::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.max-h-\[400px\]::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
