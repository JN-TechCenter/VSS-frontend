import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Alert,
  Spin,
  Progress,
  List,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { Line, Pie, Heatmap } from '@ant-design/charts';
import { VisionPlatformAPI } from '../../api/visionPlatform';

const { Title, Text } = Typography;

interface TrafficData {
  time: string;
  inFlow: number;
  outFlow: number;
  density: number;
}

interface NodeRanking {
  nodeId: string;
  nodeName: string;
  score: number;
  trafficVolume: number;
  efficiency: number;
  status: 'excellent' | 'good' | 'normal' | 'poor';
}

interface AIRecommendation {
  id: string;
  type: 'optimization' | 'alert' | 'suggestion';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

const DataScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [nodeRankings, setNodeRankings] = useState<NodeRanking[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalDensity: 0,
    currentFlow: 0,
    peakFlow: 0,
    totalVolume: 0,
  });

  useEffect(() => {
    fetchDataScreenData();
    const interval = setInterval(fetchDataScreenData, 30000); // 每30秒刷新一次
    return () => clearInterval(interval);
  }, []);

  const fetchDataScreenData = async () => {
    try {
      setLoading(true);
      // 模拟API调用
      const mockTrafficData: TrafficData[] = Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        inFlow: Math.floor(Math.random() * 100) + 50,
        outFlow: Math.floor(Math.random() * 100) + 40,
        density: Math.floor(Math.random() * 80) + 20,
      }));

      const mockNodeRankings: NodeRanking[] = Array.from({ length: 10 }, (_, i) => ({
        nodeId: `node_${i + 1}`,
        nodeName: `节点${i + 1}`,
        score: Math.floor(Math.random() * 40) + 60,
        trafficVolume: Math.floor(Math.random() * 1000) + 500,
        efficiency: Math.floor(Math.random() * 30) + 70,
        status: ['excellent', 'good', 'normal', 'poor'][Math.floor(Math.random() * 4)] as any,
      })).sort((a, b) => b.score - a.score);

      const mockAIRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'optimization',
          title: '人流高峰期优化建议',
          content: '检测到14:00-16:00时段人流密度较高，建议增加监控节点覆盖范围',
          priority: 'high',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'alert',
          title: '异常流量检测',
          content: '节点3检测到异常人流聚集，建议关注安全状况',
          priority: 'medium',
          timestamp: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'suggestion',
          title: '模型性能优化',
          content: '当前视觉模型准确率可通过调整参数进一步提升',
          priority: 'low',
          timestamp: new Date().toISOString(),
        },
      ];

      setTrafficData(mockTrafficData);
      setNodeRankings(mockNodeRankings);
      setAIRecommendations(mockAIRecommendations);
      setRealTimeStats({
        totalDensity: Math.floor(Math.random() * 200) + 100,
        currentFlow: Math.floor(Math.random() * 150) + 80,
        peakFlow: Math.floor(Math.random() * 100) + 200,
        totalVolume: Math.floor(Math.random() * 5000) + 10000,
      });
    } catch (error) {
      console.error('获取数据大屏数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const trafficLineConfig = {
    data: trafficData,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const nodeColumns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
    },
    {
      title: '综合评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Progress
          percent={score}
          size="small"
          status={score >= 90 ? 'success' : score >= 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '人流量',
      dataIndex: 'trafficVolume',
      key: 'trafficVolume',
      render: (volume: number) => volume.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          excellent: { color: 'green', text: '优秀' },
          good: { color: 'blue', text: '良好' },
          normal: { color: 'orange', text: '正常' },
          poor: { color: 'red', text: '较差' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <RiseOutlined />;
      case 'alert': return <EyeOutlined />;
      case 'suggestion': return <BulbOutlined />;
      default: return <BulbOutlined />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        数据大屏 - 视频流集群分析
      </Title>

      {/* 实时统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="当前人流密度"
              value={realTimeStats.totalDensity}
              suffix="人/区域"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="实时人流量"
              value={realTimeStats.currentFlow}
              suffix="人/小时"
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日峰值"
              value={realTimeStats.peakFlow}
              suffix="人/小时"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="累计人流存量"
              value={realTimeStats.totalVolume}
              suffix="人次"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 人流趋势图 */}
        <Col xs={24} lg={16}>
          <Card title="24小时人流趋势分析" style={{ height: '400px' }}>
            <Line
              {...{
                data: trafficData.flatMap(item => [
                  { time: item.time, value: item.inFlow, type: '入流' },
                  { time: item.time, value: item.outFlow, type: '出流' },
                  { time: item.time, value: item.density, type: '密度' },
                ]),
                xField: 'time',
                yField: 'value',
                seriesField: 'type',
                smooth: true,
                height: 300,
              }}
            />
          </Card>
        </Col>

        {/* AI分析建议 */}
        <Col xs={24} lg={8}>
          <Card title="AI大模型分析建议" style={{ height: '400px' }}>
            <List
              dataSource={aiRecommendations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                        icon={getTypeIcon(item.type)}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag color={getPriorityColor(item.priority)}>
                          {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                        </Tag>
                      </Space>
                    }
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 消费节点综合评分排行 */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="消费节点综合评分排行">
            <Table
              dataSource={nodeRankings}
              columns={nodeColumns}
              pagination={false}
              rowKey="nodeId"
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataScreen;