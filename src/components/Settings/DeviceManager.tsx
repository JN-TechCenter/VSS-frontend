import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  message,
  Form,
  Row,
  Col,
  Typography,
  Tag,
  Badge,
  Progress,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  WifiOutlined,
  DisconnectOutlined,
  SettingOutlined,
  MonitorOutlined
} from '@ant-design/icons';
import FormBuilder from './FormBuilder';
import DataTable from './DataTable';
import StatCard from './StatCard';
import { DeviceConfig, FormFieldConfig, ColumnConfig, ActionConfig, StatCardConfig } from './types';

interface DeviceManagerProps {
  tabKey?: string;
  isActive?: boolean;
}

const { Text } = Typography;

const DeviceManager: React.FC<DeviceManagerProps> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [devices, setDevices] = useState<DeviceConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceConfig | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  // 表单字段配置
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: '设备名称',
      type: 'input',
      required: true,
      span: 12,
      props: { placeholder: '请输入设备名称' }
    },
    {
      name: 'type',
      label: '设备类型',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '工业相机', value: 'camera' },
        { label: 'PLC控制器', value: 'plc' },
        { label: '传感器', value: 'sensor' },
        { label: '执行器', value: 'actuator' }
      ]
    },
    {
      name: 'ip',
      label: 'IP地址',
      type: 'input',
      required: true,
      span: 12,
      props: { placeholder: '192.168.1.100' }
    },
    {
      name: 'port',
      label: '端口',
      type: 'number',
      required: true,
      span: 12,
      props: { placeholder: '8080', min: 1, max: 65535 }
    },
    {
      name: 'protocol',
      label: '通信协议',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: 'TCP/IP', value: 'tcp' },
        { label: 'UDP', value: 'udp' },
        { label: 'Modbus', value: 'modbus' },
        { label: 'OPC UA', value: 'opcua' }
      ]
    },
    {
      name: 'status',
      label: '设备状态',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '在线', value: 'online' },
        { label: '离线', value: 'offline' },
        { label: '维护中', value: 'maintenance' }
      ]
    },
    {
      name: 'description',
      label: '设备描述',
      type: 'textarea',
      props: { rows: 3, placeholder: '请输入设备描述信息' }
    },
    {
      name: 'enabled',
      label: '启用状态',
      type: 'switch',
      span: 12,
      props: { checkedChildren: '启用', unCheckedChildren: '禁用' }
    }
  ];

  // 表格列配置
  const columns: ColumnConfig[] = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: DeviceConfig) => (
        <Space>
          <MonitorOutlined style={{ color: record.status === 'online' ? '#52c41a' : '#ff4d4f' }} />
          <div>
            <div>{name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.ip}:{record.port}</Text>
          </div>
        </Space>
      )
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          camera: { text: '工业相机', color: 'blue' },
          plc: { text: 'PLC控制器', color: 'green' },
          sensor: { text: '传感器', color: 'orange' },
          actuator: { text: '执行器', color: 'purple' }
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      }
    },
    {
      title: '通信协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => {
        const protocolMap = {
          tcp: 'TCP/IP',
          udp: 'UDP',
          modbus: 'Modbus',
          opcua: 'OPC UA'
        };
        return protocolMap[protocol as keyof typeof protocolMap] || protocol;
      }
    },
    {
      title: '连接状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          online: { text: '在线', status: 'success' as const, color: '#52c41a' },
          offline: { text: '离线', status: 'error' as const, color: '#ff4d4f' },
          maintenance: { text: '维护中', status: 'warning' as const, color: '#faad14' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, status: 'default' as const, color: '#d9d9d9' };
        return <Badge status={statusInfo.status} text={statusInfo.text} />;
      }
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Badge 
          status={enabled ? 'success' : 'default'} 
          text={enabled ? '启用' : '禁用'} 
        />
      )
    },
    {
      title: '最后通信',
      dataIndex: 'lastCommunication',
      key: 'lastCommunication'
    }
  ];

  // 操作配置
  const actions: ActionConfig[] = [
    {
      key: 'test',
      label: '测试连接',
      icon: <WifiOutlined />,
      onClick: handleTestConnection,
      render: (record: DeviceConfig) => (
        <Button 
          size="small" 
          icon={<WifiOutlined />}
          loading={testingConnection === record.id}
          onClick={() => handleTestConnection(record)}
        >
          测试连接
        </Button>
      )
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: handleEdit
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete
    }
  ];

  // 统计配置
  const stats: StatCardConfig[] = [
    {
      title: '总设备数',
      value: devices.length,
      color: '#1890ff'
    },
    {
      title: '在线设备',
      value: devices.filter(d => d.status === 'online').length,
      color: '#52c41a'
    },
    {
      title: '离线设备',
      value: devices.filter(d => d.status === 'offline').length,
      color: '#ff4d4f'
    },
    {
      title: '维护设备',
      value: devices.filter(d => d.status === 'maintenance').length,
      color: '#faad14'
    }
  ];

  // 获取设备列表
  const fetchDevices = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockDevices: DeviceConfig[] = [
        {
          id: '1',
          name: '生产线相机01',
          type: 'camera',
          ip: '192.168.1.101',
          port: 8080,
          protocol: 'tcp',
          status: 'online',
          enabled: true,
          description: '生产线质量检测相机',
          createTime: '2025-01-01 10:00:00',
          lastCommunication: '2025-08-13 15:30:00'
        },
        {
          id: '2',
          name: 'PLC控制器01',
          type: 'plc',
          ip: '192.168.1.102',
          port: 502,
          protocol: 'modbus',
          status: 'online',
          enabled: true,
          description: '主控制器',
          createTime: '2025-02-15 14:20:00',
          lastCommunication: '2025-08-13 15:29:00'
        },
        {
          id: '3',
          name: '温度传感器01',
          type: 'sensor',
          ip: '192.168.1.103',
          port: 4840,
          protocol: 'opcua',
          status: 'maintenance',
          enabled: false,
          description: '环境温度监测',
          createTime: '2025-03-20 16:45:00',
          lastCommunication: '2025-08-12 10:15:00'
        }
      ];
      setDevices(mockDevices);
    } catch (error) {
      message.error('获取设备列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存设备
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingDevice) {
        const updatedDevices = devices.map(device =>
          device.id === editingDevice.id
            ? { ...device, ...values }
            : device
        );
        setDevices(updatedDevices);
        message.success('设备更新成功');
      } else {
        const newDevice: DeviceConfig = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString(),
          lastCommunication: '-'
        };
        setDevices([...devices, newDevice]);
        message.success('设备创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingDevice(null);
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  function handleEdit(record: DeviceConfig) {
    setEditingDevice(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  }

  function handleDelete(record: DeviceConfig) {
    setDevices(devices.filter(device => device.id !== record.id));
    message.success('设备删除成功');
  }

  async function handleTestConnection(record: DeviceConfig) {
    setTestingConnection(record.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3; // 70% 成功率
      
      if (success) {
        message.success(`设备 ${record.name} 连接测试成功`);
        // 更新最后通信时间
        const updatedDevices = devices.map(device =>
          device.id === record.id
            ? { ...device, lastCommunication: new Date().toLocaleString(), status: 'online' as const }
            : device
        );
        setDevices(updatedDevices);
      } else {
        message.error(`设备 ${record.name} 连接测试失败`);
        // 更新状态为离线
        const updatedDevices = devices.map(device =>
          device.id === record.id
            ? { ...device, status: 'offline' as const }
            : device
        );
        setDevices(updatedDevices);
      }
    } catch (error) {
      message.error('连接测试失败');
    } finally {
      setTestingConnection(null);
    }
  }

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    setModalVisible(true);
  };

  useEffect(() => {
    if (isActive) {
      fetchDevices();
    }
  }, [isActive]);

  const tableExtra = (
    <Space>
      <Button 
        icon={<ReloadOutlined />}
        onClick={fetchDevices}
        loading={loading}
      >
        刷新
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        添加设备
      </Button>
    </Space>
  );

  const typeDistribution = [
    {
      title: '工业相机',
      value: devices.filter(d => d.type === 'camera').length,
      color: '#1890ff'
    },
    {
      title: 'PLC控制器',
      value: devices.filter(d => d.type === 'plc').length,
      color: '#52c41a'
    },
    {
      title: '传感器',
      value: devices.filter(d => d.type === 'sensor').length,
      color: '#faad14'
    },
    {
      title: '执行器',
      value: devices.filter(d => d.type === 'actuator').length,
      color: '#722ed1'
    }
  ];

  const onlineRate = devices.length > 0 ? 
    Math.round((devices.filter(d => d.status === 'online').length / devices.length) * 100) : 0;

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card style={{ marginBottom: 16 }}>
            <DataTable
              dataSource={devices}
              columns={columns}
              actions={actions}
              loading={loading}
              title="设备列表"
              extra={tableExtra}
            />
          </Card>
        </Col>
        <Col span={8}>
          <StatCard
            title="设备统计"
            stats={stats}
            loading={loading}
            style={{ marginBottom: 16 }}
            footer={
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">设备在线率</Text>
                <Progress 
                  percent={onlineRate} 
                  size="small" 
                  status={onlineRate >= 80 ? 'success' : onlineRate >= 60 ? 'normal' : 'exception'}
                  style={{ marginTop: 8 }}
                />
              </div>
            }
          />
          <StatCard
            title="设备类型分布"
            stats={typeDistribution}
            loading={loading}
          />
        </Col>
      </Row>

      {/* 设备编辑模态框 */}
      <Modal
        title={editingDevice ? '编辑设备' : '添加设备'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <FormBuilder
          fields={formFields}
          form={form}
          onFinish={handleSave}
          loading={loading}
          initialValues={editingDevice || { status: 'offline', enabled: true, protocol: 'tcp', port: 8080 }}
          submitText={editingDevice ? '更新设备' : '创建设备'}
        />
      </Modal>
    </div>
  );
};

export default DeviceManager;