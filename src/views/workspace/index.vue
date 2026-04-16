<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Select,
  CloseBold,
  SemiSelect,
  Tickets,
  MessageBox,
  Plus,
  Search,
  Refresh,
  CopyDocument,
} from '@element-plus/icons-vue'
import { api } from '@/api'
import { formatDate } from '@/utils/date'
import { copyToClipboard } from '@/utils/clipboard'
import type {
  PaginationParams,
  Process,
  ProcessSearchParams,
  Suit,
  SuitSearchParams,
} from '@/api/types'
import AddProcess from './components/AddProcess.vue'
import ShowFracture from './components/ShowFracture.vue'
import ShowDensity from './components/ShowDensity.vue'
import ShowFlow from './components/ShowFlow.vue'

// 表格数据
const tableData = ref<Suit[]>([])
const tableLoading = ref(false)

// 展开行 ID（实现一次只展开一行）
const expandedRowKeys = ref<(string | number)[]>([])
const handleExpandChange = (row: Suit, expandedRows: any[]) => {
  const key = row.ID ?? ''
  processTableData.value = []
  if (expandedRowKeys.value.includes(key)) {
    expandedRowKeys.value = []
  } else {
    expandedRowKeys.value = [key]
    row.ID && loadProcessData(row.ID)
  }
}

// 数据版本号 - 用于触发动画
const dataVersion = ref(0)

const searchForm = ref<Suit>({})

const paginationForm = ref<PaginationParams>({
  Page: 1,
  PageSize: 20,
})

const total = ref(0)

// 搜索参数 - 使用类型安全的 SuitSearchParams
const searchParams = computed<SuitSearchParams>(() => {
  return {
    ...paginationForm.value,
    ...searchForm.value,
  }
})

// 从API获取套单数据
const listSuits = async () => {
  tableLoading.value = true
  try {
    const response = await api.suit.getSuits(searchParams.value)
    tableData.value = []
    dataVersion.value++
    tableData.value = response.list
    total.value = response.total
  } catch (error) {
    console.error('获取套单数据失败:', error)
  } finally {
    tableLoading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  paginationForm.value.Page = page
  listSuits()
}

// 处理每页显示数量变化
const handleSizeChange = (size: number) => {
  paginationForm.value.PageSize = size
  paginationForm.value.Page = 1
  listSuits()
}

watch(tableData, () => {
  dataVersion.value++
})

onMounted(() => {
  listSuits()
})

const addProcessFlag = ref(false)
const addProcessParam = ref<Suit>({})

const openAddProcess = (suit: Suit) => {
  addProcessFlag.value = true
  addProcessParam.value = suit
}

const closeAddProcess = () => {
  addProcessFlag.value = false
}

// ProcessCard logic
const processTableData = ref<Process[]>([])
const processTableLoading = ref(false)
const processDataVersion = ref(0)

const processSearchForm = ref<Process>({
  SuitID: 0,
})

const paginationFormProcess = ref<PaginationParams>({
  Page: 1,
  PageSize: 5,
})

const processTotal = ref(0)

const processSearchParams = computed<ProcessSearchParams>(() => {
  return {
    ...paginationFormProcess.value,
    ...processSearchForm.value,
  }
})

const listProcesses = async (suitId?: number) => {
  processTableLoading.value = true
  try {
    if (suitId) {
      processSearchForm.value.SuitID = suitId
    }
    const response = await api.process.getProcesses(processSearchParams.value)
    processTableData.value = []
    await nextTick()
    processTableData.value = response.list
    processTotal.value = response.total
  } catch (error) {
    console.error('获取处理任务数据失败:', error)
  } finally {
    processTableLoading.value = false
  }
}

const handleProcessPageChange = (page: number) => {
  paginationFormProcess.value.Page = page
  listProcesses()
}

const handleProcessSizeChange = (size: number) => {
  paginationFormProcess.value.PageSize = size
  paginationFormProcess.value.Page = 1
  listProcesses()
}

const selectedProcess = ref<Process>({})
const showAddFractureDialog = ref(false)
const showAddDensityDialog = ref(false)

const openAddFractureDialog = (process: Process) => {
  selectedProcess.value = process
  showAddFractureDialog.value = true
}

const closeAddFractureDialog = () => {
  showAddFractureDialog.value = false
  selectedProcess.value = {}
}

const openAddDensityDialog = (process: Process) => {
  selectedProcess.value = process
  showAddDensityDialog.value = true
}

const closeAddDensityDialog = () => {
  showAddDensityDialog.value = false
  selectedProcess.value = {}
}

const selectedSuit = ref<Suit | null>(null)
const showFlowDialog = ref(false)

const openShowFlowDialog = (suit: Suit) => {
  selectedSuit.value = suit
  showFlowDialog.value = true
}

const closeShowFlowDialog = () => {
  showFlowDialog.value = false
  selectedSuit.value = null
}

watch(
  processTableData,
  () => {
    processDataVersion.value++
  },
  { deep: true },
)

const loadProcessData = (suitId: number) => {
  processSearchForm.value.SuitID = suitId
  listProcesses(suitId)
}
</script>

<template>
  <el-row class="w-full h-full">
    <el-col :span="24" class="h-full">
      <!-- 表格和分页容器 -->
      <div class="h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex items-center justify-between mb-2">
          <!-- 工具栏留空，已移除刷新按钮 -->
        </div>

        <!-- 表格区域 - 占据剩余高度 -->
        <div class="flex-1 min-h-0 relative">
          <el-table :data="tableData" border show-overflow-tooltip v-loading="tableLoading" size="small" class="w-full"
            height="100%" :class="{ 'table-loading': tableLoading }" :data-version="dataVersion" row-key="ID"
            :expand-row-keys="expandedRowKeys" @expand-change="handleExpandChange">
            <el-table-column type="expand" width="40">
              <template #default="props">
                <el-row class="w-full h-full p-4">
                  <el-col :span="24" class="h-full">
                    <div class="h-full flex flex-col">
                      <div class="flex-1 min-h-0 relative">
                        <el-table :data="processTableData" show-overflow-tooltip v-loading="processTableLoading"
                          default-expand-all size="small" class="w-full" height="232px"
                          :class="{ 'table-loading': processTableLoading }" :data-version="processDataVersion">
                          <el-table-column type="index" label="#" align="center" header-align="center" width="50" />
                          <el-table-column prop="CreatedAt" label="创建时间" align="center" header-align="center"
                            width="160">
                            <template #default="scope">
                              {{ formatDate(scope.row.CreatedAt) }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="UpdatedAt" label="更新时间" align="center" header-align="center"
                            width="160">
                            <template #default="scope">
                              {{ formatDate(scope.row.UpdatedAt) }}
                            </template>
                          </el-table-column>
                          <el-table-column label="创建者" prop="Creator" align="center" header-align="center" width="80" />
                          <el-table-column label="状态" prop="Status" align="center" header-align="center" width="100">
                            <template #default="scope">
                              <el-tag v-if="scope.row.Status === 'open'" type="success" size="small">进行中</el-tag>
                              <el-tag v-else-if="scope.row.Status === 'close'" type="danger" size="small">已关闭</el-tag>
                              <el-tag v-else type="info" size="small">未知</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="运行状态" prop="State" align="center" header-align="center" width="100">
                            <template #default="scope">
                              <el-tag v-if="scope.row.State === 'completed'" type="success" size="small">已完成</el-tag>
                              <el-tag v-else-if="scope.row.State === 'failed'" type="danger" size="small">错误</el-tag>
                              <el-tag v-else-if="scope.row.State === 'running'" type="warning" size="small">运行中</el-tag>
                              <el-tag v-else type="info" size="small">{{ scope.row.State }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="Orders" label="Orders" align="center" header-align="center"
                            width="240" />
                          <el-table-column prop="LinkedAddress" label="关联地址" align="center" header-align="center"
                            width="300">
                            <template #default="scope">
                              <div class="flex items-center justify-between">
                                <span class="truncate flex-1 mr-2" :title="scope.row.LinkedAddress">
                                  {{ scope.row.LinkedAddress || '-' }}
                                </span>
                                <el-button v-if="scope.row.LinkedAddress" type="primary" link size="small"
                                  class="copy-btn" @click.stop="copyToClipboard(scope.row.LinkedAddress)">
                                  <el-icon>
                                    <CopyDocument />
                                  </el-icon>
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="LocalAddress" label="本地地址" align="center" header-align="center"
                            width="500">
                            <template #default="scope">
                              <div class="flex items-center justify-between">
                                <span class="truncate flex-1 mr-2" :title="scope.row.LocalAddress">
                                  {{ scope.row.LocalAddress || '-' }}
                                </span>
                                <el-button v-if="scope.row.LocalAddress" type="primary" link size="small"
                                  class="copy-btn" @click.stop="copyToClipboard(scope.row.LocalAddress)">
                                  <el-icon>
                                    <CopyDocument />
                                  </el-icon>
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="EDA" label="EDA" align="center" header-align="center" width="120" />
                          <el-table-column prop="Threads" label="线程数" align="center" header-align="center" width="80" />
                          <el-table-column prop="Priority" label="优先级" align="center" header-align="center" width="80">
                            <template #default="scope">
                              <el-tag v-if="scope.row.Priority === 1" type="danger" size="small">高</el-tag>
                              <el-tag v-else-if="scope.row.Priority === 2" type="warning" size="small">中</el-tag>
                              <el-tag v-else-if="scope.row.Priority === 3" type="primary" size="small">低</el-tag>
                              <el-tag v-else type="info" size="small">{{
                                scope.row.Priority
                                }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" align="center" header-align="center" width="250" fixed="right">
                            <template #default="scope">
                              <div class="flex justify-center space-x-1">
                                <el-button type="primary" size="small" link disabled>
                                  LVL
                                </el-button>
                                <el-button type="primary" size="small" link @click="openAddFractureDialog(scope.row)"
                                  :disabled="scope.row.State != 'completed' || scope.row.Status === 'close'
                                    ">
                                  Fracture
                                </el-button>
                                <el-button type="primary" size="small" link @click="openAddDensityDialog(scope.row)"
                                  :disabled="scope.row.State != 'completed' || scope.row.Status === 'close'
                                    ">
                                  Density
                                </el-button>
                                <el-button type="primary" size="small" link disabled>
                                  MRC
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div class="h-6 shrink-0 flex items-center justify-center mt-2 mb-2">
                        <el-pagination v-model:current-page="paginationFormProcess.Page"
                          v-model:page-size="paginationFormProcess.PageSize" :page-sizes="[5, 10, 20, 50]" size="small"
                          :background="true" layout="total, sizes, prev, pager, next, jumper" :total="processTotal"
                          @size-change="handleProcessSizeChange" @current-change="handleProcessPageChange"
                          class="justify-center pagination-compact" />
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" align="center" header-align="center" width="50">
              <template #default="{ $index }">
                <span :style="{ '--row-index': $index }">{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="100">
              <template #default="scope">
                <div class="flex justify-center space-x-1" :style="{ '--row-index': scope.$index }">
                  <el-button type="primary" size="small" link @click="openAddProcess(scope.row)">
                    <el-icon>
                      <MessageBox />
                    </el-icon>
                    <span class="ml-1">处理</span>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="流程节点" align="center" header-align="center" width="100">
              <template #default="scope">
                <div class="flex justify-center space-x-1" :style="{ '--row-index': scope.$index }">
                  <el-button type="primary" size="small" link @click="openShowFlowDialog(scope.row)">
                    <el-icon>
                      <Tickets />
                    </el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="CreatedAt" label="创建时间" align="center" header-align="center" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.CreatedAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="UpdatedAt" label="更新时间" align="center" header-align="center" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.UpdatedAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="Number" label="套单编号" align="center" header-align="center" width="140">
              <template #default="{ row, $index }">
                <span :style="{ '--row-index': $index }">{{ row.Number }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="CustomerCode" label="客户编号" align="center" header-align="center" width="120" />
            <el-table-column prop="CustomerName" label="客户名称" align="center" header-align="center" />
            <el-table-column label="生命周期" prop="Status" align="center" header-align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.Status === 'open'" type="success" size="small">OPEN</el-tag>
                <el-tag v-else-if="scope.row.Status === 'close'" type="danger" size="small">CLOSE</el-tag>
                <el-tag v-else type="info" size="small">未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Saler" label="锁定人员" align="center" header-align="center" width="100" />
          </el-table>
        </div>

        <!-- 分页组件 - 固定高度24px -->
        <div class="h-6 shrink-0 flex items-center justify-center mt-2 mb-2">
          <el-pagination v-model:current-page="paginationForm.Page" v-model:page-size="paginationForm.PageSize"
            :page-sizes="[5, 10, 20, 50]" size="small" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handlePageChange" class="justify-center pagination-compact" />
        </div>
      </div>
    </el-col>
    <!-- AddProcess组件 -->
    <AddProcess :visible="addProcessFlag" :suit="addProcessParam" @close="closeAddProcess" />
    <!-- ShowFracture组件 -->
    <ShowFracture :visible="showAddFractureDialog" :process="selectedProcess" @close="closeAddFractureDialog" />
    <!-- ShowDensity组件 -->
    <ShowDensity :visible="showAddDensityDialog" :process="selectedProcess" @close="closeAddDensityDialog" />
    <!-- ShowFlow组件 -->
    <ShowFlow :visible="showFlowDialog" :suit-id="selectedSuit?.ID ?? 0" @close="closeShowFlowDialog" />
  </el-row>
</template>
