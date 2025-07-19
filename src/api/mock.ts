// 模拟API数据 - 用于开发和测试
import { 
  DashboardStats, 
  TrendData, 
  Device, 
  Detection, 
  DefectStatistics,
  HeatmapData,
  User,
  Staff,
  SystemConfig,
  PaginatedResponse
} from './types';

// 模拟仪表板统计数据
export const mockDashboardStats: DashboardStats = {
  todayDetections: {
    total: 11280,
    change: '+12.5%',
    trend: 'up'
  },
  defectRate: {
    rate: 9.3,
    change: '-2.1%',
    trend: 'down'
  },
  avgProcessTime: {
    time: 1.28,
    unit: 'seconds',
    change: '+0.05s',
    trend: 'up'
  },
  deviceStatus: {
    online: 8,
    total: 10,
    rate: 80
  }
};

// 模拟趋势数据
export const mockTrendData: TrendData = {
  period: '24h',
  peakDetections: 590,
  currentRate: 320,
  chartData: Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    detections: Math.floor(Math.random() * 500) + 100,
    defects: Math.floor(Math.random() * 50) + 5
  }))
};

// 模拟设备数据
export const mockDevices: Device[] = [
  {
    id: 'camera-01',
    name: '相机-01',
    type: 'camera',
    status: 'online',
    location: '生产线A',
    lastHeartbeat: new Date().toISOString(),
    performance: {
      detectionCount: 1250,
      successRate: 95.2,
      avgResponseTime: 1.15
    }
  },
  {
    id: 'camera-02',
    name: '相机-02',
    type: 'camera',
    status: 'online',
    location: '生产线B',
    lastHeartbeat: new Date().toISOString(),
    performance: {
      detectionCount: 980,
      successRate: 97.8,
      avgResponseTime: 1.02
    }
  },
  {
    id: 'camera-03',
    name: '相机-03',
    type: 'camera',
    status: 'maintenance',
    location: '生产线C',
    lastHeartbeat: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    performance: {
      detectionCount: 756,
      successRate: 92.1,
      avgResponseTime: 1.35
    }
  },
  {
    id: 'camera-04',
    name: '相机-04',
    type: 'camera',
    status: 'offline',
    location: '生产线D',
    lastHeartbeat: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    performance: {
      detectionCount: 0,
      successRate: 0,
      avgResponseTime: 0
    }
  }
];

// 模拟检测记录
export const mockDetections: Detection[] = [
  {
    id: 'det_001',
    deviceId: 'camera-01',
    productId: 'P001-001',
    timestamp: '2025-07-18T15:32:15Z',
    result: '合格',
    status: 'success',
    confidence: 98.5,
    defects: [],
    processTime: 1.15,
    imageUrl: 'https://via.placeholder.com/300x200/4CAF50/white?text=合格'
  },
  {
    id: 'det_002',
    deviceId: 'camera-01',
    productId: 'P001-002',
    timestamp: '2025-07-18T15:31:48Z',
    result: '异常',
    status: 'error',
    confidence: 85.2,
    defects: [
      {
        type: '尺寸偏差',
        severity: 'medium',
        location: { x: 150, y: 200, width: 50, height: 30 }
      }
    ],
    processTime: 1.32,
    imageUrl: 'https://via.placeholder.com/300x200/F44336/white?text=异常'
  },
  {
    id: 'det_003',
    deviceId: 'camera-02',
    productId: 'P001-003',
    timestamp: '2025-07-18T15:31:22Z',
    result: '合格',
    status: 'success',
    confidence: 96.8,
    defects: [],
    processTime: 0.98,
    imageUrl: 'https://via.placeholder.com/300x200/4CAF50/white?text=合格'
  }
];

// 模拟分页检测记录
export const mockPaginatedDetections: PaginatedResponse<Detection> = {
  total: 15680,
  page: 1,
  limit: 20,
  items: mockDetections
};

// 模拟缺陷统计
export const mockDefectStatistics: DefectStatistics = {
  period: '7d',
  totalDefects: 850,
  defectTypes: [
    {
      type: '尺寸偏差',
      count: 298,
      percentage: 35.0,
      trend: '+5.2%'
    },
    {
      type: '表面缺陷',
      count: 213,
      percentage: 25.0,
      trend: '-2.1%'
    },
    {
      type: '形状异常',
      count: 170,
      percentage: 20.0,
      trend: '+1.8%'
    },
    {
      type: '颜色异常',
      count: 128,
      percentage: 15.0,
      trend: '-0.5%'
    },
    {
      type: '其他类型',
      count: 41,
      percentage: 5.0,
      trend: '+0.3%'
    }
  ]
};

// 模拟热力图数据
export const mockHeatmapData: HeatmapData = {
  period: '7d',
  peakHour: '14:00-16:00',
  totalDetections: 1456,
  utilizationRate: 87,
  heatmapData: Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
      day,
      hour,
      detections: Math.floor(Math.random() * 100) + 10,
      intensity: Math.random()
    }))
  ).flat()
};

// 模拟用户数据
export const mockUser: User = {
  id: 'user_001',
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  role: 'administrator',
  permissions: [
    'device:read',
    'device:write',
    'detection:read',
    'detection:write',
    'report:generate',
    'system:config'
  ],
  lastLogin: new Date().toISOString(),
  avatar: 'https://via.placeholder.com/40x40/1890FF/white?text=管'
};

// 模拟值班人员
export const mockStaff: Staff[] = [
  {
    id: 'staff_001',
    name: '张师傅',
    role: 'operator',
    department: '生产部',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    status: 'active',
    avatar: 'https://via.placeholder.com/40x40/87d068/white?text=张'
  },
  {
    id: 'staff_002',
    name: '李工程师',
    role: 'engineer',
    department: '技术部',
    shiftStart: '09:00',
    shiftEnd: '18:00',
    status: 'active',
    avatar: 'https://via.placeholder.com/40x40/1890ff/white?text=李'
  },
  {
    id: 'staff_003',
    name: '王主管',
    role: 'supervisor',
    department: '质检部',
    shiftStart: '08:30',
    shiftEnd: '17:30',
    status: 'active',
    avatar: 'https://via.placeholder.com/40x40/f56a00/white?text=王'
  }
];

// 模拟系统配置
export const mockSystemConfig: SystemConfig = {
  detection: {
    defaultThreshold: 0.85,
    maxProcessTime: 5.0,
    retryAttempts: 3
  },
  alerts: {
    defectRateThreshold: 10.0,
    deviceOfflineTimeout: 300,
    emailNotifications: true
  },
  storage: {
    imageRetentionDays: 30,
    reportRetentionDays: 90,
    autoCleanup: true
  }
};

// 模拟API响应包装器
export const createMockResponse = <T>(data: T, delay = 500) => {
  return new Promise<{ code: number; message: string; data: T }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data
      });
    }, delay);
  });
};

// 模拟错误响应
export const createMockError = (message: string, code = 400, delay = 500) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        code,
        message,
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
};

// 模拟API客户端（用于开发时替换真实API）
export const mockApi = {
  // 设置token（模拟）
  setToken: (token: string) => {
    console.log('Mock API: Token设置为', token);
  },

  // 仪表板
  dashboard: {
    getStats: () => createMockResponse(mockDashboardStats),
    getTrends: (period?: string) => createMockResponse({
      ...mockTrendData,
      period: period || '24h'
    }),
  },

  // 设备
  devices: {
    list: () => createMockResponse(mockDevices),
    get: (id: string) => {
      const device = mockDevices.find(d => d.id === id);
      return device 
        ? createMockResponse(device)
        : createMockError('设备未找到', 404);
    },
    updateConfig: (id: string, config: any) => {
      console.log('Mock API: 更新设备配置', id, config);
      return createMockResponse(null);
    },
  },

  // 检测
  detections: {
    list: (params?: any) => {
      console.log('Mock API: 获取检测记录', params);
      return createMockResponse(mockPaginatedDetections);
    },
    submit: (task: any) => {
      console.log('Mock API: 提交检测任务', task);
      return createMockResponse({
        taskId: `task_${Date.now()}`,
        status: 'processing',
        estimatedTime: 2.5,
        created: new Date().toISOString()
      });
    },
    getResult: (taskId: string) => {
      return createMockResponse({
        taskId,
        status: 'completed',
        result: mockDetections[0]
      });
    },
  },

  // 缺陷
  defects: {
    getStatistics: (params?: any) => {
      console.log('Mock API: 获取缺陷统计', params);
      return createMockResponse(mockDefectStatistics);
    },
    getDetail: (id: string) => {
      return createMockResponse({
        id,
        detectionId: 'det_002',
        type: '尺寸偏差',
        severity: 'medium',
        description: '产品宽度超出规格范围',
        location: { x: 150, y: 200, width: 50, height: 30 },
        measurements: {
          expected: { width: 25.0, height: 15.0 },
          actual: { width: 26.8, height: 15.2 },
          tolerance: 0.5
        },
        images: [
          {
            type: 'original',
            url: 'https://via.placeholder.com/400x300/cccccc/white?text=原始图像'
          },
          {
            type: 'annotated',
            url: 'https://via.placeholder.com/400x300/ff4444/white?text=标注图像'
          }
        ],
        createdAt: new Date().toISOString()
      });
    },
  },

  // 报告
  reports: {
    generate: (request: any) => {
      console.log('Mock API: 生成报告', request);
      return createMockResponse({
        reportId: `report_${Date.now()}`,
        status: 'generating',
        estimatedTime: 30,
        createdAt: new Date().toISOString()
      });
    },
    getStatus: (id: string) => {
      return createMockResponse({
        reportId: id,
        status: 'completed',
        downloadUrl: `https://example.com/reports/${id}.pdf`,
        fileSize: 2048576,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date().toISOString()
      });
    },
  },

  // 分析
  analytics: {
    getHeatmap: (days?: number) => {
      console.log('Mock API: 获取热力图数据', days);
      return createMockResponse(mockHeatmapData);
    },
  },

  // 用户
  user: {
    getCurrent: () => createMockResponse(mockUser),
    getStaffOnDuty: () => createMockResponse(mockStaff),
  },

  // 系统
  system: {
    getConfig: () => createMockResponse(mockSystemConfig),
    updateConfig: (config: any) => {
      console.log('Mock API: 更新系统配置', config);
      return createMockResponse(null);
    },
  },
};

// 开发模式下的API切换
export const isDevelopment = true; // 在开发时设置为true
export const USE_MOCK_API = true; // 在开发时使用模拟数据

// 根据环境自动选择API
export const getApi = async () => {
  if (USE_MOCK_API) {
    console.log('🔧 使用模拟API数据进行开发');
    return mockApi;
  }
  
  // 这里导入真实的API客户端
  const { api } = await import('./client');
  return api;
};
