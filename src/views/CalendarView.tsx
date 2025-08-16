// FILE: /src/views/CalendarView.tsx

import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/use-normalise-store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TaskItem } from '@/components/task/TaskItem';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export function CalendarView() {
  const allTasks = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tasksForSelectedDate = useMemo(() => {
    if (!date) return [];
    const selectedDateString = format(date, 'yyyy-MM-dd');
    return allTasks.filter((task) => task.dueDate === selectedDateString);
  }, [allTasks, date]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-card p-3 rounded-xl shadow-sm flex justify-center items-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full"
          />
        </div>
        <Button variant="secondary" onClick={() => setDate(new Date())}>
          today.
        </Button>
      </div>

      <div className="lg:col-span-2">
        <Card className="transition-all hover:shadow-lg h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {date ? format(date, 'PPP') : 'Select a date'}
            </CardTitle>
            <CardDescription>
              {tasksForSelectedDate.length}{' '}
              {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'} scheduled
              for this day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <ul className="space-y-2">
                {tasksForSelectedDate.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onExpand={() => {}}
                    expandedTasks={new Set()}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center h-full">
                <CalendarIcon className="mx-auto h-12 w-12 opacity-40" />
                <p className="mt-4 text-sm font-medium">
                  No tasks scheduled for this day.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
