import type {
  StorageFile,
  StorageFolder,
  StorageVolume,
  StoragePolicy,
  FileTag,
  StorageQuota,
  StorageStats,
  FileAccess,
  FileVersion,
  StorageSearchParams,
} from './types'
import type { PaginatedResponse } from './types'
import { http } from './http'

export interface CreateVolumeParams {
  name: string
  basePath: string
  totalSize: number
}

export async function createVolume(params: CreateVolumeParams): Promise<StorageVolume> {
  return http.post('/api/v2/storage/volume', params)
}

export async function getVolume(id: number): Promise<StorageVolume> {
  return http.get('/api/v2/storage/volume', { params: { id } })
}

export async function listVolumes(): Promise<StorageVolume[]> {
  return http.get('/api/v2/storage/volumes')
}

export async function updateVolume(
  id: number,
  params: Partial<CreateVolumeParams>,
): Promise<StorageVolume> {
  return http.put('/api/v2/storage/volume', params, { params: { id } })
}

export async function deleteVolume(id: number): Promise<void> {
  return http.delete('/api/v2/storage/volume', { params: { id } })
}

export interface CreateFolderParams {
  name: string
  parentId: number
  volumeId: number
  ownerId?: number
}

export async function createFolder(params: CreateFolderParams): Promise<StorageFolder> {
  return http.post('/api/v2/storage/folder', params)
}

export async function getFolder(id: number): Promise<StorageFolder> {
  return http.get('/api/v2/storage/folder', { params: { id } })
}

export async function listFolders(params: {
  volumeId?: number
  parentId?: number
}): Promise<StorageFolder[]> {
  return http.get('/api/v2/storage/folders', { params })
}

export async function updateFolder(id: number, params: { name: string }): Promise<StorageFolder> {
  return http.put('/api/v2/storage/folder', params, { params: { id } })
}

export async function deleteFolder(id: number): Promise<void> {
  return http.delete('/api/v2/storage/folder', { params: { id } })
}

export async function uploadFile(
  folderId: number,
  file: File,
  ownerId?: number,
  onProgress?: (percent: number) => void,
): Promise<StorageFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folderId', String(folderId))
    if (ownerId) {
      formData.append('ownerId', String(ownerId))
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response.data)
        } catch {
          reject(new Error('Parse response failed'))
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

    const apiConfig = getApiConfig()
    xhr.open('POST', `${apiConfig.baseUrl}/api/v2/storage/file`)

    const token = localStorage.getItem('token')
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.send(formData)
  })
}

function getApiConfig() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  return { baseUrl: baseUrl || '/api' }
}

export async function getFile(id: number): Promise<StorageFile> {
  return http.get('/api/v2/storage/file', { params: { id } })
}

export async function getFileByUid(uid: string): Promise<StorageFile> {
  return http.get('/api/v2/storage/file', { params: { uid } })
}

export async function listFiles(
  params: StorageSearchParams,
): Promise<PaginatedResponse<StorageFile>> {
  return http.get('/api/v2/storage/files', { params })
}

export async function downloadFile(id: number, filename?: string): Promise<void> {
  const apiConfig = getApiConfig()
  const url = `${apiConfig.baseUrl}/api/v2/storage/file/download?id=${id}`

  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })
  const blob = await response.blob()

  const name = filename || 'download'
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}

export async function getFileContent(id: number): Promise<string> {
  return http.get('/api/v2/storage/file/content', { params: { id } })
}

export async function updateFileMeta(id: number, name: string): Promise<StorageFile> {
  return http.put('/api/v2/storage/file', { name }, { params: { id } })
}

export async function deleteFile(id: number): Promise<void> {
  return http.delete('/api/v2/storage/file', { params: { id } })
}

export interface CopyFileParams {
  targetFolderId: number
}

export async function copyFile(id: number, params: CopyFileParams): Promise<StorageFile> {
  return http.post('/api/v2/storage/file/copy', params, { params: { id } })
}

export async function moveFile(id: number, params: CopyFileParams): Promise<StorageFile> {
  return http.post('/api/v2/storage/file/move', params, { params: { id } })
}

export async function restoreFile(id: number): Promise<StorageFile> {
  return http.post('/api/v2/storage/file/restore', null, { params: { id } })
}

export async function archiveFile(id: number): Promise<StorageFile> {
  return http.post('/api/v2/storage/file/archive', null, { params: { id } })
}

export async function listFileVersions(fileId: number): Promise<FileVersion[]> {
  return http.get('/api/v2/storage/file/versions', { params: { fileId } })
}

export async function rollbackVersion(id: number, versionId: number): Promise<StorageFile> {
  return http.post('/api/v2/storage/file/version/rollback', null, { params: { id, versionId } })
}

export interface TagParams {
  key: string
  value: string
}

export async function addFileTag(fileId: number, params: TagParams): Promise<FileTag> {
  return http.post('/api/v2/storage/file/tag', params, { params: { fileId } })
}

export async function removeFileTag(tagId: number): Promise<void> {
  return http.delete('/api/v2/storage/file/tag', { params: { tagId } })
}

export async function setFileTags(fileId: number, tags: Record<string, string>): Promise<void> {
  return http.put('/api/v2/storage/file/tags', tags, { params: { fileId } })
}

export interface CreatePolicyParams {
  name: string
  ruleType: string
  actionDays: number
}

export async function createPolicy(params: CreatePolicyParams): Promise<StoragePolicy> {
  return http.post('/api/v2/storage/policy', params)
}

export async function getPolicy(id: number): Promise<StoragePolicy> {
  return http.get('/api/v2/storage/policy', { params: { id } })
}

export async function listPolicies(ruleType?: string): Promise<StoragePolicy[]> {
  return http.get('/api/v2/storage/policies', { params: { ruleType } })
}

export async function updatePolicy(
  id: number,
  params: Partial<CreatePolicyParams>,
): Promise<StoragePolicy> {
  return http.put('/api/v2/storage/policy', params, { params: { id } })
}

export async function deletePolicy(id: number): Promise<void> {
  return http.delete('/api/v2/storage/policy', { params: { id } })
}

export async function executePolicy(id: number): Promise<void> {
  return http.post('/api/v2/storage/policy/execute', null, { params: { id } })
}

export async function getQuota(userId: number): Promise<StorageQuota> {
  return http.get('/api/v2/storage/quota', { params: { userId } })
}

export async function setQuota(userId: number, totalSize: number): Promise<StorageQuota> {
  return http.put('/api/v2/storage/quota', { totalSize }, { params: { userId } })
}

export async function getStorageStats(): Promise<StorageStats> {
  return http.get('/api/v2/storage/stats')
}

export async function getFileAccess(id: number): Promise<FileAccess[]> {
  return http.get('/api/v2/storage/access', { params: { id } })
}

export async function listFileAccesses(params?: {
  limit?: number
  userId?: number
}): Promise<FileAccess[]> {
  return http.get('/api/v2/storage/accesses', { params })
}

export default {
  createVolume,
  getVolume,
  listVolumes,
  updateVolume,
  deleteVolume,
  createFolder,
  getFolder,
  listFolders,
  updateFolder,
  deleteFolder,
  uploadFile,
  getFile,
  getFileByUid,
  listFiles,
  downloadFile,
  getFileContent,
  updateFileMeta,
  deleteFile,
  copyFile,
  moveFile,
  restoreFile,
  archiveFile,
  listFileVersions,
  rollbackVersion,
  addFileTag,
  removeFileTag,
  setFileTags,
  createPolicy,
  getPolicy,
  listPolicies,
  updatePolicy,
  deletePolicy,
  executePolicy,
  getQuota,
  setQuota,
  getStorageStats,
  getFileAccess,
  listFileAccesses,
}
