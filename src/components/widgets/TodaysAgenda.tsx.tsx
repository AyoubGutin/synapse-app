/**
 * @file Shows the users tasks due today
 * @todo Make this a toggle. User can switch between daily, weekly, monthly
 * @todo Could redirect to calendar?
 * @todo bug - shows duplicates if parent + subtask both due - remove toggle only show individual task
 */

// -- Imports -
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from '@/components/task/TaskItem';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { useTasks } from '@/hooks/use-normalise-store';

/**
 * React function to render a Card component displaying user's current tasks due today, it is a widget on the dashboard
 */
export function TodaysAgendaWidget() {
  // get tasks from store
  const tasks = useTasks();

  // -- states --
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // get todays data and then filter tasks for the due date matching todays date
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(
    (task) => task.dueDate === today && task.status !== 'completed'
  );

  const handleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  return (
    <Card className="hover:translate-y-[-3px] transition-transform duration-200">
      <CardHeader>
        <CardTitle>today's agenda:</CardTitle>
      </CardHeader>
      <CardContent>
        {todaysTasks.length > 0 ? (
          <ul className="-mx-3">
            {todaysTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onExpand={handleExpand}
                expandedTasks={expandedTasks}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            no tasks due today.
          </p>
        )}

        <Separator className="bg-accent" />
        <div className="mt-2">
          <Link to="/tasks" className={buttonVariants({ variant: 'link' })}>
            view all your tasks.
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
