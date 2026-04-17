<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import UserInfo from './UserInfo.vue'
import { getBreadcrumbItems } from '@/utils/route'
import { useUserStore } from '@/stores/user'

interface Props {
  onCreate?: () => void
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

// 当前时间
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handleCreate = () => {
  if (props.onCreate) {
    props.onCreate()
  } else {
    emit('create')
  }
}

// 处理退出登录
const handleLogout = async () => {
  await userStore.logout()
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
    <!-- Header内容区域 -->
    <div class="flex-1 h-full min-w-0">
      <div class="flex items-center justify-between h-full px-6">
        <!-- 面包屑导航 -->
        <div class="flex-1 flex items-center h-full min-w-0">
          <el-breadcrumb separator="/" class="flex items-center h-full min-w-0">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index"
              :to="index === 0 ? { path: '/' } : undefined" class="flex items-center truncate">
              <span class="truncate">{{ item }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 中间时间显示 -->
        <div class="flex items-center justify-center px-6">
          <span class="text-sm font-mono tracking-wider time-display">
            {{ currentTime }}
          </span>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4 shrink-0">
          <slot name="user-info">
            <!-- 默认用户信息插槽 -->
            <UserInfo v-if="userInfo" :user="{
              name: userInfo.Name || userInfo.Username,
              avatar: '',
              role: '用户',
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

<style scoped>
.time-display {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 1s linear infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: 200% center;
  }
}
</style>
