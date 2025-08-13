/**
 * VSS视觉检测系统登录页面
 * 
 * 提供用户登录功能，包括：
 * - 用户名密码登录
 * - 表单验证
 * - 登录状态管理
 * - 美观的UI设计和动画效果
 * 
 * @author VSS Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, StarOutlined, SafetyOutlined } from '@ant-design/icons';
import { VisionPlatformAPI } from '../api/client';
import PageLayout from '../components/PageLayout';
import { theme, commonStyles } from '../theme';

/**
 * 添加浮动动画CSS样式
 * 
 * 动态创建并注入CSS样式，包括浮动动画和交互效果
 */
const addFloatAnimation = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
      }
    }
    
    .login-input:focus {
      border-color: #1890ff !important;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
    }
    
    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
};

const { Title, Text } = Typography;

/**
 * 登录页面组件
 * 
 * 渲染登录表单和相关UI元素，处理用户登录逻辑
 * 
 * @returns JSX.Element - 登录页面组件
 */
const LoginPage: React.FC = () => {
  /** 登录加载状态 */
  const [loading, setLoading] = useState(false);
  
  /** 错误信息状态 */
  const [error, setError] = useState('');
  
  /** 路由导航钩子 */
  const navigate = useNavigate();

  /**
   * 组件挂载时添加动画样式
   */
  useEffect(() => {
    addFloatAnimation();
  }, []);

  /**
   * 处理用户登录
   * 
   * @param values - 表单值，包含用户名和密码
   * @param values.username - 用户名
   * @param values.password - 密码
   */
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/users/login', {
        username: values.username,
        password: values.password
      });

      // 登录成功，存储用户信息并重定向
      localStorage.setItem('username', response.data.username);
      // 触发登录状态变化事件
      window.dispatchEvent(new Event('loginStateChange'));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout 
      title="欢迎使用 VSS 视觉检测系统"
      subtitle="Vision Security System - 智能视觉安全检测平台"
      showHeader={false}
      showFloatingBalls={true}
      withGradientBackground={true}
      centered={true}
    >
      
      <Card 
         style={{
           ...commonStyles.card,
           width: '100%',
           maxWidth: '450px',
           background: 'rgba(255, 255, 255, 0.95)',
           backdropFilter: 'blur(20px)',
           borderRadius: '24px',
           boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
           border: 'none',
           position: 'relative',
           zIndex: 2
         }}
         styles={{ body: { padding: '40px' } }}
       >
        {/* 头部区域 */}
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xl
        }}>
          <div style={{
            marginBottom: theme.spacing.md
          }}>
            <SafetyOutlined style={{ 
              fontSize: '48px', 
              color: theme.colors.primary 
            }} />
          </div>
          <Title level={2} style={{
            margin: `0 0 ${theme.spacing.sm} 0`,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
            fontSize: theme.fontSize.xl
          }}>
            <StarOutlined style={{ 
              marginRight: theme.spacing.xs, 
              color: theme.colors.warning 
            }} />
            Vision AI 系统
          </Title>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSize.sm
          }}>智能视觉检测平台</Text>
        </div>

        <Divider style={{ margin: '32px 0' }} />

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
            onClose={() => setError('')}
          />
        )}

        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]}
          >
            <Input
               prefix={<UserOutlined style={{ color: theme.colors.primary }} />}
               placeholder="请输入用户名"
               style={{
                 ...commonStyles.input,
                 borderRadius: theme.borderRadius.md,
                 border: `2px solid ${theme.colors.border}`,
                 transition: 'all 0.3s ease',
                 fontSize: theme.fontSize.md,
                 padding: `${theme.spacing.sm} ${theme.spacing.md}`
               }}
               className="login-input"
             />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input.Password
               prefix={<LockOutlined style={{ color: theme.colors.primary }} />}
               placeholder="请输入密码"
               style={{
                 ...commonStyles.input,
                 borderRadius: theme.borderRadius.md,
                 border: `2px solid ${theme.colors.border}`,
                 transition: 'all 0.3s ease',
                 fontSize: theme.fontSize.md,
                 padding: `${theme.spacing.sm} ${theme.spacing.md}`
               }}
               className="login-input"
             />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
               type="primary"
               htmlType="submit"
               loading={loading}
               style={{
                 ...commonStyles.button,
                 height: '48px',
                 borderRadius: theme.borderRadius.md,
                 background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                 border: 'none',
                 fontSize: theme.fontSize.md,
                 fontWeight: '600',
                 boxShadow: `0 4px 12px ${theme.colors.primary}30`,
                 transition: 'all 0.3s ease'
               }}
               className="login-button"
               icon={<LoginOutlined />}
               block
             >
              {loading ? '登录中...' : '立即登录'}
            </Button>
          </Form.Item>
        </Form>

        {/* 底部链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: theme.spacing.lg
        }}>
          <Space split={<Divider type="vertical" />}>
            <Text style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.text.secondary
            }}>
              还没有账号？ 
              <a href="/register" style={{
                color: theme.colors.primary,
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>立即注册</a>
            </Text>
            <Text style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.text.secondary
            }}>
              <a href="#" style={{
                color: theme.colors.primary,
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>忘记密码？</a>
            </Text>
          </Space>
        </div>
      </Card>
    </PageLayout>
  );
};

// 样式定义
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const backgroundDecorationStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 1,
};

const floatingBall1Style: React.CSSProperties = {
  position: 'absolute',
  top: '10%',
  left: '10%',
  width: '120px',
  height: '120px',
  background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
  borderRadius: '50%',
  animation: 'float 6s ease-in-out infinite',
};

const floatingBall2Style: React.CSSProperties = {
  position: 'absolute',
  top: '70%',
  right: '15%',
  width: '80px',
  height: '80px',
  background: 'linear-gradient(45deg, rgba(24,144,255,0.2), rgba(24,144,255,0.4))',
  borderRadius: '50%',
  animation: 'float 8s ease-in-out infinite reverse',
};

const floatingBall3Style: React.CSSProperties = {
  position: 'absolute',
  bottom: '20%',
  left: '20%',
  width: '60px',
  height: '60px',
  background: 'linear-gradient(45deg, rgba(250,173,20,0.2), rgba(250,173,20,0.4))',
  borderRadius: '50%',
  animation: 'float 10s ease-in-out infinite',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '450px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
  border: 'none',
  position: 'relative',
  zIndex: 2,
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '8px',
};

const logoStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 'bold',
};

const subtitleStyle: React.CSSProperties = {
  color: '#8c8c8c',
  fontSize: '14px',
};

const inputStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '2px solid #f0f0f0',
  transition: 'all 0.3s ease',
  fontSize: '16px',
  padding: '12px 16px',
};

const buttonStyle: React.CSSProperties = {
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
  border: 'none',
  fontSize: '16px',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
  transition: 'all 0.3s ease',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '24px',
};

const linkTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#8c8c8c',
};

const linkStyle: React.CSSProperties = {
  color: '#1890ff',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease',
};

export default LoginPage;