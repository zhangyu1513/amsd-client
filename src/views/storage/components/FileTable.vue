<script setup lang="ts">
import { Folder, Picture, Document } from '@element-plus/icons-vue'
import type { StorageFile, StorageFolder } from '@/api/types'
import { formatFileSize, formatDate, getFileType, isImageFile } from '@/utils/index'

defineProps<{
  files: StorageFile[]
  loading: boolean
  pagination: { page: number; pageSize: number; total: number }
}>()

const emit = defineEmits<{
  (e: 'download', file: StorageFile): void
  (e: 'copy', file: StorageFile): void
  (e: 'move', file: StorageFile): void
  (e: 'versions', file: StorageFile): void
  (e: 'tags', file: StorageFile): void
  (e: 'delete', file: StorageFile): void
  (e: 'page-change', page: number): void
}>()
</script>

<template>
  <el-card class="h-full flex-1 overflow-hidden">
    <el-table :data="files" v-loading="loading" stripe>
      <el-table-column type="selection" width="40" />
      <el-table-column label="文件名" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-icon v-if="getFileType(row.Name) === 'folder'">
              <Folder />
            </el-icon>
            <el-icon v-else-if="isImageFile({ name: row.Name } as File)">
              <Picture />
            </el-icon>
            <el-icon v-else>
              <Document />
            </el-icon>
            <span>{{ row.Name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="100">
        <template #default="{ row }">
          {{ formatFileSize(row.Size) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.UpdatedAt!) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-1">
            <el-button link type="primary" size="small" @click="emit('download', row)">
              下载
            </el-button>
            <el-button link type="primary" size="small" @click="emit('copy', row)">
              复制
            </el-button>
            <el-button link type="primary" size="small" @click="emit('move', row)">
              移动
            </el-button>
            <el-button link type="warning" size="small" @click="emit('versions', row)">
              版本
            </el-button>
            <el-button link type="info" size="small" @click="emit('tags', row)"> 标签 </el-button>
            <el-button link type="danger" size="small" @click="emit('delete', row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="(page: number) => emit('page-change', page)"
      />
    </div>
  </el-card>
</template>
