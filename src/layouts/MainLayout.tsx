import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Space, Badge, Modal, Drawer, List } from 'antd';
import { 
  HomeOutlined,
  DashboardOutlined, 
  EyeOutlined, 
  SettingOutlined, 
  ExperimentOutlined,
  HeartOutlined,
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  UserOutlined as UserIcon,
  LogoutOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { theme, commonStyles } from '../theme';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '/home', icon: <HomeOutlined />, label: <Link to="/home">首页</Link> },
  { key: '/data-screen', icon: <DashboardOutlined />, label: <Link to="/data-screen">数据大屏</Link> },
  { key: '/model-config', icon: <ExperimentOutlined />, label: <Link to="/model-config">模型配置</Link> },
  { key: '/health-monitor', icon: <HeartOutlined />, label: <Link to="/health-monitor">健康监控</Link> },
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
          background: theme.colors.gradients.primary,
          boxShadow: theme.shadows.md,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.colors.text.white}20`,
          padding: theme.spacing.md,
        }}>
          {!collapsed ? (
            <Title level={4} style={{ 
              color: theme.colors.text.white, 
              margin: 0,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
            }}>
              🔍 Vision AI
            </Title>
          ) : (
            <span style={{ 
              color: theme.colors.text.white, 
              fontSize: theme.fontSize.lg 
            }}>🔍</span>
          )}
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            items={menuItems}
            style={{ 
              background: 'transparent',
              border: 'none',
              height: '100%',
            }}
          />
        </div>
      </Sider>
      <Layout style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}>
        <Header style={{ 
          background: theme.colors.background.card, 
          padding: `0 ${theme.spacing.lg}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: theme.shadows.sm,
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 200,
          zIndex: 99,
          transition: 'left 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                ...commonStyles.button,
                fontSize: theme.fontSize.md,
                width: 64,
                height: 64,
                color: theme.colors.text.primary,
              }}
            />
            <Title level={5} style={{ 
              margin: 0, 
              marginLeft: theme.spacing.md, 
              color: theme.colors.text.primary,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold,
            }}>
              机器视觉数据分析平台
            </Title>
          </div>
          
          <Space size="large">
            <Badge count={notifications.length} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                size="large"
                style={{ 
                  ...commonStyles.button,
                  color: theme.colors.text.secondary 
                }}
                onClick={() => setNotificationsVisible(true)}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: theme.colors.primary }} 
                  icon={<UserOutlined />} 
                />
                <span style={{ 
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.medium,
                }}>{username || '未登录'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: theme.spacing.lg,
          marginTop: `calc(64px + ${theme.spacing.lg})`,
          background: theme.colors.background.default,
          borderRadius: theme.borderRadius.md,
          overflow: 'auto'
        }}>
          <div style={{ 
            ...commonStyles.card,
            padding: theme.spacing.lg,
            minHeight: 'calc(100vh - 112px)',
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
