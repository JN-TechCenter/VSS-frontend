import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Slider,
  Upload,
  Button,
  Row,
  Col,
  Space
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormFieldConfig } from './types';

interface FormBuilderProps {
  fields: FormFieldConfig[];
  form: any;
  onFinish: (values: any) => void;
  loading?: boolean;
  initialValues?: Record<string, any>;
  submitText?: string;
  showSubmit?: boolean;
  layout?: 'horizontal' | 'vertical' | 'inline';
  actions?: React.ReactNode;
}

const { TextArea } = Input;
const { Option } = Select;

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  form,
  onFinish,
  loading = false,
  initialValues = {},
  submitText = '保存',
  showSubmit = true,
  layout = 'vertical',
  actions
}) => {
  const renderField = (field: FormFieldConfig) => {
    const { type, options, props = {} } = field;

    switch (type) {
      case 'input':
        return <Input {...props} />;
      
      case 'textarea':
        return <TextArea {...props} />;
      
      case 'number':
        return <InputNumber style={{ width: '100%' }} {...props} />;
      
      case 'select':
        return (
          <Select {...props}>
            {options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'switch':
        return <Switch {...props} />;
      
      case 'slider':
        return <Slider {...props} />;
      
      case 'upload':
        return (
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        );
      
      default:
        return <Input {...props} />;
    }
  };

  const renderFormItem = (field: FormFieldConfig) => {
    const { name, label, required, rules = [], span = 24 } = field;
    
    const formRules = required 
      ? [{ required: true, message: `请输入${label}` }, ...rules]
      : rules;

    const formItem = (
      <Form.Item
        name={name}
        label={label}
        rules={formRules}
        valuePropName={field.type === 'switch' ? 'checked' : 'value'}
      >
        {renderField(field)}
      </Form.Item>
    );

    return span === 24 ? formItem : (
      <Col span={span} key={field.name}>
        {formItem}
      </Col>
    );
  };

  const groupedFields = fields.reduce((acc, field) => {
    if (field.span === 24) {
      acc.push([field]);
    } else {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup && lastGroup.every(f => f.span !== 24)) {
        const totalSpan = lastGroup.reduce((sum, f) => sum + (f.span || 24), 0);
        if (totalSpan + (field.span || 24) <= 24) {
          lastGroup.push(field);
        } else {
          acc.push([field]);
        }
      } else {
        acc.push([field]);
      }
    }
    return acc;
  }, [] as FormFieldConfig[][]);

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      {groupedFields.map((group, groupIndex) => {
        if (group.length === 1 && group[0].span === 24) {
          return renderFormItem(group[0]);
        }
        return (
          <Row gutter={16} key={groupIndex}>
            {group.map(field => renderFormItem(field))}
          </Row>
        );
      })}
      
      {(showSubmit || actions) && (
        <Form.Item>
          <Space>
            {showSubmit && (
              <Button type="primary" htmlType="submit" loading={loading}>
                {submitText}
              </Button>
            )}
            {actions}
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default FormBuilder;