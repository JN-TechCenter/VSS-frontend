import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Space, Badge, Modal, Drawer, List } from 'antd';
import { 
  DashboardOutlined, 
  EyeOutlined, 
  SettingOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">数据概览</Link> },
  { key: '/detail', icon: <EyeOutlined />, label: <Link to="/detail">详细分析</Link> },
  { key: '/scripts', icon: <CodeOutlined />, label: <Link to="/scripts">脚本编排</Link> },
  { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">系统设置</Link> },
];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // 如果没有用户信息，可能需要重定向到登录
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    // 触发登录状态变化事件
    window.dispatchEvent(new Event('loginStateChange'));
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
      onClick: () => setProfileVisible(true),
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const notifications = [
    '【系统通知】V1.2版本已于今晚凌晨发布。',
    '【安全警报】检测到异常登录尝试，IP地址：101.45.67.89',
    '【数据预警】3号生产线缺陷率超过阈值，请及时检查。',
    '【维护提醒】服务器将于本周六凌晨2点进行例行维护。',
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!collapsed ? (
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              🔍 Vision AI
            </Title>
          ) : (
            <span style={{ color: 'white', fontSize: '18px' }}>🔍</span>
          )}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: 'white', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Title level={5} style={{ margin: 0, marginLeft: 16, color: '#262626' }}>
              机器视觉数据分析平台
            </Title>
          </div>
          
          <Space size="large">
            <Badge count={notifications.length} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                size="large"
                style={{ color: '#666' }}
                onClick={() => setNotificationsVisible(true)}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  icon={<UserOutlined />} 
                />
                <span style={{ color: '#262626' }}>{username || '未登录'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: 24,
          background: '#f5f5f5',
          borderRadius: 8,
          overflow: 'auto'
        }}>
          <div style={{ 
            background: 'white',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Modal
        title="个人资料"
        visible={profileVisible}
        onOk={() => setProfileVisible(false)}
        onCancel={() => setProfileVisible(false)}
        footer={[
          <Button key="back" onClick={() => setProfileVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <p>用户名: {username}</p>
        <p>角色: 管理员</p>
        <p>邮箱: admin@vision-ai.com</p>
        <p>上次登录时间: {new Date().toLocaleString()}</p>
      </Modal>
      <Drawer
        title="消息通知"
        placement="right"
        onClose={() => setNotificationsVisible(false)}
        visible={notificationsVisible}
      >
        <List
          dataSource={notifications}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
