/**
 * @file Dialog for reflecting on. completed task
 */
import { useState, useEffect, type Ref } from 'react';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import type { ReflectionRating } from '@/types/taskTypes';
import type { Task } from '@/types/taskTypes';

interface ReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function ReflectionDialog({
  open,
  onOpenChange,
  task,
}: ReflectionDialogProps) {
  const { addReflection } = useAppStore();
  const [rating, setRating] = useState<ReflectionRating>('just_right');
  const [comment, setComment] = useState('');

  // reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setRating('just_right');
        setComment('');
      }, 150);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!task) return;
    addReflection(task.id, { rating, comment });
    onOpenChange(false);
    toast.info('Analysing reflection and refining tasks...');
    setTimeout(() => {
      toast.success('Tasks refined based on your reflection');
    }, 2000); // Simulate some processing time
  };

  const handleRatingChange = (value: string) => {
    setRating(value as ReflectionRating);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>reflect on {task?.title}</DialogTitle>
          <DialogDescription>
            how did this task go? your feedback will help refine your objective
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>how difficult was this task?</Label>
            <RadioGroup value={rating} onValueChange={handleRatingChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="too_easy" id="r1" />
                <Label htmlFor="r1">Too Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="just_right" id="r2" />
                <Label htmlFor="r2">Just Right</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="too_hard" id="r3" />
                <Label htmlFor="r3">Too Hard</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">any additional comments?</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Submit Reflection
        </Button>
      </DialogContent>
    </Dialog>
  );
}
