<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, Back } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">401</div>
      <div class="error-title">权限不足</div>
      <div class="error-desc">抱歉，您没有权限访问该页面</div>
      <div class="error-actions">
        <el-button type="primary" :icon="House" @click="goHome"> 返回首页 </el-button>
        <el-button :icon="Back" @click="goBack"> 返回上一页 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
}

.error-content {
  text-align: center;
  padding: 60px 40px;
  background: rgba(16, 18, 27, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(0, 168, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #ff4d4f;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 0 40px rgba(255, 77, 79, 0.5);
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.error-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
