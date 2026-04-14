<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import * as THREE from 'three'
import { useUserStore } from '@/stores/user'

interface LoginForm {
  username: string
  password: string
}

const form = reactive<LoginForm>({
  username: 'auto',
  password: '123456',
})

const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

// Three.js相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let chipMesh: THREE.Group
let animationId: number
let time = 0

// 初始化Three.js场景 - 芯片科技主题
const initThreeScene = () => {
  const container = document.getElementById('three-container')
  if (!container) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(0, 0, 25)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // 创建芯片模型
  createChipModel()

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x0a3b5c, 0.3)
  scene.add(ambientLight)

  // 添加主光源
  const mainLight = new THREE.DirectionalLight(0x00a8ff, 1)
  mainLight.position.set(10, 10, 10)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  scene.add(mainLight)

  // 添加辅助光
  const fillLight = new THREE.DirectionalLight(0x8a2be2, 0.5)
  fillLight.position.set(-10, -10, 5)
  scene.add(fillLight)

  // 添加点光源
  const pointLight = new THREE.PointLight(0x00ffff, 0.8, 50)
  pointLight.position.set(0, 0, 15)
  scene.add(pointLight)

  // 开始动画
  animate()
}

// 创建芯片模型
const createChipModel = () => {
  chipMesh = new THREE.Group()

  // 芯片基底
  const baseGeometry = new THREE.BoxGeometry(8, 8, 1)
  const baseMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    emissive: 0x0a0a1a,
    emissiveIntensity: 0.2,
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.castShadow = true
  base.receiveShadow = true
  chipMesh.add(base)

  // 芯片核心
  const coreGeometry = new THREE.BoxGeometry(4, 4, 0.5)
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00a8ff,
    metalness: 0.8,
    roughness: 0.05,
    emissive: 0x00a8ff,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9,
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.position.z = 0.8
  core.castShadow = true
  chipMesh.add(core)

  // 芯片引脚
  const pinCount = 16
  const pinGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.2)
  const pinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8a2be2,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x8a2be2,
    emissiveIntensity: 0.2,
  })

  for (let i = 0; i < pinCount; i++) {
    const angle = (i / pinCount) * Math.PI * 2
    const radius = 4.5

    const pin = new THREE.Mesh(pinGeometry, pinMaterial)
    pin.position.x = Math.cos(angle) * radius
    pin.position.y = Math.sin(angle) * radius
    pin.position.z = 0.6
    pin.rotation.z = angle + Math.PI / 2

    pin.castShadow = true
    chipMesh.add(pin)
  }

  // 数据流粒子
  const particleCount = 200
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 2

    particlePositions[i] = Math.cos(angle) * radius
    particlePositions[i + 1] = Math.sin(angle) * radius
    particlePositions[i + 2] = Math.random() * 2 - 1

    // 科技蓝紫色系
    particleColors[i] = 0.2 + Math.random() * 0.8 // R
    particleColors[i + 1] = 0.5 + Math.random() * 0.5 // G
    particleColors[i + 2] = 0.8 + Math.random() * 0.2 // B
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  chipMesh.add(particles)

  scene.add(chipMesh)
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  time += 0.01

  if (chipMesh) {
    // 芯片旋转
    chipMesh.rotation.x = Math.sin(time * 0.5) * 0.1
    chipMesh.rotation.y = time * 0.2

    // 粒子动画
    const particles = chipMesh.children[3]
    if (particles instanceof THREE.Points) {
      const positions = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(time * 2 + i * 0.01) * 2
      }
      particles.geometry.attributes.position.needsUpdate = true
    }
  }

  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  const container = document.getElementById('three-container')
  if (!container || !camera || !renderer) return

  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// 处理登录
const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    // 使用用户store进行登录
    const success = await userStore.login({
      username: form.username,
      password: form.password,
    })

    if (success) {
      ElMessage.success('登录成功')
      // 跳转到首页
      router.push('/')
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('网络错误，登录失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initThreeScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (renderer) {
    renderer.dispose()
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="login-container">
    <!-- Three.js背景容器 -->
    <div id="three-container" class="three-background"></div>

    <!-- 科技感装饰元素 -->
    <div class="tech-decoration">
      <div class="tech-line line-1"></div>
      <div class="tech-line line-2"></div>
      <div class="tech-line line-3"></div>
      <div class="tech-dot dot-1"></div>
      <div class="tech-dot dot-2"></div>
      <div class="tech-dot dot-3"></div>
    </div>

    <!-- 登录表单 -->
    <div class="login-form-container">
      <div class="login-card">
        <!-- 科技感边框 -->
        <div class="card-border"></div>

        <!-- 标题 -->
        <div class="login-header">
          <div class="title-icon">
            <div class="icon-circle"></div>
            <div class="icon-core"></div>
          </div>
          <h1 class="login-title">AMSD <span class="tech-text">SYSTEM</span></h1>
          <p class="login-subtitle">自动化掩膜服务设计系统</p>
        </div>

        <!-- 登录表单 -->
        <el-form :model="form" class="login-form" @submit.prevent="handleLogin">
          <el-form-item>
            <el-input
              v-model="form.username"
              placeholder="USERNAME"
              size="large"
              :prefix-icon="User"
              class="login-input tech-input"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="PASSWORD"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="login-input tech-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-button tech-button"
            >
              <span class="button-text">{{ loading ? '验证中...' : '系统接入' }}</span>
              <span class="button-glow"></span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部信息 -->
        <div class="login-footer">
          <p class="copyright">© 2025 AMSD SYSTEM v2.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
}

.three-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 科技感装饰元素 */
.tech-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.tech-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, #00a8ff, transparent);
  height: 1px;
  opacity: 0.3;
  animation: scanLine 3s linear infinite;
}

.line-1 {
  top: 20%;
  width: 100%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  width: 100%;
  animation-delay: 1s;
}

.line-3 {
  top: 80%;
  width: 100%;
  animation-delay: 2s;
}

.tech-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffff;
  animation: pulse 2s ease-in-out infinite;
}

.dot-1 {
  top: 30%;
  left: 10%;
  animation-delay: 0s;
}

.dot-2 {
  top: 60%;
  right: 15%;
  animation-delay: 0.5s;
}

.dot-3 {
  bottom: 40%;
  left: 20%;
  animation-delay: 1s;
}

@keyframes scanLine {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.login-form-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.login-card {
  position: relative;
  background: rgba(16, 18, 27, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 50px 40px;
  width: 100%;
  max-width: 440px;
  border: 1px solid rgba(0, 168, 255, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 168, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: cardAppear 1s ease-out;
  overflow: hidden;
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(0, 168, 255, 0.3) 0%,
    rgba(138, 43, 226, 0.3) 50%,
    rgba(0, 255, 255, 0.3) 100%
  );
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1px;
  pointer-events: none;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 50px;
}

.title-icon {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.icon-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(0, 168, 255, 0.5);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

.icon-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #00a8ff, #8a2be2);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 168, 255, 0.5);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.tech-text {
  background: linear-gradient(135deg, #00a8ff 0%, #8a2be2 50%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 168, 255, 0.3);
}

.login-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  letter-spacing: 1px;
  font-weight: 300;
}

.login-form {
  margin-bottom: 40px;
}

.tech-input {
  width: 100%;
}

.tech-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 168, 255, 0.3);
  border-radius: 8px;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 168, 255, 0);
  transition: all 0.3s ease;
  color: #fff;
}

.tech-input :deep(.el-input__wrapper:hover),
.tech-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00a8ff;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 168, 255, 0.3),
    0 0 20px rgba(0, 168, 255, 0.2);
}

.tech-input :deep(.el-input__inner) {
  color: #fff;
}

.tech-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.tech-input :deep(.el-icon) {
  color: #00a8ff;
}

.tech-button {
  position: relative;
  width: 100%;
  border-radius: 8px;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #00a8ff 0%, #8a2be2 50%, #00ffff 100%);
  border: none;
  color: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tech-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 30px rgba(0, 168, 255, 0.4),
    0 0 0 1px rgba(0, 168, 255, 0.3);
}

.tech-button:active {
  transform: translateY(0);
}

.tech-button :deep(.el-button__text) {
  position: relative;
  z-index: 2;
}

.button-text {
  position: relative;
  z-index: 2;
  letter-spacing: 1px;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 168, 255, 0.8) 0%,
    rgba(138, 43, 226, 0.8) 50%,
    rgba(0, 255, 255, 0.8) 100%
  );
  filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-button:hover .button-glow {
  opacity: 0.5;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 1px;
  font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 40px 20px;
    margin: 0 10px;
  }

  .login-title {
    font-size: 28px;
  }

  .login-subtitle {
    font-size: 13px;
  }

  .title-icon {
    width: 50px;
    height: 50px;
  }

  .icon-core {
    width: 16px;
    height: 16px;
  }
}

/* 加载状态样式 */
.tech-button :deep(.el-loading-spinner .circular) {
  color: #fff;
}

.tech-button :deep(.el-loading-spinner .path) {
  stroke: #fff;
}
</style>
