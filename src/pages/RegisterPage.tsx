import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { VisionPlatformAPI } from '../api/client';
import PageLayout from '../components/PageLayout';
import { theme, commonStyles } from '../theme';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('开始注册流程...');

    try {
      console.log('发送注册请求到 /api/users/register');
      const response = await VisionPlatformAPI.post('/api/users/register', {
        username,
        password,
        email
      });

      console.log('注册成功响应:', response);
      setSuccess('注册成功！即将跳转到登录页面...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('注册错误详情:', err);
      console.error('错误响应:', err.response);
      console.error('错误数据:', err.response?.data);
      console.error('请求URL:', err.config?.url);
      console.error('请求方法:', err.config?.method);
      
      const errorMessage = err.response?.data?.error || '注册失败，请检查输入信息';
      console.log('显示的错误信息:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <PageLayout 
      title="注册 VSS 账号"
      subtitle="创建您的视觉检测系统账号"
      showHeader={false}
      showFloatingBalls={true}
    >
      <Card style={{
        ...commonStyles.card,
        width: '100%',
        maxWidth: 450,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        animation: 'slideInUp 0.6s ease-out'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xl
        }}>
          <SafetyOutlined style={{
            fontSize: '48px',
            color: theme.colors.primary,
            marginBottom: theme.spacing.md
          }} />
          <Typography.Title level={2} style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: theme.spacing.sm,
            fontWeight: 'bold',
            fontSize: theme.fontSize.xl
          }}>
            注册 VSS 账号
          </Typography.Title>
          <Typography.Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSize.md
          }}>
            创建您的视觉检测系统账号
          </Typography.Text>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: theme.spacing.md }} />}
        {success && <Alert message={success} type="success" showIcon style={{ marginBottom: theme.spacing.md }} />}
        <Form onFinish={handleRegister} layout="vertical" size="large">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                height: '48px',
                fontSize: theme.fontSize.md,
                fontWeight: 'bold',
                boxShadow: theme.shadows.md,
                transition: 'all 0.3s ease'
              }}
            >
              立即注册
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: `${theme.spacing.lg} 0` }} />
        <div style={{ textAlign: 'center' }}>
          <Typography.Text style={{ color: theme.colors.text.secondary }}>
            已有账号？ <Link to="/login" style={{ color: theme.colors.primary, textDecoration: 'none' }}>立即登录</Link>
          </Typography.Text>
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
  backgroundColor: '#f0f2f5',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#1a1a1a',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#4a4a4a',
};

const inputStyle: React.CSSProperties = {
  padding: '0.8rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.8rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'backgroundColor 0.2s',
};

const errorStyle: React.CSSProperties = {
  color: '#dc3545',
  fontSize: '0.9rem',
  textAlign: 'center',
  padding: '0.5rem',
  backgroundColor: '#f8d7da',
  borderRadius: '4px',
};

const successStyle: React.CSSProperties = {
  color: '#28a745',
  fontSize: '0.9rem',
  textAlign: 'center',
  padding: '0.5rem',
  backgroundColor: '#d4edda',
  borderRadius: '4px',
};

const loginLinkStyle: React.CSSProperties = {
  marginTop: '1rem',
  textAlign: 'center',
  fontSize: '0.9rem',
};

const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'none',
};

export default RegisterPage;