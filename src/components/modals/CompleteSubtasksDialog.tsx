import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CompleteSubtasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCompleteAll: (rememberChoice: boolean) => void;
  onConfirmCompleteParentOnly: (rememberChoice: boolean) => void;
  taskTitle: string;
}

export function CompleteSubtasksDialog({
  open,
  onOpenChange,
  onConfirmCompleteAll,
  onConfirmCompleteParentOnly,
  taskTitle,
}: CompleteSubtasksDialogProps) {
  const [rememberChoice, setRememberChoice] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Subtasks?</AlertDialogTitle>
          <AlertDialogDescription>
            You've completed "{taskTitle}". Do you want to complete all of its
            subtasks as well?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2 my-4">
          <Checkbox
            id="remember-choice"
            checked={rememberChoice}
            onCheckedChange={(checked) => setRememberChoice(!!checked)}
          />
          <Label htmlFor="remember-choice">
            Remember my choice and don't ask again.
          </Label>
        </div>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onConfirmCompleteParentOnly(rememberChoice)}
          >
            Just This Task
          </Button>
          <Button onClick={() => onConfirmCompleteAll(rememberChoice)}>
            Complete All
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
