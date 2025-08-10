// Task Type Definitions

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

// Task object
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  objectiveId?: string;
  parentId?: string;
}

// Define the shape of the form data
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  objectiveId: string;
  tags: string;
  parentId?: string;
}

export type SubtaskCompletionPreference = 'ask' | 'always' | 'never';
