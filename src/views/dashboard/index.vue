<script setup lang="ts">
// 仪表盘页面
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Folder,
  DocumentCopy,
  Setting,
  Clock,
  TrendCharts,
  PieChart,
  List,
} from '@element-plus/icons-vue'

const loading = ref(true)
const stats = ref({
  totalSuits: 0,
  totalOrders: 0,
  totalProcesses: 0,
  activeTasks: 0,
  todayNewSuits: 0,
  todayNewOrders: 0,
  successRate: 0,
  avgProcessTime: 0,
})

// 从mock接口获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/dashboard/stats')
    const result = await response.json()
    
    if (result.code === 200) {
      stats.value = result.data
      ElMessage.success(result.message || '数据加载成功')
    } else {
      ElMessage.error(result.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('网络错误，获取数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const handleRefresh = () => {
  fetchStats()
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p class="text-gray-500 mt-1">系统概览与统计数据</p>
      </div>
      <el-button type="primary" :icon="Refresh" @click="handleRefresh">刷新</el-button>
    </div>

    <!-- 统计卡片 -->
    <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <el-card shadow="hover" class="cursor-pointer transition-all hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <el-icon size="24"><Folder /></el-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500">套单总数</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalSuits }}</p>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="cursor-pointer transition-all hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
            <el-icon size="24"><DocumentCopy /></el-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500">子单总数</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalOrders }}</p>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="cursor-pointer transition-all hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <el-icon size="24"><Setting /></el-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500">处理任务</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalProcesses }}</p>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="cursor-pointer transition-all hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
            <el-icon size="24"><Clock /></el-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500">进行中任务</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.activeTasks }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">任务趋势</span>
            <el-select size="small" style="width: 120px" placeholder="选择周期">
              <el-option label="最近7天" value="7" />
              <el-option label="最近30天" value="30" />
              <el-option label="最近90天" value="90" />
            </el-select>
          </div>
        </template>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <el-icon size="48" class="mb-2"><TrendCharts /></el-icon>
            <p>图表组件待实现</p>
          </div>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">任务分布</span>
            <el-select size="small" style="width: 120px" placeholder="选择类型">
              <el-option label="套单" value="suits" />
              <el-option label="子单" value="orders" />
              <el-option label="处理" value="processes" />
            </el-select>
          </div>
        </template>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <el-icon size="48" class="mb-2"><PieChart /></el-icon>
            <p>图表组件待实现</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <el-card>
      <template #header>
        <span class="text-lg font-semibold">最近活动</span>
      </template>
      <el-table :data="[]" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="target" label="目标" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.status === '成功' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center py-4 text-gray-400">
        <el-icon size="24" class="mb-2"><List /></el-icon>
        <p>暂无活动记录</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>