import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useTasks, useObjectives } from '@/hooks/use-normalise-store';
import { useGraphLayout } from '@/hooks/use-graph-layout';
import { CustomNode } from '@/components/graph/CustomNode';
import { Card } from '@/components/ui/card';

// node types
const nodeTypes = {
  objective: CustomNode,
  task: CustomNode,
};

export function GraphView() {
  const allTasks = useTasks();
  const allObjectives = useObjectives();
  const { nodes, edges } = useGraphLayout(allTasks, allObjectives);

  return (
    <Card className="h-[80vh] w-full">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </Card>
  );
}
