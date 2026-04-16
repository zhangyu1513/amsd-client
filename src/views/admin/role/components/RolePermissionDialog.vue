<script setup lang="ts">
import { ref, watch } from 'vue'
import { permissionApi, roleApi, adminApi } from '@/api/user'
import type { Permission } from '@/api/user'

interface Props {
  visible: boolean
  roleId: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const allPermissions = ref<Permission[]>([])
const rolePermissionIds = ref<Set<number>>(new Set())
const loading = ref(false)
const switchLoading = ref<Set<number>>(new Set())

async function fetchAllPermissions() {
  try {
    const res = await permissionApi.getPermissions({ Page: 1, PageSize: 100 })
    allPermissions.value = res.list
  } catch (error) {
    console.error('获取权限列表失败:', error)
  }
}

async function fetchRolePermissions() {
  if (!props.roleId) return
  loading.value = true
  try {
    const permissions = await roleApi.getRolePermissions(props.roleId)
    rolePermissionIds.value = new Set(permissions.map((p) => p.ID))
  } catch (error) {
    console.error('获取角色权限失败:', error)
  } finally {
    loading.value = false
  }
}

function isPermissionAssigned(permissionId: number): boolean {
  return rolePermissionIds.value.has(permissionId)
}

async function handleAssignPermission(permissionId: number) {
  if (!props.roleId) return

  const isCurrentlyAssigned = rolePermissionIds.value.has(permissionId)
  switchLoading.value.add(permissionId)
  try {
    if (isCurrentlyAssigned) {
      rolePermissionIds.value.delete(permissionId)
      await adminApi.removeRolePermission(props.roleId, permissionId)
    } else {
      rolePermissionIds.value.add(permissionId)
      await adminApi.assignRolePermission(props.roleId, permissionId)
    }
  } catch (error) {
    if (isCurrentlyAssigned) {
      rolePermissionIds.value.add(permissionId)
    } else {
      rolePermissionIds.value.delete(permissionId)
    }
    console.error('分配权限失败:', error)
  } finally {
    switchLoading.value.delete(permissionId)
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchAllPermissions()
      fetchRolePermissions()
    }
  },
)
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    title="分配权限"
    width="600px"
    @close="emit('update:visible', false)"
  >
    <el-table :data="allPermissions" border v-loading="loading" size="small" max-height="400">
      <el-table-column prop="Name" label="权限名称" align="center" />
      <el-table-column prop="Code" label="权限代码" align="center" />
      <el-table-column prop="Resource" label="资源" align="center" width="100" />
      <el-table-column prop="Action" label="操作" align="center" width="100" />
      <el-table-column label="已分配" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            :model-value="isPermissionAssigned(row.ID)"
            :loading="switchLoading.has(row.ID)"
            :disabled="switchLoading.has(row.ID)"
            @update:model-value="handleAssignPermission(row.ID)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
