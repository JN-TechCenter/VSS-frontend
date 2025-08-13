/**
 * VSS视觉检测系统前端应用入口文件
 * 
 * 该文件是React应用的启动入口，负责：
 * - 初始化React应用
 * - 挂载根组件到DOM
 * - 引入全局样式
 * 
 * @author VSS Team
 * @version 1.0.0
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/index.css';

/**
 * 应用启动入口
 * 
 * 使用React 18的createRoot API创建根节点并渲染应用
 * 启用StrictMode以便在开发环境中进行额外的检查和警告
 */
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
