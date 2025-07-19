import React from 'react';
import { createRoot } from 'react-dom/client';

const SimpleApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>简单测试页面</h1>
      <p>如果你看到这个页面，说明Vite和React基本配置是正确的。</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<SimpleApp />);
