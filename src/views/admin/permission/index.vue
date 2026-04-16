<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { permissionApi, adminApi } from '@/api/user'
import PermissionForm from './components/PermissionForm.vue'
import type { Permission, PermissionSearchParams } from '@/api/user'

const tableData = ref<Permission[]>([])
const tableLoading = ref(false)

const searchForm = ref<PermissionSearchParams>({
  Name: '',
  Code: '',
  Resource: '',
  Action: '',
})

const paginationForm = ref({
  Page: 1,
  PageSize: 20,
})

const total = ref(0)

const resourceOptions = [
  { label: '全部', value: '' },
  { label: '用户', value: 'user' },
  { label: '角色', value: 'role' },
  { label: '权限', value: 'permission' },
]

const actionOptions = [
  { label: '全部', value: '' },
  { label: '创建', value: 'create' },
  { label: '读取', value: 'read' },
  { label: '更新', value: 'update' },
  { label: '删除', value: 'delete' },
]

const formVisible = ref(false)
const editingPermission = ref<Permission | null>(null)

async function fetchData() {
  tableLoading.value = true
  try {
    const params: PermissionSearchParams = {
      ...paginationForm.value,
      ...searchForm.value,
    }
    const res = await permissionApi.getPermissions(params)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取权限列表失败:', error)
  } finally {
    tableLoading.value = false
  }
}

function handleSearch() {
  paginationForm.value.Page = 1
  fetchData()
}

function handleReset() {
  searchForm.value = {
    Name: '',
    Code: '',
    Resource: '',
    Action: '',
  }
  paginationForm.value.Page = 1
  fetchData()
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

function handleAdd() {
  editingPermission.value = null
  formVisible.value = true
}

function handleEdit(row: Permission) {
  editingPermission.value = { ...row }
  formVisible.value = true
}

async function handleDelete(row: Permission) {
  try {
    await ElMessageBox.confirm(`确定要删除权限 "${row.Name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await adminApi.deletePermission(row.ID)
    fetchData()
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 flex items-center gap-4">
      <el-input
        v-model="searchForm.Name"
        placeholder="权限名称"
        clearable
        style="width: 140px"
        @keyup.enter="handleSearch"
      />
      <el-input
        v-model="searchForm.Code"
        placeholder="权限代码"
        clearable
        style="width: 140px"
        @keyup.enter="handleSearch"
      />
      <el-select v-model="searchForm.Resource" placeholder="资源" clearable style="width: 100px">
        <el-option
          v-for="item in resourceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="searchForm.Action" placeholder="操作" clearable style="width: 100px">
        <el-option
          v-for="item in actionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <div class="flex-1 min-h-0">
      <el-table :data="tableData" border v-loading="tableLoading" size="small" height="100%">
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column prop="Name" label="权限名称" align="center" min-width="120" />
        <el-table-column prop="Code" label="权限代码" align="center" min-width="160" />
        <el-table-column prop="Resource" label="资源" align="center" width="100" />
        <el-table-column prop="Action" label="操作" align="center" width="100" />
        <el-table-column prop="Description" label="描述" align="center" min-width="200" />
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-center gap-1">
              <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
            </div>
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

    <PermissionForm
      v-model:visible="formVisible"
      :permission="editingPermission"
      @close="formVisible = false"
      @success="fetchData"
    />
  </div>
</template>
