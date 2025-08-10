/**
 * @file Custom hook to manage logic for task completion, including subtask confirmation flow.

 */

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { useTasks } from '@/hooks/use-normalise-store';
import type { Task } from '@/types/taskTypes';

export function useTaskCompletion() {
  const allTasks = useTasks();
  const {
    toggleTaskStatus,
    completeTaskWithSubtasks,
    subtaskCompletionPreference,
    setSubtaskCompletionPreference,
  } = useAppStore();

  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  const handleToggleCompletion = useCallback(
    (task: Task) => {
      // If un-completing a task, just toggle it
      if (task.status === 'completed') {
        toggleTaskStatus(task.id);
        return;
      }

      const incompleteSubtasks = allTasks.filter(
        (t) => t.parentId === task.id && t.status !== 'completed'
      );

      // If no subtasks or preference is set to 'never', just complete the parent
      if (
        incompleteSubtasks.length === 0 ||
        subtaskCompletionPreference === 'never'
      ) {
        toggleTaskStatus(task.id);
        return;
      }

      // If preference is 'always', complete all
      if (subtaskCompletionPreference === 'always') {
        completeTaskWithSubtasks(task.id);
        return;
      }

      // Otherwise, ask the user
      setTaskToComplete(task);
    },
    [
      allTasks,
      toggleTaskStatus,
      completeTaskWithSubtasks,
      subtaskCompletionPreference,
    ]
  );

  const handleConfirmCompleteAll = (rememberChoice: boolean) => {
    if (taskToComplete) {
      if (rememberChoice) {
        setSubtaskCompletionPreference('always');
      }
      completeTaskWithSubtasks(taskToComplete.id);
      setTaskToComplete(null);
    }
  };

  const handleConfirmCompleteParentOnly = (rememberChoice: boolean) => {
    if (taskToComplete) {
      if (rememberChoice) {
        setSubtaskCompletionPreference('never');
      }
      toggleTaskStatus(taskToComplete.id);
      setTaskToComplete(null);
    }
  };

  // Return the handler and the props for the dialog in a clean package
  return {
    handleToggleCompletion,
    completionDialogProps: {
      open: !!taskToComplete,
      onOpenChange: () => setTaskToComplete(null),
      taskTitle: taskToComplete?.title || '',
      onConfirmCompleteAll: handleConfirmCompleteAll,
      onConfirmCompleteParentOnly: handleConfirmCompleteParentOnly,
    },
  };
}
