import React from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Switch,
  Badge
} from 'antd';
import { ColumnConfig, ActionConfig } from './types';

interface DataTableProps {
  dataSource: any[];
  columns: ColumnConfig[];
  actions?: ActionConfig[];
  loading?: boolean;
  rowKey?: string;
  size?: 'small' | 'middle' | 'large';
  pagination?: any;
  onRow?: (record: any) => any;
  scroll?: { x?: number; y?: number };
  title?: string;
  extra?: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  dataSource,
  columns,
  actions = [],
  loading = false,
  rowKey = 'id',
  size = 'small',
  pagination = false,
  onRow,
  scroll,
  title,
  extra
}) => {
  // 渲染操作列
  const renderActions = (record: any) => {
    const visibleActions = actions.filter(action => 
      action.visible ? action.visible(record) : true
    );

    if (visibleActions.length === 0) return null;

    return (
      <Space size="small">
        {visibleActions.map(action => {
          const buttonProps = {
            key: action.key,
            size: 'small' as const,
            type: action.type || 'default' as const,
            danger: action.danger,
            icon: action.icon,
            loading: action.loading,
            onClick: () => action.onClick(record)
          };

          // 如果是危险操作，包装在确认框中
          if (action.danger) {
            return (
              <Popconfirm
                key={action.key}
                title={`确定要${action.label}吗？`}
                onConfirm={() => action.onClick(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button {...buttonProps}>
                  {action.label}
                </Button>
              </Popconfirm>
            );
          }

          return (
            <Button {...buttonProps}>
              {action.label}
            </Button>
          );
        })}
      </Space>
    );
  };

  // 构建表格列
  const tableColumns = [
    ...columns.map(col => ({
      ...col,
      render: col.render || ((value: any, record: any) => {
        // 默认渲染逻辑
        if (typeof value === 'boolean') {
          return value ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />;
        }
        if (Array.isArray(value)) {
          return value.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ));
        }
        return value;
      })
    })),
    // 如果有操作配置，添加操作列
    ...(actions.length > 0 ? [{
      title: '操作',
      key: 'actions',
      width: actions.length * 80 + 50,
      render: (_: any, record: any) => renderActions(record)
    }] : [])
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={tableColumns}
      loading={loading}
      rowKey={rowKey}
      size={size}
      pagination={pagination}
      onRow={onRow}
      scroll={scroll}
      title={title ? () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          {extra}
        </div>
      ) : undefined}
    />
  );
};

export default DataTable;