/**
 * @file Dialog for an edit task form
 * @todo Move intialFormData to /data, like with AddTaskDialog
 */

// -- Imports --
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import type { Task, TaskFormData } from '@/types/taskTypes';
import { TaskForm } from '../forms/TaskForm';

// -- Type Definitions --
interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit: Task | null;
}

// -- Constants --
const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  objectiveId: 'unassigned',
  tags: '',
};

/**
 * React function returning a dialog of an edit task form
 * @param open - boolean if dialog is open
 * @param onOpenChange - function to determine if dialog should be open
 * @param taskToEdit - The task to edit, which contains the data required to prefill the form
 * @returns
 */
export function EditTaskDialog({
  open,
  onOpenChange,
  taskToEdit,
}: EditTaskDialogProps) {
  // -- States --
  const { updateTask } = useAppStore(); // get the update function from the store
  const [formData, setFormData] = useState<TaskFormData>(initialFormData); // tracks form data

  // If taskToEdit, or Open changes, set the formdata as the current taskToEdit data.
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate || '',
        priority: taskToEdit.priority || 'medium',
        objectiveId: taskToEdit.objectiveId || 'unassigned',
        tags: taskToEdit.tags ? taskToEdit.tags.join(', ') : '',
      });
    } else {
      // Reset form if no task is being edited (e.g., when dialog closes)
      setTimeout(() => {
        setFormData(initialFormData);
      }, 150);
    }
  }, [taskToEdit, open]);

  const handleSubmit = () => {
    if (taskToEdit) {
      const updatedTask: Task = {
        ...taskToEdit,
        ...formData,
        // Convert tags string back to array for the update
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };
      updateTask(updatedTask);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>edit task.</DialogTitle>
          <DialogDescription>
            make changes to your task here. click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <TaskForm formData={formData} setFormData={setFormData} />
        <Button onClick={handleSubmit} className="w-full">
          save.
        </Button>
      </DialogContent>
    </Dialog>
  );
}
