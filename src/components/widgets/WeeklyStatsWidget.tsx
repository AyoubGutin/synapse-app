/**
 * @file Gets the weekly stats for a user, like task completed and tasks added
 * @todo extend stats, let user customise
 */

// -- Imports --
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

/**
 * React function rendering a card component showing weekly stats for a suer
 * @returns
 */
export function WeeklyStatsWidget() {
  // Get tasks from global state
  const tasks = useAppStore((state) => state.tasks);

  // -- Helper function --
  // calc stats (completed this weeks, added this week)
  const stats = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    startOfWeek.setHours(0, 0, 0, 0);
    const completedThisWeek = tasks.filter(
      (task) =>
        task.status === 'completed' &&
        new Date(task.dueDate || 0) >= startOfWeek
    ).length;

    // add a createdAt property to your Task type for this to be accurate
    // For now, simulate it.
    const addedThisWeek = tasks.length > 5 ? 3 : 1;
    return { completedThisWeek, addedThisWeek };
  }, [tasks]);

  return (
    <Card className="hover:translate-y-[-3px] transition-transform duration-200">
      <CardHeader>
        <CardTitle>this week's progress:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 mr-4" />
          <div>
            <p className="text-2xl font-bold">{stats.completedThisWeek}</p>
            <p className="text-xs text-muted-foreground">tasks completed.</p>
          </div>
        </div>
        <div className="flex items-center">
          <PlusCircle className="h-6 w-6 text-blue-500 mr-4" />
          <div>
            <p className="text-2xl font-bold">{stats.addedThisWeek}</p>
            <p className="text-xs text-muted-foreground">tasks added.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
