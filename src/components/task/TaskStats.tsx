/**
 * @file Renders statistics of tasks (total tasks, completed, overdue)
 * @todo Make it more objective based?
 */

// -- Imports --
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTasks } from '@/hooks/use-normalise-store';

/**
 * React function to render Cards for different statistics relating to the user's tasks.
 * @returns
 */
export function TaskStats() {
  const tasks = useTasks();

  // -- Helper Function --
  // -- calulates stats for different states and cache values
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === 'completed'
    ).length;
    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== 'completed'
    ).length;
    return { total, completed, overdue };
  }, [tasks]); // only re-run calc if tasks change

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">total tasks.</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">completed.</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">overdue.</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              stats.overdue > 0 ? 'text-destructive' : ''
            }`}
          >
            {stats.overdue}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
