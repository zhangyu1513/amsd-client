<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Process, Fracture } from '@/api/types'
import { api } from '@/api'

// 定义组件Props
interface Props {
    visible: boolean
    process: Process
}

const props = defineProps<Props>()

// 响应式数据
const fracture = reactive<Fracture>({
    Format: 'OASIS', // 默认值
    Type: "total"
})
const loading = ref(false)

// 定义组件Emits
const emit = defineEmits(["close"])

// 表单引用
const formRef = ref<FormInstance>()

// 计算属性：获取process中的订单列表
// const processOrders = computed(() => {
//     if (!processDetail.value.Orders) return []

//     // Orders字段可能是字符串，需要解析
//     const ordersStr = processDetail.value.Orders
//     if (typeof ordersStr === 'string') {
//         return ordersStr.split(';').filter(order => order.trim())
//     }
//     return []
// })

// 加载process详情
// const loadProcessDetail = async () => {
//     if (!props.process.ID) {
//         ElMessage.error('Process ID不能为空')
//         return
//     }

//     loading.value = true
//     try {
//         const response = await api.process.getProcess({ ID: props.process.ID })
//         processDetail.value = response
//     } catch (err) {
//         console.error('加载Process详情失败:', err)
//         ElMessage.error('获取Process数据失败，请检查网络连接')
//     } finally {
//         loading.value = false
//     }
// }

// 关闭Dialog
const handleClose = () => {
    resetForm()
    emit("close")
}

// 重置表单
const resetForm = () => {
    fracture.Format = 'OASIS'
    fracture.Type = 'total'
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        // 验证表单
        const valid = await formRef.value.validate()
        if (!valid) return

        // 准备提交数据
        const submitData: Fracture = {
            ...fracture,
            ProcessID: props.process.ID
        }

        // 调用API创建转档任务
        loading.value = true
        const loadingInstance = ElLoading.service({
            lock: true,
            text: '正在创建转档任务...',
            background: 'rgba(0, 0, 0, 0.7)'
        })

        try {
            // console.log(submitData)
            await api.fracture.createFracture(submitData)

            // 关闭Dialog
            handleClose()

            // 显示成功消息
            ElMessage.success('添加转档任务成功')
        } catch (error) {
            console.error('创建转档任务失败:', error)
            ElMessage.error(error instanceof Error ? error.message : '创建失败')
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
    }
})

</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加转档任务" width="500px" :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false" draggable @close="handleClose">
        <!-- 表单内容 -->
        <el-form ref="formRef" :model="fracture" size="small" label-width="120px" label-position="top"
            class="w-full pl-2 pr-2">
            <!-- 参数3: Format选择 -->
            <el-form-item label="Format" prop="Format" class="w-full" disabled>
                <el-radio-group v-model="fracture.Format">
                    <el-radio value="OASIS">OASIS</el-radio>
                    <el-radio value="GDS2">GDS2</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 参数1: 订单选择-所有/单张 -->
            <el-form-item label="转档类型" prop="Type" class="w-full">
                <el-radio-group v-model="fracture.Type">
                    <el-radio value="total">所有订单合并为一个总版图</el-radio>
                    <el-radio value="single">每个订单单独生成每个版图</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" :disabled="loading">关闭</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loading">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 768px) {
    :deep(.el-dialog) {
        width: 90% !important;
    }
}
</style>
