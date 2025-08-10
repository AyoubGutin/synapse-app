/**
 * @file Renders a task items, and makes additional task items based on a task's subtasks
 * @todo Logic of rendering subtasks might need to change depending on how the db is structured -> current structure may create duplicate subtasks
 * @todo Rethink the 'add' button for tasks without a subtask, maybe add a toggle and skeleton under it with an add button on that skeleton
 * @todo Split out some logic here, maybe TaskItemOptions, so TaskItem can be scalable? Not a prio
 * @todo change this logic to accomdate for single task items, another component will be responsbiel for taking tsaskITem and making it subtask compatible
 *  This is because taskItem should be one singular task.
 * @todo allow taskItem to be clicked, which can show a dialog w/ extended info.
 */

// -- Imports --
import type { Task, TaskPriority } from '@/types/taskTypes';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Calendar,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';
import { useTasks } from '@/hooks/use-normalise-store';

// -- Type Definitions --
interface TaskItemProps {
  task: Task;
  onExpand: (taskId: string) => void;
  isExpanded: boolean;
  onEdit: (task: Task) => void;
}

/**
 * React function to render a task item with its subtasks, as a list element
 * @param task - A Task object, which holds information about a task entitiy
 * @param onExpand - Function that is called when the user expands a task item to show subtasks
 * @param isExpanded - Boolean to check if a task item is expanded
 * @param onEdit - Function called when user wants to edit a task
 * @returns
 */
export function TaskItem({
  task,
  onExpand,
  isExpanded,
  onEdit,
}: TaskItemProps) {
  const tasks = useTasks();
  const { toggleTaskStatus, deleteTask } = useAppStore();

  // -- Constants --
  const subtasks = useMemo(
    () => tasks.filter((sub) => sub.parentId === task.id),
    [tasks, task.id]
  );

  const hasSubtasks = subtasks.length > 0;

  // -- Helper Functions --
  const getPriorityColour = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-slate-400';
    }
  };
  // function would be passed from parent, for now it will log to console
  const handleAddSubtask = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Add subtask');
    // this would open 'Add Task' dialog and prefill parentId
  };

  return (
    <li
      className={cn(
        'border-b-3 border-muted transition-all duration-300',
        task.parentId ? 'ml-8 border-none' : '' // style if its a child
      )}
    >
      <div className="group flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-6 h-6 flex items-center justify-center">
            {/* If a subtask : */}
            {hasSubtasks ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(task.id);
                }}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </Button>
            ) : (
              // If no subtasks, render a plus button that appears on hover, to add a task - add task not implemeneted yet
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddSubtask}
                className="p-0 h-auto text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
          {/* Checkbox to toggle a tasks status */}
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={() => toggleTaskStatus(task.id)}
            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" // line through the title if checked
          />
          <span
            className={cn(
              'flex-1',
              task.status === 'completed'
                ? 'line-through text-muted-foreground'
                : ''
            )}
          >
            {task.title}
          </span>
        </div>
        {/* tags, dates, kebab, etc */}
        <div className="flex items-center gap-2">
          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {/* Show the due date of a task */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {/* Show the task priority */}
          {task.priority && (
            <div
              className={`w-2 h-2 rounded-full ${getPriorityColour(
                task.priority
              )}`}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => deleteTask(task.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* If a task has subtasks, and a task item is expanded, render the subtasks as new task items */}
      {hasSubtasks && (
        <div
          className={`grid transition-all duration-200 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <ul className="ml-11 overflow-hidden">
            {subtasks.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                onExpand={onExpand}
                isExpanded={isExpanded}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
