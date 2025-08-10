/**
 * @file These custom hooks are designd to normalise the store of objectives and tasks into arrays for rendering
 */

import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';

export function useTasks() {
  const tasksObject = useAppStore((state) => state.tasks);
  return useMemo(() => Object.values(tasksObject), [tasksObject]);
}

export function useObjectives() {
  const objectivesObject = useAppStore((state) => state.objectives);
  return useMemo(() => Object.values(objectivesObject), [objectivesObject]);
}
