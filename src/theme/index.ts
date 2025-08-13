// VSS系统统一主题配置
export const theme = {
  // 主色调
  colors: {
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#13c2c2',
    
    // 渐变色
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
      success: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      warning: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
      error: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
    },
    
    // 背景色
    background: {
      default: '#f0f2f5',
      card: '#ffffff',
      hover: '#fafafa',
    },
    
    // 文字颜色
    text: {
      primary: '#262626',
      secondary: '#8c8c8c',
      disabled: '#bfbfbf',
      white: '#ffffff',
    }
  },
  
  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // 圆角
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
  },
  
  // 阴影
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  
  // 字体大小
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    title: '32px',
  },
  
  // 字体权重
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // 动画
  animation: {
    duration: '0.3s',
    easing: 'ease',
    hover: 'all 0.3s ease',
  },
  
  // 布局
  layout: {
    headerHeight: '64px',
    siderWidth: '200px',
    contentPadding: '24px',
  }
};

// 通用样式组件
export const commonStyles = {
  // 页面容器
  pageContainer: {
    padding: theme.spacing.lg,
    background: theme.colors.background.default,
    minHeight: 'calc(100vh - 64px)',
  },
  
  // 页面头部
  pageHeader: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing.xl,
    padding: '40px 0',
    background: theme.colors.gradients.primary,
    borderRadius: theme.borderRadius.lg,
    color: theme.colors.text.white,
    boxShadow: theme.shadows.lg,
  },
  
  // 卡片样式
  card: {
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.sm,
    transition: theme.animation.hover,
    border: 'none',
  },
  
  // 卡片悬停效果
  cardHover: {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)',
  },
  
  // 按钮样式
  button: {
    borderRadius: theme.borderRadius.md,
    transition: theme.animation.hover,
    fontWeight: theme.fontWeight.medium,
  },
  
  // 输入框样式
  input: {
    borderRadius: theme.borderRadius.md,
    border: '2px solid #f0f0f0',
    transition: theme.animation.hover,
    fontSize: theme.fontSize.md,
    padding: '12px 16px',
  },
  
  // 标题样式
  title: {
    margin: 0,
    background: theme.colors.gradients.secondary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: theme.fontWeight.bold,
  },
  
  // 副标题样式
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
  },
  
  // 渐变背景容器
  gradientContainer: {
    background: theme.colors.gradients.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  
  // 玻璃态效果
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.xxl,
    boxShadow: `${theme.shadows.xl}, 0 0 0 1px rgba(255, 255, 255, 0.2)`,
    border: 'none',
  },
  
  // 浮动球装饰
  floatingBall: (size: number, color: string, top: string, left: string, animationDelay = '0s') => ({
    position: 'absolute' as const,
    top,
    left,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    borderRadius: '50%',
    animation: `float 6s ease-in-out infinite`,
    animationDelay,
  }),
};

// CSS动画关键帧（需要在全局CSS中定义）
export const keyframes = `
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;

export default theme;