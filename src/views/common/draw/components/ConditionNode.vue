<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'

interface ConditionNodeProps extends NodeProps {
  data: {
    label: string
  }
}

defineProps<ConditionNodeProps>()
</script>

<template>
  <div class="condition-node">
    <Handle type="target" :position="Position.Top" class="handle" />
    <div class="diamond">
      <span class="label">{{ data.label }}</span>
    </div>
    <Handle type="source" :position="Position.Bottom" :id="`bottom-${$attrs.id}`" class="handle" />
    <Handle
      type="source"
      :position="Position.Left"
      :id="`left-${$attrs.id}`"
      class="handle left-handle"
    />
    <Handle
      type="source"
      :position="Position.Right"
      :id="`right-${$attrs.id}`"
      class="handle right-handle"
    />
  </div>
</template>

<style scoped>
.condition-node {
  padding: 8px;
  min-width: 80px;
}

.diamond {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: 2px solid #fbbf24;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.diamond .label {
  transform: rotate(-45deg);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  padding: 4px;
}

.handle {
  width: 12px;
  height: 12px;
  background: #f59e0b;
  border: 2px solid #fbbf24;
}

.left-handle {
  left: -6px !important;
}

.right-handle {
  left: auto !important;
  right: -6px !important;
}
</style>
