/**
 * @file The last stage of the generate tasks for an objective dialog. Provides a preview
 * @todo Possibly allow user to expand the graph to play around with it.
 */

// -- Imports --
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph';
import type { Task } from '@/types/taskTypes';
import { useGraphLayout } from '@/hooks/use-graph-layout';
import { useAppStore } from '@/store/appStore';
import type { Objective } from '@/types/objectivesTypes';

// -- Mock Data for PReview --
const mockGeneratedTasks: Omit<Task, 'id'>[] = [
  { title: 'Research Competitors', status: 'todo', priority: 'high' },
  { title: 'Outline Website Structure', status: 'todo', priority: 'medium' },
  {
    title: 'Design Wireframes',
    status: 'todo',
    priority: 'medium',
    parentId: 'temp-2',
  }, // Placeholder parentId
  {
    title: 'Develop Landing Page',
    status: 'todo',
    priority: 'high',
    parentId: 'temp-2',
  },
];

// Props for last stage of the dialog - the preview tasks
interface PreviewStageProps {
  onConfirm: (tasks: Omit<Task, 'id'>[]) => void; // Pass the task objects on confirm
  onEdit: () => void;
}

// -- PreviewStage --
/**
 * React function that is the last stage of the generate tasks for an objective dialog. It provides a visual map of the tasks generated, that is interactive, and lets a user confirm or go back to edit
 * @param onConfirm - Function that is called when the user clicks confirm
 * @param onEdit - Function that is called when the user clicks edit
 * @returns
 */
export function PreviewStage({ onConfirm, onEdit }: PreviewStageProps) {
  const mainObjectiveTitle = useAppStore((state) => state.mainObjective);

  // create a mock objective for the preview
  const mockObjective: Objective = {
    id: 'temp-objective',
    title: mainObjectiveTitle || 'New Objective',
    progress: 0,
    color: '#7c3aed',
  };

  // assign temporary IDs andmock objective ID to the tasks
  const tasksWithIds = mockGeneratedTasks.map((task, i) => ({
    ...task,
    id: `temp-${i + 1}`,
    objectiveId: mockObjective.id,
  }));

  // pass both the tasks and the mock objective to the hook
  const { nodes, edges } = useGraphLayout(tasksWithIds, [mockObjective]);
  return (
    <>
      <DialogHeader>
        <DialogTitle>preview your new tasks.</DialogTitle>
        <DialogDescription>
          here's a visual map of the tasks we generated for you.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 h-64 w-full rounded-lg border-2 border-dashed bg-muted">
        <KnowledgeGraph nodes={nodes} edges={edges} />
      </div>
      <div className="flex gap-2">
        <Button onClick={onEdit} variant="outline" className="flex-1">
          edit details.
        </Button>
        <Button
          onClick={() => onConfirm(mockGeneratedTasks)}
          className="flex-1"
        >
          confirm tasks.
        </Button>
      </div>
    </>
  );
}
