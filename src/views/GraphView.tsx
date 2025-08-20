// FILE: /src/views/GraphView.tsx

import { useTasks, useObjectives } from '@/hooks/use-normalise-store';
import { useGraphLayout } from '@/hooks/use-graph-layout';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'; // Import the new component
import { Card } from '@/components/ui/card';

export function GraphView() {
  const allTasks = useTasks();
  const allObjectives = useObjectives();

  const { nodes, edges } = useGraphLayout(allTasks, allObjectives);

  return (
    <Card className="h-[80vh] w-full">
      <KnowledgeGraph nodes={nodes} edges={edges} />
    </Card>
  );
}
