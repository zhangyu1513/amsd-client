<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '@/api'
import type { NodeMonitor, NodeStatus } from '@/api/types'

const loading = ref(true)
const nodeMonitor = ref<NodeMonitor | null>(null)

const fetchData = async () => {
  try {
    const res = await api.dashboard.getNodeMonitor()
    nodeMonitor.value = res
  } catch (error) {
    console.error('获取节点监控数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const nodeList = computed(() => {
  if (!nodeMonitor.value?.History) return []
  return Object.entries(nodeMonitor.value.History).map(([ip, history]) => {
    const latest = history[history.length - 1]
    return { ip, history, latest }
  })
})

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const getStatusColor = (value: number) => {
  if (value >= 90) return 'danger'
  if (value >= 70) return 'warning'
  return 'success'
}
</script>

<template>
  <el-card shadow="hover">
    <template #header>
      <span class="font-medium">节点监控</span>
    </template>
    <div v-if="loading" class="h-48 flex items-center justify-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
    </div>
    <div v-else-if="nodeList.length" class="space-y-4">
      <div
        v-for="item in nodeList"
        :key="item.ip"
        class="p-3 bg-gray-50 dark:bg-[#1d1d1d] rounded-lg border border-gray-100 dark:border-gray-700"
      >
        <div class="text-sm font-medium mb-2">{{ item.ip }}</div>
        <div v-if="item.latest" class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-400">CPU</span>
            <el-progress
              :percentage="item.latest.CPU"
              :status="getStatusColor(item.latest.CPU)"
              :stroke-width="6"
              style="width: 60px"
            />
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">内存</span>
            <el-progress
              :percentage="item.latest.Memory"
              :status="getStatusColor(item.latest.Memory)"
              :stroke-width="6"
              style="width: 60px"
            />
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">磁盘</span>
            <el-progress
              :percentage="item.latest.Disk"
              :status="getStatusColor(item.latest.Disk)"
              :stroke-width="6"
              style="width: 60px"
            />
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">负载</span>
            <span class="font-medium">{{ item.latest.LoadAvg.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">入站</span>
            <span class="font-medium">{{ formatBytes(item.latest.NetIn) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">出站</span>
            <span class="font-medium">{{ formatBytes(item.latest.NetOut) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-48 flex items-center justify-center text-gray-400">
      <span>暂无监控数据</span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Loading } from '@element-plus/icons-vue'
export default {
  components: { Loading },
}
</script>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>
