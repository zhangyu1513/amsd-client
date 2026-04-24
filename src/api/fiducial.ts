import { http } from './http'
import type { PaginationParams, PaginatedResponse } from './types'

export interface FiducialItem {
  ID: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Name: string
  Scale: number
  DirName: string
  Filename: string
  Cellname: string
  Layer: number
  Datatype: number

  Masktitles: Masktitle[]
  Barcodes: Barcode[]
  Qrcodes: Qrcode[]
}

export interface FiducialItemForm {
  ID?: number
  Name: string
  Scale: number
  DirName: string
  Filename: string
  Cellname: string
  Layer: number
  Datatype: number
  Masktitles: MasktitleForm[]
  Barcodes: BarcodeForm[]
  Qrcodes: QrcodeForm[]
}

export interface Masktitle {
  ID: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  FontName: string
  FontHeight: number
  CharToCharDistence: number
  AxisX: number
  AxisY: number
  Rot: number
  Mirror: string
}

export interface MasktitleForm {
  ID?: number
  FontName: string
  FontHeight: number
  CharToCharDistence: number
  AxisX: number
  AxisY: number
  Rot: number
  Mirror: string
}

export interface Barcode {
  ID: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Classify: string
  FontName: string
  FontHeight: number
  BarToCharDistence: number
  MaxLength: number
  Padding: boolean
  PaddingChar: string
  Location: string
  AxisX: number
  AxisY: number
  Rot: number
}

export interface BarcodeForm {
  ID?: number
  Classify: string
  FontName: string
  FontHeight: number
  BarToCharDistence: number
  MaxLength: number
  Padding: boolean
  PaddingChar: string
  Location: string
  AxisX: number
  AxisY: number
  Rot: number
}

export interface Qrcode {
  ID: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Version: string
  ErrorLevel: string
  BoxEdge: number
  AxisX: number
  AxisY: number
  Rot: number
}

export interface QrcodeForm {
  ID?: number
  Version: string
  ErrorLevel: string
  BoxEdge: number
  AxisX: number
  AxisY: number
  Rot: number
}

export interface FiducialSearchParams extends PaginationParams {
  name?: string
  layer?: number
  datatype?: number
}

export async function listFiducialItems(
  params: FiducialSearchParams,
): Promise<PaginatedResponse<FiducialItem>> {
  return http.get('/api/v1/fiducial/items', { params })
}

export async function getFiducialItem(id: number): Promise<FiducialItem> {
  return http.get('/api/v1/fiducial/items', { params: { id } })
}

export default {
  listFiducialItems,
  getFiducialItem,
}
