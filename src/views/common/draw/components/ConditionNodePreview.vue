<script setup lang="ts"></script>

<template>
  <div class="condition-node-preview">
    <div class="diamond">
      <span class="label">判断</span>
    </div>
  </div>
</template>

<style scoped>
.condition-node-preview {
  padding: 4px;
  min-width: 50px;
}

.diamond {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: 2px solid #fbbf24;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}

.diamond .label {
  transform: rotate(-45deg);
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
}
</style>
