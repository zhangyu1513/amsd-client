<script setup lang="ts">
import { ref, watch } from 'vue'
import { userApi, adminApi } from '@/api/user'
import type { UserFormData, User } from '@/api/user'

interface Props {
  visible: boolean
  userId?: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  success: []
}>()

const formRef = ref()
const loading = ref(false)
const fetchLoading = ref(false)

const formData = ref<UserFormData>({
  ID: 0,
  Username: '',
  Password: '',
  Name: '',
  Status: 'active',
})

async function loadUserInfo() {
  if (!props.userId) return

  fetchLoading.value = true
  try {
    const user = await userApi.getUser({ ID: props.userId })
    formData.value = {
      ID: user.ID,
      Username: user.Username,
      Password: '',
      Name: user.Name,
      Status: user.Status,
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    fetchLoading.value = false
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val && props.userId) {
      loadUserInfo()
    } else if (!val) {
      formData.value = { ID: 0, Username: '', Password: '', Name: '', Status: 'active' }
    }
  },
)

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const data = { ...formData.value }
    if (!data.Password) {
      delete data.Password
    }

    await adminApi.updateUser(data)

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
  <el-dialog :model-value="props.visible" title="修改用户信息" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="80px" v-loading="fetchLoading">
      <el-form-item label="用户名">
        <el-input v-model="formData.Username" disabled />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="formData.Password" type="password" placeholder="留空则不修改密码" show-password />
      </el-form-item>
      <el-form-item label="姓名" prop="Name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
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
