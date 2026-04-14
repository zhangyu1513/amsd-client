<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

interface StartNodeProps extends NodeProps {
  data: {
    label: string
  }
}

defineProps<StartNodeProps>()
</script>

<template>
  <div class="start-node">
    <Handle type="target" :position="Position.Top" class="handle" />
    <div class="node-content">
      {{ data.label }}
    </div>
  </div>
</template>

<style scoped>
.start-node {
  padding: 10px 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  border: 2px solid #34d399;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.handle {
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #34d399;
}
</style>
