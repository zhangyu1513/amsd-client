<script setup lang="ts">
import type { StorageVolume, StorageFolder } from '@/api/types'

defineProps<{
  volumes: StorageVolume[]
  currentVolume: StorageVolume | undefined
  currentFolder: StorageFolder | null
  currentPath: StorageFolder[]
  searchKeyword: string
  uploading: boolean
  uploadProgress: number
}>()

const emit = defineEmits<{
  (e: 'update:currentVolume', volume: StorageVolume): void
  (e: 'select-volume', volume: StorageVolume): void
  (e: 'go-back'): void
  (e: 'upload'): void
  (e: 'update:searchKeyword', value: string): void
  (e: 'search'): void
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-4">
      <el-select
        :model-value="currentVolume?.ID"
        placeholder="选择卷"
        @change="(val: number) => emit('update:currentVolume', volumes.find((v) => v.ID === val)!)"
      >
        <el-option v-for="v in volumes" :key="v.ID" :label="v.Name" :value="v.ID" />
      </el-select>
      <el-button @click="emit('go-back')" :disabled="currentPath.length === 0">
        返回上级
      </el-button>
    </div>
    <div class="flex items-center gap-2">
      <el-input
        :model-value="searchKeyword"
        placeholder="搜索文件"
        clearable
        style="width: 200px"
        @update:model-value="(val: string) => emit('update:searchKeyword', val)"
        @keyup.enter="emit('search')"
      />
      <el-button type="primary" @click="emit('upload')" :loading="uploading">
        {{ uploading ? `上传中 ${uploadProgress}%` : '上传文件' }}
      </el-button>
    </div>
  </div>
</template>
