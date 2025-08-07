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
  subtasks?: Omit<Task, 'subtasks' | 'description' | 'tags' | 'dueDate'>[];
  objectiveId?: string;
}

// Define the shape of the form data
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  objectiveId: string;
  tags: string;
}
