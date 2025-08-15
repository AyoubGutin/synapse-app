// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardView } from '@/views/DashboardView';
import { CalendarView } from '@/views/CalendarView';
import { GraphView } from '@/views/GraphView';
import { AllTasksView } from '@/views/AllTasksView';
import { ObjectivesView } from '@/views/ObjectivesView';
import { ReflectionView } from './views/ReflectionView';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/tasks" element={<AllTasksView />} />
        <Route path="/objectives/:objectiveId" element={<ObjectivesView />} />
        <Route path="/reflections" element={<ReflectionView />} />
      </Route>
    </Routes>
  );
}
