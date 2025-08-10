/**
 * @file view of objectives with option to edit title, colour, list of tasks, graph preview
 * Placeholdersfor now
 * @todo finish settings
 * @todo show list of tasks
 * @todo allow user to delete
 * @todo separate this out
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useMemo, useCallback, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Task } from '@/types/taskTypes';
import { TaskList } from '@/components/task/TaskList';
import { EditTaskDialog } from '@/components/modals/EditTaskDialog';
import { useTasks } from '@/hooks/use-normalise-store';
import { ConfirmationDialog } from '@/components/modals/ConfirmationDialog';

const EMPTY_OBJECTIVES: [] = [];

export function ObjectivesView() {
  const { objectiveId } = useParams<{ objectiveId: string }>();
  const navigate = useNavigate();

  const tasks = useTasks();
  const {
    objectives: objectivesObject,
    updateObjective,
    deleteObjective,
  } = useAppStore();

  const objective = objectivesObject[objectiveId || ''];

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const handleEditDialogClose = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setTaskToEdit(null);
    }
    setIsEditDialogOpen(isOpen);
  }, []);

  const objectiveTasks = useMemo(() => {
    return tasks.filter((task) => task.objectiveId === objectiveId);
  }, [tasks, objectiveId]);

  const handleDelete = () => {
    if (!objectiveId) return;
    deleteObjective(objectiveId);
    navigate('/');
  };

  if (!objective) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">objective not found.</h1>
        <p className="text-muted-foreground">
          The objective you're looking for does not exist.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4">
          go back to dashboard.
        </Button>
      </div>
    );
  }
  const handleTitleChange = (newTitle: string) => {
    updateObjective({ ...objective, title: newTitle });
  };

  return (
    <div className="space-y-6">
      {/* header with editable title */}
      <div className="flex justify-between flex-row items-center">
        <div className="space-y-2">
          <Label
            htmlFor="objective-title"
            className="text-xs text-muted-foreground"
          >
            objective title:
          </Label>
          <Input
            id="objective-title"
            className="text-3xl font-bold h-auto"
            value={objective.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Button
            variant="destructive"
            className="size-10"
            onClick={() => setIsConfirmDeleteDialogOpen(true)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>tasks:</CardTitle>
              <CardDescription>
                all tasks related to the {objective.title} objective.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={objectiveTasks} objectives={EMPTY_OBJECTIVES} />{' '}
              {/* not working */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>task graph.</CardTitle>
              <CardDescription>
                visual map of how your tasks connect and depend on each other
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 bg-muted rounded-4xl m-5 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>interactive graph coming.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* settings on the right */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Objective Colour</Label>
                {/* color picker placeholder */}
                <div className="flex gap-2">
                  {['#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateObjective({ ...objective, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        objective.color === color
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date:</Label>
                <p>Date here</p>
              </div>
              {/*  other settings here, like target date */}
            </CardContent>
          </Card>
        </div>
      </div>
      <EditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        taskToEdit={taskToEdit}
      />
      <ConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Are you sure?"
        description={`This will permanently delete the "${objective.title}" objective and all of its tasks. This action cannot be undone.`}
      />
    </div>
  );
}
