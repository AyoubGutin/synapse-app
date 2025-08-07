// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardView } from '@/views/DashboardView';
import { CalendarView } from '@/views/CalendarView';
import { GraphView } from '@/views/GraphView';
import { AllTasksView } from '@/views/AllTasksView';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/tasks" element={<AllTasksView />} />
      </Route>
    </Routes>
  );
}
