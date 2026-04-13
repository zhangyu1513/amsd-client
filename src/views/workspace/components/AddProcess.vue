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

// 定义组件Emits
const emit = defineEmits(["close"])

// 加载订单
const loadOrders = async () => {
  loading.value = true
  try {
    const response = await api.order.getOrders({ SuitID: props.suit.ID })
    orders.value = response.list
  } catch (err) {
    console.error('加载订单失败:', err)
    ElMessage.error('获取订单数据失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 关闭Dialog
const handleClose = () => {
  resetForm()
  emit("close")
}

// 重置表单
const resetForm = () => {
  process.LinkedAddress = ""
  checkedOrders.value = []
}

// 提交表单
const handleSubmit = async () => {

  try {
    // 去除空格
    process.LinkedAddress = process.LinkedAddress?.trim()
    // 准备提交数据
    const submitData: Process = {
      ...process,
      SuitID: props.suit.ID,
      Orders: checkedOrders.value.join(';') // 将选中的订单编号用逗号分隔
    }


    // 调用API创建处理任务
    loading.value = true
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在创建处理任务...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      await api.process.createProcess(submitData)

      // 关闭Dialog
      handleClose()

      // 显示成功消息
      ElMessage.success('添加处理任务成功')
    } catch (error) {
      console.error(error)
    } finally {
      loadingInstance.close()
      loading.value = false
    }

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
    :close-on-press-escape="false" :show-close="false" draggable @close="handleClose">
    <!-- 表单内容 -->
    <el-form ref="formRef" :model="process" size="small" label-width="100px" label-position="top"
      class="w-full pl-2 pr-2">
      <el-form-item label="选择订单" prop="Orders" class="w-full">
        <div class="order-table-container" :class="{ 'loading': loading }">
          <div v-if="loading" class="loading-overlay">
            <el-icon class="loading-icon">
              <Loading />
            </el-icon>
            <span>加载订单中...</span>
          </div>

          <div v-if="orders.length === 0" class="empty-state">
            <el-icon>
              <Document />
            </el-icon>
            <p>暂无订单数据</p>
          </div>

          <el-table v-if="orders.length > 0" :data="orders" border size="small" class="w-full" max-height="250px"
            @selection-change="handleSelectionChange" :row-key="(row: Order) => row.Number || ''">
            <el-table-column type="selection" :selectable="selectable" align="center" width="40" />
            <el-table-column prop="Number" label="订单编号" align="center" />
            <el-table-column prop="ModelNumber" label="ModelNumber" align="center" width="160">
              <template #default="scope">
                {{ scope.row.ModelNumber || '未设置' }}
              </template>
            </el-table-column>
            <el-table-column prop="JobdeckLevel" label="JobdeckLevel" align="center" width="100">
              <template #default="scope">
                {{ scope.row.JobdeckLevel || '未设置' }}
              </template>
            </el-table-column>
            <el-table-column prop="Status" label="状态" align="center" width="80">
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

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">关闭</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading"
          :disabled="checkedOrders.length === 0 || process.LinkedAddress?.trim() === ''">
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
  width: 100%;
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
