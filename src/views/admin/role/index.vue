<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { roleApi, adminApi } from '@/api/user'
import RoleForm from './components/RoleForm.vue'
import RolePermissionDialog from './components/RolePermissionDialog.vue'
import type { Role, RoleSearchParams } from '@/api/user'

const tableData = ref<Role[]>([])
const tableLoading = ref(false)

const searchForm = ref<RoleSearchParams>({
  Name: '',
  Code: '',
  Status: '',
})

const paginationForm = ref({
  Page: 1,
  PageSize: 20,
})

const total = ref(0)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '激活', value: 'active' },
  { label: '停用', value: 'inactive' },
]

const formVisible = ref(false)
const permissionDialogVisible = ref(false)
const editingRole = ref<Role | null>(null)
const selectedRoleId = ref<number | null>(null)

async function fetchData() {
  tableLoading.value = true
  try {
    const params: RoleSearchParams = {
      ...paginationForm.value,
      ...searchForm.value,
    }
    const res = await roleApi.getRoles(params)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
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
    Status: '',
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
  editingRole.value = null
  formVisible.value = true
}

function handleEdit(row: Role) {
  editingRole.value = { ...row }
  formVisible.value = true
}

async function handleDelete(row: Role) {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.Name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await adminApi.deleteRole(row.ID)
    fetchData()
  } catch {
    // 用户取消
  }
}

function handleAssignPermission(row: Role) {
  selectedRoleId.value = row.ID
  permissionDialogVisible.value = true
}

onMounted(() => {
  fetchData()
})

defineExpose({
  refresh: fetchData,
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 flex items-center gap-4">
      <el-input v-model="searchForm.Name" placeholder="角色名称" clearable style="width: 160px"
        @keyup.enter="handleSearch" />
      <el-input v-model="searchForm.Code" placeholder="角色代码" clearable style="width: 160px"
        @keyup.enter="handleSearch" />
      <el-select v-model="searchForm.Status" placeholder="状态" clearable style="width: 120px">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <div class="flex-1 min-h-0">
      <el-table :data="tableData" border v-loading="tableLoading" size="small" height="100%">
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column prop="Name" label="角色名称" align="center" min-width="120" />
        <el-table-column prop="Code" label="角色代码" align="center" min-width="120" />
        <el-table-column prop="Description" label="描述" align="center" min-width="200" />
        <el-table-column prop="Status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.Status === 'active'" type="success" size="small">激活</el-tag>
            <el-tag v-else-if="row.Status === 'inactive'" type="danger" size="small">停用</el-tag>
            <el-tag v-else type="info" size="small">{{ row.Status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-center gap-1">
              <el-button type="primary" size="small" link @click="handleAssignPermission(row)">
                分配权限
              </el-button>
              <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
              <!-- <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="h-6 shrink-0 flex items-center justify-center mt-2">
      <el-pagination v-model:current-page="paginationForm.Page" v-model:page-size="paginationForm.PageSize"
        :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper" background
        size="small" @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>

    <RoleForm v-model:visible="formVisible" :role="editingRole" @close="formVisible = false" @success="fetchData" />
    <RolePermissionDialog v-model:visible="permissionDialogVisible" :role-id="selectedRoleId"
      @close="permissionDialogVisible = false" @success="fetchData" />
  </div>
</template>
