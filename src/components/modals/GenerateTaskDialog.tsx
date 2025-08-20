/**
 * @file Dialog for generating tasks for a specified objective
 * @todo Should say this form is for objective: 'mainObjective', etc
 * @todo Different questions?
 */

// -- Imports --
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GenerateFormStage } from '@/components/modals/generate_modal_stages/GenerateFormStage';
import { LoadingStage } from '@/components/modals/generate_modal_stages/LoadingStage';
import { PreviewStage } from '@/components/modals/generate_modal_stages/PreviewStage';
import type { Task } from '@/types/taskTypes';
import { v4 as uuidv4 } from 'uuid';

// -- Type definitions --
type ModalStage = 'form' | 'loading' | 'preview';
interface GenerateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
/**
 * React function that orchestrates all the different stages for the Generate Tasks for an objective dialog
 * @param open - boolean if the dialog is open or not
 * @param onOpenChange - function if the dialog should be open or not
 */
export function GenerateTaskDialog({
  open,
  onOpenChange,
}: GenerateTaskDialogProps) {
  const { addTask, addObjective, mainObjective } = useAppStore();
  // -- states --
  const [stage, setStage] = useState<ModalStage>('form'); // local state to determine what stage it currently is, default is 'form'
  const [formData, setFormData] = useState({
    deadline: '',
    priority: 'medium',
    scope: '',
  }); // local state to track the current form data

  // reset the state if not open, called on whenever the 'open' state changes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStage('form');
        setFormData({ deadline: '', priority: 'medium', scope: '' });
      }, 150); // delay to account for animations.
    }
  }, [open]);

  // -- Helper Functions --
  const handleGenerate = () => {
    setStage('loading'); // set stage to loading
    setTimeout(() => {
      setStage('preview');
    }, 2000); // artificial delay to stimualte API call
  };
  const handleConfirm = (tasksToCreate: Omit<Task, 'id' | 'objectiveId'>[]) => {
    addObjective({
      title: mainObjective || 'New AI Objective',
    });

    // to-do: need to get the new objective's ID to link the tasks.
    // for now, we'll link them as 'unassigned'.
    tasksToCreate.forEach((task) => {
      addTask({
        ...task,
        objectiveId: 'unassigned', // placeholder until we can get the new ID from store
      });
    });

    onOpenChange(false);
  };

  const handleEdit = () => {
    setStage('form'); // go back to form
  };
  // render the stage based on the stage state, and pass the relevant helper functions & states
  const renderStage = () => {
    switch (stage) {
      case 'form':
        return (
          <GenerateFormStage
            formData={formData}
            setFormData={setFormData}
            onGenerate={handleGenerate}
          />
        );
      case 'loading':
        return <LoadingStage />;
      case 'preview':
        return <PreviewStage onConfirm={handleConfirm} onEdit={handleEdit} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">{renderStage()}</DialogContent>
    </Dialog>
  );
}
