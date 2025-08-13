import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Alert,
  Spin,
  Progress,
  List,
  Avatar,
  Button,
  Tooltip,
  Badge,
  Timeline,
  Descriptions,
  Tabs,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  ApiOutlined,
  EyeOutlined,
  GlobalOutlined,
  ReloadOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Line, Gauge } from '@ant-design/charts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ServiceStatus {
  id: string;
  name: string;
  type: 'database' | 'api' | 'inference' | 'frontend' | 'proxy' | 'cache';
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  uptime: number; // 运行时间（小时）
  cpu: number;
  memory: number;
  responseTime: number; // ms
  lastCheck: string;
  endpoint?: string;
  version: string;
  description: string;
  dependencies: string[];
}

interface SystemMetrics {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface AlertLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  service: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  details?: string;
}

const HealthMonitor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchHealthData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchHealthData, 30000); // 每30秒刷新
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      
      // 模拟服务状态数据
      const mockServices: ServiceStatus[] = [
        {
          id: '1',
          name: 'VSS Database',
          type: 'database',
          status: 'healthy',
          uptime: 168.5,
          cpu: 25,
          memory: 68,
          responseTime: 12,
          lastCheck: new Date().toISOString(),
          endpoint: 'postgresql://localhost:5432',
          version: '13.8',
          description: 'PostgreSQL 主数据库',
          dependencies: [],
        },
        {
          id: '2',
          name: 'VSS Redis',
          type: 'cache',
          status: 'healthy',
          uptime: 168.5,
          cpu: 8,
          memory: 32,
          responseTime: 2,
          lastCheck: new Date().toISOString(),
          endpoint: 'redis://localhost:6379',
          version: '7.0.5',
          description: 'Redis 缓存服务',
          dependencies: [],
        },
        {
          id: '3',
          name: 'VSS Backend',
          type: 'api',
          status: 'healthy',
          uptime: 72.3,
          cpu: 45,
          memory: 78,
          responseTime: 156,
          lastCheck: new Date().toISOString(),
          endpoint: 'http://localhost:8000',
          version: '1.2.3',
          description: '后端API服务',
          dependencies: ['VSS Database', 'VSS Redis'],
        },
        {
          id: '4',
          name: 'VSS YOLO Inference',
          type: 'inference',
          status: 'warning',
          uptime: 24.1,
          cpu: 85,
          memory: 92,
          responseTime: 234,
          lastCheck: new Date().toISOString(),
          endpoint: 'http://localhost:8001',
          version: '1.0.8',
          description: 'YOLO推理服务',
          dependencies: ['VSS Backend'],
        },
        {
          id: '5',
          name: 'VSS Frontend',
          type: 'frontend',
          status: 'healthy',
          uptime: 72.3,
          cpu: 15,
          memory: 42,
          responseTime: 89,
          lastCheck: new Date().toISOString(),
          endpoint: 'http://localhost:3000',
          version: '1.2.1',
          description: 'React前端应用',
          dependencies: ['VSS Backend'],
        },
        {
          id: '6',
          name: 'VSS Nginx Proxy',
          type: 'proxy',
          status: 'healthy',
          uptime: 168.5,
          cpu: 12,
          memory: 28,
          responseTime: 45,
          lastCheck: new Date().toISOString(),
          endpoint: 'http://localhost:80',
          version: '1.21.6',
          description: 'Nginx反向代理',
          dependencies: ['VSS Frontend', 'VSS Backend'],
        },
        {
          id: '7',
          name: 'VSS Data Analysis',
          type: 'api',
          status: 'error',
          uptime: 0,
          cpu: 0,
          memory: 0,
          responseTime: 0,
          lastCheck: new Date(Date.now() - 300000).toISOString(),
          endpoint: 'http://localhost:8002',
          version: '1.1.2',
          description: '数据分析服务',
          dependencies: ['VSS Database', 'VSS Redis'],
        },
      ];

      // 模拟系统指标数据
      const mockMetrics: SystemMetrics[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 30) + 50,
        disk: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 50) + 20,
      }));

      // 模拟告警日志
      const mockAlerts: AlertLog[] = [
        {
          id: '1',
          level: 'error',
          service: 'VSS Data Analysis',
          message: '服务连接失败，无法访问端点',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          resolved: false,
          details: 'Connection refused at http://localhost:8002',
        },
        {
          id: '2',
          level: 'warning',
          service: 'VSS YOLO Inference',
          message: 'CPU使用率过高',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          resolved: false,
          details: 'CPU usage: 85%, Memory usage: 92%',
        },
        {
          id: '3',
          level: 'info',
          service: 'VSS Backend',
          message: '服务重启完成',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          resolved: true,
          details: 'Service restarted successfully',
        },
        {
          id: '4',
          level: 'warning',
          service: 'VSS Database',
          message: '连接池使用率较高',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          resolved: true,
          details: 'Connection pool usage: 78%',
        },
      ];

      setServices(mockServices);
      setSystemMetrics(mockMetrics);
      setAlertLogs(mockAlerts);
    } catch (error) {
      console.error('获取健康监控数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'database': return <DatabaseOutlined />;
      case 'cache': return <DatabaseOutlined />;
      case 'api': return <ApiOutlined />;
      case 'inference': return <EyeOutlined />;
      case 'frontend': return <GlobalOutlined />;
      case 'proxy': return <CloudServerOutlined />;
      default: return <CloudServerOutlined />;
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const serviceColumns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ServiceStatus) => (
        <Space>
          {getServiceIcon(record.type)}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Tag color={getStatusColor(status)}>
            {status === 'healthy' ? '健康' : status === 'warning' ? '警告' : status === 'error' ? '错误' : '未知'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => {
        const days = Math.floor(uptime / 24);
        const hours = Math.floor(uptime % 24);
        return `${days}天 ${hours}小时`;
      },
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: number) => (
        <Progress
          percent={cpu}
          size="small"
          status={cpu >= 90 ? 'exception' : cpu >= 70 ? 'normal' : 'success'}
        />
      ),
    },
    {
      title: '内存',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: number) => (
        <Progress
          percent={memory}
          size="small"
          status={memory >= 90 ? 'exception' : memory >= 70 ? 'normal' : 'success'}
        />
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => `${time}ms`,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: ServiceStatus) => (
        <Space size="middle">
          <Tooltip title="重启服务">
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={() => {
                // 模拟重启服务
                message.success(`${record.name} 重启命令已发送`);
              }}
            />
          </Tooltip>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<InfoCircleOutlined />}
              onClick={() => {
                // 显示服务详情
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const errorCount = services.filter(s => s.status === 'error').length;
  const totalServices = services.length;

  const systemHealthScore = totalServices > 0 ? 
    Math.round((healthyCount / totalServices) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>健康监控</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchHealthData}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            type={autoRefresh ? 'primary' : 'default'}
            icon={<SyncOutlined spin={autoRefresh} />}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="系统概览" key="overview">
          {/* 系统健康度总览 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="系统健康度"
                  value={systemHealthScore}
                  suffix="%"
                  valueStyle={{ 
                    color: systemHealthScore >= 90 ? '#3f8600' : 
                           systemHealthScore >= 70 ? '#faad14' : '#cf1322' 
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="健康服务"
                  value={healthyCount}
                  suffix={`/ ${totalServices}`}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="警告服务"
                  value={warningCount}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="异常服务"
                  value={errorCount}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 系统资源使用趋势 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={18}>
              <Card title="24小时系统资源趋势">
                <Line
                  data={systemMetrics.flatMap(item => [
                    { time: new Date(item.timestamp).getHours() + ':00', value: item.cpu, type: 'CPU' },
                    { time: new Date(item.timestamp).getHours() + ':00', value: item.memory, type: '内存' },
                    { time: new Date(item.timestamp).getHours() + ':00', value: item.disk, type: '磁盘' },
                  ])}
                  xField="time"
                  yField="value"
                  seriesField="type"
                  smooth
                  height={300}
                />
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card title="当前系统负载">
                <div style={{ textAlign: 'center' }}>
                  <Gauge
                    percent={systemMetrics[systemMetrics.length - 1]?.cpu / 100 || 0}
                    range={{ color: '#30BF78' }}
                    indicator={{
                      pointer: { style: { stroke: '#D0D0D0' } },
                      pin: { style: { stroke: '#D0D0D0' } },
                    }}
                    statistic={{
                      content: {
                        style: {
                          fontSize: '16px',
                          lineHeight: '16px',
                        },
                        formatter: () => 'CPU',
                      },
                    }}
                    height={200}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          {/* 服务状态表格 */}
          <Card title="服务状态详情">
            <Table
              dataSource={services}
              columns={serviceColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="告警日志" key="alerts">
          <Card title="系统告警日志">
            <Timeline>
              {alertLogs.map(alert => (
                <Timeline.Item
                  key={alert.id}
                  dot={getAlertIcon(alert.level)}
                  color={alert.level === 'error' || alert.level === 'critical' ? 'red' : 
                         alert.level === 'warning' ? 'orange' : 'blue'}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Badge
                          status={alert.resolved ? 'success' : 'error'}
                          text={alert.resolved ? '已解决' : '未解决'}
                        />
                        <Tag color={alert.level === 'error' || alert.level === 'critical' ? 'red' : 
                                   alert.level === 'warning' ? 'orange' : 'blue'}>
                          {alert.level.toUpperCase()}
                        </Tag>
                        <Text strong>{alert.service}</Text>
                      </Space>
                      <Text type="secondary">
                        {new Date(alert.timestamp).toLocaleString()}
                      </Text>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Text>{alert.message}</Text>
                      {alert.details && (
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {alert.details}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="服务依赖" key="dependencies">
          <Card title="服务依赖关系">
            <Alert
              message="服务依赖图"
              description="显示各个服务之间的依赖关系，帮助理解系统架构和故障影响范围。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <List
              dataSource={services}
              renderItem={(service) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ 
                          backgroundColor: getStatusColor(service.status),
                          color: 'white'
                        }}
                        icon={getServiceIcon(service.type)}
                      />
                    }
                    title={
                      <Space>
                        <span>{service.name}</span>
                        <Tag color={getStatusColor(service.status)}>
                          {service.status === 'healthy' ? '健康' : 
                           service.status === 'warning' ? '警告' : 
                           service.status === 'error' ? '错误' : '未知'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{service.description}</div>
                        {service.dependencies.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <Text type="secondary">依赖服务: </Text>
                            {service.dependencies.map((dep, index) => (
                              <Tag key={index} size="small">{dep}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  />
                  <div>
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="端点">{service.endpoint}</Descriptions.Item>
                      <Descriptions.Item label="版本">{service.version}</Descriptions.Item>
                      <Descriptions.Item label="响应时间">{service.responseTime}ms</Descriptions.Item>
                    </Descriptions>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HealthMonitor;