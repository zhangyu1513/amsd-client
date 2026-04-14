<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { getMenuItems, type MenuItem } from '@/utils/route'
import {
  Odometer,
  Briefcase,
  Document,
  Tickets,
  MessageBox,
  Tools,
  EditPen,
  Connection,
  Plus,
  Minus,
  Delete,
  House,
  ZoomIn,
  ZoomOut,
  FullScreen,
  Download,
  Share,
  Link,
} from '@element-plus/icons-vue'

interface Props {
  isCollapse?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
  class: '',
})

const emit = defineEmits<{
  toggleCollapse: []
}>()

const route = useRoute()

// 获取菜单项
const menuItems = computed(() => getMenuItems())

const handleToggleCollapse = () => {
  emit('toggleCollapse')
}

// 图标映射
const iconMap: Record<string, any> = {
  Odometer,
  Briefcase,
  Document,
  Tickets,
  MessageBox,
  Tools,
  EditPen,
  Connection,
  Plus,
  Minus,
  Delete,
  House,
  ZoomIn,
  ZoomOut,
  FullScreen,
  Download,
  Share,
  Link,
}

// 获取图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return null
  return iconMap[iconName] || null
}
</script>

<template>
  <div :class="['h-full shrink-0', props.class]">
    <el-aside
      :width="props.isCollapse ? '64px' : '200px'"
      class="sidebar-container transition-all duration-500 ease-tech h-full"
    >
      <!-- 科技感背景光效 -->
      <div class="sidebar-glow" :class="{ collapsed: props.isCollapse }"></div>

      <!-- 导航菜单 -->
      <el-menu
        :default-active="route.path"
        :collapse="props.isCollapse"
        router
        class="border-r border-gray-800 h-full bg-gray-900/50 backdrop-blur-sm"
        :class="{ 'menu-collapsed': props.isCollapse }"
      >
        <!-- 递归渲染菜单项 -->
        <template v-for="item in menuItems" :key="item.path">
          <template v-if="item.children && item.children.length > 0">
            <el-sub-menu :index="item.path" class="menu-item-tech">
              <template #title>
                <div class="menu-icon-wrapper">
                  <el-icon v-if="item.icon" class="menu-icon">
                    <component :is="getIconComponent(item.icon)" />
                  </el-icon>
                </div>
                <span class="menu-title">{{ item.title }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
                class="submenu-item-tech"
              >
                <div class="submenu-icon-wrapper">
                  <el-icon v-if="child.icon" class="submenu-icon">
                    <component :is="getIconComponent(child.icon)" />
                  </el-icon>
                </div>
                <template #title>
                  <span class="submenu-title">{{ child.title }}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="item.path" class="menu-item-tech">
              <div class="menu-icon-wrapper">
                <el-icon v-if="item.icon" class="menu-icon">
                  <component :is="getIconComponent(item.icon)" />
                </el-icon>
              </div>
              <template #title>
                <span class="menu-title">{{ item.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>

      <!-- 折叠按钮 -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center">
        <el-button
          :icon="props.isCollapse ? 'Expand' : 'Fold'"
          circle
          size="small"
          @click="handleToggleCollapse"
          class="collapse-btn-tech"
        />
      </div>
    </el-aside>
  </div>
</template>

<style scoped>
.el-aside {
  position: relative;
  overflow: hidden;
}

.sidebar-container {
  transition-property: width, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-tech {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.sidebar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 50%,
    rgba(59, 130, 246, 0.1) 100%
  );
  opacity: 0.5;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.sidebar-glow.collapsed {
  opacity: 0.2;
}

.menu-item-tech {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item-tech::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 0 2px 2px 0;
  transition: height 0.3s ease;
}

.menu-item-tech:hover::before,
.menu-item-tech.is-active::before {
  height: 60%;
}

.menu-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.menu-icon {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.menu-item-tech:hover .menu-icon {
  transform: scale(1.2) rotate(5deg);
  color: #3b82f6;
}

.menu-title {
  transition: all 0.3s ease;
  font-weight: 500;
}

.menu-collapsed .menu-title {
  opacity: 0;
  transform: translateX(-10px);
}

/* 确保折叠状态下图标仍然可见 */
.menu-collapsed .menu-icon-wrapper,
.menu-collapsed .submenu-icon-wrapper {
  opacity: 1 !important;
  transform: none !important;
}

.menu-collapsed .menu-icon,
.menu-collapsed .submenu-icon {
  opacity: 1 !important;
  transform: none !important;
}

/* 修复折叠状态下菜单项动画 */
.menu-collapsed .menu-item-tech {
  animation: none;
}

.menu-collapsed .el-menu-item,
.menu-collapsed .el-sub-menu__title {
  justify-content: center !important;
}

.submenu-item-tech {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: 40px !important;
}

.submenu-item-tech:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateX(5px);
}

.submenu-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.submenu-icon {
  transition: all 0.3s ease;
}

.submenu-item-tech:hover .submenu-icon {
  transform: scale(1.1);
  color: #8b5cf6;
}

.submenu-title {
  transition: all 0.3s ease;
}

.collapse-btn-tech {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.collapse-btn-tech:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

/* 展开动画 - 只应用于非折叠状态 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 折叠动画 - 只应用于标题 */
@keyframes titleSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(-10px);
  }
}

/* 菜单项进入动画 */
.menu-item-tech:not(.menu-collapsed .menu-item-tech) {
  animation: slideIn 0.3s ease forwards;
}

/* 科技感脉冲效果 */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }

  50% {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
  }
}

.collapse-btn-tech {
  animation: pulse-glow 2s infinite;
}

/* 折叠状态下图标居中显示 */
:deep(.el-menu--collapse) .el-menu-item,
:deep(.el-menu--collapse) .el-sub-menu__title {
  display: flex;
  justify-content: center;
  padding: 0 !important;
  min-width: 64px;
  position: relative;
}

:deep(.el-menu--collapse) .el-sub-menu__title .el-sub-menu__icon-arrow {
  display: none;
}

:deep(.el-menu--collapse) .el-sub-menu__title > .menu-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
