<template>
  <el-dialog v-model="visible" title="新增基准" width="80%" top="20px" class="h-4/5" destroy-on-close @close="handleClose">
    <el-scrollbar class="h-full pr-2">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="基本信息" name="basic">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" size="small" label-position="top">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="基准名称" prop="Name">
                      <el-input v-model="form.Name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="基准文件名" prop="Filename">
                      <el-input v-model="form.Filename" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Cellname" prop="Cellname">
                      <el-input v-model="form.Cellname" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="缩放系数" prop="Scale">
                      <el-input-number v-model="form.Scale" :min="1" class="w-full" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Layer" prop="Layer">
                      <el-input-number v-model="form.Layer" :min="1" class="w-full" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Datatype" prop="Datatype">
                      <el-input-number v-model="form.Datatype" :min="0" class="w-full" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-form-item label="文件上传">
                  <el-upload ref="uploadRef" class="upload-demo" drag action="#" :auto-upload="false" :limit="1"
                    accept=".gds" :on-change="handleFileChange" :on-remove="handleFileRemove">
                    <el-icon class="el-icon--upload">
                      <upload-filled />
                    </el-icon>
                    <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
                    <template #tip>
                      <div class="el-upload__tip text-gray-400">仅支持 .gds 文件</div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>

        <el-collapse-item :title="`Masktitle (${form.Masktitles.length})`" name="masktitle">
          <div class="mb-2">
            <el-button size="small" @click="addMasktitle">添加</el-button>
          </div>
          <el-card v-for="(mt, idx) in form.Masktitles" :key="'mt-' + idx" class="mb-2" shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span>Masktitle #{{ idx + 1 }}</span>
                <el-button type="danger" size="small" text @click="removeMasktitle(idx)">删除</el-button>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="字体">
                  <el-input v-model="mt.FontName" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="字高">
                  <el-input-number v-model="mt.FontHeight" :min="1" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="字距">
                  <el-input-number v-model="mt.CharToCharDistence" :min="0" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="X坐标">
                  <el-input-number v-model="mt.AxisX" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Y坐标">
                  <el-input-number v-model="mt.AxisY" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="旋转">
                  <el-input-number v-model="mt.Rot" :min="0" :max="360" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="镜像">
                  <el-select v-model="mt.Mirror" class="w-full">
                    <el-option label="否" value="N" />
                    <el-option label="是" value="Y" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>

        <el-collapse-item :title="`Barcode (${form.Barcodes.length})`" name="barcode">
          <div class="mb-2">
            <el-button size="small" @click="addBarcode">添加</el-button>
          </div>
          <el-card v-for="(bc, idx) in form.Barcodes" :key="'bc-' + idx" class="mb-2" shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span>Barcode #{{ idx + 1 }}</span>
                <el-button type="danger" size="small" text @click="removeBarcode(idx)">删除</el-button>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="分类">
                  <el-input v-model="bc.Classify" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="字体">
                  <el-input v-model="bc.FontName" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="字高">
                  <el-input-number v-model="bc.FontHeight" :min="1" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="条距">
                  <el-input-number v-model="bc.BarToCharDistence" :min="0" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最大长度">
                  <el-input-number v-model="bc.MaxLength" :min="1" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="填充">
                  <el-switch v-model="bc.Padding" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="填充字符">
                  <el-input v-model="bc.PaddingChar" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="位置">
                  <el-select v-model="bc.Location" class="w-full">
                    <el-option label="top" value="top" />
                    <el-option label="bottom" value="bottom" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="X坐标">
                  <el-input-number v-model="bc.AxisX" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Y坐标">
                  <el-input-number v-model="bc.AxisY" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="旋转">
                  <el-input-number v-model="bc.Rot" :min="0" :max="360" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>

        <el-collapse-item :title="`Qrcode (${form.Qrcodes.length})`" name="qrcode">
          <div class="mb-2">
            <el-button size="small" @click="addQrcode">添加</el-button>
          </div>
          <el-card v-for="(qr, idx) in form.Qrcodes" :key="'qr-' + idx" class="mb-2" shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span>Qrcode #{{ idx + 1 }}</span>
                <el-button type="danger" size="small" text @click="removeQrcode(idx)">删除</el-button>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="版本">
                  <el-input v-model="qr.Version" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="容错级别">
                  <el-select v-model="qr.ErrorLevel" class="w-full">
                    <el-option label="L" value="L" />
                    <el-option label="M" value="M" />
                    <el-option label="Q" value="Q" />
                    <el-option label="H" value="H" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="边框">
                  <el-input-number v-model="qr.BoxEdge" :min="1" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="X坐标">
                  <el-input-number v-model="qr.AxisX" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Y坐标">
                  <el-input-number v-model="qr.AxisY" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="旋转">
                  <el-input-number v-model="qr.Rot" :min="0" :max="360" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules, UploadFile, UploadInstance } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { FiducialItemForm, MasktitleForm, BarcodeForm, QrcodeForm } from '@/api/fiducial'

const visible = ref(false)
const activeCollapse = ref<string[]>(['basic'])
const formRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()

function handleFileChange(file: UploadFile) {
  if (file.name) {
    form.Filename = file.name
  }
}

function handleFileRemove() {
  form.Filename = ''
}

const defaultMasktitle = (): MasktitleForm => ({
  FontName: '',
  FontHeight: 10,
  CharToCharDistence: 0,
  AxisX: 0,
  AxisY: 0,
  Rot: 0,
  Mirror: 'N',
})

const defaultBarcode = (): BarcodeForm => ({
  Classify: '',
  FontName: '',
  FontHeight: 8,
  BarToCharDistence: 0,
  MaxLength: 20,
  Padding: false,
  PaddingChar: '0',
  Location: 'bottom',
  AxisX: 0,
  AxisY: 0,
  Rot: 0,
})

const defaultQrcode = (): QrcodeForm => ({
  Version: '1',
  ErrorLevel: 'M',
  BoxEdge: 10,
  AxisX: 0,
  AxisY: 0,
  Rot: 0,
})

const form = reactive<FiducialItemForm>({
  Name: '',
  Scale: 1,
  DirName: '',
  Filename: '',
  Cellname: '',
  Layer: 1,
  Datatype: 0,
  Masktitles: [],
  Barcodes: [],
  Qrcodes: [],
})

const rules: FormRules = {
  Name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  DirName: [{ required: true, message: '请输入目录名', trigger: 'blur' }],
  Filename: [{ required: true, message: '请输入文件名', trigger: 'blur' }],
  Cellname: [{ required: true, message: '请输入单元名', trigger: 'blur' }],
}

function open() {
  visible.value = true
  activeCollapse.value = ['basic']
  resetForm()
}

function resetForm() {
  form.Name = ''
  form.Scale = 1
  form.DirName = ''
  form.Filename = ''
  form.Cellname = ''
  form.Layer = 1
  form.Datatype = 0
  form.Masktitles = []
  form.Barcodes = []
  form.Qrcodes = []
}

function addMasktitle() {
  form.Masktitles.push(defaultMasktitle())
}

function removeMasktitle(index: number) {
  form.Masktitles.splice(index, 1)
}

function addBarcode() {
  form.Barcodes.push(defaultBarcode())
}

function removeBarcode(index: number) {
  form.Barcodes.splice(index, 1)
}

function addQrcode() {
  form.Qrcodes.push(defaultQrcode())
}

function removeQrcode(index: number) {
  form.Qrcodes.splice(index, 1)
}

function handleClose() {
  visible.value = false
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    emit('submit', { ...form })
    handleClose()
  } catch {
    activeCollapse.value = ['basic']
  }
}

const emit = defineEmits<{
  submit: [data: FiducialItemForm]
}>()

defineExpose({ open })
</script>
