import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Avatar,
  Upload,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
  Alert,
  Switch,
  InputNumber,
  Select,
  Badge,
  Tooltip,
  Progress,
  FloatButton,
  Affix,
  BackTop
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  ApiOutlined,
  MonitorOutlined,
  BellOutlined,
  SafetyOutlined,
  CrownOutlined,
  EditOutlined,
  CloudUploadOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  GiftOutlined,
  DiamondOutlined,
  FireOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import MCPStrategyManager from '../../components/Settings/MCPStrategyManager';
import UserManager from '../../components/Settings/UserManager';
import DeviceManager from '../../components/Settings/DeviceManager';
import { settingsTabsConfig, getAccessibleTabs } from '../../components/Settings/settingsConfig';
import { TabConfig, UserProfile } from '../../components/Settings/types';
import PageLayout from '../../components/PageLayout';
import { theme, commonStyles } from '../../theme';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 个人信息组件
const UserProfileComponent: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    username: 'admin',
    email: 'admin@vss.com',
    role: 'admin',
    phone: '13800138001',
    department: '技术部',
    avatar: ''
  });

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile({ ...userProfile, ...values });
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      form.setFieldsValue(userProfile);
    }
  }, [isActive, userProfile, form]);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>头像设置</span>
              </div>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                  }} 
                />
                <Badge 
                  count={<CrownOutlined style={{ color: '#faad14' }} />} 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    right: 10,
                    background: 'transparent',
                    boxShadow: 'none'
                  }}
                />
              </div>
              <br />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => {
                  message.success('头像上传成功');
                  return false;
                }}
              >
                <Button 
                  type="primary" 
                  icon={<CloudUploadOutlined />}
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(24,144,255,0.3)'
                  }}
                >
                  更换头像
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EditOutlined style={{ color: '#52c41a' }} />
                <span>基本信息</span>
              </div>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={userProfile}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#262626' }}>用户名</span>}
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input 
                      placeholder="请输入用户名" 
                      style={{ 
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#262626' }}>邮箱</span>}
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input 
                      placeholder="请输入邮箱" 
                      style={{ 
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#262626' }}>手机号</span>}
                    name="phone"
                  >
                    <Input 
                      placeholder="请输入手机号" 
                      style={{ 
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#262626' }}>部门</span>}
                    name="department"
                  >
                    <Input 
                      placeholder="请输入部门" 
                      style={{ 
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(82,196,26,0.3)',
                    fontWeight: 600
                  }}
                >
                  保存更改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 通知设置组件
const NotificationSettings: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('通知设置保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellOutlined style={{ color: '#fa8c16' }} />
            <span>通知设置</span>
          </div>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            emailNotification: true,
            smsNotification: false,
            systemAlert: true,
            deviceAlert: true
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#1890ff' }}>
                  基础通知
                </Typography.Title>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>邮件通知</span>} 
                  name="emailNotification" 
                  valuePropName="checked"
                  style={{ marginBottom: '16px' }}
                >
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>短信通知</span>} 
                  name="smsNotification" 
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #fff7e6 0%, #ffecc7 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#fa8c16' }}>
                  告警通知
                </Typography.Title>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>系统告警</span>} 
                  name="systemAlert" 
                  valuePropName="checked"
                  style={{ marginBottom: '16px' }}
                >
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>设备告警</span>} 
                  name="deviceAlert" 
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #fa8c16, #ffa940)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(250,140,22,0.3)',
                fontWeight: 600
              }}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
     </div>
   );
};

// 系统设置组件
const SystemSettings: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('系统设置保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingOutlined style={{ color: '#722ed1' }} />
            <span>系统设置</span>
          </div>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            systemName: 'VSS视觉检测系统',
            maxUsers: 100,
            sessionTimeout: 30,
            autoBackup: true,
            logLevel: 'info'
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#52c41a' }}>
                  基础配置
                </Typography.Title>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>系统名称</span>}
                  name="systemName"
                  rules={[{ required: true, message: '请输入系统名称' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <Input 
                    placeholder="请输入系统名称" 
                    style={{ 
                      borderRadius: '8px',
                      border: '1px solid #d9d9d9',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>最大用户数</span>}
                  name="maxUsers"
                  rules={[{ required: true, message: '请输入最大用户数' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={1000} 
                    style={{ 
                      width: '100%',
                      borderRadius: '8px'
                    }} 
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#f5222d' }}>
                  运行配置
                </Typography.Title>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>会话超时(分钟)</span>}
                  name="sessionTimeout"
                  rules={[{ required: true, message: '请输入会话超时时间' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <InputNumber 
                    min={5} 
                    max={480} 
                    style={{ 
                      width: '100%',
                      borderRadius: '8px'
                    }} 
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>日志级别</span>}
                  name="logLevel"
                  rules={[{ required: true, message: '请选择日志级别' }]}
                >
                  <Select
                    style={{
                      borderRadius: '8px'
                    }}
                  >
                    <Select.Option value="debug">调试</Select.Option>
                    <Select.Option value="info">信息</Select.Option>
                    <Select.Option value="warn">警告</Select.Option>
                    <Select.Option value="error">错误</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626', fontSize: '16px' }}>自动备份</span>} 
                  name="autoBackup" 
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭"
                    size="default"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #722ed1, #9254de)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(114,46,209,0.3)',
                fontWeight: 600
              }}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// 安全设置组件
const SecuritySettings: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('安全设置保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SafetyOutlined style={{ color: '#f5222d' }} />
            <span>安全设置</span>
          </div>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Alert
          message="安全提醒"
          description="请谨慎配置安全设置，确保系统安全性与可用性的平衡。"
          type="warning"
          showIcon
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)'
          }}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            passwordPolicy: true,
            twoFactorAuth: false,
            loginAttempts: 5,
            lockoutDuration: 30,
            ipWhitelist: ''
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#eb2f96' }}>
                  身份验证
                </Typography.Title>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>密码策略</span>} 
                  name="passwordPolicy" 
                  valuePropName="checked"
                  style={{ marginBottom: '16px' }}
                >
                  <Switch 
                    checkedChildren="启用" 
                    unCheckedChildren="禁用"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>双因子认证</span>} 
                  name="twoFactorAuth" 
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="启用" 
                    unCheckedChildren="禁用"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)'
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#1890ff' }}>
                  访问控制
                </Typography.Title>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>登录尝试次数</span>}
                  name="loginAttempts"
                  rules={[{ required: true, message: '请输入登录尝试次数' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <InputNumber 
                    min={3} 
                    max={10} 
                    style={{ 
                      width: '100%',
                      borderRadius: '8px'
                    }} 
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>锁定时长(分钟)</span>}
                  name="lockoutDuration"
                  rules={[{ required: true, message: '请输入锁定时长' }]}
                >
                  <InputNumber 
                    min={5} 
                    max={1440} 
                    style={{ 
                      width: '100%',
                      borderRadius: '8px'
                    }} 
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div style={{
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{ marginBottom: '16px', color: '#722ed1' }}>
                  网络安全
                </Typography.Title>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: '#262626' }}>IP白名单</span>}
                  name="ipWhitelist"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入允许访问的IP地址，每行一个" 
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #d9d9d9',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #f5222d, #ff4d4f)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(245,34,45,0.3)',
                fontWeight: 600
              }}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userRole] = useState('admin'); // 模拟当前用户角色
  
  // 根据用户角色获取可访问的标签
  const accessibleTabs = getAccessibleTabs(userRole);

  // 组件映射
  const componentMap = {
    UserProfile: UserProfileComponent,
    UserManager: UserManager,
    MCPStrategyManager: MCPStrategyManager,
    DeviceManager: DeviceManager,
    NotificationSettings: NotificationSettings,
    SystemSettings: SystemSettings,
    SecuritySettings: SecuritySettings
  };

  // 渲染标签内容
  const renderTabContent = (tabConfig: TabConfig) => {
    const Component = componentMap[tabConfig.component as keyof typeof componentMap];
    if (!Component) {
      return (
        <Alert
          message="组件未找到"
          description={`组件 ${tabConfig.component} 尚未实现`}
          type="warning"
          showIcon
        />
      );
    }
    return <Component isActive={activeTab === tabConfig.key} />;
  };

  // 生成标签项
  const tabItems = accessibleTabs.map(tab => ({
    key: tab.key,
    label: (
      <span>
        <tab.icon style={{ marginRight: 8 }} />
        {tab.label}
      </span>
    ),
    children: renderTabContent(tab)
  }));

  return (
    <PageLayout 
      title="系统设置"
      subtitle="配置和管理您的 VSS 系统参数"
      showHeader={true}
      showFloatingBalls={false}
    >

      
      <Card
        style={{
          ...commonStyles.card,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabPosition="top"
          tabBarStyle={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))',
            margin: 0,
            padding: '16px 24px 0',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '24px 24px 0 0'
          }}
        />
      </Card>
      
      {/* 浮动操作按钮 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<ExperimentOutlined />}
      >
        <FloatButton 
          icon={<HeartOutlined />} 
          tooltip="收藏此页面"
          onClick={() => message.success('已收藏！')}
        />
        <FloatButton 
          icon={<ThunderboltOutlined />} 
          tooltip="快速设置"
          onClick={() => message.info('快速设置功能开发中...')}
        />
        <FloatButton 
          icon={<GiftOutlined />} 
          tooltip="帮助中心"
          onClick={() => message.info('帮助文档即将推出！')}
        />
      </FloatButton.Group>
      
      {/* 回到顶部 */}
      <BackTop 
        style={{
          right: 24,
          bottom: 120
        }}
      >
        <div style={{
          height: 40,
          width: 40,
          lineHeight: '40px',
          borderRadius: '50%',
          backgroundColor: '#667eea',
          color: '#fff',
          textAlign: 'center',
          fontSize: 16,
          boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
          transition: 'all 0.3s ease'
        }}>
          <RocketOutlined />
        </div>
      </BackTop>
    </PageLayout>
  );
};

export default Settings;
