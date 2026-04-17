<script setup lang="ts">
import type { StorageFolder } from '@/api/types'

defineProps<{
  visible: boolean
  type: 'copy' | 'move'
  folders: StorageFolder[]
  targetFolderId: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:targetFolderId', value: number): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="type === 'copy' ? '复制文件' : '移动文件'"
    width="400px"
    @update:model-value="(val: boolean) => emit('update:visible', val)"
  >
    <el-form>
      <el-form-item label="目标文件夹">
        <el-select
          :model-value="targetFolderId"
          placeholder="选择目标文件夹"
          @update:model-value="(val: number) => emit('update:targetFolderId', val)"
        >
          <el-option v-for="f in folders" :key="f.ID" :label="f.Name" :value="f.ID" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="emit('confirm')">确定</el-button>
    </template>
  </el-dialog>
</template>
