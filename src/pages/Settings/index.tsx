import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  InputNumber, 
  Switch, 
  Button, 
  Space, 
  Divider, 
  Tabs, 
  Select, 
  Input, 
  Slider,
  Row,
  Col,
  Table,
  Modal,
  message,
  Typography,
  Badge,
  Tag,
  Upload,
  Progress
} from 'antd';
import { 
  SettingOutlined, 
  CameraOutlined, 
  NotificationOutlined,
  DatabaseOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('设置已保存成功！');
      console.log('设置已保存:', values);
    } catch (error) {
      message.error('保存失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const deviceData = [
    {
      key: '1',
      name: '相机01',
      ip: '192.168.1.101',
      status: 'online',
      resolution: '1920x1080',
      fps: 30,
      lastUpdate: '2025-07-18 15:30:00'
    },
    {
      key: '2',
      name: '相机02',
      ip: '192.168.1.102',
      status: 'online',
      resolution: '2048x1536',
      fps: 25,
      lastUpdate: '2025-07-18 15:29:45'
    },
    {
      key: '3',
      name: '相机03',
      ip: '192.168.1.103',
      status: 'offline',
      resolution: '1920x1080',
      fps: 30,
      lastUpdate: '2025-07-18 14:25:12'
    },
  ];

  const deviceColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'online' ? 'success' : 'error'} 
          text={status === 'online' ? '在线' : '离线'} 
        />
      ),
    },
    {
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
    },
    {
      title: 'FPS',
      dataIndex: 'fps',
      key: 'fps',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <SettingOutlined />
          检测参数
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            threshold: 85,
            sensitivity: 70,
            minDefectSize: 5,
            maxDefectSize: 100,
            processTimeout: 30,
            retryCount: 3,
            autoSave: true,
            notifications: true,
            autoExport: false,
            debugMode: false,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Card title="基础参数" size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="检测阈值"
                  name="threshold"
                  rules={[{ required: true, message: '请设置检测阈值' }]}
                  tooltip="检测算法的置信度阈值，影响检测精度"
                >
                  <Slider
                    min={0}
                    max={100}
                    marks={{
                      0: '0%',
                      50: '50%',
                      100: '100%',
                    }}
                    tipFormatter={(value) => `${value}%`}
                  />
                </Form.Item>

                <Form.Item
                  label="灵敏度"
                  name="sensitivity"
                  rules={[{ required: true, message: '请设置灵敏度' }]}
                  tooltip="检测灵敏度，数值越高越容易检出缺陷"
                >
                  <Slider
                    min={0}
                    max={100}
                    marks={{
                      0: '低',
                      50: '中',
                      100: '高',
                    }}
                    tipFormatter={(value) => `${value}%`}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="最小缺陷尺寸 (像素)"
                      name="minDefectSize"
                    >
                      <InputNumber min={1} max={50} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="最大缺陷尺寸 (像素)"
                      name="maxDefectSize"
                    >
                      <InputNumber min={10} max={500} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="处理参数" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="处理超时 (秒)"
                      name="processTimeout"
                    >
                      <InputNumber min={5} max={120} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="重试次数"
                      name="retryCount"
                    >
                      <InputNumber min={0} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="系统设置" size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  label="自动保存检测结果"
                  name="autoSave"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item
                  label="异常通知"
                  name="notifications"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item
                  label="自动导出报告"
                  name="autoExport"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item
                  label="调试模式"
                  name="debugMode"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Card>

              <Card title="存储设置" size="small">
                <Form.Item label="数据保存路径">
                  <Input.Group compact>
                    <Input 
                      style={{ width: 'calc(100% - 80px)' }} 
                      defaultValue="D:\VisionData\Results"
                      readOnly
                    />
                    <Button icon={<UploadOutlined />}>选择</Button>
                  </Input.Group>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text>磁盘使用情况</Text>
                      <Progress percent={65} status="active" />
                      <Text type="secondary">剩余空间: 150GB</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text>内存使用情况</Text>
                      <Progress percent={42} />
                      <Text type="secondary">可用内存: 4.2GB</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                保存设置
              </Button>
              <Button 
                onClick={() => form.resetFields()}
                icon={<ReloadOutlined />}
              >
                重置
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出配置
              </Button>
              <Upload>
                <Button icon={<UploadOutlined />}>导入配置</Button>
              </Upload>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <CameraOutlined />
          设备管理
        </span>
      ),
      children: (
        <div>
          <Card 
            title="相机设备" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                添加设备
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Table 
              columns={deviceColumns} 
              dataSource={deviceData} 
              pagination={false}
              size="small"
            />
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="设备状态统计" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', color: '#52c41a' }}>2</div>
                      <div>在线设备</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', color: '#ff4d4f' }}>1</div>
                      <div>离线设备</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', color: '#1890ff' }}>3</div>
                      <div>总设备数</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="网络配置" size="small">
                <Form layout="vertical" size="small">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item label="子网掩码">
                        <Input defaultValue="255.255.255.0" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="网关">
                        <Input defaultValue="192.168.1.1" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button size="small">测试连接</Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <NotificationOutlined />
          通知设置
        </span>
      ),
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="邮件通知" size="small" style={{ marginBottom: 16 }}>
              <Form layout="vertical" size="small">
                <Form.Item label="SMTP服务器">
                  <Input placeholder="smtp.company.com" />
                </Form.Item>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item label="端口">
                      <InputNumber defaultValue={587} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="加密方式">
                      <Select defaultValue="tls">
                        <Select.Option value="none">无</Select.Option>
                        <Select.Option value="ssl">SSL</Select.Option>
                        <Select.Option value="tls">TLS</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="发送邮箱">
                  <Input placeholder="system@company.com" />
                </Form.Item>
                <Form.Item label="接收邮箱">
                  <TextArea rows={3} placeholder="admin1@company.com&#10;admin2@company.com" />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="通知规则" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>检测异常</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="red">邮件</Tag>
                    <Tag color="blue">短信</Tag>
                    <Tag color="green">系统通知</Tag>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong>设备离线</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="red">邮件</Tag>
                    <Tag color="green">系统通知</Tag>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text strong>存储空间不足</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="orange">邮件</Tag>
                    <Tag color="green">系统通知</Tag>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <UserOutlined />
          用户管理
        </span>
      ),
      children: (
        <Card title="用户权限设置">
          <Paragraph>
            用户管理功能正在开发中，敬请期待...
          </Paragraph>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 0 }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          系统设置
        </Title>
        <Text type="secondary">配置检测参数、设备管理和系统选项</Text>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>

      {/* 添加设备Modal */}
      <Modal
        title="添加新设备"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => setModalVisible(false)}>
            确定
          </Button>,
        ]}
      >
        <Form form={deviceForm} layout="vertical">
          <Form.Item label="设备名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="IP地址" name="ip" rules={[{ required: true }]}>
            <Input placeholder="192.168.1.xxx" />
          </Form.Item>
          <Form.Item label="分辨率" name="resolution">
            <Select placeholder="选择分辨率">
              <Select.Option value="1920x1080">1920x1080</Select.Option>
              <Select.Option value="2048x1536">2048x1536</Select.Option>
              <Select.Option value="2560x1920">2560x1920</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="帧率" name="fps">
            <InputNumber min={1} max={60} defaultValue={30} addonAfter="FPS" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
