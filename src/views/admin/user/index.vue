<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { userApi, adminApi } from '@/api/user'
import { formatDate } from '@/utils/date'
import UserCreateForm from './components/UserCreateForm.vue'
import UserUpdateForm from './components/UserUpdateForm.vue'
import UserRoleDialog from './components/UserRoleDialog.vue'
import type { User, UserSearchParams } from '@/api/user'

const tableData = ref<User[]>([])
const tableLoading = ref(false)

const searchForm = ref<UserSearchParams>({
  Username: '',
  Name: '',
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

const createFormVisible = ref(false)
const updateFormVisible = ref(false)
const roleDialogVisible = ref(false)
const editingUser = ref<User | null>(null)
const selectedUserId = ref<number | null>(null)

async function fetchData() {
  tableLoading.value = true
  try {
    const params: UserSearchParams = {
      ...paginationForm.value,
      ...searchForm.value,
    }
    const res = await userApi.getUsers(params)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
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
    Username: '',
    Name: '',
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
  editingUser.value = null
  createFormVisible.value = true
}

function handleEdit(row: User) {
  editingUser.value = { ...row }
  updateFormVisible.value = true
}

async function handleDelete(row: User) {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.Username}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await adminApi.deleteUser(row.ID)
    fetchData()
  } catch {
    // 用户取消
  }
}

function handleAssignRole(row: User) {
  selectedUserId.value = row.ID
  roleDialogVisible.value = true
}

function handleCreateFormClose() {
  createFormVisible.value = false
}

function handleUpdateFormClose() {
  updateFormVisible.value = false
  editingUser.value = null
}

function isAdminUser(row: User): boolean {
  return row.Username === 'admin'
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
      <el-input v-model="searchForm.Username" placeholder="用户名" clearable style="width: 160px"
        @keyup.enter="handleSearch" />
      <el-input v-model="searchForm.Name" placeholder="姓名" clearable style="width: 160px" @keyup.enter="handleSearch" />
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
        <el-table-column prop="Username" label="用户名" align="center" min-width="120" />
        <el-table-column prop="Name" label="姓名" align="center" min-width="120" />
        <el-table-column prop="Status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.Status === 'active'" type="success" size="small">激活</el-tag>
            <el-tag v-else-if="row.Status === 'inactive'" type="danger" size="small">停用</el-tag>
            <el-tag v-else type="info" size="small">{{ row.Status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreatedAt" label="创建时间" align="center" width="180">
          <template #default="{ row }">
            {{ formatDate(row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-center gap-1">
              <el-button v-if="!isAdminUser(row)" type="primary" size="small" link @click="handleAssignRole(row)">
                分配角色
              </el-button>
              <el-button v-if="!isAdminUser(row)" type="primary" size="small" link @click="handleEdit(row)">
                编辑
              </el-button>
              <!-- <el-button v-if="!isAdminUser(row)" type="danger" size="small" link @click="handleDelete(row)">
                删除
              </el-button> -->
              <el-tag v-if="isAdminUser(row)" type="warning" size="small">超级管理员</el-tag>
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

    <UserCreateForm v-model:visible="createFormVisible" @close="handleCreateFormClose" @success="fetchData" />
    <UserUpdateForm v-model:visible="updateFormVisible" :user-id="editingUser?.ID" @close="handleUpdateFormClose"
      @success="fetchData" />
    <UserRoleDialog v-model:visible="roleDialogVisible" :user-id="selectedUserId" :users="tableData"
      @close="roleDialogVisible = false" @success="fetchData" />
  </div>
</template>
