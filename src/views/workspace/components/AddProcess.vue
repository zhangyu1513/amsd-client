<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Suit, Process, Order } from '@/api/types'
import { api } from '@/api'
import { Loading, Document } from '@element-plus/icons-vue'

// 定义组件Props
interface Props {
  visible: boolean
  suit: Suit
}

const props = defineProps<Props>()

// 响应式数据
const process = reactive<Process>({})
const orders = ref<Order[]>([])
const checkedOrders = ref<Array<string>>([])
const loading = ref(false)

// 表格选择变化处理
const handleSelectionChange = (selection: Order[]) => {
  checkedOrders.value = selection
    .filter(order => order.Number)
    .map(order => order.Number!) as string[]
}

// 判断订单是否可选
const selectable = (row: Order, index: number) => {
  // 这里可以根据业务逻辑控制哪些订单可选
  // 例如：只允许状态为 'open' 的订单被选择
  return row.Status === 'open' || !row.Status
}

// 订单选择验证规则
const validateOrders = (rule: any, value: any, callback: any) => {
  if (!checkedOrders.value || checkedOrders.value.length === 0) {
    callback(new Error('请至少选择一个订单'))
  } else {
    callback()
  }
}

// 定义组件Emits
const emit = defineEmits(["close"])

// 表单引用
const formRef = ref<FormInstance>()

// 加载订单
const loadOrders = async () => {
  loading.value = true
  try {
    const response = await api.order.getOrders({ SuitID: props.suit.ID })
    orders.value = response.List
  } catch (err) {
    console.error('加载订单失败:', err)
    ElMessage.error('获取订单数据失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// Linux文件路径校验规则
const validateLinuxPath = (rule: any, value: string, callback: any) => {
  // 如果值为空或undefined，由required规则处理
  if (!value || value.trim() === '') {
    callback()
    return
  }

  const trimmedValue = value.trim()

  // 检查是否以空格开头或结尾
  if (value !== trimmedValue) {
    callback(new Error('路径不能以空格开头或结尾'))
    return
  }

  // 检查非法字符
  const illegalChars = /[<>:"|?*]/
  if (illegalChars.test(trimmedValue)) {
    callback(new Error('路径包含非法字符：<>:"|?*'))
    return
  }

  // 检查连续斜杠（除了网络路径开头的//）
  if (trimmedValue.startsWith('//')) {
    // 网络路径允许开头的//，但检查后面的部分
    const afterNetworkPath = trimmedValue.substring(2)
    if (afterNetworkPath.includes('//')) {
      callback(new Error('路径不能包含连续斜杠'))
      return
    }
  } else if (trimmedValue.includes('//')) {
    callback(new Error('路径不能包含连续斜杠'))
    return
  }

  // 检查路径格式
  // 允许的格式：
  // 1. 绝对路径：/path/to/file
  // 2. 相对路径：./path/to/file 或 ../path/to/file
  // 3. 用户家目录：~/path/to/file
  // 4. 网络路径：//server/path
  const pathPattern = /^(\/|\.\/|\.\.\/|~\/|\/\/)/
  if (!pathPattern.test(trimmedValue)) {
    callback(new Error('请输入有效的Linux文件路径（以/, ./, ../, ~/或//开头）'))
    return
  }

  // 检查路径长度
  if (trimmedValue.length > 4096) {
    callback(new Error('路径过长，Linux系统最大路径长度为4096字符'))
    return
  }

  callback()
}

// 表单验证规则
const rules = reactive<FormRules>({
  Orders: [
    { validator: validateOrders, trigger: 'change' }
  ],
  LinkedAddress: [
    { required: true, message: '请输入关联地址', trigger: 'blur' },
    { validator: validateLinuxPath, trigger: 'blur' }
  ]
})

// 关闭Dialog
const handleClose = () => {
  resetForm()
  emit("close")
}

// 重置表单
const resetForm = () => {
  process.LinkedAddress = ""
  checkedOrders.value = []
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    const valid = await formRef.value.validate()
    if (!valid) return

    // 准备提交数据
    const submitData: Process = {
      ...process,
      SuitID: props.suit.ID,
      Orders: checkedOrders.value.join(',') // 将选中的订单编号用逗号分隔
    }


    // 调用API创建处理任务
    loading.value = true
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在创建处理任务...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    console.log(submitData)
    // return

    // try {
    //   await api.process.createProcess(submitData)

    //   // 关闭Dialog
    //   handleClose()

    //   // 显示成功消息
    //   ElMessage.success('添加处理任务成功')
    // } catch (error) {
    //   console.error('创建处理任务失败:', error)
    //   ElMessage.error('创建处理任务失败，请稍后重试')
    // } finally {
    //   loadingInstance.close()
    //   loading.value = false
    // }

  } catch (error) {
    console.error('表单验证失败:', error)
    // 验证失败时不需要显示错误消息，Element Plus会自动显示
  }
}

const dialogVisible = ref(false)

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  dialogVisible.value = props.visible
  if (newVal) {
    resetForm()
    loadOrders()
  }
})

</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加处理任务" width="600px" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" @close="handleClose">
    <!-- 表单内容 -->
    <el-form ref="formRef" :model="process" :rules="rules" label-width="100px" label-position="top"
      class="add-process-form">
      <el-form-item label="选择订单" prop="Orders" class="w-full">
        <div class="order-table-container" :class="{ 'loading': loading }">
          <div v-if="loading" class="loading-overlay">
            <el-icon class="loading-icon">
              <Loading />
            </el-icon>
            <span>加载订单中...</span>
          </div>

          <div v-if="!loading && orders.length === 0" class="empty-state">
            <el-icon>
              <Document />
            </el-icon>
            <p>暂无订单数据</p>
          </div>

          <el-table v-if="!loading && orders.length > 0" :data="orders" border size="small" class="w-full" height="250"
            @selection-change="handleSelectionChange" :row-key="(row: Order) => row.Number || ''">
            <el-table-column type="selection" :selectable="selectable" width="55" />
            <el-table-column prop="Number" label="订单编号" />
            <el-table-column prop="ModelNumber" label="ModelNumber" width="160">
              <template #default="scope">
                {{ scope.row.ModelNumber || '未设置' }}
              </template>
            </el-table-column>
            <el-table-column prop="JobdeckLevel" label="JobdeckLevel" width="100">
              <template #default="scope">
                {{ scope.row.JobdeckLevel || '未设置' }}
              </template>
            </el-table-column>
            <el-table-column prop="Status" label="状态" width="80">
              <template #default="scope">
                <el-tag v-if="scope.row.Status" :type="scope.row.Status === 'open' ? 'success' : 'info'" size="small">
                  {{ scope.row.Status === 'open' ? '进行中' : scope.row.Status }}
                </el-tag>
                <span v-else>未设置</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <el-form-item label="关联地址" prop="LinkedAddress">
        <el-input v-model="process.LinkedAddress" placeholder="请输入Linux文件夹路径, 例如: /home/user/xxx" clearable
          :disabled="loading" />
      </el-form-item>
    </el-form>

    <!-- <div class="form-tips">
      <p class="tip-text">Linux文件夹路径格式要求：</p>
      <ul class="tip-list">
        <li>• 必须以 /, ./, ../, ~/ 或 // 开头</li>
        <li>• 不能包含非法字符：<> : " | ? *</li>
        <li>• 不能以空格开头或结尾</li>
        <li>• 不能包含连续斜杠（//）</li>
        <li>• 最大长度：4096字符</li>
      </ul>
    </div> -->

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">关闭</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading" :disabled="checkedOrders.length === 0">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.add-process-form {
  padding: 10px 0;
}

/* 订单表格容器 */
.order-table-container {
  position: relative;
  /* border: 1px solid #e4e7ed; */
  border-radius: 4px;
  /* background-color: #fafafa; */
  /* min-height: 200px; */
}

.order-table-container.loading {
  min-height: 200px;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loading-icon {
  font-size: 24px;
  color: #409eff;
  margin-bottom: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
  text-align: center;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
  overflow: hidden;
}


:deep(.el-table .el-checkbox) {
  margin: 0;
}

:deep(.el-table .el-tag) {
  margin: 0;
}

/* 表单提示 */
.form-tips {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.tip-text {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

.tip-list {
  margin: 0;
  padding-left: 16px;
}

.tip-list li {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-bottom: 4px;
}

.tip-list li:last-child {
  margin-bottom: 0;
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 确保Dialog样式符合项目规范 */
:deep(.el-dialog) {
  border-radius: 20px !important;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 20px;
  width: 100%;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: 1px solid #e4e7ed;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

:deep(.el-input) {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-table-column) {
    padding: 4px !important;
  }
}
</style>
