import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useTasks } from '@/hooks/use-normalise-store';

export function CalendarView() {
  const allTasks = useTasks();

  const events = useMemo(() => {
    return allTasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        date: task.dueDate,
        color:
          task.priority === 'high'
            ? '#ef4444'
            : task.priority === 'medium'
            ? '#f97316'
            : '#22c55e',
      }));
  }, [allTasks]);

  return (
    <Card>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          height="auto"
        />
      </CardContent>
    </Card>
  );
}
