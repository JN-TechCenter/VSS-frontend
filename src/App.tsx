import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Detail from './pages/Detail';
import Settings from './pages/Settings';
import ScriptsPage from './pages/ScriptsPage';
import PrivateRoute from './components/PrivateRoute';
import './assets/index.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('username'));
    };

    // 监听storage事件
    window.addEventListener('storage', handleStorageChange);
    
    // 创建一个自定义事件来处理同页面内的localStorage变化
    window.addEventListener('loginStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          wireframe: false,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route 
            path="/*" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            } 
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="detail" element={<Detail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="scripts" element={<ScriptsPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
