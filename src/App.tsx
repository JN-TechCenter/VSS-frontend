import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DataScreen from './pages/DataScreen';
import ModelConfig from './pages/ModelConfig';
import HealthMonitor from './pages/HealthMonitor';
import Settings from './pages/Settings';
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
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/home" replace /> : <RegisterPage />} />
          <Route 
            path="/*" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            } 
          >
            <Route path="home" element={<Home />} />
            <Route path="data-screen" element={<DataScreen />} />
            <Route path="model-config" element={<ModelConfig />} />
            <Route path="health-monitor" element={<HealthMonitor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
