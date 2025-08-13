// 设置页面相关的类型定义
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createTime: string;
}

export interface MCPStrategy {
  id: string;
  name: string;
  description: string;
  type: 'detection' | 'classification' | 'segmentation';
  modelPath: string;
  confidence: number;
  enabled: boolean;
  createTime: string;
  updateTime: string;
}

export interface DeviceConfig {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  ip: string;
  port: number;
}

export interface NotificationConfig {
  id: string;
  type: string;
  enabled: boolean;
  channels: string[];
  conditions: Record<string, any>;
}

// 表单配置接口
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'input' | 'select' | 'number' | 'switch' | 'textarea' | 'upload' | 'slider';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
  props?: Record<string, any>;
  span?: number;
}

export interface TabConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

// 操作配置接口
export interface ActionConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  onClick: (record?: any) => void;
  visible?: (record?: any) => boolean;
  loading?: boolean;
}

// 表格列配置接口
export interface ColumnConfig {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: number;
  ellipsis?: boolean;
  sorter?: boolean;
  filters?: Array<{ text: string; value: any }>;
}

// 统计卡片配置接口
export interface StatCardConfig {
  title: string;
  value: number | string;
  color: string;
  icon?: React.ReactNode;
  formatter?: (value: number | string) => string;
}