import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  Switch,
  Space,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Typography,
  Alert,
  Slider,
  InputNumber,
  Upload,
  Progress,
  Descriptions,
  Divider,
} from 'antd';
import {
  ExperimentOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface LLMConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'gemini' | 'local';
  model: string;
  apiKey?: string;
  endpoint?: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  description: string;
  usage: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
  };
}

interface VisionModel {
  id: string;
  name: string;
  type: 'detection' | 'tracking' | 'classification' | 'segmentation';
  framework: 'yolo' | 'tensorflow' | 'pytorch' | 'onnx';
  version: string;
  accuracy: number;
  speed: number; // FPS
  modelSize: number; // MB
  status: 'active' | 'inactive' | 'training' | 'deploying';
  description: string;
  parameters: {
    confidence: number;
    nmsThreshold: number;
    inputSize: [number, number];
    batchSize: number;
  };
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    inference_time: number;
  };
}

interface ProcessingCluster {
  id: string;
  name: string;
  nodeCount: number;
  totalGPU: number;
  availableGPU: number;
  cpuUsage: number;
  memoryUsage: number;
  status: 'running' | 'stopped' | 'error' | 'scaling';
  models: string[];
  throughput: number; // streams per second
  description: string;
}

const ModelConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('llm');
  const [llmConfigs, setLLMConfigs] = useState<LLMConfig[]>([]);
  const [visionModels, setVisionModels] = useState<VisionModel[]>([]);
  const [processingClusters, setProcessingClusters] = useState<ProcessingCluster[]>([]);
  const [llmModalVisible, setLLMModalVisible] = useState(false);
  const [visionModalVisible, setVisionModalVisible] = useState(false);
  const [clusterModalVisible, setClusterModalVisible] = useState(false);
  const [editingLLM, setEditingLLM] = useState<LLMConfig | null>(null);
  const [editingVision, setEditingVision] = useState<VisionModel | null>(null);
  const [editingCluster, setEditingCluster] = useState<ProcessingCluster | null>(null);
  const [llmForm] = Form.useForm();
  const [visionForm] = Form.useForm();
  const [clusterForm] = Form.useForm();

  useEffect(() => {
    fetchLLMConfigs();
    fetchVisionModels();
    fetchProcessingClusters();
  }, []);

  const fetchLLMConfigs = async () => {
    const mockLLMConfigs: LLMConfig[] = [
      {
        id: '1',
        name: 'GPT-4 分析引擎',
        provider: 'openai',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2048,
        enabled: true,
        description: '用于复杂数据分析和决策建议',
        usage: {
          totalRequests: 15420,
          successRate: 98.5,
          avgResponseTime: 1200,
        },
      },
      {
        id: '2',
        name: 'Claude 助手',
        provider: 'claude',
        model: 'claude-3-sonnet',
        temperature: 0.5,
        maxTokens: 1024,
        enabled: false,
        description: '备用分析引擎',
        usage: {
          totalRequests: 3200,
          successRate: 97.2,
          avgResponseTime: 800,
        },
      },
    ];
    setLLMConfigs(mockLLMConfigs);
  };

  const fetchVisionModels = async () => {
    const mockVisionModels: VisionModel[] = [
      {
        id: '1',
        name: 'YOLOv8-人体检测',
        type: 'detection',
        framework: 'yolo',
        version: '8.0.0',
        accuracy: 94.2,
        speed: 45,
        modelSize: 22.5,
        status: 'active',
        description: '高精度人体检测模型',
        parameters: {
          confidence: 0.5,
          nmsThreshold: 0.4,
          inputSize: [640, 640],
          batchSize: 8,
        },
        performance: {
          precision: 0.942,
          recall: 0.891,
          f1Score: 0.916,
          inference_time: 22.3,
        },
      },
      {
        id: '2',
        name: 'DeepSORT-追踪',
        type: 'tracking',
        framework: 'pytorch',
        version: '1.0.0',
        accuracy: 89.7,
        speed: 30,
        modelSize: 45.2,
        status: 'active',
        description: '多目标追踪模型',
        parameters: {
          confidence: 0.6,
          nmsThreshold: 0.5,
          inputSize: [416, 416],
          batchSize: 4,
        },
        performance: {
          precision: 0.897,
          recall: 0.863,
          f1Score: 0.880,
          inference_time: 33.1,
        },
      },
    ];
    setVisionModels(mockVisionModels);
  };

  const fetchProcessingClusters = async () => {
    const mockClusters: ProcessingCluster[] = [
      {
        id: '1',
        name: '主处理集群',
        nodeCount: 4,
        totalGPU: 8,
        availableGPU: 6,
        cpuUsage: 65,
        memoryUsage: 72,
        status: 'running',
        models: ['YOLOv8-人体检测', 'DeepSORT-追踪'],
        throughput: 24,
        description: '主要视频流处理集群',
      },
      {
        id: '2',
        name: '备用集群',
        nodeCount: 2,
        totalGPU: 4,
        availableGPU: 4,
        cpuUsage: 15,
        memoryUsage: 28,
        status: 'stopped',
        models: [],
        throughput: 0,
        description: '备用处理集群',
      },
    ];
    setProcessingClusters(mockClusters);
  };

  const handleLLMSubmit = async (values: any) => {
    try {
      if (editingLLM) {
        setLLMConfigs(llmConfigs.map(l => l.id === editingLLM.id ? { ...l, ...values } : l));
        message.success('LLM配置更新成功');
      } else {
        const newLLM: LLMConfig = {
          id: Date.now().toString(),
          ...values,
          usage: {
            totalRequests: 0,
            successRate: 0,
            avgResponseTime: 0,
          },
        };
        setLLMConfigs([...llmConfigs, newLLM]);
        message.success('LLM配置添加成功');
      }
      setLLMModalVisible(false);
      setEditingLLM(null);
      llmForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleVisionSubmit = async (values: any) => {
    try {
      if (editingVision) {
        setVisionModels(visionModels.map(v => v.id === editingVision.id ? { ...v, ...values } : v));
        message.success('视觉模型更新成功');
      } else {
        const newVision: VisionModel = {
          id: Date.now().toString(),
          ...values,
          status: 'inactive',
          parameters: {
            confidence: 0.5,
            nmsThreshold: 0.4,
            inputSize: [640, 640],
            batchSize: 8,
          },
          performance: {
            precision: 0,
            recall: 0,
            f1Score: 0,
            inference_time: 0,
          },
        };
        setVisionModels([...visionModels, newVision]);
        message.success('视觉模型添加成功');
      }
      setVisionModalVisible(false);
      setEditingVision(null);
      visionForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const llmColumns: ColumnsType<LLMConfig> = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: string) => {
        const providerConfig = {
          openai: { color: 'green', text: 'OpenAI' },
          claude: { color: 'blue', text: 'Claude' },
          gemini: { color: 'orange', text: 'Gemini' },
          local: { color: 'purple', text: '本地' },
        };
        const config = providerConfig[provider as keyof typeof providerConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '成功率',
      dataIndex: ['usage', 'successRate'],
      key: 'successRate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          status={rate >= 95 ? 'success' : rate >= 90 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingLLM(record);
              llmForm.setFieldsValue(record);
              setLLMModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={record.enabled ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => {
              const updatedConfigs = llmConfigs.map(l => 
                l.id === record.id ? { ...l, enabled: !l.enabled } : l
              );
              setLLMConfigs(updatedConfigs);
              message.success(`${record.enabled ? '禁用' : '启用'}成功`);
            }}
          >
            {record.enabled ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定要删除这个LLM配置吗？"
            onConfirm={() => {
              setLLMConfigs(llmConfigs.filter(l => l.id !== record.id));
              message.success('删除成功');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const visionColumns: ColumnsType<VisionModel> = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          detection: { color: 'blue', text: '检测' },
          tracking: { color: 'green', text: '追踪' },
          classification: { color: 'orange', text: '分类' },
          segmentation: { color: 'purple', text: '分割' },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '框架',
      dataIndex: 'framework',
      key: 'framework',
      render: (framework: string) => framework.toUpperCase(),
    },
    {
      title: '精度',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy: number) => `${accuracy}%`,
    },
    {
      title: '速度',
      dataIndex: 'speed',
      key: 'speed',
      render: (speed: number) => `${speed} FPS`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '运行中' },
          inactive: { color: 'red', text: '未激活' },
          training: { color: 'blue', text: '训练中' },
          deploying: { color: 'orange', text: '部署中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingVision(record);
              visionForm.setFieldsValue(record);
              setVisionModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => {
              const newStatus = record.status === 'active' ? 'inactive' : 'active';
              const updatedModels = visionModels.map(v => 
                v.id === record.id ? { ...v, status: newStatus } : v
              );
              setVisionModels(updatedModels);
              message.success(`模型${newStatus === 'active' ? '激活' : '停用'}成功`);
            }}
          >
            {record.status === 'active' ? '停用' : '激活'}
          </Button>
          <Popconfirm
            title="确定要删除这个视觉模型吗？"
            onConfirm={() => {
              setVisionModels(visionModels.filter(v => v.id !== record.id));
              message.success('删除成功');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const clusterColumns: ColumnsType<ProcessingCluster> = [
    {
      title: '集群名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '节点数',
      dataIndex: 'nodeCount',
      key: 'nodeCount',
    },
    {
      title: 'GPU使用',
      key: 'gpu',
      render: (_, record) => `${record.totalGPU - record.availableGPU}/${record.totalGPU}`,
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpuUsage',
      key: 'cpuUsage',
      render: (usage: number) => (
        <Progress
          percent={usage}
          size="small"
          status={usage >= 90 ? 'exception' : usage >= 70 ? 'normal' : 'success'}
        />
      ),
    },
    {
      title: '吞吐量',
      dataIndex: 'throughput',
      key: 'throughput',
      render: (throughput: number) => `${throughput} 流/秒`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          running: { color: 'green', text: '运行中' },
          stopped: { color: 'red', text: '已停止' },
          error: { color: 'red', text: '错误' },
          scaling: { color: 'blue', text: '扩容中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCluster(record);
              clusterForm.setFieldsValue(record);
              setClusterModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={record.status === 'running' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => {
              const newStatus = record.status === 'running' ? 'stopped' : 'running';
              const updatedClusters = processingClusters.map(c => 
                c.id === record.id ? { ...c, status: newStatus } : c
              );
              setProcessingClusters(updatedClusters);
              message.success(`集群${newStatus === 'running' ? '启动' : '停止'}成功`);
            }}
          >
            {record.status === 'running' ? '停止' : '启动'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        节点模型配置
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="语言大模型" key="llm" icon={<ExperimentOutlined />}>
          <Card
            title="数据分析大脑配置"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingLLM(null);
                  llmForm.resetFields();
                  setLLMModalVisible(true);
                }}
              >
                添加LLM
              </Button>
            }
          >
            <Alert
              message="语言大模型配置"
              description="配置作为数据分析大脑的语言大模型，用于智能分析和决策建议生成。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Table
              dataSource={llmConfigs}
              columns={llmColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="视觉模型" key="vision" icon={<EyeOutlined />}>
          <Card
            title="视觉智能模型配置"
            extra={
              <Space>
                <Button icon={<UploadOutlined />}>导入模型</Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingVision(null);
                    visionForm.resetFields();
                    setVisionModalVisible(true);
                  }}
                >
                  添加模型
                </Button>
              </Space>
            }
          >
            <Alert
              message="视觉模型配置"
              description="配置视频流处理集群所需的视觉模型，包括检测、追踪、分类等多种类型。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Table
              dataSource={visionModels}
              columns={visionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="处理集群" key="cluster" icon={<SettingOutlined />}>
          <Card
            title="视频流处理集群"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCluster(null);
                  clusterForm.resetFields();
                  setClusterModalVisible(true);
                }}
              >
                添加集群
              </Button>
            }
          >
            <Alert
              message="处理集群配置"
              description="管理视频流处理集群的配置和状态，包括GPU资源分配和模型部署。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Table
              dataSource={processingClusters}
              columns={clusterColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* LLM配置模态框 */}
      <Modal
        title={editingLLM ? '编辑LLM配置' : '添加LLM配置'}
        open={llmModalVisible}
        onCancel={() => {
          setLLMModalVisible(false);
          setEditingLLM(null);
          llmForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={llmForm}
          layout="vertical"
          onFinish={handleLLMSubmit}
        >
          <Form.Item label="模型名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="提供商" name="provider" rules={[{ required: true }]}>
                <Select>
                  <Option value="openai">OpenAI</Option>
                  <Option value="claude">Claude</Option>
                  <Option value="gemini">Gemini</Option>
                  <Option value="local">本地</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="模型" name="model" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="温度" name="temperature">
                <Slider min={0} max={2} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="最大Token" name="maxTokens">
                <InputNumber min={1} max={8192} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="API密钥" name="apiKey">
            <Input.Password />
          </Form.Item>
          <Form.Item label="端点URL" name="endpoint">
            <Input />
          </Form.Item>
          <Form.Item label="启用状态" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingLLM ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setLLMModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 视觉模型配置模态框 */}
      <Modal
        title={editingVision ? '编辑视觉模型' : '添加视觉模型'}
        open={visionModalVisible}
        onCancel={() => {
          setVisionModalVisible(false);
          setEditingVision(null);
          visionForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={visionForm}
          layout="vertical"
          onFinish={handleVisionSubmit}
        >
          <Form.Item label="模型名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="模型类型" name="type" rules={[{ required: true }]}>
                <Select>
                  <Option value="detection">检测</Option>
                  <Option value="tracking">追踪</Option>
                  <Option value="classification">分类</Option>
                  <Option value="segmentation">分割</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="框架" name="framework" rules={[{ required: true }]}>
                <Select>
                  <Option value="yolo">YOLO</Option>
                  <Option value="tensorflow">TensorFlow</Option>
                  <Option value="pytorch">PyTorch</Option>
                  <Option value="onnx">ONNX</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="版本" name="version">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="精度(%)" name="accuracy">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="速度(FPS)" name="speed">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="模型文件">
            <Upload>
              <Button icon={<CloudUploadOutlined />}>上传模型文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingVision ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setVisionModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 处理集群配置模态框 */}
      <Modal
        title={editingCluster ? '编辑处理集群' : '添加处理集群'}
        open={clusterModalVisible}
        onCancel={() => {
          setClusterModalVisible(false);
          setEditingCluster(null);
          clusterForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={clusterForm}
          layout="vertical"
          onFinish={(values) => {
            // 处理集群配置提交逻辑
            message.success('集群配置保存成功');
            setClusterModalVisible(false);
          }}
        >
          <Form.Item label="集群名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="节点数量" name="nodeCount">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="GPU总数" name="totalGPU">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCluster ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setClusterModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelConfig;