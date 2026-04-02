<template>
  <el-dialog v-model="dialogVisible" title="海量数据展示">
    <el-table :data="data" style="width: 100%" max-height="600" virtual-scroll :estimated-row-height="40">
      <el-table-column prop="Log" label="文本内容" />
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { api } from '@/api';
import type { Process, Fracture } from '@/api';

interface Props {
  logType: string
  id: number
}

const props = defineProps<Props>()

const dialogVisible = ref(false)

const data = ref<Process | Fracture>()



</script>