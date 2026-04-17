<script setup lang="ts">
import type { StorageStats } from '@/api/types'
import { formatFileSize } from '@/utils/index'

defineProps<{
  stats: StorageStats | null
}>()
</script>

<template>
  <el-card v-if="stats" class="mb-4">
    <div class="flex gap-6">
      <div>
        <span class="text-gray-500">总容量：</span>
        <span class="font-bold">{{ formatFileSize(stats.TotalSize) }}</span>
      </div>
      <div>
        <span class="text-gray-500">已使用：</span>
        <span class="font-bold">{{ formatFileSize(stats.UsedSize) }}</span>
      </div>
      <div>
        <span class="text-gray-500">文件数：</span>
        <span class="font-bold">{{ stats.FileCount }}</span>
      </div>
      <div>
        <span class="text-gray-500">卷数量：</span>
        <span class="font-bold">{{ stats.TotalVolumes }}</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.font-bold {
  font-weight: 600;
}
</style>
