/**
 * VSS视觉检测系统统一主题配置
 * 
 * 定义了整个应用的设计系统，包括：
 * - 颜色系统（主色调、渐变色、背景色、文字颜色）
 * - 间距系统
 * - 圆角规范
 * - 阴影效果
 * - 字体规范
 * - 动画配置
 * - 布局参数
 * 
 * @author VSS Team
 * @version 1.0.0
 */

/**
 * 主题配置对象
 * 
 * 包含所有设计系统的配置参数
 */
export const theme = {
  /**
   * 颜色系统配置
   */
  colors: {
    /** 主要颜色 - 蓝色 */
    primary: '#1890ff',
    /** 次要颜色 - 紫色 */
    secondary: '#722ed1',
    /** 成功颜色 - 绿色 */
    success: '#52c41a',
    /** 警告颜色 - 橙色 */
    warning: '#faad14',
    /** 错误颜色 - 红色 */
    error: '#ff4d4f',
    /** 信息颜色 - 青色 */
    info: '#13c2c2',
    
    /**
     * 渐变色配置
     */
    gradients: {
      /** 主要渐变 - 蓝紫渐变 */
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      /** 次要渐变 - 蓝紫渐变 */
      secondary: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
      /** 成功渐变 - 绿色渐变 */
      success: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      /** 警告渐变 - 橙色渐变 */
      warning: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
      /** 错误渐变 - 红色渐变 */
      error: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
    },
    
    /**
     * 背景色配置
     */
    background: {
      /** 默认背景色 */
      default: '#f0f2f5',
      /** 卡片背景色 */
      card: '#ffffff',
      /** 悬停背景色 */
      hover: '#fafafa',
    },
    
    /**
     * 文字颜色配置
     */
    text: {
      /** 主要文字颜色 */
      primary: '#262626',
      /** 次要文字颜色 */
      secondary: '#8c8c8c',
      /** 禁用文字颜色 */
      disabled: '#bfbfbf',
      /** 白色文字 */
      white: '#ffffff',
    }
  },
  
  /**
   * 间距系统配置
   */
  spacing: {
    /** 超小间距 - 4px */
    xs: '4px',
    /** 小间距 - 8px */
    sm: '8px',
    /** 中等间距 - 16px */
    md: '16px',
    /** 大间距 - 24px */
    lg: '24px',
    /** 超大间距 - 32px */
    xl: '32px',
    /** 特大间距 - 48px */
    xxl: '48px',
  },
  
  /**
   * 圆角配置
   */
  borderRadius: {
    /** 小圆角 - 4px */
    sm: '4px',
    /** 中等圆角 - 8px */
    md: '8px',
    /** 大圆角 - 12px */
    lg: '12px',
    /** 超大圆角 - 16px */
    xl: '16px',
    /** 特大圆角 - 24px */
    xxl: '24px',
  },
  
  /**
   * 阴影效果配置
   */
  shadows: {
    /** 小阴影 */
    sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    /** 中等阴影 */
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    /** 大阴影 */
    lg: '0 8px 32px rgba(0, 0, 0, 0.1)',
    /** 超大阴影 */
    xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  
  /**
   * 字体大小配置
   */
  fontSize: {
    /** 超小字体 - 12px */
    xs: '12px',
    /** 小字体 - 14px */
    sm: '14px',
    /** 中等字体 - 16px */
    md: '16px',
    /** 大字体 - 18px */
    lg: '18px',
    /** 超大字体 - 20px */
    xl: '20px',
    /** 特大字体 - 24px */
    xxl: '24px',
    /** 标题字体 - 32px */
    title: '32px',
  },
  
  /**
   * 字体粗细配置
   */
  fontWeight: {
    /** 正常粗细 */
    normal: 400,
    /** 中等粗细 */
    medium: 500,
    /** 半粗体 */
    semibold: 600,
    /** 粗体 */
    bold: 700,
    /** 超粗体 */
    extrabold: 800,
  },
  
  /**
   * 动画配置
   */
  animation: {
    /** 动画持续时间 */
    duration: '0.3s',
    /** 动画缓动函数 */
    easing: 'ease',
    /** 悬停动画 */
    hover: 'all 0.3s ease',
  },
  
  /**
   * 布局配置
   */
  layout: {
    /** 头部高度 */
    headerHeight: '64px',
    /** 侧边栏宽度 */
    siderWidth: '200px',
    /** 内容区域内边距 */
    contentPadding: '24px',
  }
};

/**
 * 通用样式配置
 * 
 * 定义了应用中常用的样式组合，包括：
 * - 页面布局样式
 * - 卡片样式
 * - 按钮样式
 * - 输入框样式
 * - 标题样式
 * - 特效样式
 */
export const commonStyles = {
  /**
   * 页面容器样式
   * 
   * 用于页面的根容器，提供基础的布局和背景
   */
  pageContainer: {
    padding: theme.spacing.lg,
    background: theme.colors.background.default,
    minHeight: 'calc(100vh - 64px)',
  },
  
  /**
   * 页面头部样式
   * 
   * 用于页面顶部的标题区域，包含渐变背景和阴影效果
   */
  pageHeader: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing.xl,
    padding: '40px 0',
    background: theme.colors.gradients.primary,
    borderRadius: theme.borderRadius.lg,
    color: theme.colors.text.white,
    boxShadow: theme.shadows.lg,
  },
  
  /**
   * 卡片样式
   * 
   * 通用的卡片容器样式，包含悬停效果
   */
  card: {
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.sm,
    transition: theme.animation.hover,
    border: 'none',
  },
  
  /**
   * 卡片悬停效果
   * 
   * 当鼠标悬停在卡片上时的样式变化
   */
  cardHover: {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)',
  },
  
  /**
   * 按钮样式
   * 
   * 通用按钮的基础样式配置
   */
  button: {
    borderRadius: theme.borderRadius.md,
    transition: theme.animation.hover,
    fontWeight: theme.fontWeight.medium,
  },
  
  /**
   * 输入框样式
   * 
   * 表单输入框的统一样式配置
   */
  input: {
    borderRadius: theme.borderRadius.md,
    border: '2px solid #f0f0f0',
    transition: theme.animation.hover,
    fontSize: theme.fontSize.md,
    padding: '12px 16px',
  },
  
  /**
   * 标题样式
   * 
   * 页面主标题的渐变文字效果
   */
  title: {
    margin: 0,
    background: theme.colors.gradients.secondary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: theme.fontWeight.bold,
  },
  
  /**
   * 副标题样式
   * 
   * 页面副标题的样式配置
   */
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
  },
  
  /**
   * 渐变背景容器
   * 
   * 带有渐变背景的容器样式
   */
  gradientContainer: {
    background: theme.colors.gradients.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  
  /**
   * 玻璃态效果
   * 
   * 现代化的毛玻璃背景效果样式
   */
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.xxl,
    boxShadow: `${theme.shadows.xl}, 0 0 0 1px rgba(255, 255, 255, 0.2)`,
    border: 'none',
  },
  
  /**
   * 浮动球装饰
   * 
   * 创建浮动动画装饰球的样式函数
   * @param size 球的大小（像素）
   * @param color 球的颜色
   * @param top 顶部位置
   * @param left 左侧位置
   * @param animationDelay 动画延迟时间
   */
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

/**
 * CSS动画关键帧定义
 * 
 * 包含应用中使用的各种动画效果：
 * - float: 浮动动画
 * - fadeIn: 淡入动画
 * - slideInLeft: 从左侧滑入动画
 * - slideInRight: 从右侧滑入动画
 * 
 * 注意：这些关键帧需要在全局CSS中定义才能生效
 */
export const keyframes = `
/** 浮动动画 - 上下浮动效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/** 淡入动画 - 从下方淡入 */
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

/** 左侧滑入动画 - 从左侧滑入 */
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

/** 右侧滑入动画 - 从右侧滑入 */
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