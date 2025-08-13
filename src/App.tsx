/**
 * VSS视觉检测系统前端应用主组件
 * 
 * 该组件是整个应用的根组件，负责：
 * - 路由配置和管理
 * - 用户登录状态管理
 * - 全局主题配置
 * - 页面访问权限控制
 * 
 * @author VSS Team
 * @version 1.0.0
 */

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

/**
 * 应用主组件
 * 
 * 管理整个应用的路由结构和用户认证状态
 * 
 * @returns {JSX.Element} 应用根组件
 */
const App: React.FC = () => {
  /** 用户登录状态，基于localStorage中的username字段判断 */
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));

  /**
   * 监听用户登录状态变化
   * 
   * 通过监听localStorage变化和自定义事件来实时更新登录状态
   * 确保在多标签页或同页面内登录状态变化时能够及时响应
   */
  useEffect(() => {
    /**
     * 处理登录状态变化的回调函数
     * 检查localStorage中的username字段来更新登录状态
     */
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('username'));
    };

    // 监听跨标签页的storage事件
    window.addEventListener('storage', handleStorageChange);
    
    // 监听同页面内的自定义登录状态变化事件
    window.addEventListener('loginStateChange', handleStorageChange);

    // 清理事件监听器
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
