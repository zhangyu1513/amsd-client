<template>
  <div class="flex flex-col h-full">
    <div class="shrink-0 flex flex-col border-b border-gray-700 p-2">
      <el-form ref="searchFormRef" :model="searchForm" label-width="60px" size="small" label-position="top"
        class="flex items-center gap-4">
        <el-form-item label="基准名称" prop="Name">
          <el-input v-model="searchForm.Name" placeholder="请输入基准名称" />
        </el-form-item>
        <el-form-item label="基准文件名" prop="Filename">
          <el-input v-model="searchForm.Filename" placeholder="请输入基准文件名" />
        </el-form-item>
        <el-form-item class="ml-auto">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <el-text>加载中...</el-text>
      </div>
      <div v-else-if="!tableData.length" class="flex items-center justify-center h-full text-gray-500">
        暂无数据
      </div>
      <template v-else>
        <el-card v-for="item in tableData" :key="item.ID" class="mb-4 bg-gray-800">
          <el-descriptions :column="6" border>
            <el-descriptions-item label="基准名称">{{ item.Name }}</el-descriptions-item>
            <el-descriptions-item label="放大系数">{{ item.Scale }}</el-descriptions-item>
            <el-descriptions-item label="基准文件名">{{ item.Filename }}</el-descriptions-item>
            <el-descriptions-item label="Cellname">{{ item.Cellname }}</el-descriptions-item>
            <el-descriptions-item label="Layer">{{ item.Layer }}</el-descriptions-item>
            <el-descriptions-item label="Datatype">{{ item.Datatype }}</el-descriptions-item>

            <el-descriptions-item v-if="item.Masktitles?.length" label="Masktitles" :span="6">
              <el-descriptions v-for="(mt, idx) in item.Masktitles" :key="idx" :column="5" border class="mt-2">
                <el-descriptions-item label="X坐标" :span="2">{{ mt.AxisX }}</el-descriptions-item>
                <el-descriptions-item label="Y坐标" :span="2">{{ mt.AxisY }}</el-descriptions-item>
                <el-descriptions-item label="字体" :span="1">{{
                  mt.FontName
                }}</el-descriptions-item>
                <el-descriptions-item label="字高">{{ mt.FontHeight }}</el-descriptions-item>
                <el-descriptions-item label="字间距">{{
                  mt.CharToCharDistence
                }}</el-descriptions-item>
                <el-descriptions-item label="旋转">{{ mt.Rot }}</el-descriptions-item>
                <el-descriptions-item label="镜像">{{ mt.Mirror }}</el-descriptions-item>
              </el-descriptions>
            </el-descriptions-item>

            <el-descriptions-item v-if="item.Barcodes?.length" label="Barcodes" :span="6">
              <el-descriptions v-for="(bc, idx) in item.Barcodes" :key="idx" :column="8" border class="mt-2">
                <el-descriptions-item label="类型" :span="1">{{
                  bc.Classify
                }}</el-descriptions-item>
                <el-descriptions-item label="X坐标" :span="3">{{ bc.AxisX }}</el-descriptions-item>
                <el-descriptions-item label="Y坐标" :span="3">{{ bc.AxisY }}</el-descriptions-item>
                <el-descriptions-item label="字体" :span="1">{{
                  bc.FontName
                }}</el-descriptions-item>
                <el-descriptions-item label="字高">{{ bc.FontHeight }}</el-descriptions-item>
                <el-descriptions-item label="条字距">{{ bc.BarToCharDistence }}</el-descriptions-item>
                <el-descriptions-item label="字符最大长度">{{ bc.MaxLength }}</el-descriptions-item>
                <el-descriptions-item label="填充">{{
                  bc.Padding ? '是' : '否'
                }}</el-descriptions-item>
                <el-descriptions-item label="填充字符">{{ bc.PaddingChar }}</el-descriptions-item>
                <el-descriptions-item label="位置">{{ bc.Location }}</el-descriptions-item>

                <el-descriptions-item label="旋转">{{ bc.Rot }}</el-descriptions-item>
              </el-descriptions>
            </el-descriptions-item>

            <el-descriptions-item v-if="item.Qrcodes?.length" label="Qrcodes" :span="6">
              <el-descriptions v-for="(qr, idx) in item.Qrcodes" :key="idx" :column="8" border class="mt-2">
                <el-descriptions-item label="版本">{{ qr.Version }}</el-descriptions-item>
                <el-descriptions-item label="容错级别">{{ qr.ErrorLevel }}</el-descriptions-item>
                <el-descriptions-item label="边框">{{ qr.BoxEdge }}</el-descriptions-item>
                <el-descriptions-item label="X坐标">{{ qr.AxisX }}</el-descriptions-item>
                <el-descriptions-item label="Y坐标">{{ qr.AxisY }}</el-descriptions-item>
                <el-descriptions-item label="旋转">{{ qr.Rot }}</el-descriptions-item>
              </el-descriptions>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </template>
    </div>

    <FiducialDialog ref="dialogRef" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FiducialItem, FiducialItemForm } from '@/api/fiducial'
import FiducialDialog from './components/FiducialDialog.vue'

const searchFormRef = ref<FormInstance>()
const dialogRef = ref<InstanceType<typeof FiducialDialog>>()
const loading = ref(false)

const searchForm = reactive({
  Name: '',
  Filename: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

const tableData = ref<FiducialItem[]>([
  {
    ID: 1,
    Name: 'TestFiducial1',
    Scale: 1,
    DirName: '/fiducial/test1',
    Filename: 'test1.gds',
    Cellname: 'CELL_A',
    Layer: 1,
    Datatype: 0,
    Masktitles: [
      {
        ID: 1,
        FontName: 'Arial',
        FontHeight: 10,
        CharToCharDistence: 5,
        AxisX: 100,
        AxisY: 200,
        Rot: 0,
        Mirror: 'N',
      },
    ],
    Barcodes: [
      {
        ID: 1,
        Classify: 'CODE128',
        FontName: 'Code128',
        FontHeight: 8,
        BarToCharDistence: 2,
        MaxLength: 20,
        Padding: true,
        PaddingChar: '0',
        Location: 'bottom',
        AxisX: 300,
        AxisY: 400,
        Rot: 0,
      },
    ],
    Qrcodes: [
      {
        ID: 1,
        Version: '1',
        ErrorLevel: 'M',
        BoxEdge: 10,
        AxisX: 500,
        AxisY: 600,
        Rot: 0,
      },
    ],
  },
  {
    ID: 2,
    Name: 'TestFiducial2',
    Scale: 2,
    DirName: '/fiducial/test2',
    Filename: 'test2.gds',
    Cellname: 'CELL_B',
    Layer: 2,
    Datatype: 1,
    Masktitles: [
      {
        ID: 2,
        FontName: 'Helvetica',
        FontHeight: 12,
        CharToCharDistence: 6,
        AxisX: 150,
        AxisY: 250,
        Rot: 90,
        Mirror: 'Y',
      },
    ],
    Barcodes: [],
    Qrcodes: [],
  },
])

function handleSearch() {
  pagination.page = 1
}

function handleReset() {
  searchFormRef.value?.resetFields()
}

function handleAdd() {
  dialogRef.value?.open()
}

function handleSubmit(data: FiducialItemForm) {
  const newItem: FiducialItem = {
    ...data,
    ID: Math.max(0, ...tableData.value.map((i) => i.ID)) + 1,
    Masktitles: data.Masktitles.map((m) => ({ ...m, ID: Math.floor(Math.random() * 1000) })),
    Barcodes: data.Barcodes.map((b) => ({ ...b, ID: Math.floor(Math.random() * 1000) })),
    Qrcodes: data.Qrcodes.map((q) => ({ ...q, ID: Math.floor(Math.random() * 1000) })),
  }
  tableData.value.unshift(newItem)
}
</script>
