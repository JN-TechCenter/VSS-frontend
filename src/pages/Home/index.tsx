import React from 'react';
import { Card, Row, Col, Button, Statistic, Progress, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  ExperimentOutlined,
  HeartOutlined,
  UserOutlined,
  DatabaseOutlined,
  ApiOutlined,
  MonitorOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/PageLayout';
import { theme, commonStyles } from '../../theme';
import './style.css';

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const systemStats = {
    totalUsers: 1248,
    activeModels: 12,
    apiCalls: 45678,
    systemHealth: 98.5
  };

  const quickActions = [
    {
      title: '数据大屏',
      description: '查看系统实时数据监控',
      icon: <DashboardOutlined />,
      path: '/data-screen',
      color: '#1890ff'
    },
    {
      title: '模型配置',
      description: '管理AI模型和参数设置',
      icon: <ExperimentOutlined />,
      path: '/model-config',
      color: '#52c41a'
    },
    {
      title: '健康监控',
      description: '监控系统运行状态',
      icon: <HeartOutlined />,
      path: '/health-monitor',
      color: '#fa541c'
    },
    {
      title: '系统设置',
      description: '账户管理和系统配置',
      icon: <SettingOutlined />,
      path: '/settings',
      color: '#722ed1'
    }
  ];

  return (
    <PageLayout
      title="欢迎使用 VSS 视觉监控系统"
      subtitle="智能视觉分析与监控平台"
      showHeader={true}
    >
      {/* 系统概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={commonStyles.card}>
            <Statistic
              title="总用户数"
              value={systemStats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: theme.colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={commonStyles.card}>
            <Statistic
              title="活跃模型"
              value={systemStats.activeModels}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: theme.colors.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={commonStyles.card}>
            <Statistic
              title="API调用次数"
              value={systemStats.apiCalls}
              prefix={<ApiOutlined />}
              valueStyle={{ color: theme.colors.warning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={commonStyles.card}>
            <div>
              <div style={{ marginBottom: 8 }}>
                <MonitorOutlined style={{ marginRight: 8 }} />
                系统健康度
              </div>
              <Progress
                type="circle"
                percent={systemStats.systemHealth}
                size={80}
                strokeColor={{
                  '0%': theme.colors.primary,
                  '100%': theme.colors.success,
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 数据大屏预览 */}
      <Card 
        title="数据大屏预览" 
        style={{
          ...commonStyles.card,
          marginBottom: theme.spacing.lg,
        }}
        extra={
          <Button 
            type="primary" 
            icon={<DashboardOutlined />}
            onClick={() => navigate('/data-screen')}
            style={commonStyles.button}
          >
            查看完整大屏
          </Button>
        }
      >
        <div className="preview-content">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="preview-chart">
                <h4>实时监控数据</h4>
                <div className="chart-placeholder">
                  <DatabaseOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  <p>点击查看完整数据大屏</p>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="preview-chart">
                <h4>系统性能指标</h4>
                <div className="chart-placeholder">
                  <MonitorOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                  <p>实时性能监控图表</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 快捷操作 */}
      <Card 
        title="快捷操作" 
        style={{
          ...commonStyles.card,
          marginBottom: theme.spacing.lg,
        }}
      >
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                onClick={() => navigate(action.path)}
                style={{
                  ...commonStyles.card,
                  textAlign: 'center',
                  borderColor: action.color,
                  cursor: 'pointer',
                  transition: theme.animation.hover,
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, commonStyles.cardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = commonStyles.card.boxShadow;
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ 
                  fontSize: theme.fontSize.xxl, 
                  color: action.color, 
                  marginBottom: theme.spacing.md 
                }}>
                  {action.icon}
                </div>
                <Title level={4} style={{ 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text.primary,
                }}>
                  {action.title}
                </Title>
                <p style={{ 
                  color: theme.colors.text.secondary, 
                  margin: 0,
                  fontSize: theme.fontSize.sm,
                }}>
                  {action.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </PageLayout>
  );
};

export default Home;