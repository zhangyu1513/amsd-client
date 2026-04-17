<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    uploadFile,
    listVolumes,
    listFolders,
    listFiles,
    downloadFile,
    deleteFile,
    copyFile,
    moveFile,
    restoreFile,
    archiveFile,
    listFileVersions,
    rollbackVersion,
    addFileTag,
    removeFileTag,
    getStorageStats,
} from '@/api/storage'
import type {
    StorageVolume,
    StorageFolder,
    StorageFile,
    StorageSearchParams,
    StorageStats,
    FileVersion,
    FileTag,
} from '@/api/types'
import {
    FileStats,
    FileToolbar,
    FileTable,
    FileVersionDialog,
    FileTagDialog,
    FileCopyMoveDialog,
} from './components'

const stats = ref<StorageStats | null>(null)
const volumes = ref<StorageVolume[]>([])
const folders = ref<StorageFolder[]>([])
const files = ref<StorageFile[]>([])
const currentFolder = ref<StorageFolder | null>(null)
const currentVolume = ref<StorageVolume | undefined>(undefined)
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)
const currentPath = ref<StorageFolder[]>([])
const searchKeyword = ref('')
const pagination = ref({ page: 1, pageSize: 20, total: 0 })
const uploadMultiple = ref(false)

const fileVersionDialogVisible = ref(false)
const versionList = ref<FileVersion[]>([])
const currentFileForVersion = ref<StorageFile | null>(null)

const tagDialogVisible = ref(false)
const currentFileForTag = ref<StorageFile | null>(null)
const tagForm = ref({ key: '', value: '' })

const copyMoveDialogVisible = ref(false)
const copyMoveType = ref<'copy' | 'move'>('copy')
const targetFolderId = ref(0)
const currentFileForCopyMove = ref<StorageFile | null>(null)

onMounted(async () => {
    await loadStats()
    await loadVolumes()
    await loadFolders()
    await loadFiles()
})

async function loadStats() {
    try {
        stats.value = await getStorageStats()
    } catch (e) {
        console.error(e)
    }
}

async function loadVolumes() {
    try {
        loading.value = true
        volumes.value = await listVolumes()
        if (volumes.value.length > 0 && !currentVolume.value) {
            currentVolume.value = volumes.value[0]
            await loadFolders()
        }
    } catch (e) {
        ElMessage.error('加载卷失败')
    } finally {
        loading.value = false
    }
}

async function loadFolders() {
    if (!currentVolume.value) return
    try {
        folders.value = await listFolders({ volumeId: currentVolume.value.ID })
    } catch (e) {
        ElMessage.error('加载文件夹失败')
    }
}

async function loadFiles() {
    if (!currentVolume.value) return
    try {
        loading.value = true
        const params: StorageSearchParams = {
            volumeId: currentVolume.value.ID,
            folderId: currentFolder.value?.ID,
            page: pagination.value.page,
            pageSize: pagination.value.pageSize,
            keyword: searchKeyword.value,
        }
        const res = await listFiles(params)
        files.value = res.list
        pagination.value.total = res.total
    } catch (e) {
        ElMessage.error('加载文件失败')
    } finally {
        loading.value = false
    }
}

async function handleSelectVolume(volume: StorageVolume) {
    currentVolume.value = volume
    currentFolder.value = null
    currentPath.value = []
    pagination.value.page = 1
    await Promise.all([loadFolders(), loadFiles()])
}

async function handleEnterFolder(folder: StorageFolder) {
    currentFolder.value = folder
    currentPath.value = [...currentPath.value, folder]
    pagination.value.page = 1
    await loadFiles()
}

async function handleGoBack() {
    if (currentPath.value.length === 0) return
    currentPath.value = currentPath.value.slice(0, -1)
    currentFolder.value = currentPath.value[currentPath.value.length - 1] || null
    await loadFiles()
}

function handleUploadClick() {
    fileInputRef.value?.click()
}

async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const filesList = target.files
    if (!filesList || filesList.length === 0) return
    if (!currentVolume.value) {
        ElMessage.warning('请先选择卷')
        return
    }

    const folderId = currentFolder.value?.ID || 0
    for (const file of filesList) {
        try {
            uploading.value = true
            await uploadFile(folderId, file)
            ElMessage.success(`${file.name} 上传成功`)
        } catch (e) {
            ElMessage.error(`${file.name} 上传失败`)
        } finally {
            uploading.value = false
            uploadProgress.value = 0
        }
    }
    target.value = ''
    await loadFiles()
}

async function handleDownload(file: StorageFile) {
    try {
        await downloadFile(file.ID, file.Name)
        ElMessage.success('下载成功')
    } catch (e) {
        ElMessage.error('下载失败')
    }
}

async function handleDelete(file: StorageFile) {
    try {
        await ElMessageBox.confirm(`确定要删除 ${file.Name} 吗？`, '提示', {
            type: 'warning',
        })
        await deleteFile(file.ID)
        ElMessage.success('删除成功')
        await loadFiles()
    } catch (e) {
        if (e !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

function handleCopyMove(type: 'copy' | 'move', file: StorageFile) {
    copyMoveType.value = type
    currentFileForCopyMove.value = file
    copyMoveDialogVisible.value = true
}

async function confirmCopyMove() {
    if (!currentFileForCopyMove.value || !targetFolderId.value) return
    try {
        if (copyMoveType.value === 'copy') {
            await copyFile(currentFileForCopyMove.value.ID, { targetFolderId: targetFolderId.value })
        } else {
            await moveFile(currentFileForCopyMove.value.ID, { targetFolderId: targetFolderId.value })
        }
        ElMessage.success(copyMoveType.value === 'copy' ? '复制成功' : '移动成功')
        copyMoveDialogVisible.value = false
        await loadFiles()
    } catch (e) {
        ElMessage.error(copyMoveType.value === 'copy' ? '复制失败' : '移动失败')
    }
}

async function handleRestore(file: StorageFile) {
    try {
        await restoreFile(file.ID)
        ElMessage.success('恢复成功')
        await loadFiles()
    } catch (e) {
        ElMessage.error('恢复失败')
    }
}

async function handleArchive(file: StorageFile) {
    try {
        await archiveFile(file.ID)
        ElMessage.success('归档成功')
        await loadFiles()
    } catch (e) {
        ElMessage.error('归档失败')
    }
}

async function handleViewVersions(file: StorageFile) {
    currentFileForVersion.value = file
    try {
        versionList.value = await listFileVersions(file.ID)
        fileVersionDialogVisible.value = true
    } catch (e) {
        ElMessage.error('加载版本失败')
    }
}

async function handleRollback(version: FileVersion) {
    if (!currentFileForVersion.value) return
    try {
        await ElMessageBox.confirm(`确定要回滚到版本 ${version.Version} 吗？`, '提示', {
            type: 'warning',
        })
        await rollbackVersion(currentFileForVersion.value.ID, version.ID)
        ElMessage.success('回滚成功')
        fileVersionDialogVisible.value = false
        await loadFiles()
    } catch (e) {
        if (e !== 'cancel') {
            ElMessage.error('回滚失败')
        }
    }
}

function handleManageTags(file: StorageFile) {
    currentFileForTag.value = file
    tagDialogVisible.value = true
}

async function confirmAddTag() {
    if (!currentFileForTag.value || !tagForm.value.key) return
    try {
        await addFileTag(currentFileForTag.value.ID, {
            key: tagForm.value.key,
            value: tagForm.value.value,
        })
        ElMessage.success('添加标签成功')
        tagForm.value = { key: '', value: '' }
        await loadFiles()
    } catch (e) {
        ElMessage.error('添加标签失败')
    }
}

async function handleRemoveTag(tag: FileTag) {
    if (!currentFileForTag.value) return
    try {
        await removeFileTag(tag.ID)
        ElMessage.success('删除标签成功')
        await loadFiles()
    } catch (e) {
        ElMessage.error('删除标签失败')
    }
}

async function handleSearch() {
    pagination.value.page = 1
    await loadFiles()
}

async function handlePageChange(page: number) {
    pagination.value.page = page
    await loadFiles()
}
</script>

<template>
    <div class="h-full flex flex-col p-4">
        <input ref="fileInputRef" type="file" :multiple="uploadMultiple" style="display: none"
            @change="handleFileSelect" />

        <FileToolbar :volumes="volumes" :current-volume="currentVolume" :current-folder="currentFolder"
            :current-path="currentPath" :search-keyword="searchKeyword" :uploading="uploading"
            :upload-progress="uploadProgress" @update:current-volume="handleSelectVolume"
            @select-volume="handleSelectVolume" @go-back="handleGoBack" @upload="handleUploadClick"
            @update:search-keyword="(val) => (searchKeyword = val)" @search="handleSearch" />

        <FileStats :stats="stats" />

        <FileTable class="flex-1" :files="files" :loading="loading" :pagination="pagination" @download="handleDownload"
            @copy="(file) => handleCopyMove('copy', file)" @move="(file) => handleCopyMove('move', file)"
            @versions="handleViewVersions" @tags="handleManageTags" @delete="handleDelete"
            @page-change="handlePageChange" />

        <FileVersionDialog :visible="fileVersionDialogVisible" :versions="versionList"
            :current-file="currentFileForVersion" @update:visible="(val) => (fileVersionDialogVisible = val)"
            @rollback="handleRollback" />

        <FileTagDialog :visible="tagDialogVisible" :current-file="currentFileForTag" :tag-form="tagForm"
            @update:visible="(val) => (tagDialogVisible = val)" @add-tag="confirmAddTag"
            @remove-tag="handleRemoveTag" />

        <FileCopyMoveDialog :visible="copyMoveDialogVisible" :type="copyMoveType" :folders="folders"
            :target-folder-id="targetFolderId" @update:visible="(val) => (copyMoveDialogVisible = val)"
            @update:target-folder-id="(val) => (targetFolderId = val)" @confirm="confirmCopyMove" />
    </div>
</template>
