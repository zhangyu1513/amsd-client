<script setup lang="ts">
import NodeList from './components/NodeList.vue'
import TodayStats from './components/TodayStats.vue'
import HistoryStats from './components/HistoryStats.vue'
import NodeMonitorCard from './components/NodeMonitorCard.vue'
import TaskList from './components/TaskList.vue'
</script>

<template>
  <div class="space-y-6 p-2">
    <el-row :gutter="16">
      <el-col :xs="24" :md="12">
        <div class="flex flex-col gap-4 h-full">
          <TodayStats />
          <HistoryStats class="flex-1" />
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="flex flex-col gap-4 h-full">
          <NodeList class="h-2/5" />
          <TaskList class="flex-1" />
        </div>
      </el-col>
      <el-col :xs="24" :md="18" class="mt-4">
        <!-- <NodeMonitorCard /> -->
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>
