/**
 * @file Reusable form component that has all the inputs for a task to be editied or added
 * @todo Wrap in shadcn Form component for error checking and validation. e.g prevent title from beign blank
 */

// -- Imports --
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
import type { TaskFormData } from '@/types/taskTypes';
import { useAppStore } from '@/store/appStore';

// Define the props for the form component
interface TaskFormProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}
// -- TaskForm --
/**
 * React function providing a reusable form component for tasks
 * @param formData - Tracks the current form data
 * @param setFormData - Updates the formData state
 */
export function TaskForm({ formData, setFormData }: TaskFormProps) {
  const { objectives } = useAppStore();
  // helper function for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target; // Get the id of the form element and the current value of it
    setFormData((prev) => ({ ...prev, [id]: value })); // Update the formData state with the new values
  };

  // helper function for select changes
  const handleSelectChange = (field: keyof TaskFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">task title:</Label>
        <Input
          id="title"
          placeholder="e.g., read a chapter of 'Atomic Habits'"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">description:</Label>
        <Textarea
          id="description"
          placeholder="add more details about the task..."
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">due date:</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">priority:</Label>
          <Select
            value={formData.priority}
            onValueChange={handleSelectChange('priority')}
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">high.</SelectItem>
              <SelectItem value="medium">medium.</SelectItem>
              <SelectItem value="low">low.</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="objectiveId">link to objective:</Label>
        <Select
          value={formData.objectiveId}
          onValueChange={handleSelectChange('objectiveId')}
        >
          <SelectTrigger id="objectiveId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">none (quick task).</SelectItem>
            {objectives.map((obj) => (
              <SelectItem key={obj.id} value={obj.id}>
                {obj.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">tags (comma-separated)</Label>
        <Input
          id="tags"
          type="text"
          value={formData.tags || ''}
          onChange={handleInputChange}
          placeholder="work, urgent, project-x"
        />
      </div>
    </div>
  );
}
