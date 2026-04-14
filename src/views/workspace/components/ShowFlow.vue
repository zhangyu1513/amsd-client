<template>
  <el-dialog
    v-model="dialogVisible"
    title="流程图"
    :width="'80%'"
    :top="'5vh'"
    :close-on-click-modal="false"
    class="show-flow-dialog"
    @close="handleClose"
  >
    <div class="flow-container">
      <VueFlow
        v-if="dialogVisible"
        :nodes="nodes"
        :edges="edges"
        :fit-view-on-init="true"
        :min-zoom="0.1"
        :max-zoom="2"
        class="vue-flow-container"
        @ready="handleFlowReady"
      >
        <Background pattern-color="#374151" :gap="16" />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          :pannable="true"
          :zoomable="true"
          node-color="#2d2d44"
          mask-color="rgba(0, 0, 0, 0.3)"
        />
      </VueFlow>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { getSuit } from '@/api/suit'
import { getProcesses } from '@/api/process'
import { getFractures } from '@/api/fracture'
import { getDensities } from '@/api/density'
import type { Suit, Process, Fracture, Density } from '@/api/types'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

interface Props {
  visible: boolean
  suitId: number
}

interface NodeData {
  label: string
  type: string
  [key: string]: unknown
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const suitData = ref<Suit | null>(null)
const loading = ref(false)

const { fitView } = useVueFlow()

const handleFlowReady = () => {
  fitView({ padding: 0.2, duration: 300 })
}

const nodes = ref<
  Array<{ id: string; position: { x: number; y: number }; data: NodeData; type?: string }>
>([])
const edges = ref<
  Array<{
    id: string
    source: string
    target: string
    type?: string
    style?: { stroke: string; strokeWidth: number }
  }>
>([])

const getNodeLabel = (type: string, data: NodeData): string => {
  switch (type) {
    case 'suit':
      return `${data.Number}\n${data.CustomerName}\n${data.Saler}`
    case 'process':
      return `${data.UID}\n${data.State} | ${data.Status}`
    case 'fracture':
      return `${data.UID}\n${data.Type}\n${data.State}`
    case 'density':
      return `${data.UID}\n${data.Type}\n${data.State}`
    default:
      return data.label
  }
}

const getStateColors = (state: string): { bg: string; border: string; line: string } => {
  const stateLower = state?.toLowerCase() || ''
  switch (stateLower) {
    case 'completed':
      return { bg: '#1f2d1f', border: '#10b981', line: '#10b981' }
    case 'failed':
      return { bg: '#3f1f1f', border: '#ef4444', line: '#ef4444' }
    case 'running':
      return { bg: '#3f2f1f', border: '#f59e0b', line: '#f59e0b' }
    case 'pending':
      return { bg: '#2d2d2d', border: '#6b7280', line: '#6b7280' }
    default:
      return { bg: '#2d2d44', border: '#4a4a6a', line: '#6366f1' }
  }
}

const loadData = async () => {
  if (!props.suitId) return
  loading.value = true
  try {
    const suit = await getSuit({ ID: props.suitId })

    const processesResponse = await getProcesses({ SuitID: props.suitId })
    const processes = processesResponse.list || []

    const processesWithChildren = await Promise.all(
      processes.map(async (process) => {
        const [fracturesResponse, densitiesResponse] = await Promise.all([
          getFractures({ ProcessID: process.ID }),
          getDensities({ ProcessID: process.ID }),
        ])
        return {
          ...process,
          Fractures: fracturesResponse.list || [],
          Densities: densitiesResponse.list || [],
        } as Process
      }),
    )

    const completeSuit = {
      ...suit,
      Processes: processesWithChildren,
    } as Suit

    suitData.value = completeSuit
    buildFlowData(completeSuit)
  } catch (error) {
    console.error('加载流程数据失败:', error)
  } finally {
    loading.value = false
  }
}

const buildFlowData = (suit: Suit) => {
  const newNodes: typeof nodes.value = []
  const newEdges: typeof edges.value = []

  const suitNode = {
    id: `suit-${suit.ID}`,
    position: { x: 300, y: 50 },
    data: {
      label: getNodeLabel('suit', {
        label: '',
        type: 'suit',
        Number: suit.Number || '',
        CustomerName: suit.CustomerName || '',
        Saler: suit.Saler || '',
      }),
      type: 'suit',
      Number: suit.Number,
      CustomerName: suit.CustomerName,
      Saler: suit.Saler,
      Status: suit.Status,
    },
    type: 'input',
    style: {
      background: '#1e3a5f',
      border: '#3b82f6',
      color: '#e0e0e0',
    },
  }
  newNodes.push(suitNode)

  const processes = suit.Processes || []
  const processCount = processes.length

  processes.forEach((process, index) => {
    const totalProcessWidth = processCount * 250
    const startX = (600 - totalProcessWidth) / 2
    const processX = startX + index * 250
    const processY = 200

    const processState = process.State || ''
    const processColors = getStateColors(processState)
    const processNode = {
      id: `process-${process.ID}`,
      position: { x: processX, y: processY },
      data: {
        label: getNodeLabel('process', {
          label: '',
          type: 'process',
          UID: process.UID || '',
          State: processState,
          Status: process.Status || '',
        }),
        type: 'process',
        UID: process.UID,
        EDA: process.EDA,
        Threads: process.Threads,
        Priority: process.Priority,
        State: process.State,
        Status: process.Status,
        Error: process.Error,
      },
      style: {
        background: processColors.bg,
        border: processColors.border,
        color: '#e0e0e0',
      },
    }
    newNodes.push(processNode)

    newEdges.push({
      id: `edge-suit-${suit.ID}-process-${process.ID}`,
      source: `suit-${suit.ID}`,
      target: `process-${process.ID}`,
      type: 'smoothstep',
      style: { stroke: processColors.line, strokeWidth: 2 },
    })

    const fractures = process.Fractures || []
    const densities = process.Densities || []
    const children = [...fractures, ...densities]
    const childCount = children.length
    const childStartX = processX - ((childCount - 1) * 120) / 2

    let childIndex = 0
    fractures.forEach((fracture, fIndex) => {
      const fractureState = fracture.State || ''
      const fractureColors = getStateColors(fractureState)
      const fractureNode = {
        id: `fracture-${fracture.ID}`,
        position: { x: childStartX + childIndex * 120, y: 350 },
        data: {
          label: getNodeLabel('fracture', {
            label: '',
            type: 'fracture',
            UID: fracture.UID || '',
            Type: fracture.Type || '',
            State: fractureState,
          }),
          type: 'fracture',
          UID: fracture.UID,
          Type: fracture.Type,
          EDA: fracture.EDA,
          Threads: fracture.Threads,
          Priority: fracture.Priority,
          Format: fracture.Format,
          Classify: fracture.Classify,
          State: fracture.State,
          Status: fracture.Status,
          Error: fracture.Error,
        },
        style: {
          background: fractureColors.bg,
          border: fractureColors.border,
          color: '#e0e0e0',
        },
      }
      newNodes.push(fractureNode)

      newEdges.push({
        id: `edge-process-${process.ID}-fracture-${fracture.ID}`,
        source: `process-${process.ID}`,
        target: `fracture-${fracture.ID}`,
        type: 'smoothstep',
        style: { stroke: fractureColors.line, strokeWidth: 2 },
      })
      childIndex++
    })

    densities.forEach((density, dIndex) => {
      const densityState = density.State || ''
      const densityColors = getStateColors(densityState)
      const densityNode = {
        id: `density-${density.ID}`,
        position: { x: childStartX + childIndex * 120, y: 350 },
        data: {
          label: getNodeLabel('density', {
            label: '',
            type: 'density',
            UID: density.UID || '',
            Type: density.Type || '',
            State: densityState,
          }),
          type: 'density',
          UID: density.UID,
          Type: density.Type,
          EDA: density.EDA,
          Threads: density.Threads,
          Priority: density.Priority,
          ChipWindow: density.ChipWindow,
          State: density.State,
          Status: density.Status,
          Error: density.Error,
        },
        style: {
          background: densityColors.bg,
          border: densityColors.border,
          color: '#e0e0e0',
        },
      }
      newNodes.push(densityNode)

      newEdges.push({
        id: `edge-process-${process.ID}-density-${density.ID}`,
        source: `process-${process.ID}`,
        target: `density-${density.ID}`,
        type: 'smoothstep',
        style: { stroke: densityColors.line, strokeWidth: 2 },
      })
      childIndex++
    })
  })

  nodes.value = newNodes
  edges.value = newEdges

  nextTick(() => {
    fitView({ padding: 0.2, duration: 300 })
  })
}

const handleClose = () => {
  suitData.value = null
  nodes.value = []
  edges.value = []
  emit('close')
}

watch(
  () => props.visible,
  (val) => {
    if (val && props.suitId) {
      loadData()
    }
  },
)
</script>

<style scoped>
.flow-container {
  height: 70vh;
  min-height: 400px;
  background-color: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
}

.vue-flow-container {
  width: 100%;
  height: 100%;
  background-color: #1a1a2e;
}

:deep(.vue-flow__node) {
  background-color: #2d2d44;
  border: 2px solid #4a4a6a;
  border-radius: 8px;
  padding: 12px 16px;
  color: #e0e0e0;
  font-size: 13px;
  transition: all 0.2s ease;
}

:deep(.vue-flow__node-default) {
  padding: 12px 16px;
}

:deep(.vue-flow__node-default-input) {
  padding: 12px 16px;
}

:deep(.vue-flow__node:hover) {
  border-color: #6366f1;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
}

:deep(.vue-flow__node-input) {
  border-color: #10b981;
}

:deep(.vue-flow__node-input:hover) {
  border-color: #34d399;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

:deep(.vue-flow__edge-path) {
  stroke: #6366f1;
  stroke-width: 2;
}

:deep(.vue-flow__controls) {
  background-color: #2d2d44;
  border: 1px solid #4a4a6a;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

:deep(.vue-flow__controls-button) {
  background-color: #2d2d44;
  border: none;
  border-bottom: 1px solid #4a4a6a;
  width: 20px;
  height: 20px;
  padding: 8px;
}

:deep(.vue-flow__controls-button:last-child) {
  border-bottom: none;
}

:deep(.vue-flow__controls-button:hover) {
  background-color: #3d3d5c;
}

:deep(.vue-flow__controls-button svg) {
  fill: #e0e0e0;
  width: 16px;
  height: 16px;
}

:deep(.vue-flow__background) {
  background-color: #1a1a2e;
}

:deep(.vue-flow__minimap) {
  background-color: #2d2d44;
  border: 1px solid #4a4a6a;
  border-radius: 6px;
}

:deep(.vue-flow__minimap-mask) {
  fill: rgba(0, 0, 0, 0.3);
}

.node-detail {
  padding: 8px;
}

:deep(.el-dialog__header) {
  background-color: #2d2d44;
}

:deep(.el-dialog__body) {
  background-color: #1f1f2e;
}
</style>

<style>
.show-flow-dialog .el-dialog__body {
  padding: 16px 20px;
  max-height: 70vh;
  overflow: hidden;
}

.show-flow-dialog {
  --el-dialog-bg-color: #1a1a2e;
}
</style>
