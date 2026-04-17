import { downloadFile } from './index'

export interface UploadProgress {
  percent: number
  loaded: number
  total: number
}

export interface UploadOptions {
  file: File
  url: string
  filename?: string
  onProgress?: (progress: UploadProgress) => void
  headers?: Record<string, string>
}

export interface UploadResult {
  url: string
  filename: string
  size: number
  [key: string]: unknown
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { file, url, filename, onProgress, headers = {} } = options

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    if (filename) {
      formData.append('filename', filename)
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          percent: Math.round((event.loaded / event.total) * 100),
          loaded: event.loaded,
          total: event.total,
        })
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response.data || response)
        } catch {
          resolve({ url: xhr.responseText, filename: file.name, size: file.size })
        }
      } else {
        reject(new Error(`上传失败: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('网络错误'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('上传已取消'))
    })

    xhr.open('POST', url)
    const token = localStorage.getItem('token')
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.send(formData)
  })
}

export async function uploadFiles(
  options: Omit<UploadOptions, 'file'> & { files: File[] },
): Promise<UploadResult[]> {
  const { files, url, onProgress, headers = {} } = options
  const results: UploadResult[] = []
  const total = files.length

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i]
    if (!currentFile) continue
    const result = await uploadFile({
      file: currentFile,
      url,
      headers,
      onProgress: onProgress
        ? (p) => {
            const basePercent = (i / total) * 100
            const filePercent = p.percent / total
            onProgress({
              percent: Math.round(basePercent + filePercent),
              loaded: p.loaded,
              total: p.total,
            })
          }
        : undefined,
    })
    results.push(result)
  }

  return results
}

export interface DownloadOptions {
  url: string
  filename?: string
  method?: 'get' | 'post'
  data?: unknown
  headers?: Record<string, string>
  responseType?: 'blob' | 'arraybuffer' | 'text'
}

export async function downloadFileByUrl(options: DownloadOptions): Promise<void> {
  const { url, filename, method = 'get', data, headers = {}, responseType = 'blob' } = options

  const config: Record<string, unknown> = {
    method,
    url,
    responseType,
    headers: {
      ...headers,
    },
  }

  if (method === 'get') {
    config.params = data
  } else {
    config.data = data
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...(config.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config as RequestInit)
  const blob = await response.blob()
  const name = filename || getFilenameFromHeaders(response.headers) || 'download'
  downloadFile(blob, name)
}

function getFilenameFromHeaders(headers: Headers): string | null {
  const disposition = headers.get('content-disposition')
  if (!disposition) return null

  const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
  if (filenameMatch && filenameMatch[1]) {
    return decodeURIComponent(filenameMatch[1].replace(/['"/]/g, ''))
  }

  const filenameStarMatch = disposition.match(/filename\*=UTF-8''(.+)/)
  if (filenameStarMatch && filenameStarMatch[1]) {
    return decodeURIComponent(filenameStarMatch[1])
  }

  return null
}

export function createDownloadUrl(url: string, params?: Record<string, string>): string {
  const baseUrl = new URL(url)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      baseUrl.searchParams.append(key, value)
    })
  }
  return baseUrl.toString()
}

export function previewFile(file: File): string {
  return URL.createObjectURL(file)
}

export function revokeFileUrl(url: string): void {
  URL.revokeObjectURL(url)
}

export function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const docExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt']
  const videoExts = ['mp4', 'webm', 'ogg', 'avi', 'mov']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz']

  if (imageExts.includes(ext)) return 'image'
  if (docExts.includes(ext)) return 'document'
  if (videoExts.includes(ext)) return 'video'
  if (audioExts.includes(ext)) return 'audio'
  if (archiveExts.includes(ext)) return 'archive'
  return 'other'
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || getFileType(file.name) === 'image'
}

export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
