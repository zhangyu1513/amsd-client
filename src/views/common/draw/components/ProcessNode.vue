<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'

interface ProcessNodeProps extends NodeProps {
  data: {
    label: string
    color?: string
  }
}

const props = defineProps<ProcessNodeProps>()

const nodeColor = computed(() => props.data.color || '#3b82f6')
</script>

<template>
  <div class="process-node" :style="{ '--node-color': nodeColor }">
    <Handle type="target" :position="Position.Top" class="handle" />
    <div class="node-content">
      {{ data.label }}
    </div>
    <Handle type="source" :position="Position.Bottom" class="handle" />
  </div>
</template>

<style scoped>
.process-node {
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--node-color), var(--node-color));
  border: 2px solid var(--node-color);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  filter: brightness(1.1);
}

.handle {
  width: 12px;
  height: 12px;
  background: var(--node-color);
  border: 2px solid var(--node-color);
}
</style>
