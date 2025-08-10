/**
 * @file A list of tasks
 * @todo JSDoc for the helper function
 * @todo Finish comments
 * @todo make helper function of rendering the Objective Folder w/ Task Items as duplicates
 */

// -- Imports --
import { TaskItem } from './TaskItem';
import type { Task } from '@/types/taskTypes';
import type { Objective } from '@/types/objectivesTypes';
import { ChevronRight } from 'lucide-react';
import { Folder } from 'lucide-react';
import { useCallback, useState } from 'react';

// -- Type Definitions --
interface TaskListProps {
  tasks: Task[];
  objectives: Objective[];
  onEdit: (task: Task) => void;
}

// -- Helper Functions --
const ObjectiveFolder = ({ title, taskCount, isOpen, onToggle }: any) => (
  <div
    onClick={onToggle}
    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 rounded-lg"
  >
    <ChevronRight
      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
        isOpen ? 'rotate-90' : ''
      }`}
    />
    <Folder className="h-5 w-5 text-muted-foreground" />
    <h3 className="font-semibold">{title}</h3>
    <span className="text-sm text-muted-foreground">({taskCount})</span>
  </div>
);

/**
 * React function to render a list of tasks
 * @param tasks - tasks to be displayed
 * @param objectives - The objectives a user has
 * @param onEdit - Function called when a user wants to edit a task, this is passed into TaskItem
 * @returns
 */
export function TaskList({ tasks, objectives, onEdit }: TaskListProps) {
  // -- States --
  const [openObjectives, setOpenObjectives] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // -- Helper Functions --
  const toggleObjective = useCallback((objectiveId: string) => {
    setOpenObjectives((prev) => {
      const newSet = new Set(prev);
      newSet.has(objectiveId)
        ? newSet.delete(objectiveId)
        : newSet.add(objectiveId);
      return newSet;
    });
  }, []);
  const toggleTaskExpansion = useCallback((taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  }, []);

  // -- Constants --
  const unassignedTasks = tasks.filter(
    (task) => !task.objectiveId && !task.parentId // if not child + no objective id
  );

  return (
    <div className="rounded-lg border-accent bg-card p-2 space-y-2">
      {/* Section for tasks without an objective */}
      {unassignedTasks.length > 0 && (
        <div>
          <ObjectiveFolder
            title="Quick Tasks"
            taskCount={unassignedTasks.length}
            isOpen={openObjectives.has('unassigned')}
            onToggle={() => toggleObjective('unassigned')}
          />
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openObjectives.has('unassigned')
                ? 'grid-rows-[1fr]'
                : 'grid-rows-[0fr]'
            }`}
          >
            <ul className="overflow-hidden pl-6">
              {unassignedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onExpand={toggleTaskExpansion}
                  isExpanded={expandedTasks.has(task.id)}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sections for each objective */}
      {objectives.map((obj) => {
        // Filter for top-level tasks belonging to this objective
        const objectiveTopLevelTasks = tasks.filter(
          (task) => task.objectiveId === obj.id && !task.parentId
        );

        if (objectiveTopLevelTasks.length === 0) return null;

        const isOpen = openObjectives.has(obj.id);
        return (
          <div key={obj.id}>
            <ObjectiveFolder
              title={obj.title}
              taskCount={objectiveTopLevelTasks.length}
              isOpen={isOpen}
              onToggle={() => toggleObjective(obj.id)}
            />
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <ul className="overflow-hidden pl-6">
                {objectiveTopLevelTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onExpand={toggleTaskExpansion}
                    isExpanded={expandedTasks.has(task.id)}
                    onEdit={onEdit}
                  />
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
