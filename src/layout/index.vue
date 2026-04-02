<script setup lang="ts">
// 布局组件
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import MainContent from './MainContent.vue'

const isCollapse = ref(false)

const handleToggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCreate = () => {
  console.log('新建操作')
  // 这里可以触发新建相关的逻辑
}
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div class="flex w-full h-full">
      <!-- 侧边栏组件 -->
      <Sidebar :is-collapse="isCollapse" @toggle-collapse="handleToggleCollapse" />
      
      <!-- 主内容区 -->
      <div class="flex-1 flex flex-col min-w-0 h-full">
        <!-- 顶部导航组件 -->
        <Header :is-collapse="isCollapse" @create="handleCreate" />
        <!-- 主体内容组件 -->
        <MainContent class="flex-1 overflow-auto" />
      </div>
    </div>
  </div>
</template>
