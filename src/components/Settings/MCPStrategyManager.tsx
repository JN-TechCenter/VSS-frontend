import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  message,
  Form,
  Row,
  Col,
  Alert,
  Progress,
  Typography,
  Upload,
  Input,
  Tag,
  Badge
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ApiOutlined,
  UploadOutlined
} from '@ant-design/icons';
import FormBuilder from './FormBuilder';
import DataTable from './DataTable';
import StatCard from './StatCard';
import { MCPStrategy, FormFieldConfig, ColumnConfig, ActionConfig, StatCardConfig } from './types';

interface MCPStrategyManagerProps {
  tabKey?: string;
  isActive?: boolean;
}

const { Text } = Typography;

const MCPStrategyManager: React.FC<MCPStrategyManagerProps> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [strategies, setStrategies] = useState<MCPStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<MCPStrategy | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelValidation, setModelValidation] = useState({
    loading: false,
    valid: false,
    message: ''
  });

  // 表单字段配置
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: '策略名称',
      type: 'input',
      required: true,
      span: 12,
      props: { placeholder: '请输入策略名称' }
    },
    {
      name: 'type',
      label: '策略类型',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '缺陷检测', value: 'detection' },
        { label: '分类识别', value: 'classification' },
        { label: '图像分割', value: 'segmentation' }
      ]
    },
    {
      name: 'description',
      label: '策略描述',
      type: 'textarea',
      required: true,
      props: { rows: 3, placeholder: '请输入策略描述' }
    },
    {
      name: 'modelPath',
      label: '模型路径',
      type: 'input',
      required: true,
      span: 16,
      props: { placeholder: '/models/your_model.onnx' }
    },
    {
      name: 'confidence',
      label: '置信度阈值',
      type: 'number',
      required: true,
      span: 8,
      props: {
        min: 0.1,
        max: 1.0,
        step: 0.05,
        formatter: (value: number) => `${((value || 0) * 100).toFixed(0)}%`,
        parser: (value: string) => parseFloat(value?.replace('%', '') || '0') / 100
      }
    },
    {
      name: 'enabled',
      label: '启用状态',
      type: 'switch',
      span: 12,
      props: { checkedChildren: '启用', unCheckedChildren: '禁用' }
    }
  ];

  // 表格列配置
  const columns: ColumnConfig[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          detection: { text: '缺陷检测', color: 'blue' },
          classification: { text: '分类识别', color: 'green' },
          segmentation: { text: '图像分割', color: 'orange' }
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      }
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => `${(confidence * 100).toFixed(0)}%`
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Badge 
          status={enabled ? 'success' : 'default'} 
          text={enabled ? '启用' : '禁用'} 
        />
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    }
  ];

  // 操作配置
  const actions: ActionConfig[] = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: handleEdit
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete
    }
  ];

  // 统计配置
  const stats: StatCardConfig[] = [
    {
      title: '总策略数',
      value: strategies.length,
      color: '#1890ff'
    },
    {
      title: '启用策略',
      value: strategies.filter(s => s.enabled).length,
      color: '#52c41a'
    },
    {
      title: '禁用策略',
      value: strategies.filter(s => !s.enabled).length,
      color: '#ff4d4f'
    }
  ];

  // 获取策略列表
  const fetchStrategies = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockStrategies: MCPStrategy[] = [
        {
          id: '1',
          name: '缺陷检测策略',
          description: '用于检测产品表面缺陷的AI模型策略',
          type: 'detection',
          modelPath: '/models/defect_detection.onnx',
          confidence: 0.85,
          enabled: true,
          createTime: '2025-01-01 10:00:00',
          updateTime: '2025-08-13 15:30:00'
        },
        {
          id: '2',
          name: '分类识别策略',
          description: '用于产品分类识别的AI模型策略',
          type: 'classification',
          modelPath: '/models/classification.onnx',
          confidence: 0.90,
          enabled: true,
          createTime: '2025-02-15 14:20:00',
          updateTime: '2025-08-10 09:15:00'
        },
        {
          id: '3',
          name: '图像分割策略',
          description: '用于图像分割处理的AI模型策略',
          type: 'segmentation',
          modelPath: '/models/segmentation.onnx',
          confidence: 0.75,
          enabled: false,
          createTime: '2025-03-20 16:45:00',
          updateTime: '2025-07-25 11:30:00'
        }
      ];
      setStrategies(mockStrategies);
    } catch (error) {
      message.error('获取MCP策略失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存策略
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingStrategy) {
        const updatedStrategies = strategies.map(strategy =>
          strategy.id === editingStrategy.id
            ? { ...strategy, ...values, updateTime: new Date().toLocaleString() }
            : strategy
        );
        setStrategies(updatedStrategies);
        message.success('策略更新成功');
      } else {
        const newStrategy: MCPStrategy = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        };
        setStrategies([...strategies, newStrategy]);
        message.success('策略创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingStrategy(null);
      setPreviewVisible(false);
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  function handleEdit(record: MCPStrategy) {
    setEditingStrategy(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  }

  function handleDelete(record: MCPStrategy) {
    setStrategies(strategies.filter(strategy => strategy.id !== record.id));
    message.success('策略删除成功');
  }

  const handleAdd = () => {
    setEditingStrategy(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();
    setSelectedStrategy(values);
    setPreviewVisible(true);
  };

  const handleModelUpload = () => {
    setUploadProgress(0);
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          message.success('模型上传成功');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleModelValidation = () => {
    setModelValidation({ loading: true, valid: false, message: '' });
    setTimeout(() => {
      setModelValidation({ 
        loading: false, 
        valid: true, 
        message: '模型验证通过' 
      });
      message.success('模型验证通过');
    }, 1500);
  };

  useEffect(() => {
    if (isActive) {
      fetchStrategies();
    }
  }, [isActive]);

  const tableExtra = (
    <Space>
      <Button 
        icon={<ReloadOutlined />}
        onClick={fetchStrategies}
        loading={loading}
      >
        刷新
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        添加策略
      </Button>
    </Space>
  );

  const modalActions = (
    <>
      <Button 
        onClick={handlePreview}
        icon={<ApiOutlined />}
      >
        预览
      </Button>
      <Button onClick={() => setModalVisible(false)}>
        取消
      </Button>
    </>
  );

  const statsFooter = (
    <div style={{ textAlign: 'center' }}>
      <Text type="secondary">
        平均置信度: {strategies.length > 0 ? 
          `${(strategies.reduce((sum, s) => sum + s.confidence, 0) / strategies.length * 100).toFixed(1)}%` : 
          '0%'
        }
      </Text>
    </div>
  );

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card style={{ marginBottom: 16 }}>
            <DataTable
              dataSource={strategies}
              columns={columns}
              actions={actions}
              loading={loading}
              title="MCP策略列表"
              extra={tableExtra}
            />
          </Card>
        </Col>
        <Col span={8}>
          <StatCard
            title="策略统计"
            stats={stats}
            loading={loading}
            footer={statsFooter}
            style={{ marginBottom: 16 }}
          />
          <Card title="模型配置">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>模型存储路径</Text>
                <br />
                <Text type="secondary">/models/</Text>
              </div>
              <div>
                <Text strong>支持格式</Text>
                <br />
                <Tag>ONNX</Tag>
                <Tag>TensorRT</Tag>
                <Tag>PyTorch</Tag>
              </div>
              <div>
                <Text strong>推理引擎</Text>
                <br />
                <Badge status="success" text="ONNX Runtime" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 策略编辑模态框 */}
      <Modal
        title={editingStrategy ? '编辑MCP策略' : '添加MCP策略'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {/* 实时预览区域 */}
        {previewVisible && (
          <Alert
            message="策略预览"
            description={
              <div>
                <p><strong>策略名称:</strong> {selectedStrategy?.name || '未设置'}</p>
                <p><strong>策略类型:</strong> {selectedStrategy?.type || '未设置'}</p>
                <p><strong>置信度:</strong> {selectedStrategy?.confidence ? `${(selectedStrategy.confidence * 100).toFixed(0)}%` : '未设置'}</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setPreviewVisible(false)}
          />
        )}

        <FormBuilder
          fields={formFields}
          form={form}
          onFinish={handleSave}
          loading={loading}
          initialValues={editingStrategy || { type: 'detection', confidence: 0.85, enabled: true }}
          submitText={editingStrategy ? '更新策略' : '创建策略'}
          actions={modalActions}
        />

        {/* 文件上传和验证区域 */}
        <Card size="small" title="模型管理" style={{ marginTop: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Upload
                accept=".onnx,.pt,.pth,.trt"
                showUploadList={false}
                beforeUpload={() => {
                  handleModelUpload();
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>上传模型</Button>
              </Upload>
              <Button 
                icon={<ApiOutlined />}
                onClick={handleModelValidation}
                loading={modelValidation.loading}
              >
                验证模型
              </Button>
            </Space>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Progress percent={uploadProgress} size="small" />
            )}
            
            {modelValidation.message && (
              <Text type={modelValidation.valid ? 'success' : 'danger'}>
                {modelValidation.message}
              </Text>
            )}
          </Space>
        </Card>
      </Modal>
    </div>
  );
};

export default MCPStrategyManager;