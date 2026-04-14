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

const { fitView, addNodes, onConnect } = useVueFlow()

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
}

const nodeConfigs: NodeConfig[] = [
  { type: 'start', label: '开始', icon: 'VideoPlay' },
  { type: 'process', label: '处理', icon: 'Box' },
  { type: 'condition', label: '判断', icon: 'Switch' },
  { type: 'end', label: '结束', icon: 'VideoPause' },
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

onConnect((params) => {
  edges.value.push({
    id: `e-${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    type: selectedEdgeType.value,
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
      data: { label },
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
</script>

<template>
  <div class="draw-container">
    <div class="toolbar">
      <div class="tool-section">
        <div class="section-title">节点</div>
        <div class="node-list">
          <div v-for="node in nodeConfigs" :key="node.type" class="node-item"
            :class="{ active: selectedNodeType === node.type }" @click="selectedNodeType = node.type">
            <el-icon>
              <component :is="node.icon" />
            </el-icon>
            <span>{{ node.label }}</span>
          </div>
        </div>
      </div>

      <div class="tool-section">
        <div class="section-title">线条</div>
        <div class="edge-list">
          <div v-for="edge in edgeConfigs" :key="edge.type" class="edge-item"
            :class="{ active: selectedEdgeType === edge.type }" @click="selectedEdgeType = edge.type">
            <span>{{ edge.label }}</span>
          </div>
        </div>
      </div>

      <div class="tool-actions">
        <el-button type="primary" size="small" @click="addNode">添加节点</el-button>
        <el-button size="small" @click="deleteSelected">删除选中</el-button>
        <el-button size="small" @click="exportData">导出数据</el-button>
      </div>
    </div>

    <div class="canvas-container">
      <VueFlow v-model:nodes="nodes" v-model:edges="edges" :node-types="nodeTypes" :fit-view-on-init="true"
        :min-zoom="0.1" :max-zoom="2" class="flow-editor">
        <Background pattern-color="#374151" :gap="16" />
        <Controls position="bottom-left" />
      </VueFlow>
    </div>
  </div>
</template>

<style scoped>
.draw-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* position: absolute; */
  /* inset: 0; */
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
  cursor: pointer;
  transition: all 0.2s;
  color: #d1d5db;
  font-size: 0.8125rem;
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
</style>
