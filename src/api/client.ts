// API 客户端实现
import { 
  APIClient, 
  ApiResponse, 
  DashboardStats, 
  TrendData,
  Device,
  DeviceConfig,
  Detection,
  DetectionTask,
  TaskResult,
  DefectStatistics,
  DefectDetail,
  ReportRequest,
  Report,
  HeatmapData,
  User,
  Staff,
  SystemConfig,
  PaginatedRequest,
  PaginatedResponse,
  API_ENDPOINTS,
  HTTP_STATUS,
  Script
} from './types';

export class VisionPlatformAPI implements APIClient {
  private baseURL: string = import.meta.env.VITE_API_BASE_URL;
  private scriptBaseURL: string = import.meta.env.VITE_SCRIPT_SERVICE_URL;
  private token: string;

  constructor(token: string = '') {
    this.token = token;
  }

  // 设置认证token
  setToken(token: string): void {
    this.token = token;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API请求失败: ${endpoint}`, error);
      throw error;
    }
  }

  // 脚本服务请求
  private async scriptRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.scriptBaseURL}${endpoint}`;
    return this.requestInternal<T>(url, options);
  }

  // 通用内部请求方法，不使用 baseURL
  private async requestInternal<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const defaultHeaders: HeadersInit = { 'Content-Type': 'application/json' };
    if (this.token) defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    const config: RequestInit = { ...options, headers: { ...defaultHeaders, ...options.headers } };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
  }

  // GET 请求
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    return this.request<T>(url);
  }

  // POST 请求
  private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  private async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // ===================
  // Scripts management
  // ===================
  async getScripts(): Promise<ApiResponse<Script[]>> {
    return this.scriptRequest<Script[]>(API_ENDPOINTS.SCRIPTS);
  }

  async createScript(script: { id: string; name: string; content: any }): Promise<ApiResponse<any>> {
    return this.scriptRequest<any>(API_ENDPOINTS.SCRIPTS, {
      method: 'POST',
      body: JSON.stringify(script)
    });
  }

  async runScript(id: string): Promise<ApiResponse<any>> {
    return this.scriptRequest<any>(API_ENDPOINTS.SCRIPT_RUN(id), {
      method: 'POST'
    });
  }
  // ===================
  // 仪表板相关接口
  // ===================
  
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS);
  }

  async getTrendData(period: string = '24h'): Promise<ApiResponse<TrendData>> {
    return this.get<TrendData>(API_ENDPOINTS.DASHBOARD_TRENDS, { period });
  }

  // ===================
  // 设备管理接口
  // ===================
  
  async getDevices(): Promise<ApiResponse<Device[]>> {
    return this.get<Device[]>(API_ENDPOINTS.DEVICES);
  }

  async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return this.get<Device>(API_ENDPOINTS.DEVICE_DETAIL(deviceId));
  }

  async updateDeviceConfig(
    deviceId: string, 
    config: Partial<DeviceConfig>
  ): Promise<ApiResponse<void>> {
    return this.put<void>(API_ENDPOINTS.DEVICE_CONFIG(deviceId), config);
  }

  // ===================
  // 检测数据接口
  // ===================
  
  async getDetections(params?: PaginatedRequest & {
    deviceId?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<ApiResponse<PaginatedResponse<Detection>>> {
    return this.get<PaginatedResponse<Detection>>(API_ENDPOINTS.DETECTIONS, params);
  }

  async submitDetection(task: DetectionTask): Promise<ApiResponse<TaskResult>> {
    return this.post<TaskResult>(API_ENDPOINTS.DETECTIONS, task);
  }

  async getDetectionResult(taskId: string): Promise<ApiResponse<TaskResult>> {
    return this.get<TaskResult>(API_ENDPOINTS.DETECTION_RESULT(taskId));
  }

  // ===================
  // 缺陷分析接口
  // ===================
  
  async getDefectStatistics(params?: {
    period?: string;
    deviceId?: string;
  }): Promise<ApiResponse<DefectStatistics>> {
    return this.get<DefectStatistics>(API_ENDPOINTS.DEFECT_STATISTICS, params);
  }

  async getDefectDetail(defectId: string): Promise<ApiResponse<DefectDetail>> {
    return this.get<DefectDetail>(API_ENDPOINTS.DEFECT_DETAIL(defectId));
  }

  // ===================
  // 报告生成接口
  // ===================
  
  async generateReport(request: ReportRequest): Promise<ApiResponse<Report>> {
    return this.post<Report>(API_ENDPOINTS.REPORTS_QUALITY, request);
  }

  async getReportStatus(reportId: string): Promise<ApiResponse<Report>> {
    return this.get<Report>(API_ENDPOINTS.REPORT_STATUS(reportId));
  }

  // ===================
  // 分析数据接口
  // ===================
  
  async getHeatmapData(days: number = 7): Promise<ApiResponse<HeatmapData>> {
    return this.get<HeatmapData>(API_ENDPOINTS.ANALYTICS_HEATMAP, { days });
  }

  // ===================
  // 用户管理接口
  // ===================
  
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>(API_ENDPOINTS.USER_PROFILE);
  }

  async getStaffOnDuty(): Promise<ApiResponse<Staff[]>> {
    return this.get<Staff[]>(API_ENDPOINTS.STAFF_ON_DUTY);
  }

  // ===================
  // 系统配置接口
  // ===================
  
  async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
    return this.get<SystemConfig>(API_ENDPOINTS.SYSTEM_CONFIG);
  }

  async updateSystemConfig(config: Partial<SystemConfig>): Promise<ApiResponse<void>> {
    return this.put<void>(API_ENDPOINTS.SYSTEM_CONFIG, config);
  }
}

// WebSocket 客户端
export class VisionPlatformWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  constructor(token: string, url: string = API_ENDPOINTS.WEBSOCKET) {
    this.url = url;
    this.token = token;
  }

  // 连接WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.url}?token=${this.token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket连接已建立');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('解析WebSocket消息失败:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket连接已关闭');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // 断线重连
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重连WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectInterval);
    } else {
      console.error('WebSocket重连失败，已达到最大重连次数');
    }
  }

  // 处理接收到的消息
  private handleMessage(data: any): void {
    const { channel, event, data: eventData } = data;
    const eventKey = `${channel}:${event}`;
    
    const listeners = this.listeners.get(eventKey);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error('WebSocket事件处理错误:', error);
        }
      });
    }

    // 通用监听器
    const allListeners = this.listeners.get('*');
    if (allListeners) {
      allListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('WebSocket通用事件处理错误:', error);
        }
      });
    }
  }

  // 订阅频道
  subscribe(channel: string, filters?: Record<string, any>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        action: 'subscribe',
        channel,
        filters: filters || {}
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  // 取消订阅
  unsubscribe(channel: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        action: 'unsubscribe',
        channel
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  // 监听事件
  on(eventKey: string, callback: Function): void {
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set());
    }
    this.listeners.get(eventKey)!.add(callback);
  }

  // 移除事件监听
  off(eventKey: string, callback: Function): void {
    const listeners = this.listeners.get(eventKey);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(eventKey);
      }
    }
  }

  // 关闭连接
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// 创建默认的API客户端实例
export const apiClient = new VisionPlatformAPI();

// 导出便捷方法
export const api = {
  // 设置认证token
  setToken: (token: string) => apiClient.setToken(token),
  
  // 仪表板
  dashboard: {
    getStats: () => apiClient.getDashboardStats(),
    getTrends: (period?: string) => apiClient.getTrendData(period),
  },
  
  // 设备
  devices: {
    list: () => apiClient.getDevices(),
    get: (id: string) => apiClient.getDevice(id),
    updateConfig: (id: string, config: Partial<DeviceConfig>) => 
      apiClient.updateDeviceConfig(id, config),
  },
  
  // 检测
  detections: {
    list: (params?: any) => apiClient.getDetections(params),
    submit: (task: DetectionTask) => apiClient.submitDetection(task),
    getResult: (taskId: string) => apiClient.getDetectionResult(taskId),
  },
  
  // 缺陷
  defects: {
    getStatistics: (params?: any) => apiClient.getDefectStatistics(params),
    getDetail: (id: string) => apiClient.getDefectDetail(id),
  },
  
  // 报告
  reports: {
    generate: (request: ReportRequest) => apiClient.generateReport(request),
    getStatus: (id: string) => apiClient.getReportStatus(id),
  },
  
  // 分析
  analytics: {
    getHeatmap: (days?: number) => apiClient.getHeatmapData(days),
  },
  
  // 用户
  user: {
    getCurrent: () => apiClient.getCurrentUser(),
    getStaffOnDuty: () => apiClient.getStaffOnDuty(),
  },
  
  // 系统
  system: {
    getConfig: () => apiClient.getSystemConfig(),
    updateConfig: (config: Partial<SystemConfig>) => 
      apiClient.updateSystemConfig(config),
  },
};

// 使用示例
/*
// 设置token
api.setToken('your-jwt-token');

// 获取仪表板数据
const dashboardData = await api.dashboard.getStats();

// 获取设备列表
const devices = await api.devices.list();

// 提交检测任务
const task = await api.detections.submit({
  deviceId: 'camera-01',
  productId: 'P001-001',
  imageData: 'base64-image-data'
});

// WebSocket使用
const ws = new VisionPlatformWebSocket('your-jwt-token');
await ws.connect();

// 订阅检测结果
ws.subscribe('detections');
ws.on('detections:detection_completed', (data) => {
  console.log('新的检测结果:', data);
});

// 订阅设备状态
ws.subscribe('devices');
ws.on('devices:device_status_changed', (data) => {
  console.log('设备状态变化:', data);
});
*/
