/**
 * @file Dialog for an add task form
 * @todo Move initialFormData to a /data folder
 */

// -- Imports --
import { useState, useEffect } from 'react';
import type { TaskStatus, TaskFormData } from '@/types/taskTypes';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { TaskForm } from '../forms/TaskForm';

// -- Type Definition --
interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// -- Constant --
const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  objectiveId: 'unassigned',
  tags: '',
};

/**
 * React function returning a dialog of an add task form
 * @param open - boolean if dialog is open or not
 * @param onOpenChange - Function determining if dialog should be open or not
 * @returns
 */
export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  // -- States --
  const { addTask } = useAppStore();
  const [formData, setFormData] = useState(initialFormData);

  // Reset form when dialog is closed, with a delay to account for animations
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFormData(initialFormData);
      }, 150);
    }
  }, [open]);

  /**
   * Helper function to handle the logic when a user clicks submit
   */
  const handleSubmit = () => {
    // Create the final task object
    const newTaskPayload = {
      ...formData,
      status: 'todo' as TaskStatus,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
    };
    addTask(newTaskPayload); // Send the final task object to the store
    onOpenChange(false); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new task to your list.
          </DialogDescription>
        </DialogHeader>
        <TaskForm formData={formData} setFormData={setFormData} />
        <Button onClick={handleSubmit} className="w-full">
          Add Task
        </Button>
      </DialogContent>
    </Dialog>
  );
}
