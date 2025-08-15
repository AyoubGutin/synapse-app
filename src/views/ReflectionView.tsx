import { ReflectionDialog } from '@/components/modals/ReflectionDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTasks } from '@/hooks/use-normalise-store';
import { useState } from 'react';
import type { Task } from '@/types/taskTypes';

export function ReflectionView() {
  const allTasks = useTasks();
  const [taskToReflect, setTaskToReflect] = useState<Task | null>(null);
  const reflectionsDue = allTasks.filter(
    (task) => task.status === 'completed' && !task.reflection
  );

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">pending reflections.</h1>
        <Card>
          <CardHeader>
            <CardTitle>reflections due</CardTitle>
            <CardDescription>
              select a completed task to reflect on your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reflectionsDue.length > 0 ? (
              <div className="space-y-2">
                {reflectionsDue.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setTaskToReflect(task)}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <span>{task.title}</span>
                    <span className="text-xs">
                      {new Date(
                        task.completedAt ? task.completedAt : ''
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>you have no pending reflections. Great job!</p>
            )}
          </CardContent>
        </Card>
      </div>
      <ReflectionDialog
        open={!!taskToReflect}
        onOpenChange={() => setTaskToReflect(null)}
        task={taskToReflect}
      />
    </>
  );
}
