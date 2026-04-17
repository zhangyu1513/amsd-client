<script setup lang="ts">
import type { StorageFile, FileTag } from '@/api/types'

defineProps<{
  visible: boolean
  currentFile: StorageFile | null
  tagForm: { key: string; value: string }
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'add-tag'): void
  (e: 'remove-tag', tag: FileTag): void
}>()
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="管理标签"
    width="400px"
    @update:model-value="(val: boolean) => emit('update:visible', val)"
  >
    <div v-if="currentFile" class="mb-4">
      <div class="text-gray-500 mb-2">{{ currentFile.Name }} 的标签</div>
      <div v-if="currentFile.Tags?.length" class="flex flex-wrap gap-2 mb-4">
        <el-tag
          v-for="tag in currentFile.Tags"
          :key="tag.ID"
          closable
          @close="emit('remove-tag', tag)"
        >
          {{ tag.Key }}: {{ tag.Value }}
        </el-tag>
      </div>
      <el-empty v-else description="暂无标签" :image-size="60" />
    </div>
    <el-form @submit.prevent="emit('add-tag')">
      <el-form-item label="标签键">
        <el-input
          :model-value="tagForm.key"
          placeholder="请输入标签键"
          @update:model-value="(val: string) => (tagForm.key = val)"
        />
      </el-form-item>
      <el-form-item label="标签值">
        <el-input
          :model-value="tagForm.value"
          placeholder="请输入标签值"
          @update:model-value="(val: string) => (tagForm.value = val)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="emit('add-tag')">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
