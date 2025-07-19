import React, { useState } from 'react';

const defaultScript = [
  { type: 'api', name: '登录', params: { url: '/api/login' } }
];

export default function ScriptDesigner() {
  const [script, setScript] = useState(defaultScript);

  // 添加API节点
  const addApiNode = () => {
    setScript([...script, { type: 'api', name: '新API', params: { url: '' } }]);
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>脚本设计器（无代码）</h3>
      <button onClick={addApiNode}>添加API节点</button>
      <ul style={{ marginTop: 16 }}>
        {script.map((node, idx) => (
          <li key={idx}>{node.name} - {node.params.url}</li>
        ))}
      </ul>
      <h4>脚本配置 JSON：</h4>
      <pre>{JSON.stringify(script, null, 2)}</pre>
    </div>
  );
}
