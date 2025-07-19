import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post('/api/users/register', {
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
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>用户注册</h2>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}
        <form onSubmit={handleRegister} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>注册</button>
        </form>
        <div style={loginLinkStyle}>
          已有账号？ <a href="/login" style={linkStyle}>立即登录</a>
        </div>
      </div>
    </div>
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