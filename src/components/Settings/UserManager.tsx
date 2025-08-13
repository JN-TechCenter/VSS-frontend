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
  Avatar,
  Typography,
  Tag,
  Badge,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import FormBuilder from './FormBuilder';
import DataTable from './DataTable';
import StatCard from './StatCard';
import { SystemUser, FormFieldConfig, ColumnConfig, ActionConfig, StatCardConfig } from './types';

interface UserManagerProps {
  tabKey?: string;
  isActive?: boolean;
}

const { Text } = Typography;

const UserManager: React.FC<UserManagerProps> = ({ isActive }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  // 表单字段配置
  const formFields: FormFieldConfig[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      span: 12,
      props: { placeholder: '请输入用户名' }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
      span: 12,
      props: { placeholder: '请输入邮箱地址', type: 'email' }
    },
    {
      name: 'phone',
      label: '手机号',
      type: 'input',
      span: 12,
      props: { placeholder: '请输入手机号' }
    },
    {
      name: 'department',
      label: '部门',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '销售部', value: 'sales' }
      ]
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '操作员', value: 'operator' },
        { label: '观察员', value: 'viewer' }
      ]
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      required: true,
      span: 12,
      options: [
        { label: '正常', value: 'active' },
        { label: '禁用', value: 'disabled' },
        { label: '锁定', value: 'locked' }
      ]
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      required: !editingUser,
      span: 12,
      props: { placeholder: editingUser ? '留空则不修改密码' : '请输入密码' }
    },
    {
      name: 'confirmPassword',
      label: '确认密码',
      type: 'password',
      required: !editingUser,
      span: 12,
      props: { placeholder: '请再次输入密码' },
      dependencies: ['password'],
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的密码不一致'));
          },
        }),
      ]
    }
  ];

  // 表格列配置
  const columns: ColumnConfig[] = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: SystemUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{username}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => {
        const deptMap = {
          tech: { text: '技术部', color: 'blue' },
          product: { text: '产品部', color: 'green' },
          operation: { text: '运营部', color: 'orange' },
          sales: { text: '销售部', color: 'purple' }
        };
        const deptInfo = deptMap[department as keyof typeof deptMap] || { text: department, color: 'default' };
        return <Tag color={deptInfo.color}>{deptInfo.text}</Tag>;
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleMap = {
          admin: { text: '管理员', color: 'red' },
          operator: { text: '操作员', color: 'blue' },
          viewer: { text: '观察员', color: 'default' }
        };
        const roleInfo = roleMap[role as keyof typeof roleMap] || { text: role, color: 'default' };
        return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { text: '正常', status: 'success' as const },
          disabled: { text: '禁用', status: 'default' as const },
          locked: { text: '锁定', status: 'error' as const }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, status: 'default' as const };
        return <Badge status={statusInfo.status} text={statusInfo.text} />;
      }
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
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
      key: 'lock',
      label: '锁定/解锁',
      icon: <LockOutlined />,
      onClick: handleToggleLock,
      render: (record: SystemUser) => (
        <Popconfirm
          title={`确定要${record.status === 'locked' ? '解锁' : '锁定'}该用户吗？`}
          onConfirm={() => handleToggleLock(record)}
        >
          <Button 
            size="small" 
            icon={record.status === 'locked' ? <UnlockOutlined /> : <LockOutlined />}
          >
            {record.status === 'locked' ? '解锁' : '锁定'}
          </Button>
        </Popconfirm>
      )
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
      title: '总用户数',
      value: users.length,
      color: '#1890ff'
    },
    {
      title: '正常用户',
      value: users.filter(u => u.status === 'active').length,
      color: '#52c41a'
    },
    {
      title: '禁用用户',
      value: users.filter(u => u.status === 'disabled').length,
      color: '#faad14'
    },
    {
      title: '锁定用户',
      value: users.filter(u => u.status === 'locked').length,
      color: '#ff4d4f'
    }
  ];

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers: SystemUser[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@vss.com',
          phone: '13800138001',
          department: 'tech',
          role: 'admin',
          status: 'active',
          createTime: '2025-01-01 10:00:00',
          lastLogin: '2025-08-13 15:30:00'
        },
        {
          id: '2',
          username: 'operator1',
          email: 'operator1@vss.com',
          phone: '13800138002',
          department: 'product',
          role: 'operator',
          status: 'active',
          createTime: '2025-02-15 14:20:00',
          lastLogin: '2025-08-13 14:15:00'
        },
        {
          id: '3',
          username: 'viewer1',
          email: 'viewer1@vss.com',
          phone: '13800138003',
          department: 'operation',
          role: 'viewer',
          status: 'disabled',
          createTime: '2025-03-20 16:45:00',
          lastLogin: '2025-08-10 09:30:00'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      message.error('获取用户列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存用户
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 移除确认密码字段
      const { confirmPassword, ...userData } = values;
      
      if (editingUser) {
        const updatedUsers = users.map(user =>
          user.id === editingUser.id
            ? { ...user, ...userData }
            : user
        );
        setUsers(updatedUsers);
        message.success('用户更新成功');
      } else {
        const newUser: SystemUser = {
          id: Date.now().toString(),
          ...userData,
          createTime: new Date().toLocaleString(),
          lastLogin: '-'
        };
        setUsers([...users, newUser]);
        message.success('用户创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  function handleEdit(record: SystemUser) {
    setEditingUser(record);
    const { password, ...userWithoutPassword } = record;
    form.setFieldsValue(userWithoutPassword);
    setModalVisible(true);
  }

  function handleDelete(record: SystemUser) {
    setUsers(users.filter(user => user.id !== record.id));
    message.success('用户删除成功');
  }

  function handleToggleLock(record: SystemUser) {
    const newStatus = record.status === 'locked' ? 'active' : 'locked';
    const updatedUsers = users.map(user =>
      user.id === record.id
        ? { ...user, status: newStatus }
        : user
    );
    setUsers(updatedUsers);
    message.success(`用户${newStatus === 'locked' ? '锁定' : '解锁'}成功`);
  }

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  useEffect(() => {
    if (isActive) {
      fetchUsers();
    }
  }, [isActive]);

  const tableExtra = (
    <Space>
      <Button 
        icon={<ReloadOutlined />}
        onClick={fetchUsers}
        loading={loading}
      >
        刷新
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        添加用户
      </Button>
    </Space>
  );

  const roleDistribution = [
    {
      title: '管理员',
      value: users.filter(u => u.role === 'admin').length,
      color: '#ff4d4f'
    },
    {
      title: '操作员',
      value: users.filter(u => u.role === 'operator').length,
      color: '#1890ff'
    },
    {
      title: '观察员',
      value: users.filter(u => u.role === 'viewer').length,
      color: '#52c41a'
    }
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card style={{ marginBottom: 16 }}>
            <DataTable
              dataSource={users}
              columns={columns}
              actions={actions}
              loading={loading}
              title="用户列表"
              extra={tableExtra}
            />
          </Card>
        </Col>
        <Col span={8}>
          <StatCard
            title="用户统计"
            stats={stats}
            loading={loading}
            style={{ marginBottom: 16 }}
          />
          <StatCard
            title="角色分布"
            stats={roleDistribution}
            loading={loading}
          />
        </Col>
      </Row>

      {/* 用户编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <FormBuilder
          fields={formFields}
          form={form}
          onFinish={handleSave}
          loading={loading}
          initialValues={editingUser || { status: 'active', role: 'viewer', department: 'tech' }}
          submitText={editingUser ? '更新用户' : '创建用户'}
        />
      </Modal>
    </div>
  );
};

export default UserManager;