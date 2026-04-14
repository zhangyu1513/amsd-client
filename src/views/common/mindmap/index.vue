<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
// @ts-ignore
import MindMap from 'simple-mind-map'
// @ts-ignore
import Themes from 'simple-mind-map-plugin-themes'
// @ts-ignore
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'
// @ts-ignore
import Export from 'simple-mind-map/src/plugins/Export.js'
import 'simple-mind-map/dist/simpleMindMap.esm.css'

Themes.init(MindMap)
MindMap.usePlugin(MiniMap)
MindMap.usePlugin(Export)

const containerRef = ref<HTMLElement | null>(null)
const minimapRef = ref<HTMLElement | null>(null)
// @ts-ignore
let mindMap: any = null

const showContextMenu = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const currentNode = ref<any>(null)

const isRootNode = computed(() => {
  if (!currentNode.value || !mindMap) return false
  const rootNode = mindMap.renderer?.root
  if (!rootNode) return false
  return currentNode.value.uid === rootNode.uid
})

const initMindMap = () => {
  if (!containerRef.value) return

  mindMap = new MindMap({
    el: containerRef.value,
    data: {
      data: {
        text: '中心主题',
      },
      children: [],
    },
    theme: 'dark',
  } as any)

  mindMap.on('node_contextmenu', (e: any, node: any) => {
    e.preventDefault()
    currentNode.value = node
    contextMenuPos.value = {
      x: e.clientX,
      y: e.clientY,
    }
    showContextMenu.value = true
  })

  mindMap.on('click', () => {
    showContextMenu.value = false
  })

  mindMap.on('data_change', updateMinimap)
  mindMap.on('view_data_change', updateMinimap)

  updateMinimap()
}

const updateMinimap = () => {
  if (!mindMap || !minimapRef.value) return
  const result = mindMap.miniMap.calculationMiniMap(200, 150)
  if (result.getImgUrl) {
    result.getImgUrl((imgUrl: string) => {
      minimapRef.value!.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;">`
    })
  } else if (result.svgHTML) {
    minimapRef.value.innerHTML = result.svgHTML
  }
}

const addChildNode = () => {
  if (mindMap) {
    mindMap.execCommand('INSERT_CHILD_NODE')
    showContextMenu.value = false
  }
}

const addBrotherNode = () => {
  if (mindMap) {
    mindMap.execCommand('INSERT_NODE')
    showContextMenu.value = false
  }
}

const deleteNode = () => {
  if (mindMap && currentNode.value) {
    if (isRootNode.value) {
      ElMessage.warning('不能删除根节点')
      return
    }
    mindMap.execCommand('REMOVE_NODE')
    showContextMenu.value = false
  }
}

const goToRoot = () => {
  console.log('goToRoot clicked', mindMap)
  if (mindMap) {
    mindMap.renderer.setRootNodeCenter()
  }
}

const zoomIn = () => {
  console.log('zoomIn clicked', mindMap)
  if (mindMap) {
    mindMap.view.enlarge()
  }
}

const zoomOut = () => {
  console.log('zoomOut clicked', mindMap)
  if (mindMap) {
    mindMap.view.narrow()
  }
}

const fitView = () => {
  console.log('fitView clicked', mindMap)
  if (mindMap) {
    mindMap.view.fit()
  }
}

const exportImage = () => {
  if (mindMap) {
    mindMap.export('png', true, 'AMSD-MindMap')
  }
}

onMounted(() => {
  initMindMap()

  document.addEventListener('click', () => {
    showContextMenu.value = false
  })
})

onUnmounted(() => {
  if (mindMap) {
    mindMap.destroy()
  }
})
</script>

<template>
  <div class="mindmap-container h-full w-full">
    <div ref="containerRef" class="mindmap-wrapper"></div>

    <!-- 左下角工具箱 -->
    <div class="toolbox">
      <el-button circle size="small" @click="exportImage" title="导出图片">
        <el-icon>
          <Download />
        </el-icon>
      </el-button>
      <el-button circle size="small" @click="goToRoot" title="回到根节点">
        <el-icon>
          <House />
        </el-icon>
      </el-button>
      <el-button circle size="small" @click="zoomIn" title="放大">
        <el-icon>
          <ZoomIn />
        </el-icon>
      </el-button>
      <el-button circle size="small" @click="zoomOut" title="缩小">
        <el-icon>
          <ZoomOut />
        </el-icon>
      </el-button>
      <el-button circle size="small" @click="fitView" title="适应画布">
        <el-icon>
          <FullScreen />
        </el-icon>
      </el-button>
    </div>

    <!-- 右下角小地图 -->
    <div ref="minimapRef" class="minimap"></div>

    <Teleport to="body">
      <div v-if="showContextMenu" class="context-menu"
        :style="{ left: contextMenuPos.x + `px`, top: contextMenuPos.y + `px` }" @click.stop>
        <div class="menu-group">
          <div class="menu-item" @click="addChildNode">
            <el-icon>
              <Plus />
            </el-icon>
            <span>添加子节点</span>
          </div>
          <div v-if="!isRootNode" class="menu-item" @click="addBrotherNode">
            <el-icon>
              <Share />
            </el-icon>
            <span>添加兄弟节点</span>
          </div>
          <div v-if="!isRootNode" class="menu-item" @click="deleteNode">
            <el-icon>
              <Delete />
            </el-icon>
            <span>删除节点</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mindmap-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.mindmap-wrapper {
  flex: 1;
  overflow: hidden;
}

:deep(.simple-mind-map) {
  background-color: var(--el-bg-color);
}

.toolbox {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 100;
}

.minimap {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 200px;
  height: 150px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--el-bg-color);
  z-index: 100;
}

.minimap :deep(svg) {
  width: 100%;
  height: 100%;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 160px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-primary);
  font-size: 13px;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.menu-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  padding: 0.25rem 0.5rem;
}

.menu-divider {
  height: 1px;
  background-color: var(--el-border-color-lighter);
  margin: 0.5rem 0;
}
</style>
