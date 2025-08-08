/**
 *  Defines the global state management for the entire application via Zustand
 * Centralises all core business logic and data, like tasks, objectives, and user activity
 * @todo rethinnk about mainObjective wording
 *
 *
 */
import { create } from 'zustand';
import type { Task } from '@/types/taskTypes';
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
  tasks: Task[];
  objectives: Objective[];
  mainObjective: string; // text currently in main objective input field
  showAddTaskDialog: boolean; // controls visibility of 'Add Task' dialog
  isSidebarCollapsed: boolean; // tracks collapsed/expanded state of the nav sidebar
  activityLog: ActivityItem[]; // log of recent user actions
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
  tasks: [
    {
      id: 'd9a8b5c0-4f6e-4b8a-82f3-1c9d0e7a6b5c',
      title: 'Learn French Grammar',
      description: 'Master French grammar fundamentals',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-08-15',
      tags: ['learning', 'french'],
      subtasks: [
        {
          id: 'e1c7b4a2-9f8e-4c6d-8a3b-2f9e1d8c5b7a',
          title: 'Study verb conjugations',
          status: 'in-progress',
          priority: 'medium',
        },
      ],
    },
    {
      id: 'f3b2a1c9-8e7d-4f6c-8a2b-1e9d8c7b6a5d',
      title: 'Build Marketing Website',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-08-10',
      tags: ['work', 'development'],
      subtasks: [],
    },
  ],
  objectives: [
    {
      id: 'f3b2a1c9-8e7d-4f6c-8a2b-1e988c7b6a5d',
      title: 'Synapse App',
      progress: 70,
      color: '#e0aaff',
    },
    {
      id: 'f3b2a1676c9-8e7d-4f6c-8a2b-1e9d8c7b6a5d',
      title: 'Marketing Website',
      progress: 45,
      color: '#c77dff',
    },
  ],
  mainObjective: '',
  expandedTasks: new Set(),
  showAddTaskDialog: false,
  isSidebarCollapsed: true,
  activityLog: [],

  // --- State Actions ---

  // Setters for UI state - simple
  setMainObjective: (objective) => set({ mainObjective: objective }),
  setShowAddTaskDialog: (show) => set({ showAddTaskDialog: show }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  // Toggle sidebar collapsed state by reversing current value
  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  // Add a new task to tasks array
  addTask: (newTask) =>
    set((state) => ({
      // create new array with previous and new task appended w/ unique id
      tasks: [...state.tasks, { ...newTask, id: uuidv4() }],
    })),

  // Update a exising task by creating a new array, replacing old task with updated one
  updateTask: (updatedTask) =>
    set((state) => {
      const updateRecursively = (tasks: Task[]): Task[] =>
        tasks.map((task) => {
          if (task.id === updatedTask.id) {
            // if id matches a task, merge the task object with the uodated task
            return { ...task, ...updatedTask };
          }
          if (task.subtasks?.length) {
            // if a task has subtasks, apply the update recursively to the nested tasks
            const newSubtasks = updateRecursively(task.subtasks);
            if (newSubtasks !== task.subtasks) {
              return { ...task, subtasks: newSubtasks };
            }
          }
          return task;
        });

      return { tasks: updateRecursively(state.tasks) };
    }),

  updateObjective: (updatedObjective) =>
    set((state) => ({
      objectives: state.objectives.map((obj) =>
        obj.id === updatedObjective.id ? updatedObjective : obj
      ),
    })),

  // Delete a task from the tasks array, by making a new array filtering out old id
  deleteTask: (taskId) =>
    set((state) => {
      const deleteRecursively = (tasks: Task[]): Task[] => {
        // Check if the task to be deleted exists at the current level.
        const taskExistsAtThisLevel = tasks.some((task) => task.id === taskId); // .some checks if at least one item in array

        let newTasks = tasks; // this will hold the updated task array

        // If the task is at this level, filter it out.
        if (taskExistsAtThisLevel) {
          newTasks = tasks.filter((task) => task.id !== taskId);
        }

        // Now, map over the list to check subtasks.
        return newTasks.map((task) => {
          // If the task has subtasks, we need to recurse.
          if (task.subtasks) {
            const newSubtasks = deleteRecursively(task.subtasks);

            // This is the key: only create a new parent object if the subtasks array has actually changed.
            if (newSubtasks.length !== task.subtasks.length) {
              return { ...task, subtasks: newSubtasks };
            }
          }
          // If no changes occurred in the subtasks, return the original task object.
          return task;
        });
      };

      return { tasks: deleteRecursively(state.tasks) };
    }),

  // Add a new objective to the objectives array
  addObjective: (newObjective) =>
    set((state) => ({
      objectives: [
        ...state.objectives,
        // Default value for progress and colour
        { ...newObjective, id: uuidv4(), progress: 0, color: '#e0aaff' },
      ],
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

  // Toggle completion status of a task and log the activity
  toggleTaskStatus: (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);

    if (task && task.status !== 'completed') {
      get().logActivity('TASK_COMPLETED', `Completed task: "${task.title}"`);
    }
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'todo' : 'completed',
            }
          : task
      ),
    }));
  },
}));
