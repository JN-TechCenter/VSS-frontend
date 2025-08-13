import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { TabConfig } from './types';

interface SettingsFrameworkProps {
  title?: string;
  description?: string;
  tabs: TabConfig[];
  defaultActiveKey?: string;
  onTabChange?: (key: string) => void;
  style?: React.CSSProperties;
}

const { Title, Text } = Typography;

const SettingsFramework: React.FC<SettingsFrameworkProps> = ({
  title = '系统设置',
  description = '配置检测参数、设备管理和系统选项',
  tabs,
  defaultActiveKey,
  onTabChange,
  style
}) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  // 构建标签页项目
  const tabItems = tabs.map(tab => ({
    key: tab.key,
    label: (
      <span>
        {tab.icon}
        {tab.label}
      </span>
    ),
    children: (
      <tab.component 
        {...(tab.props || {})} 
        tabKey={tab.key}
        isActive={activeKey === tab.key}
      />
    )
  }));

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 0, ...style }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          {title}
        </Title>
        <Text type="secondary">{description}</Text>
      </Card>

      {/* 标签页内容 */}
      <Card>
        <Tabs 
          items={tabItems} 
          activeKey={activeKey}
          onChange={handleTabChange}
        />
      </Card>
    </div>
  );
};

export default SettingsFramework;