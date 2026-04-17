<script setup lang="ts">
import type { StorageFile, FileVersion } from '@/api/types'
import { formatFileSize, formatDate } from '@/utils/index'

defineProps<{
  visible: boolean
  versions: FileVersion[]
  currentFile: StorageFile | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'rollback', version: FileVersion): void
}>()
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="文件版本"
    width="500px"
    @update:model-value="(val: boolean) => emit('update:visible', val)"
  >
    <el-table :data="versions" max-height="400">
      <el-table-column prop="Version" label="版本号" width="100" />
      <el-table-column label="大小" width="100">
        <template #default="{ row }">
          {{ formatFileSize(row.Size) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.CreatedAt!) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="emit('rollback', row)"> 回滚 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
