<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import Logo from './Logo.vue'
import UserInfo from './UserInfo.vue'
import { getBreadcrumbItems } from '@/utils/route'
import { useUserStore } from '@/stores/user'

interface Props {
  onCreate?: () => void
  isCollapse?: boolean
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  create: []
}>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 获取面包屑项
const breadcrumbItems = computed(() => getBreadcrumbItems(route.path))

// 用户信息
const userInfo = computed(() => userStore.userInfo)

const handleCreate = () => {
  if (props.onCreate) {
    props.onCreate()
  } else {
    emit('create')
  }
}

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 处理个人中心
const handleProfile = () => {
  // 这里可以跳转到个人中心页面
  console.log('跳转到个人中心')
}

// 处理设置
const handleSettings = () => {
  // 这里可以跳转到设置页面
  console.log('跳转到设置')
}
</script>

<template>
  <div :class="['flex items-center border-b border-dashed border-gray-600 h-16 min-w-0', props.class]">
    <!-- Logo组件 -->
    <Logo :is-collapse="props.isCollapse" />

    <!-- Header内容区域 -->
    <div class="flex-1 h-full min-w-0">
      <div class="flex items-center justify-between h-full px-6">
        <!-- 面包屑导航 -->
        <div class="flex items-center h-full min-w-0">
          <el-breadcrumb separator="/" class="flex items-center h-full min-w-0">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index"
              :to="index === 0 ? { path: '/' } : undefined" class="flex items-center truncate">
              <span class="truncate">{{ item }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4 shrink-0">
          <slot name="user-info">
            <!-- 默认用户信息插槽 -->
            <UserInfo v-if="userInfo" :user="{
              name: userInfo.username,
              avatar: userInfo.avatar,
              role: userInfo.roles?.[0] || '用户'
            }" @logout="handleLogout" @profile="handleProfile" @settings="handleSettings" />
            <div v-else class="flex items-center cursor-pointer">
              <el-avatar size="small" class="mr-2"></el-avatar>
              <span class="text-sm text-gray-700">未登录</span>
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
