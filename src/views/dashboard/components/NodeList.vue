<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import type { Node } from '@/api/types'

interface Props {
  title?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '节点列表',
  loading: false,
})

const data = ref<Node[]>([])
const localLoading = ref(true)

const fetchNodes = async () => {
  try {
    const res = await api.dashboard.getNodes()
    data.value = res || []
  } catch (error) {
    console.error('获取节点列表失败:', error)
  } finally {
    localLoading.value = false
  }
}

onMounted(() => {
  fetchNodes()
})

const getUsagePercent = (loaded: number, threads: number) => {
  if (!threads) return 0
  return Math.round((loaded / threads) * 100)
}

const getUsageStatus = (percent: number) => {
  if (percent >= 90) return 'danger'
  if (percent >= 70) return 'warning'
  return 'success'
}
</script>

<template>
  <el-card>
    <template #header>
      <span class="text-lg font-semibold">{{ title }}</span>
    </template>
    <div v-if="localLoading || loading" class="h-48 flex items-center justify-center">
      <el-icon class="is-loading" size="32">
        <Loading />
      </el-icon>
    </div>
    <div v-else-if="data?.length" class="space-y-3">
      <div v-for="node in data" :key="node.ID" class="p-3 rounded-lg bg-[#1d1d1d]">
        <div class="flex items-center gap-2">
          <!-- 左侧：图标+名称+主机 -->
          <div class="flex items-center gap-2 w-40 shrink-0">
            <div class="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900 text-blue-300">
              <el-icon size="16">
                <Monitor />
              </el-icon>
            </div>
            <div class="min-w-0">
              <div class="font-medium text-sm truncate">{{ node.Name }}</div>
              <div class="text-xs text-gray-400 truncate">
                {{ node.Host }}:{{ node.Port }}
              </div>
            </div>
          </div>
          <!-- 中间：路径信息 -->
          <div class="flex-1 min-w-0 px-2">
            <div class="text-xs text-gray-500 truncate" :title="node.Workspace">
              {{ node.Workspace }}
            </div>
            <div class="text-xs text-gray-500 truncate" :title="node.ExePath">
              {{ node.ExePath }}
            </div>
          </div>
          <!-- 右侧：状态信息 -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="w-12 text-center">
              <div class="text-xs text-gray-400">类型</div>
              <div class="text-sm font-medium">{{ node.Type }}</div>
            </div>
            <div class="w-14 text-center">
              <div class="text-xs text-gray-400">线程</div>
              <div class="text-sm font-medium">{{ node.Loaded }}/{{ node.Threads }}</div>
            </div>
            <div class="w-10 text-center">
              <el-progress type="dashboard" :percentage="getUsagePercent(node.Loaded, node.Threads)"
                :status="getUsageStatus(getUsagePercent(node.Loaded, node.Threads))" :width="48" :stroke-width="8" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-48 flex items-center justify-center text-gray-400">
      <span>暂无节点数据</span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Loading, Monitor } from '@element-plus/icons-vue'
export default {
  components: { Loading, Monitor },
}
</script>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>
