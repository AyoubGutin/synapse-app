/**
 *@file Main Layout Wrapper
 * @todo Consider removing the FAB and putting it inside the widget. This would remove the FAB  from layout as it is specific to one page
 * @todo Dialog may be kept as it is used in more than one page
 */

// -- Imports --
import { Outlet } from 'react-router-dom'; // Placeholder where child route components will be rendered
import { Button } from '@/components/ui/button';
import { AddTaskDialog } from '@/components/modals/AddTaskDialog';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { useAppStore } from '@/store/appStore'; // Global state management
import { Plus } from 'lucide-react';
import { Separator } from '../ui/separator';

// -- Layout --
/**
 * Wraps the layout components into one React Function, with child route components rendered
 * @returns A full page component with the layout rendered, with its child route component
 */
export function Layout() {
  // --  Global States --
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const showAddTaskDialog = useAppStore((state) => state.showAddTaskDialog);
  const setShowAddTaskDialog = useAppStore(
    (state) => state.setShowAddTaskDialog
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation /> {/* Sidebar navigation */}
      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-52' // adjust the margin of the header and main content to account for sidebar
        }`}
      >
        <div className="p-8">
          <Header /> {/* always visible */}
          <Separator className="bg-accent mb-5" />
          <Outlet /> {/* changes based on current route */}
        </div>
      </main>
      {/* Floating Action Buttons and Dialogs */}
      <Button
        onClick={() => setShowAddTaskDialog(true)} // update global state to show dialog
        size="icon"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus size={24} />
      </Button>
      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
      />
    </div>
  );
}
