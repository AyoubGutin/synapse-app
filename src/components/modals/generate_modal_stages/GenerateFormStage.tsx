/**
 * @file First stage of the 'Generate Tasks' feature from the ObjectiveGenerator widget
 * @todo Naming convention needs to be better
 * @todo Wrap in shadcn form for error checking / validation
 */

// -- Imports --
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Props for stage 1 of the dialog - the form
interface FormStageProps {
  formData: { deadline: string; priority: string; scope: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ deadline: string; priority: string; scope: string }>
  >;
  onGenerate: () => void;
}
// -- GenerateFormStage --
/**
 * React function that is the first stage of the generate tasks for an objective.
 * @param formData - Tracks the current form data
 * @param setFormData - Function to update the formData state
 * @param onGenerate - Function that is called when the user clicks generate on the form
 */
export function GenerateFormStage({
  formData,
  setFormData,
  onGenerate,
}: FormStageProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>generate tasks: more details.</DialogTitle>
        <DialogDescription>
          provide more details about your main objective to generate relevant
          tasks.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="generate-task-deadline">
            when do you want to achieve this goal?
          </Label>
          <Input
            id="generate-task-deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deadline: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="generate-task-priority">
            what is the priority of this goal?
          </Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger id="generate-task-priority">
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">high</SelectItem>
              <SelectItem value="medium">medium</SelectItem>
              <SelectItem value="low">low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="generate-task-scope">
            briefly describe the scope of this goal.
          </Label>
          <Textarea
            id="generate-task-scope"
            placeholder="e.g., focus on grammar specifically"
            value={formData.scope}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, scope: e.target.value }))
            }
          />
        </div>
      </div>
      <Button onClick={onGenerate} className="w-full">
        generate.
      </Button>
    </>
  );
}
