<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

interface ProcessNodeProps extends NodeProps {
  data: {
    label: string
  }
}

defineProps<ProcessNodeProps>()
</script>

<template>
  <div class="process-node">
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
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: 2px solid #60a5fa;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.handle {
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border: 2px solid #60a5fa;
}
</style>
