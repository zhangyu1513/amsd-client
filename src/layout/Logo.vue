<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  isCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
})

const router = useRouter()

const handleLogoClick = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <!-- Logo区域 -->
    <div class="flex items-center justify-center h-16 cursor-pointer hover:opacity-80 transition-opacity"
      @click="handleLogoClick">
      <span class="text-3xl font-bold logo-text">AMSD</span>
    </div>
  </div>
</template>

<style scoped>
.logo-text {
  background: linear-gradient(90deg,
      #ff6b6b 0%,
      #ffa726 20%,
      #66bb6a 40%,
      #42a5f5 60%,
      #ab47bc 80%,
      #ff6b6b 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 3s linear infinite;
  font-weight: 700;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: 200% center;
  }
}
</style>
