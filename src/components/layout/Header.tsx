/**
 * @file Header with a logo and profile icon
 * @todo Dropdown component for profile, w/ settings logout
 */

// -- Imports --
import { Button } from '../ui/button';
import { User } from 'lucide-react';

// -- Header --
/**
 * Header for the application.
 * @returns A header element w/ a logo and profile button
 */
export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-primary">synapse.</h1>
      <Button variant="outline" size="icon" className="rounded-full">
        <User size={20} />
      </Button>
    </header>
  );
}
