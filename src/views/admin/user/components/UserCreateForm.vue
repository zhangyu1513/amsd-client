<script setup lang="ts">
import { ref } from 'vue'
import { adminApi } from '@/api/user'
import type { UserFormData } from '@/api/user'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const formRef = ref()
const loading = ref(false)

const formData = ref<UserFormData>({
  Username: '',
  Password: '',
  Name: '',
  Status: 'active',
})

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await adminApi.createUser(formData.value)

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
  <el-dialog :model-value="props.visible" title="新增用户" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="80px">
      <el-form-item
        label="用户名"
        prop="Username"
        :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
      >
        <el-input v-model="formData.Username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="Password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
      >
        <el-input
          v-model="formData.Password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="Name"
        :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
      >
        <el-input v-model="formData.Name" placeholder="请输入姓名" />
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
