import { useState } from 'react';
import { ObjectiveGeneratorWidget } from '@/components/widgets/ObjectiveGeneratorWidget';
import { ObjectivesWidget } from '@/components/widgets/ObjectivesWidget';
import { TodaysAgendaWidget } from '@/components/widgets/TodaysAgenda.tsx';
import { WeeklyStatsWidget } from '@/components/widgets/WeeklyStatsWidget';
import { GenerateTaskDialog } from '@/components/modals/GenerateTaskDialog';

// helper function to get dynamic greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'good morning';
  if (hour < 18) return 'good afternoon';
  return 'good evening';
};

export function DashboardView() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false); // state responsible for opening the modal in the dashboard view
  const greeting = getGreeting(); // get dynamic greeting

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {greeting},<span className="text-primary"> user.</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Left Column --- */}
        <div className="lg:col-span-2 space-y-6">
          <ObjectiveGeneratorWidget
            onGenerateClick={() => setIsGenerateDialogOpen(true)}
          />
          <TodaysAgendaWidget />
        </div>

        {/* -- Right Column -- */}
        <div className="space-y-6">
          <WeeklyStatsWidget />
          <ObjectivesWidget />
        </div>
      </div>

      <GenerateTaskDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      />
    </div>
  );
}
