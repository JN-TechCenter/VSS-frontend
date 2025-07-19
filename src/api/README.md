# API 使用指南

## 概述

本文档说明如何在机器视觉数据分析平台前端项目中使用API接口。

## 文件结构

```
src/api/
├── types.ts       # TypeScript类型定义
├── client.ts      # API客户端实现
├── mock.ts        # 模拟数据和测试API
└── README.md      # 本文档
```

## 快速开始

### 1. 基础使用

```typescript
import { api } from '@/api/client';

// 设置认证token
api.setToken('your-jwt-token');

// 获取仪表板统计数据
const statsResponse = await api.dashboard.getStats();
if (statsResponse.code === 200) {
  console.log('统计数据:', statsResponse.data);
}
```

### 2. 在React组件中使用

```typescript
import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { DashboardStats } from '@/api/types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.dashboard.getStats();
        if (response.code === 200) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (!stats) return <div>数据加载失败</div>;

  return (
    <div>
      <h2>今日检测总量: {stats.todayDetections.total}</h2>
      <p>异常检出率: {stats.defectRate.rate}%</p>
    </div>
  );
};
```

### 3. 错误处理

```typescript
import { api } from '@/api/client';
import { APIError } from '@/api/types';

const handleApiCall = async () => {
  try {
    const response = await api.devices.list();
    return response.data;
  } catch (error) {
    const apiError = error as APIError;
    
    switch (apiError.code) {
      case 401:
        // 未授权，重新登录
        console.error('认证失败，请重新登录');
        break;
      case 403:
        // 权限不足
        console.error('权限不足');
        break;
      case 404:
        // 资源不存在
        console.error('请求的资源不存在');
        break;
      default:
        console.error('API调用失败:', apiError.message);
    }
  }
};
```

## API接口详解

### 1. 仪表板API

```typescript
// 获取统计数据
const stats = await api.dashboard.getStats();

// 获取趋势数据
const trends = await api.dashboard.getTrends('24h'); // 24h, 7d, 30d
```

### 2. 设备管理API

```typescript
// 获取设备列表
const devices = await api.devices.list();

// 获取单个设备
const device = await api.devices.get('camera-01');

// 更新设备配置
await api.devices.updateConfig('camera-01', {
  resolution: '1920x1080',
  fps: 30,
  exposureTime: 5.5
});
```

### 3. 检测数据API

```typescript
// 获取检测记录（支持分页和过滤）
const detections = await api.detections.list({
  page: 1,
  limit: 20,
  deviceId: 'camera-01',
  status: 'error',
  startTime: '2025-07-18T00:00:00Z',
  endTime: '2025-07-18T23:59:59Z'
});

// 提交检测任务
const task = await api.detections.submit({
  deviceId: 'camera-01',
  productId: 'P001-001',
  imageData: 'base64_encoded_image_data',
  metadata: {
    batchId: 'B2025071801',
    operator: '张师傅'
  }
});

// 获取检测结果
const result = await api.detections.getResult(task.data.taskId);
```

### 4. 缺陷分析API

```typescript
// 获取缺陷统计
const defectStats = await api.defects.getStatistics({
  period: '7d',
  deviceId: 'camera-01'
});

// 获取缺陷详情
const defectDetail = await api.defects.getDetail('defect_001');
```

### 5. 报告生成API

```typescript
// 生成质量报告
const report = await api.reports.generate({
  startDate: '2025-07-11',
  endDate: '2025-07-18',
  deviceIds: ['camera-01', 'camera-02'],
  reportFormat: 'pdf',
  includeCharts: true
});

// 查询报告状态
const reportStatus = await api.reports.getStatus(report.data.reportId);

// 报告完成后下载
if (reportStatus.data.status === 'completed') {
  window.open(reportStatus.data.downloadUrl);
}
```

## WebSocket 实时数据

### 1. 建立连接

```typescript
import { VisionPlatformWebSocket } from '@/api/client';

const ws = new VisionPlatformWebSocket('your-jwt-token');

// 连接WebSocket
await ws.connect();
```

### 2. 订阅和监听事件

```typescript
// 订阅检测结果
ws.subscribe('detections', { deviceId: 'camera-01' });

// 监听检测完成事件
ws.on('detections:detection_completed', (data) => {
  console.log('新的检测结果:', data);
  // 更新UI显示最新检测结果
});

// 订阅设备状态
ws.subscribe('devices');

// 监听设备状态变化
ws.on('devices:device_status_changed', (data) => {
  console.log('设备状态变化:', data);
  // 更新设备状态显示
});

// 监听所有事件
ws.on('*', (event) => {
  console.log('WebSocket事件:', event);
});
```

### 3. 清理连接

```typescript
// 组件卸载时断开连接
useEffect(() => {
  return () => {
    ws.disconnect();
  };
}, []);
```

## 开发和测试

### 1. 使用模拟数据

在开发阶段，可以使用模拟API来测试前端功能：

```typescript
import { mockApi } from '@/api/mock';

// 替换真实API
const api = mockApi;

// 正常使用，数据来自模拟
const stats = await api.dashboard.getStats();
```

### 2. 自动切换API

```typescript
import { getApi } from '@/api/mock';

// 根据环境自动选择API
const api = await getApi();

// 开发环境使用模拟数据，生产环境使用真实API
const stats = await api.dashboard.getStats();
```

### 3. 环境配置

在 `.env` 文件中配置：

```bash
# 开发环境使用模拟API
VITE_USE_MOCK_API=true

# API基础URL
VITE_API_BASE_URL=https://api.vision-platform.com/v1

# WebSocket URL
VITE_WS_URL=wss://api.vision-platform.com/ws
```

## 最佳实践

### 1. 错误处理

```typescript
const useApiCall = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
```

### 2. 缓存和状态管理

```typescript
// 使用React Query或SWR进行数据缓存
import { useQuery } from 'react-query';

const useDashboardStats = () => {
  return useQuery(
    'dashboard-stats',
    () => api.dashboard.getStats(),
    {
      refetchInterval: 30000, // 30秒自动刷新
      retry: 3,
      retryDelay: 1000
    }
  );
};
```

### 3. 类型安全

```typescript
// 使用泛型确保类型安全
const useApiData = <T>(
  key: string,
  fetcher: () => Promise<ApiResponse<T>>
) => {
  // 实现...
};

// 使用
const { data: stats } = useApiData('stats', api.dashboard.getStats);
// stats 自动推断为 DashboardStats 类型
```

### 4. 批量操作

```typescript
// 批量获取设备状态
const deviceIds = ['camera-01', 'camera-02', 'camera-03'];
const devicePromises = deviceIds.map(id => api.devices.get(id));

try {
  const devices = await Promise.all(devicePromises);
  console.log('所有设备信息:', devices);
} catch (error) {
  console.error('批量获取设备信息失败:', error);
}
```

## 常见问题

### Q: 如何处理token过期？

```typescript
// 在API客户端中添加拦截器
class VisionPlatformAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token过期，清除本地token并重定向到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
```

### Q: 如何处理网络超时？

```typescript
const requestWithTimeout = async (
  url: string, 
  options: RequestInit, 
  timeout = 10000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
```

### Q: 如何实现请求重试？

```typescript
const retryRequest = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('所有重试都失败');
};
```

## 更新说明

- **v1.0.0**: 初始版本，包含基础API功能
- **v1.1.0**: 添加WebSocket支持和模拟数据
- **v1.2.0**: 完善错误处理和类型定义

---

*最后更新: 2025年7月18日*
