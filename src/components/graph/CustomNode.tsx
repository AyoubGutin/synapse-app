import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle2, Circle } from 'lucide-react'; // Import icons

const nodeStyles = {
  task: {
    padding: '10px 15px',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    minWidth: '150px',
  },
  objective: {
    padding: '12px 20px',
    borderRadius: '0.5rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    fontWeight: 'bold',
    fontSize: '15px',
  },
};

const priorityColors = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

export const CustomNode = ({ data, type }) => {
  const style = nodeStyles[type] || nodeStyles.task;

  return (
    <div style={style}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Status Icon */}
        {data.status === 'completed' ? (
          <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
        ) : (
          <Circle size={16} style={{ color: '#9ca3af' }} />
        )}

        <span>{data.label}</span>

        {/* Priority Dot */}
        {data.priority && (
          <div
            style={{
              marginLeft: 'auto',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: priorityColors[data.priority],
            }}
          />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
};
