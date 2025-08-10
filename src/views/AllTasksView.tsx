// -- Imports --
import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import type { Task, TaskStatus, TaskPriority } from '@/types/taskTypes';
import { TaskStats } from '@/components/task/TaskStats';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskList } from '@/components/task/TaskList';
import { EditTaskDialog } from '@/components/modals/EditTaskDialog';
import { AddTaskDialog } from '@/components/modals/AddTaskDialog';

type FilterValues = {
  searchTerm: string;
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
};

export function AllTasksView() {
  // Global state
  const tasksObject = useAppStore((state) => state.tasks);
  const tasks = useMemo(() => Object.values(tasksObject), [tasksObject]);

  const objectivesObject = useAppStore((state) => state.objectives);
  const objectives = useMemo(
    () => Object.values(objectivesObject),
    [objectivesObject]
  );

  const { setShowAddTaskDialog, showAddTaskDialog } = useAppStore();

  // -- Local state --
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: 'all' as TaskStatus | 'all',
    priorityFilter: 'all' as TaskPriority | 'all',
  });
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditDialogOpen, setisEditDialogOpen] = useState(false);

  // -- Helper Functions --
  const handleFiltersChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setTaskToEdit(task);
    setisEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setTaskToEdit(null);
    }
    setisEditDialogOpen(isOpen);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const matchesStatus =
        filters.statusFilter === 'all' || task.status === filters.statusFilter;
      const matchesPriority =
        filters.priorityFilter === 'all' ||
        task.priority === filters.priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  return (
    <div className="space-y-6">
      <div className="mt-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold">all tasks.</h1>
        <Button onClick={() => setShowAddTaskDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <TaskStats />
      <TaskFilters onFiltersChange={handleFiltersChange} />
      <TaskList
        tasks={filteredTasks}
        objectives={objectives}
        onEdit={handleEditTask}
      />

      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
      />

      <EditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
