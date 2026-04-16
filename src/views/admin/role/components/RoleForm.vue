<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { adminApi } from '@/api/user'
import type { RoleFormData, Role } from '@/api/user'

interface Props {
  visible: boolean
  role?: Role | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const formRef = ref()
const loading = ref(false)

const formData = ref<RoleFormData>({
  Name: '',
  Code: '',
  Description: '',
  Status: 'active',
})

const isEdit = computed(() => !!props.role?.ID)

const rules = {
  Name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  Code: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
}

watch(
  () => props.role,
  (val) => {
    if (val) {
      formData.value = { ...val }
    } else {
      formData.value = { Name: '', Code: '', Description: '', Status: 'active' }
    }
  },
  { immediate: true },
)

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      formData.value = { Name: '', Code: '', Description: '', Status: 'active' }
    }
  },
)

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await adminApi.updateRole(formData.value)
    } else {
      await adminApi.createRole(formData.value)
    }

    emit('update:visible', false)
    emit('success')
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    :title="isEdit ? '编辑角色' : '新增角色'"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="Name">
        <el-input v-model="formData.Name" />
      </el-form-item>
      <el-form-item label="角色代码" prop="Code">
        <el-input v-model="formData.Code" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="描述" prop="Description">
        <el-input v-model="formData.Description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-radio-group v-model="formData.Status">
          <el-radio value="active">激活</el-radio>
          <el-radio value="inactive">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
