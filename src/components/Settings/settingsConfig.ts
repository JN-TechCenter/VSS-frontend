import { TabConfig } from './types';
import {
  UserOutlined,
  SettingOutlined,
  ApiOutlined,
  MonitorOutlined,
  BellOutlined,
  SafetyOutlined
} from '@ant-design/icons';

// 设置页面标签配置
export const settingsTabsConfig: TabConfig[] = [
  {
    key: 'profile',
    label: '个人信息',
    icon: UserOutlined,
    component: 'UserProfile',
    description: '管理个人账户信息和偏好设置'
  },
  {
    key: 'users',
    label: '用户管理',
    icon: UserOutlined,
    component: 'UserManager',
    description: '管理系统用户账户和权限',
    permission: 'admin'
  },
  {
    key: 'mcp',
    label: 'MCP策略',
    icon: ApiOutlined,
    component: 'MCPStrategyManager',
    description: '配置和管理机器视觉检测策略'
  },
  {
    key: 'devices',
    label: '设备管理',
    icon: MonitorOutlined,
    component: 'DeviceManager',
    description: '管理连接的设备和通信配置'
  },
  {
    key: 'notifications',
    label: '通知设置',
    icon: BellOutlined,
    component: 'NotificationSettings',
    description: '配置系统通知和告警设置'
  },
  {
    key: 'system',
    label: '系统设置',
    icon: SettingOutlined,
    component: 'SystemSettings',
    description: '系统级配置和参数设置',
    permission: 'admin'
  },
  {
    key: 'security',
    label: '安全设置',
    icon: SafetyOutlined,
    component: 'SecuritySettings',
    description: '安全策略和访问控制设置',
    permission: 'admin'
  }
];

// 用户权限映射
export const userPermissions = {
  admin: ['admin', 'operator', 'viewer'],
  operator: ['operator', 'viewer'],
  viewer: ['viewer']
};

// 根据用户角色过滤可访问的标签
export const getAccessibleTabs = (userRole: string): TabConfig[] => {
  return settingsTabsConfig.filter(tab => {
    if (!tab.permission) return true;
    return userPermissions[userRole as keyof typeof userPermissions]?.includes(tab.permission);
  });
};

// 表单验证规则配置
export const validationRules = {
  required: { required: true, message: '此字段为必填项' },
  email: {
    type: 'email' as const,
    message: '请输入有效的邮箱地址'
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码'
  },
  ip: {
    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: '请输入有效的IP地址'
  },
  port: {
    type: 'number' as const,
    min: 1,
    max: 65535,
    message: '端口号必须在1-65535之间'
  },
  password: {
    min: 6,
    message: '密码长度至少6位'
  },
  confidence: {
    type: 'number' as const,
    min: 0.1,
    max: 1.0,
    message: '置信度必须在0.1-1.0之间'
  }
};

// 主题配置
export const themeConfig = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff'
  },
  layout: {
    cardMargin: 16,
    formItemSpan: 12,
    modalWidth: 700
  }
};

// 数据刷新间隔配置（毫秒）
export const refreshIntervals = {
  devices: 30000,    // 设备状态每30秒刷新
  strategies: 60000, // MCP策略每分钟刷新
  users: 300000,     // 用户信息每5分钟刷新
  notifications: 10000 // 通知每10秒刷新
};

// API端点配置
export const apiEndpoints = {
  users: '/api/users',
  devices: '/api/devices',
  strategies: '/api/mcp/strategies',
  notifications: '/api/notifications',
  system: '/api/system',
  security: '/api/security'
};

// 导出配置
export const exportConfig = {
  formats: ['json', 'csv', 'xlsx'],
  maxRecords: 10000,
  defaultFormat: 'json'
};

// 分页配置
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
};