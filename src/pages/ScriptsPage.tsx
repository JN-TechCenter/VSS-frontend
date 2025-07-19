import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Space, Upload, message, Layout, Menu, Typography, Drawer, Form, Input, Select, InputNumber } from 'antd';
import {
  UploadOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  GatewayOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  FieldNumberOutlined,
  SyncOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { VisionPlatformAPI } from '../api/client';

const { Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const api = new VisionPlatformAPI();

const initialNodes: Node[] = [
  { id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: { label: '视频流输入' } },
  { id: 'n2', type: 'output', position: { x: 400, y: 0 }, data: { label: '输出' } },
];

const initialEdges: Edge[] = [];

let id = 3;
const getId = () => `n${id++}`;

const ScriptsPage: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [form] = Form.useForm();

  // 拖拽连线
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  // 拖拽节点: 拖入画布
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = reactFlowInstance.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    const newNode: Node = { id: getId(), type: 'default', position, data: { label: `${type}` } };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleImportPyScript = (file: File) => {
    // 在这里处理Python脚本的导入逻辑
    message.success(`${file.name} 导入成功，正在解析...`);
    return false; // 阻止 antd 的默认上传行为
  };

  const fetchScripts = async () => {
    try {
      const res = await api.getScripts();
      // 这里可以根据实际情况更新节点和边
      // 例如：setNodes(res.data.nodes); setEdges(res.data.edges);
    } catch (e) {
      message.error('加载脚本列表失败');
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleSave = async () => {
    try {
      // 这里需要将节点和边的数据保存到后端
      // 例如：await api.saveScripts({ nodes, edges });
      message.success('保存成功');
      // fetchScripts(); // 保存后可以重新加载脚本
    } catch (e) {
      message.error('保存失败');
    }
  };

  const handleRun = async () => {
    try {
      // 这里需要实现执行脚本的逻辑
      // 例如：await api.runScript(selectedScriptId);
      message.success('执行成功');
    } catch (e) {
      message.error('执行失败');
    }
  };

  const addNode = (type: string) => {
    const newNode: Node = { id: getId(), type: 'default', position: { x: 150, y: 100 }, data: { label: type } };
    setNodes((nds) => nds.concat(newNode));
  };

  // 点击节点时弹出属性编辑
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // 当选中节点变化时，更新表单初始值
  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        label: selectedNode.data.label,
        source: selectedNode.data.source,
        config: selectedNode.data.config,
        operator: selectedNode.data.operator,
        value: selectedNode.data.value,
        varName: selectedNode.data.varName,
        iteration: selectedNode.data.iteration,
        target: selectedNode.data.target,
      });
    } else {
      form.resetFields();
    }
  }, [selectedNode]);

  // 保存编辑
  const handleDrawerSave = () => {
    const values = form.getFieldsValue();
    setNodes((nds) => nds.map(n => {
      if (n.id === selectedNode?.id) {
        return {
          ...n,
          data: {
            ...n.data,
            ...values,
          }
        };
      }
      return n;
    }));
    setSelectedNode(null);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Sider width={200} style={{ background: '#f7f7f7', padding: 10 }}>
        <Title level={5}>节点面板</Title>
        <Menu selectable={false} mode="inline" style={{ border: 0 }}>
          <Menu.Item icon={<GatewayOutlined />} onClick={() => addNode('数据源')} onDragStart={(e) => onDragStart(e, '数据源')} draggable>
            数据源
          </Menu.Item>
          <Menu.Item icon={<ApartmentOutlined />} onClick={() => addNode('处理')} onDragStart={(e) => onDragStart(e, '处理')} draggable>
            处理节点
          </Menu.Item>
          <Menu.Item icon={<BranchesOutlined />} onClick={() => addNode('分支')} onDragStart={(e) => onDragStart(e, '分支')} draggable>
            条件分支
          </Menu.Item>
          <Menu.Item icon={<FieldNumberOutlined />} onClick={() => addNode('变量')} onDragStart={(e) => onDragStart(e, '变量')} draggable>
            变量存储
          </Menu.Item>
          <Menu.Item icon={<SyncOutlined />} onClick={() => addNode('循环')} onDragStart={(e) => onDragStart(e, '循环')} draggable>
            循环
          </Menu.Item>
          <Menu.Item icon={<LogoutOutlined />} onClick={() => addNode('输出')} onDragStart={(e) => onDragStart(e, '输出')} draggable>
            输出
          </Menu.Item>
        </Menu>
      </Sider>
      <Content ref={reactFlowWrapper} style={{ height: '100%', position: 'relative' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
        <Drawer
          title="节点属性"
          visible={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          footer={<Button type="primary" onClick={handleDrawerSave}>保存</Button>}
          width={300}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="label" label="标签">
              <Input />
            </Form.Item>
            {/* 数据源节点 */}
            {selectedNode?.data.label === '数据源' && (
              <Form.Item name="source" label="数据来源">
                <Input placeholder="例如：摄像头1" />
              </Form.Item>
            )}
            {/* 处理节点 */}
            {selectedNode?.data.label === '处理' && (
              <Form.Item name="config" label="处理配置">
                <Input placeholder="例如：阈值0.5" />
              </Form.Item>
            )}
            {/* 条件分支节点 */}
            {selectedNode?.data.label === '分支' && (
              <>
                <Form.Item name="operator" label="比较运算符">
                  <Select>
                    <Option value=">">大于（&gt;）</Option>
                    <Option value="<">小于（&lt;）</Option>
                    <Option value="==">等于（==）</Option>
                    <Option value="!=">不等于（!=）</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="value" label="比较值">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}
            {/* 变量存储节点 */}
            {selectedNode?.data.label === '变量' && (
              <Form.Item name="varName" label="变量名称">
                <Input placeholder="例如：count" />
              </Form.Item>
            )}
            {/* 循环节点 */}
            {selectedNode?.data.label === '循环' && (
              <Form.Item name="iteration" label="迭代次数">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            )}
            {/* 输出节点 */}
            {selectedNode?.data.label === '输出' && (
              <Form.Item name="target" label="输出目标">
                <Input placeholder="例如：日志" />
              </Form.Item>
            )}
          </Form>
        </Drawer>
      </Content>
    </Layout>
  );
};

export default ScriptsPage;
