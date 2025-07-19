// 机器视觉数据分析平台 - API 接口定义
// API Types and Interfaces

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: string;
}

// 1. 仪表板相关接口
export interface DashboardStats {
  todayDetections: {
    total: number;
    change: string;
    trend: 'up' | 'down' | 'stable';
  };
  defectRate: {
    rate: number;
    change: string;
    trend: 'up' | 'down' | 'stable';
  };
  avgProcessTime: {
    time: number;
    unit: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
  };
  deviceStatus: {
    online: number;
    total: number;
    rate: number;
  };
}

export interface TrendData {
  period: string;
  peakDetections: number;
  currentRate: number;
  chartData: Array<{
    time: string;
    detections: number;
    defects: number;
  }>;
}

// 2. 设备相关接口
export interface Device {
  id: string;
  name: string;
  type: 'camera' | 'sensor' | 'controller';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location: string;
  lastHeartbeat: string;
  performance: {
    detectionCount: number;
    successRate: number;
    avgResponseTime: number;
  };
}

export interface DeviceConfig {
  resolution: string;
  fps: number;
  exposureTime: number;
  gain: number;
  detectionThreshold?: number;
}

// 3. 检测数据相关接口
export interface Detection {
  id: string;
  deviceId: string;
  productId: string;
  timestamp: string;
  result: string;
  status: 'success' | 'error' | 'warning';
  confidence: number;
  defects: Defect[];
  processTime: number;
  imageUrl: string;
}

export interface Defect {
  id?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description?: string;
}

export interface DetectionTask {
  deviceId: string;
  productId: string;
  imageData: string; // base64 encoded
  metadata?: {
    batchId?: string;
    productType?: string;
    operator?: string;
  };
}

export interface TaskResult {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: Detection;
  estimatedTime?: number;
  created: string;
  completedAt?: string;
}

// 4. 缺陷分析相关接口
export interface DefectStatistics {
  period: string;
  totalDefects: number;
  defectTypes: Array<{
    type: string;
    count: number;
    percentage: number;
    trend: string;
  }>;
}

export interface DefectDetail {
  id: string;
  detectionId: string;
  type: string;
  severity: string;
  description: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  measurements?: {
    expected: Record<string, number>;
    actual: Record<string, number>;
    tolerance: number;
  };
  images: Array<{
    type: 'original' | 'annotated' | 'processed';
    url: string;
  }>;
  createdAt: string;
}

// 5. 报告相关接口
export interface ReportRequest {
  startDate: string;
  endDate: string;
  deviceIds?: string[];
  reportFormat: 'pdf' | 'excel' | 'json';
  includeCharts?: boolean;
  includeImages?: boolean;
}

export interface Report {
  reportId: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

// 6. 热力图数据接口
export interface HeatmapData {
  period: string;
  peakHour: string;
  totalDetections: number;
  utilizationRate: number;
  heatmapData: Array<{
    day: number; // 0-6 (周日到周六)
    hour: number; // 0-23
    detections: number;
    intensity: number; // 0-1
  }>;
}

// 7. 用户相关接口
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'administrator' | 'engineer' | 'operator' | 'viewer';
  permissions: string[];
  lastLogin: string;
  avatar?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'operator' | 'engineer' | 'supervisor' | 'manager';
  department: string;
  shiftStart: string;
  shiftEnd: string;
  status: 'active' | 'break' | 'offline';
  avatar?: string;
}

// 8. 系统配置接口
export interface SystemConfig {
  detection: {
    defaultThreshold: number;
    maxProcessTime: number;
    retryAttempts: number;
  };
  alerts: {
    defectRateThreshold: number;
    deviceOfflineTimeout: number;
    emailNotifications: boolean;
  };
  storage: {
    imageRetentionDays: number;
    reportRetentionDays: number;
    autoCleanup: boolean;
  };
}

// 9. 分页查询接口
export interface PaginatedRequest {
  page: number;
  limit: number; // Changed from pageSize to limit
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number; // Changed from pageSize to limit
}

// 10. WebSocket 消息接口
export interface WSMessage {
  action: 'subscribe' | 'unsubscribe';
  channel: 'detections' | 'devices' | 'alerts';
  filters?: Record<string, any>;
}

export interface WSEvent {
  channel: string;
  event: string;
  data: any;
  timestamp: string;
}

// API 客户端类型定义
export interface APIClient {
  // 仪表板
  getDashboardStats(): Promise<ApiResponse<DashboardStats>>;
  getTrendData(period?: string): Promise<ApiResponse<TrendData>>;
  
  // 设备管理
  getDevices(): Promise<ApiResponse<Device[]>>;
  getDevice(deviceId: string): Promise<ApiResponse<Device>>;
  updateDeviceConfig(deviceId: string, config: Partial<DeviceConfig>): Promise<ApiResponse<void>>;
  
  // 检测数据
  getDetections(params?: PaginatedRequest & {
    deviceId?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<ApiResponse<PaginatedResponse<Detection>>>;
  submitDetection(task: DetectionTask): Promise<ApiResponse<TaskResult>>;
  getDetectionResult(taskId: string): Promise<ApiResponse<TaskResult>>;
  
  // 缺陷分析
  getDefectStatistics(params?: {
    period?: string;
    deviceId?: string;
  }): Promise<ApiResponse<DefectStatistics>>;
  getDefectDetail(defectId: string): Promise<ApiResponse<DefectDetail>>;
  
  // 报告生成
  generateReport(request: ReportRequest): Promise<ApiResponse<Report>>;
  getReportStatus(reportId: string): Promise<ApiResponse<Report>>;
  
  // 热力图数据
  getHeatmapData(days?: number): Promise<ApiResponse<HeatmapData>>;
  
  // 用户管理
  getCurrentUser(): Promise<ApiResponse<User>>;
  getStaffOnDuty(): Promise<ApiResponse<Staff[]>>;
  
  // 系统配置
  getSystemConfig(): Promise<ApiResponse<SystemConfig>>;
  updateSystemConfig(config: Partial<SystemConfig>): Promise<ApiResponse<void>>;
}

// 错误处理接口
export interface APIError {
  code: number;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
// 脚本定义
export interface Script {
  id: string;
  name: string;
  content: any[];
}

// 常量定义
export const API_ENDPOINTS = {
  // Base
  BASE_URL: 'https://api.vision-platform.com/v1',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_TRENDS: '/dashboard/trends',
  
  // Devices
  DEVICES: '/devices',
  DEVICE_DETAIL: (id: string) => `/devices/${id}`,
  DEVICE_CONFIG: (id: string) => `/devices/${id}/config`,
  
  // Detections
  DETECTIONS: '/detections',
  DETECTION_RESULT: (taskId: string) => `/detections/${taskId}/result`,
  
  // Defects
  DEFECT_STATISTICS: '/defects/statistics',
  DEFECT_DETAIL: (id: string) => `/defects/${id}`,
  
  // Reports
  REPORTS_QUALITY: '/reports/quality',
  REPORT_STATUS: (id: string) => `/reports/${id}/status`,
  
  // Analytics
  ANALYTICS_HEATMAP: '/analytics/heatmap',
  
  // User
  USER_PROFILE: '/user/profile',
  STAFF_ON_DUTY: '/staff/on-duty',
  
  // System
  SYSTEM_CONFIG: '/system/config',
  
  // WebSocket
  WEBSOCKET: 'wss://api.vision-platform.com/ws'
  ,
  // Scripts
  SCRIPTS: '/scripts',
  SCRIPT_RUN: (id: string) => `/scripts/run/${id}`
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const DETECTION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
} as const;

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error'
} as const;

export const DEFECT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;
