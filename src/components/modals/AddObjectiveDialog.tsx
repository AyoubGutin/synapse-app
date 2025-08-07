/**
 * @file Dialog for adding a new objective
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/appStore';

interface AddObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddObjectiveDialog({
  open,
  onOpenChange,
}: AddObjectiveDialogProps) {
  const { addObjective } = useAppStore();

  // -- States --
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      addObjective({ title });
      onOpenChange(false); // close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>create a new objective.</DialogTitle>
          <DialogDescription>
            make a new objective manually to group tasks to it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objective-title">objective title:</Label>
            <Input
              id="objective-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., run a marathon"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full">
          create objective.
        </Button>
      </DialogContent>
    </Dialog>
  );
}
