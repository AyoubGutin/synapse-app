/**
 * @file The sidebar for the application
 * @todo Move navItems to data folder
 */

// -- Imports --
import { NavLink } from 'react-router-dom'; // Link component but with active state styling
import {
  Home,
  Network,
  CalendarDays,
  ListTodo,
  Settings,
  ChevronLeft,
  Lightbulb,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore'; // Global state management
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// -- Constants --
const navItems = [
  { to: '/', icon: Home, label: 'home.' },
  { to: '/tasks', icon: ListTodo, label: 'tasks.' },
  { to: '/reflections', icon: Lightbulb, label: 'reflections.' },
  { to: '/graph', icon: Network, label: 'graph.' },
  { to: '/calendar', icon: CalendarDays, label: 'calendar.' },
];

// -- Navigation --
/**
 * Sidebar navigation
 * @returns aside element with containers for logo + toggle, nav links, and a settings button
 */
export function Navigation() {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();

  // Define tailwind styling for different states of a link
  const baseLinkClass =
    'flex w-full items-center rounded-full px-3 py-2 transition-color cursor-pointer';
  const activeLinkClass = 'bg-card text-primary';
  const inactiveLinkClass =
    'text-muted-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-card transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-52' // adjust width of sidebar based on if it the sidebar should be collapsed
      }`}
    >
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4 overflow-x-hidden">
        <div>
          {/* Container for logo + toggle button */}
          <div
            className={`flex items-center mb-8 transition-all ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between' // Align center if collapsed for toggle, space out the logo and toggle if not
            }`}
          >
            {/* Conditionally render the logo text, if open */}
            {!isSidebarCollapsed && (
              <h1 className="text-2xl font-bold text-primary">synapse.</h1>
            )}

            {/*/ Toggle button */}
            <Button
              onClick={toggleSidebar}
              className="rounded-full p-2 hover:bg-accent"
              variant="ghost"
            >
              <ChevronLeft
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>

          {/*/ Navigation container which contains the navlinks */}
          <nav>
            <ul className="space-y-2">
              {/* Map each object/'item' in navItems and make it a NavLink component */}
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${baseLinkClass} gap-4 ${
                        isActive ? activeLinkClass : inactiveLinkClass
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={`font-medium transition-opacity duration-200 whitespace-nowrap !cursor-pointer ${
                        isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section: User Profile */}
        <footer className="mt-auto">
          <Separator orientation="horizontal" className="bg-accent" />
          <div
            className={`${baseLinkClass} text-muted-foreground hover:bg-accent hover:text-accent-foreground ${
              isSidebarCollapsed ? 'justify-center' : 'gap-4'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0">
              <Settings className="h-5 w-5" />
            </div>
            <span
              className={`font-medium transition-opacity duration-200 whitespace-nowrap ${
                isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              settings.
            </span>
          </div>
        </footer>
      </div>
    </aside>
  );
}
