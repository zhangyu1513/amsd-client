// API 类型定义

// 基础响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface PaginationParams {
  Page?: number
  PageSize?: number
  SortBy?: string
  SortOrder?: 'asc' | 'desc'
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface Suit {
  ID?: number // gorm.Model 包含的主键
  CreatedAt?: Date // gorm.Model 包含的创建时间
  UpdatedAt?: Date // gorm.Model 包含的更新时间
  DeletedAt?: Date // gorm.Model 包含的删除时间

  Number?: string // 订单套编号，uniqueIndex, not null
  CustomerCode?: string // 客户代码，not null
  CustomerName?: string // 客户名称，not null

  Status?: string // 默认值: 'open'
  Saler?: string // 销售人员，not null

  // 关联数据
  Orders?: Order[] // 一对多关联
  Processes?: Process[] // 一对多关联
}

// 套单搜索参数（结合分页和搜索条件）
export interface SuitSearchParams extends PaginationParams, Suit {}

export interface Order {
  ID?: number // gorm.Model 包含的主键
  CreatedAt?: Date // gorm.Model 包含的创建时间
  UpdatedAt?: Date // gorm.Model 包含的更新时间
  DeletedAt?: Date // gorm.Model 包含的删除时间

  Number?: string // 子单编号，uniqueIndex, not null
  JobdeckLevel?: string // 必填
  ProductName?: string // 产品名称，必填
  ModelNumber?: string // model号，必填

  Status?: string // 默认值: 'open'

  SuitID?: number // 外键，not null
}

export interface OrderSearchParams extends PaginationParams, Order {}

export interface Process {
  ID?: number // gorm.Model 包含的主键 ID
  CreatedAt?: Date // gorm.Model 包含的创建时间
  UpdatedAt?: Date // gorm.Model 包含的更新时间
  DeletedAt?: Date // gorm.Model 包含的删除时间（软删除）

  UID?: string // 任务编号，not null

  EDA?: string
  Threads?: number
  Priority?: number // 默认值: 4

  LinkedAddress?: string
  Orders?: string // 对应 text 类型

  LocalAddress?: string // 对应 text 类型

  Status?: string // 默认值: 'open'
  State?: string // 默认值: 'running'

  Error?: string // 对应 text 类型
  Log?: string // 对应 text 类型

  SuitID?: number // 外键，not null

  // 关联数据，通常在后端返回 JSON 时包含
  Fractures?: Fracture[]
  Densities?: Density[]
}

export interface ProcessSearchParams extends PaginationParams, Process {}

// ==========================================
// 基础任务类型
// ==========================================

export interface Fracture {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Type?: string // total/single
  UID?: string // 转档编号，not null

  EDA?: string
  Threads?: number
  Priority?: number // 默认值: 4

  LocalAddress?: string // text 类型
  Format?: string // 默认值: ''
  Classify?: string // 分号分隔，例如: FRAME01;CHIP01

  Status?: string // 默认值: 'open'
  State?: string // 默认值: 'running'

  Error?: string // text 类型
  Log?: string // text 类型

  ProcessID?: number // 外键，not null
}

export interface FractureSearchParams extends PaginationParams, Fracture {}

export interface Density {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  UID: string // 透光率编号，not null

  EDA?: string
  Threads?: number
  Priority?: number // 默认值: 4

  Type?: string // process frame

  LocalAddress?: string // text 类型

  Status?: string // 默认值: 'open'
  State?: string // 默认值: 'running'

  Error?: string // text 类型
  Log?: string // text 类型

  ProcessID: number // 外键，not null
}

// ==========================================
// 工具与配置类型 (Tooling & Relations)
// ==========================================

export interface Tooling {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  // 关联数据，序列化时包含
  Layouts?: Layout[]
  Flowplans?: Flowplan[]
  Fiducials?: Fiducial[]

  SuitID?: number
  ProcessID?: number
}

export interface Layout {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  UID: string // 索引标识，not null
  Filename: string // not null
  Cellname: string // not null
  Xlow: string // not null
  Ylow: string // not null
  Xup: string // not null
  Yup: string // not null

  // 带有默认值的字段设为可选
  Algorithm?: string // 默认值: '/'
  Sum?: string // 默认值: '/'
  Size?: string // 默认值: '/'

  ToolingID: number // 外键，not null
}

export interface Flowplan {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Order: string // not null
  MebesName: string // not null
  Classify: string // not null
  Rot: string // not null
  Tone: string // not null
  Bias: string // not null
  Mirror: string // not null
  MergeX: string // not null
  MergeY: string // not null
  ArrayX: string // not null
  ArrayY: string // not null
  PitchX: string // not null
  PitchY: string // not null
  Rule?: string // text 类型

  ToolingID: number // 外键，not null
}

export interface Fiducial {
  ID?: number
  CreatedAt?: Date
  UpdatedAt?: Date
  DeletedAt?: Date

  Order: string // not null
  MebesName: string // not null
  Name: string // not null
  Masktitles: string // not null
  Barcodes: string // not null
  Qrcodes: string // not null
  Dmcodes: string // not null
  Scale: string // not null
  Mirror: string // not null
  Process: string // 工艺代号，not null

  ToolingID: number // 外键，not null
}
