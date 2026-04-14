<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

interface EndNodeProps extends NodeProps {
  data: {
    label: string
  }
}

defineProps<EndNodeProps>()
</script>

<template>
  <div class="end-node">
    <div class="node-content">
      {{ data.label }}
    </div>
    <Handle type="source" :position="Position.Bottom" class="handle" />
  </div>
</template>

<style scoped>
.end-node {
  padding: 10px 16px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: 2px solid #f87171;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.handle {
  width: 12px;
  height: 12px;
  background: #ef4444;
  border: 2px solid #f87171;
}
</style>
