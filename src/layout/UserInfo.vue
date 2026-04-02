<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

interface User {
  name?: string
  avatar?: string
  role?: string
}

interface Props {
  user?: User
  onLogout?: () => void
  onProfile?: () => void
  onSettings?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  user: () => ({
    name: '管理员',
    avatar: '',
    role: '管理员'
  })
})

const emit = defineEmits<{
  logout: []
  profile: []
  settings: []
}>()

const handleLogout = () => {
  if (props.onLogout) {
    props.onLogout()
  } else {
    emit('logout')
  }
}

const handleProfile = () => {
  if (props.onProfile) {
    props.onProfile()
  } else {
    emit('profile')
  }
}

const handleSettings = () => {
  if (props.onSettings) {
    props.onSettings()
  } else {
    emit('settings')
  }
}
</script>

<template>
  <el-dropdown>
    <span class="flex items-center cursor-pointer">
      <el-avatar size="small" class="mr-2" :src="user.avatar">
        {{ user.avatar ? '' : (user.name?.charAt(0) || '用户') }}
      </el-avatar>
      <span class="text-sm text-gray-700">{{ user.name?.toUpperCase() }}</span>
      <el-icon class="ml-1">
        <ArrowDown />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleProfile" disabled>个人中心</el-dropdown-item>
        <el-dropdown-item @click="handleSettings" disabled>设置</el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
