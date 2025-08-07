/**
 * @file The 'loading' / second stage of the 'generate tasks' for an objective dialog
 * @todo Provide more detail possibly or use a skeleton
 */

// -- Imports --
import { Loader2 } from 'lucide-react';

// -- LoadingStage --
/**
 * React function that is the second stage of the generate tasks for an objective dialog, it is a container that shows a spinning loader, indicating the response is 'loading'
 */
export function LoadingStage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">generating tasks...</p>
    </div>
  );
}
