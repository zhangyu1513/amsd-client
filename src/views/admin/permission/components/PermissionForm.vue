<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { adminApi } from '@/api/user'
import type { PermissionFormData, Permission } from '@/api/user'

interface Props {
  visible: boolean
  permission?: Permission | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const formRef = ref()
const loading = ref(false)

const formData = ref<PermissionFormData>({
  Name: '',
  Code: '',
  Resource: '',
  Action: '',
  Description: '',
})

const isEdit = computed(() => !!props.permission?.ID)

const rules = {
  Name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  Code: [{ required: true, message: '请输入权限代码', trigger: 'blur' }],
  Resource: [{ required: true, message: '请输入资源', trigger: 'blur' }],
  Action: [{ required: true, message: '请输入操作', trigger: 'blur' }],
}

watch(
  () => props.permission,
  (val) => {
    if (val) {
      formData.value = { ...val }
    } else {
      formData.value = { Name: '', Code: '', Resource: '', Action: '', Description: '' }
    }
  },
  { immediate: true },
)

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      formData.value = { Name: '', Code: '', Resource: '', Action: '', Description: '' }
    }
  },
)

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await adminApi.updatePermission(formData.value)
    } else {
      await adminApi.createPermission(formData.value)
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
    :title="isEdit ? '编辑权限' : '新增权限'"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="权限名称" prop="Name">
        <el-input v-model="formData.Name" />
      </el-form-item>
      <el-form-item label="权限代码" prop="Code">
        <el-input v-model="formData.Code" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="资源" prop="Resource">
        <el-input v-model="formData.Resource" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="操作" prop="Action">
        <el-input v-model="formData.Action" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="描述" prop="Description">
        <el-input v-model="formData.Description" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
