<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authLogApi } from '@/api/user'
import { formatDate } from '@/utils/date'
import type { LoginLog } from '@/api/user'

const tableData = ref<LoginLog[]>([])
const tableLoading = ref(false)

const paginationForm = ref({
  Page: 1,
  PageSize: 20,
})

const total = ref(0)

async function fetchData() {
  tableLoading.value = true
  try {
    const res = await authLogApi.getLoginLogs(paginationForm.value)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取登录日志失败:', error)
  } finally {
    tableLoading.value = false
  }
}

function handlePageChange(page: number) {
  paginationForm.value.Page = page
  fetchData()
}

function handleSizeChange(size: number) {
  paginationForm.value.PageSize = size
  paginationForm.value.Page = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 flex items-center gap-4">
      <span class="text-sm text-gray-400">登录日志记录</span>
    </div>

    <div class="flex-1 min-h-0">
      <el-table :data="tableData" border v-loading="tableLoading" size="small" height="100%">
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column prop="Username" label="用户名" align="center" min-width="120" />
        <el-table-column prop="Ip" label="IP 地址" align="center" min-width="140" />
        <el-table-column prop="Status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.Status === 'success'" type="success" size="small">成功</el-tag>
            <el-tag v-else-if="row.Status === 'failed'" type="danger" size="small">失败</el-tag>
            <el-tag v-else-if="row.Status === 'logout'" type="info" size="small">登出</el-tag>
            <el-tag v-else type="info" size="small">{{ row.Status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Message" label="消息" align="center" min-width="160" />
        <el-table-column
          prop="UserAgent"
          label="浏览器信息"
          align="center"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="CreatedAt" label="登录时间" align="center" width="180">
          <template #default="{ row }">
            {{ formatDate(row.CreatedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="h-6 shrink-0 flex items-center justify-center mt-2">
      <el-pagination
        v-model:current-page="paginationForm.Page"
        v-model:page-size="paginationForm.PageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        size="small"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
