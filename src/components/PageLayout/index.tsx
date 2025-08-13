/**
 * VSS视觉检测系统页面布局组件
 * 
 * 提供统一的页面布局和样式，包括：
 * - 可选的页面标题和副标题
 * - 渐变背景和浮动装饰元素
 * - 居中布局选项
 * - 灵活的样式自定义
 * 
 * @author VSS Team
 * @version 1.0.0
 */

import React from 'react';
import { Typography } from 'antd';
import { theme, commonStyles } from '../../theme';

const { Title, Text } = Typography;

/**
 * 页面布局组件的属性接口
 */
interface PageLayoutProps {
  /** 子组件内容 */
  children: React.ReactNode;
  
  /** 页面标题 */
  title?: string;
  
  /** 页面副标题 */
  subtitle?: string;
  
  /** 是否显示页面头部 */
  showHeader?: boolean;
  
  /** 头部自定义样式 */
  headerStyle?: React.CSSProperties;
  
  /** 容器自定义样式 */
  containerStyle?: React.CSSProperties;
  
  /** 是否使用渐变背景 */
  withGradientBackground?: boolean;
  
  /** 是否显示浮动装饰球 */
  withFloatingBalls?: boolean;
  
  /** 是否居中布局 */
  centered?: boolean;
}

/**
 * 页面布局组件
 * 
 * 根据传入的属性渲染不同样式的页面布局
 * 
 * @param props - 组件属性
 * @returns JSX.Element - 页面布局组件
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = false,
  headerStyle = {},
  containerStyle = {},
  withGradientBackground = false,
  withFloatingBalls = false,
  centered = false,
}) => {
  const containerBaseStyle = {
    ...(withGradientBackground
      ? {
          ...commonStyles.pageContainer,
          background: theme.colors.gradients.primary,
          position: 'relative' as const,
          overflow: 'hidden' as const,
        }
      : commonStyles.pageContainer),
    ...(centered
      ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: theme.spacing.lg,
        }
      : {}),
  };

  return (
    <div style={{ ...containerBaseStyle, ...containerStyle }}>
      {/* 浮动装饰球 */}
      {withFloatingBalls && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          <div style={commonStyles.floatingBall(
            120,
            'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
            '10%',
            '10%',
            '0s'
          )} />
          <div style={commonStyles.floatingBall(
            80,
            'linear-gradient(45deg, rgba(24,144,255,0.2), rgba(24,144,255,0.4))',
            '70%',
            '85%',
            '2s'
          )} />
          <div style={commonStyles.floatingBall(
            60,
            'linear-gradient(45deg, rgba(250,173,20,0.2), rgba(250,173,20,0.4))',
            '80%',
            '20%',
            '4s'
          )} />
        </div>
      )}
      
      {/* 页面头部 */}
      {showHeader && (title || subtitle) && (
        <div style={{
          ...commonStyles.pageHeader,
          ...headerStyle,
          position: 'relative',
          zIndex: 2,
        }}>
          {title && (
            <Title 
              level={1} 
              style={{
                ...commonStyles.title,
                color: theme.colors.text.white,
                fontSize: theme.fontSize.title,
                marginBottom: theme.spacing.sm,
              }}
            >
              {title}
            </Title>
          )}
          {subtitle && (
            <Text style={{
              ...commonStyles.subtitle,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: theme.fontSize.lg,
            }}>
              {subtitle}
            </Text>
          )}
        </div>
      )}
      
      {/* 页面内容 */}
      <div style={{
        position: 'relative',
        zIndex: 2,
      }}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;