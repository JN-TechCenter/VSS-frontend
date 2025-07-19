import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Typography, Avatar, Space, Table, message, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  CameraOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  AlertOutlined,
  ToolOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Line, Pie, Heatmap } from '@ant-design/charts';
import { VisionPlatformAPI } from '../../api/client';
import { TrendData, DefectStatistics, HeatmapData, Device, Detection, DashboardStats } from '../../api/types';

const { Title, Text } = Typography;

const getStatusTag = (status: string) => {
  switch (status) {
    case 'online':
      return <Tag color="success">在线</Tag>;
    case 'offline':
      return <Tag color="error">离线</Tag>;
    case 'maintenance':
      return <Tag color="warning">维护中</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Partial<DashboardStats>>({});
  const [username, setUsername] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendData['chartData']>([]);
  const [defectData, setDefectData] = useState<DefectStatistics['defectTypes']>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData['heatmapData']>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const api = new VisionPlatformAPI();

  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, trendRes, defectRes, heatmapRes, devicesRes, detectionsRes] = await Promise.all([
          api.getDashboardStats(),
          api.getTrendData(),
          api.getDefectStatistics(),
          api.getHeatmapData(),
          api.getDevices(),
          api.getDetections({ page: 1, limit: 5, sortBy: 'timestamp', order: 'desc' })
        ]);
        setStats(statsRes.data);
        setTrendData(trendRes.data.chartData);
        setDefectData(defectRes.data.defectTypes);
        setHeatmapData(heatmapRes.data.heatmapData);
        setDevices(devicesRes.data);
        setRecentDetections(detectionsRes.data.items);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        message.error('加载仪表盘数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (title: string) => {
    message.info(`点击了 "${title}" 卡片，可以跳转到详细页面`);
  };

  const detectionColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (ts: string) => new Date(ts).toLocaleTimeString(),
      width: 100
    },
    {
      title: '产品编号',
      dataIndex: 'productId', 
      key: 'productId',
      width: 120
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string, record: any) => (
        <Tag color={record.status === 'success' ? 'green' : 'red'}>
          {result}
        </Tag>
      ),
      width: 80
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => `${confidence}%`,
      width: 80
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="正在加载仪表盘数据..." />
      </div>
    );
  }

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          🔍 机器视觉数据分析平台 - 数据概览
        </Title>
        <Text type="secondary">{username ? `欢迎，${username}！` : '实时监控系统运行状态和检测数据'}</Text>
      </div>

      {/* 顶部统计卡片区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            onClick={() => handleCardClick('今日检测总量')}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '12px'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: 8 }}>今日检测总量</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 4 }}>{stats.todayDetections?.total ?? 'N/A'}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {stats.todayDetections?.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stats.todayDetections?.change ?? ''} 比昨日
                </div>
              </div>
              <CameraOutlined style={{ fontSize: '48px', opacity: 0.7 }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            onClick={() => handleCardClick('异常检出率')}
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '12px'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: 8 }}>异常检出率</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 4 }}>{stats.defectRate?.rate ?? 'N/A'}%</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {stats.defectRate?.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stats.defectRate?.change ?? ''} 比昨日
                </div>
              </div>
              <BugOutlined style={{ fontSize: '48px', opacity: 0.7 }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            onClick={() => handleCardClick('平均处理时长')}
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '12px'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: 8 }}>平均处理时长</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 4 }}>{stats.avgProcessTime?.time ?? 'N/A'}{stats.avgProcessTime?.unit}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {stats.avgProcessTime?.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stats.avgProcessTime?.change ?? ''} 比昨日
                </div>
              </div>
              <ClockCircleOutlined style={{ fontSize: '48px', opacity: 0.7 }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            onClick={() => handleCardClick('设备在线状态')}
            style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '12px'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: 8 }}>设备在线状态</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 4 }}>{stats.deviceStatus?.online ?? 'N/A'}/{stats.deviceStatus?.total ?? 'N/A'}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  <CheckCircleOutlined /> {stats.deviceStatus?.rate ?? 'N/A'}% 在线率
                </div>
              </div>
              <Progress 
                type="circle" 
                percent={stats.deviceStatus?.rate ?? 0} 
                size={50}
                strokeColor="rgba(255,255,255,0.9)"
                trailColor="rgba(255,255,255,0.3)"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 中间图表和数据区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <EyeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                检测趋势分析
              </span>
            } 
            bordered={false} 
            style={{ height: 420, borderRadius: '12px' }}
          >
            <Line 
              data={trendData}
              height={320}
              xField="time"
              yField="detections"
              seriesField="category"
              point={{ size: 5, shape: 'diamond' }}
              tooltip={{ showMarkers: true }}
              yAxis={{ title: { text: '检测数量' } }}
              xAxis={{ title: { text: '时间' } }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <AlertOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                异常类型分布
              </span>
            } 
            bordered={false} 
            style={{ height: 420, borderRadius: '12px' }}
          >
            <Pie
              data={defectData}
              height={320}
              angleField="count"
              colorField="type"
              radius={0.8}
              label={{
                type: 'inner',
                offset: '-50%',
                content: '{value}',
                style: {
                  textAlign: 'center',
                  fontSize: 14,
                },
              }}
              interactions={[{ type: 'element-selected' }, { type: 'element-active' }]}
              legend={{ layout: 'horizontal', position: 'bottom' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部详细信息区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span>
                <ToolOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                检测活动热力图
              </span>
            } 
            bordered={false} 
            style={{ height: 420, borderRadius: '12px' }}
          >
            <Heatmap
              data={heatmapData}
              height={320}
              xField="day"
              yField="hour"
              colorField="detections"
              color={['#d6e4ff', '#b7d2ff', '#94bfff', '#6eaaff', '#4091ff', '#1875f0']}
              meta={{
                day: { type: 'cat' },
                hour: { type: 'cat' },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <span>
                <UserOutlined style={{ marginRight: 8, color: '#13c2c2' }} />
                实时状态监控
              </span>
            } 
            bordered={false} 
            style={{ height: 420, borderRadius: '12px' }}
          >
            <div style={{ height: '320px', overflowY: 'auto' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* 设备状态 */}
                <div style={{ marginBottom: 20 }}>
                  <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
                    🎥 设备运行状态
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {devices.map(device => (
                      <div key={device.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{device.name}</Text>
                        {getStatusTag(device.status)}
                      </div>
                    ))}
                  </Space>
                </div>

                {/* 最近检测记录 */}
                <div style={{ marginBottom: 20 }}>
                  <Title level={5} style={{ marginBottom: 12, color: '#fa8c16' }}>
                    📋 最近检测记录
                  </Title>
                  <Table 
                    dataSource={recentDetections}
                    columns={detectionColumns}
                    pagination={false}
                    size="small"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* 操作员信息 */}
                <div>
                  <Title level={5} style={{ marginBottom: 12, color: '#13c2c2' }}>
                    👥 当前值班人员
                  </Title>
                  <Space>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar style={{ backgroundColor: '#87d068', marginBottom: 4 }}>张</Avatar>
                      <div style={{ fontSize: '10px', color: '#666' }}>张师傅</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar style={{ backgroundColor: '#1890ff', marginBottom: 4 }}>李</Avatar>
                      <div style={{ fontSize: '10px', color: '#666' }}>李工程师</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar style={{ backgroundColor: '#f56a00', marginBottom: 4 }}>王</Avatar>
                      <div style={{ fontSize: '10px', color: '#666' }}>王主管</div>
                    </div>
                  </Space>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;