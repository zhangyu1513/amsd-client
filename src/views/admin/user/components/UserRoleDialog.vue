<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { userApi, adminApi, roleApi } from '@/api/user'
import type { Role, User } from '@/api/user'

interface Props {
  visible: boolean
  userId: number | null
  users: User[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const allRoles = ref<Role[]>([])
const userRoleIds = ref<Set<number>>(new Set())
const loading = ref(false)
const switchLoading = ref<Set<number>>(new Set())

const selectedUsername = computed(() => {
  const user = props.users.find((u) => u.ID === props.userId)
  return user?.Username || ''
})

async function fetchAllRoles() {
  try {
    const res = await roleApi.getRoles({ Page: 1, PageSize: 100 })
    allRoles.value = res.list
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

async function fetchUserRoles() {
  if (!props.userId) return
  loading.value = true
  try {
    const roles = await userApi.getUserRoles(props.userId)
    userRoleIds.value = new Set(roles.map((r) => r.ID))
  } catch (error) {
    console.error('获取用户角色失败:', error)
  } finally {
    loading.value = false
  }
}

function isRoleAssigned(roleId: number): boolean {
  return userRoleIds.value.has(roleId)
}

async function handleToggleRole(roleId: number) {
  if (!props.userId) return

  const isCurrentlyAssigned = userRoleIds.value.has(roleId)
  switchLoading.value.add(roleId)
  try {
    if (isCurrentlyAssigned) {
      userRoleIds.value.delete(roleId)
    } else {
      userRoleIds.value.add(roleId)
    }
    await adminApi.toggleUserRole(props.userId, roleId)
  } catch (error) {
    if (isCurrentlyAssigned) {
      userRoleIds.value.add(roleId)
    } else {
      userRoleIds.value.delete(roleId)
    }
    console.error('切换角色失败:', error)
  } finally {
    switchLoading.value.delete(roleId)
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchAllRoles()
      fetchUserRoles()
    }
  },
)
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    title="分配角色"
    width="600px"
    @close="emit('update:visible', false)"
  >
    <div class="mb-4">
      <span class="text-gray-400">当前用户：</span>
      <span class="font-medium">{{ selectedUsername }}</span>
    </div>

    <el-table :data="allRoles" border v-loading="loading" size="small" max-height="400">
      <el-table-column prop="Name" label="角色名称" align="center" />
      <el-table-column prop="Code" label="角色代码" align="center" />
      <el-table-column prop="Description" label="描述" align="center" />
      <el-table-column label="已分配" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            :model-value="isRoleAssigned(row.ID)"
            :loading="switchLoading.has(row.ID)"
            :disabled="switchLoading.has(row.ID)"
            @update:model-value="handleToggleRole(row.ID)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
