import React from 'react';
import ReactFlow, {
  Controls,
  type Node,
  type Edge,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';

const nodeTypes = {
  objective: CustomNode,
  task: CustomNode,
};

interface KnowledgeGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export const KnowledgeGraph = ({ nodes, edges }: KnowledgeGraphProps) => {
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Controls showInteractive={false} />
        <Background />
      </ReactFlow>
    </div>
  );
};
