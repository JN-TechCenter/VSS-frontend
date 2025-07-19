import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Image, 
  List, 
  Timeline, 
  Button, 
  Select, 
  DatePicker, 
  Table, 
  Tag, 
  Progress, 
  Statistic, 
  Descriptions,
  Space,
  Typography,
  Tabs,
  Alert,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const Detail: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const detectionResults = [
    { 
      id: 1, 
      type: '缺陷检测', 
      result: '正常', 
      confidence: 98.5,
      status: 'success',
      details: '未发现表面缺陷'
    },
    { 
      id: 2, 
      type: '尺寸测量', 
      result: '超差', 
      confidence: 89.2,
      status: 'error',
      details: '长度超出标准范围 2.3mm'
    },
    { 
      id: 3, 
      type: '表面质量', 
      result: '正常', 
      confidence: 95.8,
      status: 'success',
      details: '表面光滑度符合要求'
    },
    { 
      id: 4, 
      type: '颜色检测', 
      result: '待确认', 
      confidence: 76.4,
      status: 'warning',
      details: '颜色偏差在临界值边缘'
    },
  ];

  const timelineData = [
    { time: '09:30:45.123', event: '图像采集开始', status: 'success' },
    { time: '09:30:45.890', event: '预处理完成', status: 'success' },
    { time: '09:30:46.234', event: '特征提取', status: 'success' },
    { time: '09:30:46.567', event: '模型推理', status: 'success' },
    { time: '09:30:46.789', event: '后处理完成', status: 'success' },
    { time: '09:30:47.012', event: '结果输出', status: 'success' },
  ];

  const historyData = [
    {
      key: '1',
      time: '2025-07-18 15:30:45',
      product: 'P001-240718-001',
      result: '合格',
      confidence: 98.5,
      defects: 0,
      status: 'success'
    },
    {
      key: '2',
      time: '2025-07-18 15:29:12',
      product: 'P001-240718-002',
      result: '不合格',
      confidence: 85.3,
      defects: 2,
      status: 'error'
    },
    {
      key: '3',
      time: '2025-07-18 15:27:38',
      product: 'P001-240718-003',
      result: '合格',
      confidence: 94.7,
      defects: 0,
      status: 'success'
    },
  ];

  const columns = [
    {
      title: '检测时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '产品编号',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '检测结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string, record: any) => (
        <Tag color={record.status === 'success' ? 'green' : 'red'}>
          {result}
        </Tag>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Progress 
          percent={confidence} 
          size="small" 
          status={confidence > 90 ? 'success' : confidence > 80 ? 'active' : 'exception'}
        />
      ),
    },
    {
      title: '缺陷数量',
      dataIndex: 'defects',
      key: 'defects',
      render: (defects: number) => (
        <Badge count={defects} color={defects > 0 ? 'red' : 'green'} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
          <Button size="small" icon={<DownloadOutlined />}>下载</Button>
        </Space>
      ),
    },
  ];

  const imageList = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY5NGZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+5Y6f5aeL5Zu+5YOP8J+Ttwk8L3RleHQ+Cjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTJjNDFhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+5aSE55CG5ZCO5Zu+5YOP8J+UjTwvdGV4dD4KPC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY0ZDRmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+5byC5bi45qCH6K6w8J+agDwvdGV4dD4KPC9zdmc+'
  ];

  const tabItems = [
    {
      key: '1',
      label: '检测结果',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message="检测完成"
              description="本次检测发现1个异常项目，请查看详细结果并采取相应措施。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Col>
          <Col span={24}>
            <List
              itemLayout="horizontal"
              dataSource={detectionResults}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button size="small" type="link">详情</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.status === 'success' ? 
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /> :
                      item.status === 'error' ?
                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} /> :
                        <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
                    }
                    title={
                      <Space>
                        <Text strong>{item.type}</Text>
                        <Tag color={
                          item.status === 'success' ? 'green' : 
                          item.status === 'error' ? 'red' : 'orange'
                        }>
                          {item.result}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{item.details}</div>
                        <Progress 
                          percent={item.confidence} 
                          size="small" 
                          style={{ marginTop: 8, width: 200 }}
                          format={(percent) => `置信度: ${percent}%`}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: '处理时间线',
      children: (
        <Timeline
          mode="left"
          items={timelineData.map((item, index) => ({
            color: item.status === 'success' ? 'green' : 'red',
            dot: item.status === 'success' ? <CheckCircleOutlined /> : <SyncOutlined spin />,
            children: (
              <div>
                <Text strong>{item.event}</Text>
                <br />
                <Text type="secondary">{item.time}</Text>
                {index < timelineData.length - 1 && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">
                      耗时: {(parseFloat(timelineData[index + 1]?.time.split(':')[2] || '0') - 
                              parseFloat(item.time.split(':')[2])).toFixed(3)}秒
                    </Text>
                  </div>
                )}
              </div>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 0 }}>
      {/* 控制面板 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>详细分析</Title>
          </Col>
          <Col flex="auto">
            <Space>
              <Select defaultValue="all" style={{ width: 120 }}>
                <Select.Option value="all">所有产品</Select.Option>
                <Select.Option value="qualified">合格</Select.Option>
                <Select.Option value="unqualified">不合格</Select.Option>
              </Select>
              <RangePicker />
              <Button type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Card title="检测图像" bordered={false}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Image
                width="100%"
                height={400}
                src={imageList[selectedImage]}
                placeholder="机器视觉检测图像"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <Row gutter={8}>
              {imageList.map((img, index) => (
                <Col span={8} key={index}>
                  <div 
                    style={{ 
                      border: selectedImage === index ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      width="100%"
                      height={80}
                      src={img}
                      preview={false}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        
        <Col span={10}>
          <Card title="产品信息" bordered={false} style={{ marginBottom: 16 }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="产品编号">P001-240718-001</Descriptions.Item>
              <Descriptions.Item label="检测时间">2025-07-18 15:30:45</Descriptions.Item>
              <Descriptions.Item label="生产线">生产线A</Descriptions.Item>
              <Descriptions.Item label="检测工位">工位02</Descriptions.Item>
              <Descriptions.Item label="操作员">张三</Descriptions.Item>
              <Descriptions.Item label="班次">白班</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="统计概览" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总检测项"
                  value={4}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="通过项"
                  value={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="异常项"
                  value={1}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="处理时长"
                  value={1.267}
                  precision={3}
                  suffix="秒"
                  prefix={<SyncOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 详细结果 */}
      <Card style={{ marginTop: 16 }}>
        <Tabs items={tabItems} />
      </Card>

      {/* 历史记录 */}
      <Card title="最近检测记录" style={{ marginTop: 16 }}>
        <Table 
          columns={columns} 
          dataSource={historyData} 
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Detail;
