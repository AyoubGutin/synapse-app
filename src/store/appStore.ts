/**
 *  Defines the global state management for the entire application via Zustand
 * Centralises all core business logic and data, like tasks, objectives, and user activity
 * @todo rethinnk about mainObjective wording
 *
 *
 */
import { create } from 'zustand';
import type { Task, SubtaskCompletionPreference } from '@/types/taskTypes';
import type { Objective } from '@/types/objectivesTypes';
import type { ActivityItem, ActivityType } from '@/types/activityTypes';
import { v4 as uuidv4 } from 'uuid';

// -- Type Definitions for store --

/**
 * @interface AppState
 * @description Defines 'shape' of all data that will be stored in global state
 * Includes arrays of tasks and objective, as well as UI state variables
 */
interface AppState {
  tasks: { [taskId: string]: Task };
  objectives: { [objectiveId: string]: Objective };
  mainObjective: string; // text currently in main objective input field
  showAddTaskDialog: boolean; // controls visibility of 'Add Task' dialog
  isSidebarCollapsed: boolean; // tracks collapsed/expanded state of the nav sidebar
  activityLog: ActivityItem[]; // log of recent user actions
  subtaskCompletionPreference: SubtaskCompletionPreference;
}

/**
 * @interface AppActions
 * @description Defines all functions that can modify AppState
 */
interface AppActions {
  toggleTaskStatus: (taskId: string) => void;
  setMainObjective: (objective: string) => void;
  setShowAddTaskDialog: (show: boolean) => void;
  addTask: (newTask: Omit<Task, 'id'>) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  logActivity: (type: ActivityType, text: string) => void;
  addObjective: (
    newObjective: Omit<Objective, 'id' | 'progress' | 'color'>
  ) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  updateObjective: (updatedObjective: Objective) => void;
  deleteObjective: (objeciveId: string) => void;
  setSubtaskCompletionPreference: (
    preference: SubtaskCompletionPreference
  ) => void;
  completeTaskWithSubtasks: (taskId: string) => void;
}

/**
 * @function useAppStore
 * @description Main Zustand store for the app
 * Combines the state and actions into a single hook that can be used by any component
 * `set` is a function to update the state
 * `get` is a function to read current state
 */
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // --- Initial States ---
  // These would be fetched from a db instead
  objectives: {
    'f3b2a1c9-8e7d-4f6c-8a2b-1e988c7b6a5d': {
      // ID is the key
      id: 'f3b2a1c9-8e7d-4f6c-8a2b-1e988c7b6a5d',
      title: 'Synapse App',
      progress: 70,
      color: '#e0aaff',
    },
    'f3b2a1676c9-8e7d-4f6c-8a2b-1e9d8c7b6a5d': {
      // ID is the key
      id: 'f3b2a1676c9-8e7d-4f6c-8a2b-1e9d8c7b6a5d',
      title: 'Marketing Website',
      progress: 45,
      color: '#c77dff',
    },
  },

  tasks: {
    // This is now an object, not an array
    'd9a8b5c0-4f6e-4b8a-82f3-1c9d0e7a6b5c': {
      // ID is the key
      id: 'd9a8b5c0-4f6e-4b8a-82f3-1c9d0e7a6b5c',
      title: 'Learn French Grammar',
      description: 'Master French grammar fundamentals',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-08-15',
      tags: ['learning', 'french'],
      objectiveId: 'f3b2a1c9-8e7d-4f6c-8a2b-1e988c7b6a5d',
      parentId: undefined,
    },
    'dfij35c0-4ljf6e-4blja-8289hjf3-1c9ljb5c': {
      // ID is the key
      id: 'dfij35c0-4ljf6e-4blja-8289hjf3-1c9ljb5c',
      title: 'Study verb conjugations',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-08-10',
      objectiveId: 'f3b2a1c9-8e7d-4f6c-8a2b-1e988c7b6a5d',
      parentId: 'd9a8b5c0-4f6e-4b8a-82f3-1c9d0e7a6b5c',
    },
    '4b8a-82f3-1c9d0e7a6b5c-4b8a-82f3-1c9d0e7a6b5c': {
      // ID is the key
      id: '4b8a-82f3-1c9d0e7a6b5c-4b8a-82f3-1c9d0e7a6b5c',
      title: 'Build marketing website',
      status: 'completed',
      priority: 'high',
      objectiveId: 'f3b2a1676c9-8e7d-4f6c-8a2b-1e9d8c7b6a5d',
      parentId: undefined,
    },
  },
  mainObjective: '',
  expandedTasks: new Set(),
  showAddTaskDialog: false,
  isSidebarCollapsed: true,
  activityLog: [],
  subtaskCompletionPreference: 'ask',

  // --- State Actions ---

  // Setters for UI state - simple
  setMainObjective: (objective) => set({ mainObjective: objective }),
  setShowAddTaskDialog: (show) => set({ showAddTaskDialog: show }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setSubtaskCompletionPreference: (preference) =>
    set({ subtaskCompletionPreference: preference }),

  // Toggle sidebar collapsed state by reversing current value
  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  // Add a new task to tasks array
  addTask: (newTask) => {
    const newId = uuidv4();
    set((state) => ({
      // create new array with previous and new task appended w/ unique id
      tasks: {
        ...state.tasks,
        [newId]: { ...newTask, id: newId },
      },
    }));
  },

  // Update a exising task by creating a new array, replacing old task with updated one
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [updatedTask.id]: {
          ...state.tasks[updatedTask.id], // Keep existing properties
          ...updatedTask, // Overwrite with new ones
        },
      },
    })),

  // Delete a task from the tasks array, by making a new array filtering out old id
  deleteTask: (taskIdToDelete) =>
    set((state) => {
      const newTasks = { ...state.tasks };

      // Find all children and grandchildren via while loop to delete them too
      const tasksToDelete = new Set<string>([taskIdToDelete]);
      let childrenFound = true;
      while (childrenFound) {
        childrenFound = false;
        Object.values(newTasks).forEach((task) => {
          if (
            task.parentId &&
            tasksToDelete.has(task.parentId) &&
            !tasksToDelete.has(task.id)
          ) {
            tasksToDelete.add(task.id);
            childrenFound = true;
          }
        });
      }

      tasksToDelete.forEach((id) => delete newTasks[id]);

      return { tasks: newTasks };
    }),

  // Add a new objective to the objectives array
  addObjective: (newObjective) => {
    const newId = uuidv4();
    set((state) => ({
      objectives: {
        ...state.objectives,
        [newId]: {
          ...newObjective,
          id: newId,
          progress: 0,
          color: '#e0aaff',
        },
      },
    }));
  },

  // Delete an objective along with its tasks
  deleteObjective: (objectiveId) =>
    set((state) => {
      const newObjectives = { ...state.objectives };
      delete newObjectives[objectiveId];

      // Filter out tasks associated with the objectives
      const newTasks = Object.values(state.tasks).reduce((acc, task) => {
        if (task.objectiveId !== objectiveId) {
          acc[task.id] = task;
        }
        return acc;
      }, {} as { [taskId: string]: Task });

      return { objectives: newObjectives, tasks: newTasks };
    }),

  // Update an existing objective
  updateObjective: (updatedObjective) =>
    set((state) => ({
      objectives: {
        ...state.objectives,
        [updatedObjective.id]: {
          ...state.objectives[updatedObjective.id],
          ...updatedObjective,
        },
      },
    })),

  // Add a new entry to the activity log array
  logActivity: (type, text) => {
    const newActivity: ActivityItem = {
      id: uuidv4(),
      type,
      text,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ activityLog: [newActivity, ...state.activityLog] }));
  },

  completeTaskWithSubtasks: (taskId) =>
    set((state) => {
      const tasksToComplete = new Set<string>([taskId]);
      let childrenFound = true;
      while (childrenFound) {
        childrenFound = false;
        Object.values(state.tasks).forEach((task) => {
          if (
            task.parentId &&
            tasksToComplete.has(task.parentId) &&
            !tasksToComplete.has(task.id)
          ) {
            tasksToComplete.add(task.id);
            childrenFound = true;
          }
        });
      }

      const newTasks = { ...state.tasks };
      tasksToComplete.forEach((id) => {
        if (newTasks[id]) {
          newTasks[id] = { ...newTasks[id], status: 'completed' };
        }
      });

      return { tasks: newTasks };
    }),

  // Toggle completion status of a task and log the activity
  // Toggle completion status of a task and log the activity
  toggleTaskStatus: (taskId) => {
    const task = get().tasks[taskId];
    if (!task) return;

    if (task.status !== 'completed') {
      get().logActivity('TASK_COMPLETED', `Completed task: "${task.title}"`);
    }
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          status: task.status === 'completed' ? 'todo' : 'completed',
        },
      },
    }));
  },
}));
