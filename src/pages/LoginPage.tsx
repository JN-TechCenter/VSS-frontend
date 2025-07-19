import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3002/api/users/login', {
        username,
        password
      });

      // 登录成功，存储用户信息并重定向
      localStorage.setItem('username', response.data.username);
      // 触发登录状态变化事件
      window.dispatchEvent(new Event('loginStateChange'));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败，请检查用户名和密码');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>用户登录</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleLogin} style={formStyle}>
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
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>登录</button>
        </form>
        <div style={registerLinkStyle}>
          还没有账号？ <a href="/register" style={linkStyle}>立即注册</a>
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
  backgroundColor: '#007bff',
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

const registerLinkStyle: React.CSSProperties = {
  marginTop: '1rem',
  textAlign: 'center',
  fontSize: '0.9rem',
};

const linkStyle: React.CSSProperties = {
  color: '#007bff',
    textDecoration: 'none',
};

export default LoginPage;