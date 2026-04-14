<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import StartNode from './components/StartNode.vue'
import EndNode from './components/EndNode.vue'
import ProcessNode from './components/ProcessNode.vue'
import ConditionNode from './components/ConditionNode.vue'
import StartNodePreview from './components/StartNodePreview.vue'
import EndNodePreview from './components/EndNodePreview.vue'
import ProcessNodePreview from './components/ProcessNodePreview.vue'
import ConditionNodePreview from './components/ConditionNodePreview.vue'

const { fitView, addNodes, onConnect, project, findNode, getNodes, getEdges, onInit } = useVueFlow()

const vueFlowInstance = ref<any>(null)

onInit((instance) => {
  vueFlowInstance.value = instance
})

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  condition: ConditionNode,
}

const selectedNodeType = ref('process')
const selectedEdgeType = ref('smoothstep')

interface NodeConfig {
  type: string
  label: string
  icon: string
  preview: any
}

const nodeConfigs: NodeConfig[] = [
  { type: 'start', label: '开始', icon: 'VideoPlay', preview: StartNodePreview },
  { type: 'process', label: '处理', icon: 'Box', preview: ProcessNodePreview },
  { type: 'condition', label: '判断', icon: 'Switch', preview: ConditionNodePreview },
  { type: 'end', label: '结束', icon: 'VideoPause', preview: EndNodePreview },
]

const nodeTypeMap: Record<string, string> = {
  start: 'VideoPlay',
  process: 'Box',
  condition: 'Switch',
  end: 'VideoPause',
}

const selectedNodeColor = ref('#3b82f6')

const nodeColors = [
  { label: '蓝色', value: '#3b82f6' },
  { label: '绿色', value: '#10b981' },
  { label: '红色', value: '#ef4444' },
  { label: '黄色', value: '#f59e0b' },
  { label: '紫色', value: '#8b5cf6' },
  { label: '粉色', value: '#ec4899' },
]

interface EdgeConfig {
  type: string
  label: string
}

const edgeConfigs: EdgeConfig[] = [
  { type: 'default', label: '直线' },
  { type: 'smoothstep', label: '折线' },
  { type: 'step', label: '阶梯' },
]

const nodes = ref<Node[]>([])

const edges = ref<Edge[]>([])

const draggedType = ref<string | null>(null)

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  type: '' as 'node' | 'edge' | 'canvas',
  targetId: '' as string,
})

const selectedEdgeColor = ref('#94a3b8')

const edgeColors = [
  { label: '灰色', value: '#94a3b8' },
  { label: '蓝色', value: '#3b82f6' },
  { label: '绿色', value: '#10b981' },
  { label: '红色', value: '#ef4444' },
  { label: '黄色', value: '#f59e0b' },
  { label: '紫色', value: '#8b5cf6' },
]

const edgeTypeMap: Record<string, string> = {
  default: '直线',
  smoothstep: '折线',
  step: '阶梯',
}

onConnect((params) => {
  edges.value.push({
    id: `e-${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    type: selectedEdgeType.value,
    style: { stroke: selectedEdgeColor.value, strokeWidth: 2 },
  })
})

const addNode = () => {
  const id = String(Date.now())
  const type = selectedNodeType.value
  const label = nodeConfigs.find((n) => n.type === type)?.label || '节点'

  addNodes([
    {
      id,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label, color: selectedNodeColor.value },
    },
  ])
}

const deleteSelected = () => {
  nodes.value = nodes.value.filter((n) => !(n as any).selected)
  edges.value = edges.value.filter((e) => !(e as any).selected)
}

const exportData = () => {
  const data = {
    nodes: nodes.value,
    edges: edges.value,
  }
  console.log('导出数据:', JSON.stringify(data, null, 2))
}

const onDragStart = (event: DragEvent, type: string) => {
  draggedType.value = type
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDragEnd = () => {
  draggedType.value = null
}

const onDrop = (event: DragEvent) => {
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type) return

  const position = project({
    x: event.clientX,
    y: event.clientY,
  })

  const config = nodeConfigs.find((n) => n.type === type)
  const label = config?.label || '节点'

  addNodes([
    {
      id: String(Date.now()),
      type,
      position,
      data: { label, color: selectedNodeColor.value },
    },
  ])

  fitView()
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onNodeContextMenu = (event: MouseEvent, node: Node) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    type: 'node',
    targetId: node.id,
  }
}

const onEdgeContextMenu = (event: MouseEvent, edge: Edge) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    type: 'edge',
    targetId: edge.id,
  }
}

const onCanvasContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  const target = event.target as HTMLElement
  if (target.classList.contains('vue-flow__pane')) {
    contextMenu.value = {
      show: true,
      x: event.clientX,
      y: event.clientY,
      type: 'canvas',
      targetId: '',
    }
  }
}

const closeContextMenu = () => {
  contextMenu.value.show = false
}

const deleteNode = () => {
  if (contextMenu.value.type === 'node') {
    nodes.value = nodes.value.filter((n) => n.id !== contextMenu.value.targetId)
    edges.value = edges.value.filter(
      (e) => e.source !== contextMenu.value.targetId && e.target !== contextMenu.value.targetId,
    )
  }
  closeContextMenu()
}

const deleteEdge = () => {
  if (contextMenu.value.type === 'edge') {
    edges.value = edges.value.filter((e) => e.id !== contextMenu.value.targetId)
  }
  closeContextMenu()
}

const changeNodeColor = (color: string) => {
  if (contextMenu.value.type === 'node') {
    const node = nodes.value.find((n) => n.id === contextMenu.value.targetId)
    if (node) {
      node.data = { ...node.data, color }
    }
  }
  closeContextMenu()
}

const changeEdgeColor = (color: string) => {
  if (contextMenu.value.type === 'edge') {
    const edge = edges.value.find((e) => e.id === contextMenu.value.targetId)
    if (edge) {
      edge.style = { stroke: color, strokeWidth: 2 }
    }
  }
  closeContextMenu()
}

const addNodeAtCanvas = () => {
  const position = project({
    x: contextMenu.value.x,
    y: contextMenu.value.y,
  })

  const config = nodeConfigs.find((n) => n.type === selectedNodeType.value)
  const label = config?.label || '节点'

  addNodes([
    {
      id: String(Date.now()),
      type: selectedNodeType.value,
      position,
      data: { label, color: selectedNodeColor.value },
    },
  ])

  closeContextMenu()
}

const addEdgeAtCanvas = () => {
  closeContextMenu()
}
</script>

<template>
  <div class="draw-container" @click="closeContextMenu" @contextmenu.prevent>
    <div class="toolbar">
      <div class="tool-section">
        <div class="section-title">节点</div>
        <div class="node-list">
          <div
            v-for="node in nodeConfigs"
            :key="node.type"
            class="node-item"
            :class="{ active: selectedNodeType === node.type }"
            draggable="true"
            @click="selectedNodeType = node.type"
            @dragstart="onDragStart($event, node.type)"
            @dragend="onDragEnd"
          >
            <component :is="node.preview" class="node-preview" />
            <span>{{ node.label }}</span>
          </div>
        </div>
      </div>

      <div class="tool-section">
        <div class="section-title">线条</div>
        <div class="edge-list">
          <div
            v-for="edge in edgeConfigs"
            :key="edge.type"
            class="edge-item"
            :class="{ active: selectedEdgeType === edge.type }"
            draggable="true"
            @click="selectedEdgeType = edge.type"
            @dragstart="onDragStart($event, edge.type)"
            @dragend="onDragEnd"
          >
            <svg width="40" height="20" class="edge-preview">
              <path
                v-if="edge.type === 'default'"
                d="M0,10 L40,10"
                fill="none"
                stroke="#94a3b8"
                stroke-width="2"
              />
              <path
                v-else-if="edge.type === 'smoothstep'"
                d="M0,10 L15,10 L15,5 L25,5 L25,15 L35,15 L35,10 L40,10"
                fill="none"
                stroke="#94a3b8"
                stroke-width="2"
              />
              <path
                v-else-if="edge.type === 'step'"
                d="M0,10 L15,10 L15,2 L25,2 L25,18 L35,18 L35,10 L40,10"
                fill="none"
                stroke="#94a3b8"
                stroke-width="2"
              />
            </svg>
            <span>{{ edge.label }}</span>
          </div>
        </div>
      </div>

      <div class="tool-section">
        <div class="section-title">节点颜色</div>
        <div class="color-list">
          <div
            v-for="color in nodeColors"
            :key="color.value"
            class="color-item"
            :class="{ active: selectedNodeColor === color.value }"
            :style="{ background: color.value }"
            @click="selectedNodeColor = color.value"
          />
        </div>
      </div>

      <div class="tool-section">
        <div class="section-title">线条颜色</div>
        <div class="color-list">
          <div
            v-for="color in edgeColors"
            :key="color.value"
            class="color-item"
            :class="{ active: selectedEdgeColor === color.value }"
            :style="{ background: color.value }"
            @click="selectedEdgeColor = color.value"
          />
        </div>
      </div>

      <div class="tool-actions">
        <el-button type="primary" size="small" @click="addNode">添加节点</el-button>
        <el-button size="small" @click="deleteSelected">删除选中</el-button>
        <el-button size="small" @click="exportData">导出数据</el-button>
      </div>
    </div>

    <div class="canvas-container">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :fit-view-on-init="true"
        :min-zoom="0.1"
        :max-zoom="2"
        class="flow-editor"
        @drop="onDrop"
        @dragover="onDragOver"
        @node-contextmenu="onNodeContextMenu"
        @edge-contextmenu="onEdgeContextMenu"
        @pane-contextmenu="onCanvasContextMenu"
      >
        <Background pattern-color="#374151" :gap="16" />
        <Controls position="bottom-left" />
      </VueFlow>
    </div>

    <Teleport to="body">
      <div
        v-if="contextMenu.show"
        class="context-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        @click.stop
      >
        <template v-if="contextMenu.type === 'node'">
          <div class="menu-item" @click="deleteNode">删除节点</div>
          <div class="menu-submenu">
            <span class="menu-item">修改颜色</span>
            <div class="submenu-content">
              <div
                v-for="color in nodeColors"
                :key="color.value"
                class="color-option"
                :style="{ background: color.value }"
                @click="changeNodeColor(color.value)"
              />
            </div>
          </div>
        </template>
        <template v-else-if="contextMenu.type === 'edge'">
          <div class="menu-item" @click="deleteEdge">删除线条</div>
          <div class="menu-submenu">
            <span class="menu-item">修改颜色</span>
            <div class="submenu-content">
              <div
                v-for="color in edgeColors"
                :key="color.value"
                class="color-option"
                :style="{ background: color.value }"
                @click="changeEdgeColor(color.value)"
              />
            </div>
          </div>
        </template>
        <template v-else-if="contextMenu.type === 'canvas'">
          <div class="menu-item" @click="addNodeAtCanvas">添加节点</div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.draw-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.toolbar {
  width: 14rem;
  background-color: #111827;
  border-right: 1px solid #374151;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-shrink: 0;
  overflow-y: auto;
}

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.node-list,
.edge-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.node-item,
.edge-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  cursor: grab;
  transition: all 0.2s;
  color: #d1d5db;
  font-size: 0.8125rem;
}

.node-item:active {
  cursor: grabbing;
}

.node-item:hover,
.edge-item:hover {
  background: #374151;
}

.node-item.active,
.edge-item.active {
  background: #3b82f6;
  border-color: #60a5fa;
  color: #fff;
}

.node-preview {
  pointer-events: none;
}

.edge-preview {
  pointer-events: none;
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px #3b82f6;
}

.tool-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.canvas-container {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.flow-editor {
  height: 100%;
  background-color: #1a1a2e;
}

:deep(.vue-flow__node) {
  cursor: move;
}

:deep(.vue-flow) {
  height: 100%;
}

:deep(.el-dialog__body) {
  padding: 0;
  height: 100%;
}

.context-menu {
  position: fixed;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 0.25rem 0;
  min-width: 120px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.menu-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #d1d5db;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #374151;
}

.menu-submenu {
  position: relative;
}

.menu-submenu > .menu-item::after {
  content: '▶';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
  color: #9ca3af;
}

.submenu-content {
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 0.25rem;
  min-width: 100px;
}

.menu-submenu:hover .submenu-content {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 120px;
}

.color-option {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.2);
}
</style>
