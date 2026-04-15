<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { Sunny, Finished, CircleCheckFilled, Timer } from '@element-plus/icons-vue'

const loading = ref(true)
const suitStats = ref({ executed: 0, pending: 0 })
const orderStats = ref({ executed: 0, pending: 0 })

const fetchData = async () => {
  try {
    const res = await api.dashboard.getTodayStats()
    suitStats.value = {
      executed: res.ExecutedSuits || 0,
      pending: res.PendingSuits || 0,
    }
    orderStats.value = {
      executed: res.ExecutedOrders || 0,
      pending: res.PendingOrders || 0,
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
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
        <el-icon class="text-orange-500 text-lg">
          <Sunny />
        </el-icon>
        <span class="font-medium">今日实时数据</span>
      </div>
    </template>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="p-4 bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <el-icon class="text-lg">
                <Finished />
              </el-icon>
              <span class="font-semibold">套单</span>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-3xl font-bold">{{ suitStats.executed + suitStats.pending }}</div>
            <div class="text-xs opacity-75">总套单数</div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white/20 backdrop-blur rounded-lg p-2">
              <div class="flex items-center gap-1 text-xs opacity-75">
                <el-icon class="text-xs">
                  <CircleCheckFilled />
                </el-icon>
                <span>已处理数</span>
              </div>
              <div class="text-xl font-bold mt-1">{{ suitStats.executed }}</div>
            </div>
            <div class="bg-white/20 backdrop-blur rounded-lg p-2">
              <div class="flex items-center gap-1 text-xs opacity-75">
                <el-icon class="text-xs">
                  <Timer />
                </el-icon>
                <span>等待处理</span>
              </div>
              <div class="text-xl font-bold mt-1">{{ suitStats.pending }}</div>
            </div>
          </div>

          <el-progress :percentage="Math.round((suitStats.executed / (suitStats.executed + suitStats.pending || 1)) * 100)
            " :stroke-width="4" :show-text="false" color="#fff" class="mt-3" />
          <div class="flex justify-end text-xs mt-1 opacity-60">
            {{
              Math.round(
                (suitStats.executed / (suitStats.executed + suitStats.pending || 1)) * 100,
              )
            }}%
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="p-4 bg-linear-to-br from-violet-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <el-icon class="text-lg">
                <Finished />
              </el-icon>
              <span class="font-semibold">订单</span>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-3xl font-bold">{{ orderStats.executed + orderStats.pending }}</div>
            <div class="text-xs opacity-75">总订单数</div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white/20 backdrop-blur rounded-lg p-2">
              <div class="flex items-center gap-1 text-xs opacity-75">
                <el-icon class="text-xs">
                  <CircleCheckFilled />
                </el-icon>
                <span>已处理数</span>
              </div>
              <div class="text-xl font-bold mt-1">{{ orderStats.executed }}</div>
            </div>
            <div class="bg-white/20 backdrop-blur rounded-lg p-2">
              <div class="flex items-center gap-1 text-xs opacity-75">
                <el-icon class="text-xs">
                  <Timer />
                </el-icon>
                <span>等待处理</span>
              </div>
              <div class="text-xl font-bold mt-1">{{ orderStats.pending }}</div>
            </div>
          </div>

          <el-progress :percentage="Math.round(
            (orderStats.executed / (orderStats.executed + orderStats.pending || 1)) * 100,
          )
            " :stroke-width="4" :show-text="false" color="#fff" class="mt-3" />
          <div class="flex justify-end text-xs mt-1 opacity-60">
            {{
              Math.round(
                (orderStats.executed / (orderStats.executed + orderStats.pending || 1)) * 100,
              )
            }}%
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>
