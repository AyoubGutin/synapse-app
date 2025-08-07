/**
 * @file The last stage of the generate tasks for an objective dialog. Provides a preview
 * @todo Possibly allow user to expand the graph to play around with it.
 */

// -- Imports --
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Props for last stage of the dialog - the preview tasks
interface PreviewStageProps {
  onConfirm: () => void;
  onEdit: () => void;
}

// -- PreviewStage --
/**
 * React function that is the last stage of the generate tasks for an objective dialog. It provides a visual map of the tasks generated, that is interactive, and lets a user confirm or go back to edit
 * @param onConfirm - Function that is called when the user clicks confirm
 * @param onEdit - Function that is called when the user clicks edit
 * @returns
 */
export function PreviewStage({ onConfirm, onEdit }: PreviewStageProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>preview your new tasks.</DialogTitle>
        <DialogDescription>
          here's a visual map of the tasks we generated for you.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
        <p className="text-muted-foreground">Graph Placeholder</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onEdit} variant="outline" className="flex-1">
          edit details.
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          confirm tasks.
        </Button>
      </div>
    </>
  );
}
