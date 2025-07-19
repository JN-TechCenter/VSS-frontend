import React, { useState } from 'react';

const defaultFields = [
  { label: '用户名', type: 'text', name: 'username' },
  { label: '密码', type: 'password', name: 'password' }
];

export default function FormDesigner() {
  const [fields, setFields] = useState(defaultFields);

  // 添加字段
  const addField = () => {
    setFields([...fields, { label: '新字段', type: 'text', name: `field${fields.length}` }]);
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>表单设计器（低代码）</h3>
      <button onClick={addField}>添加字段</button>
      <form style={{ marginTop: 16 }}>
        {fields.map((f, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <label>{f.label}</label>
            <input type={f.type} name={f.name} style={{ marginLeft: 8 }} />
          </div>
        ))}
      </form>
      <h4>表单配置 JSON：</h4>
      <pre>{JSON.stringify(fields, null, 2)}</pre>
    </div>
  );
}
