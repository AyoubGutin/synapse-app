/**
 * @file This file is for rendering a Card component, representing a widget, displaying all the user's objectives
 * @todo Make a cut-off point, 2+?. Allow objectives to be clicked, this will possibly be a objective objet, extracting some code here and calling
 *  on the objective, insteaf of making one here.
 * @todo objective page
 */

// -- Imports --
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Plus } from 'lucide-react';
import { AddObjectiveDialog } from '../modals/AddObjectiveDialog';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useObjectives } from '@/hooks/use-normalise-store';

/**
 * React function displays user's objectives in a Card component. It is a widget in the dashboard
 * @returns
 */
export function ObjectivesWidget() {
  // get all the user's objectives
  const objectives = useObjectives();

  // -- states --
  const [isAddObjectiveOpen, setIsAddObjectiveOpen] = useState(false);

  return (
    <>
      <Card className="hover:translate-y-[-3px] transition-transform duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>my objectives:</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddObjectiveOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives.map((objective) => (
              <Link
                to={`/objectives/${objective.id}`}
                key={objective.id}
                className="block rounded-lg p-3 hover:bg-muted/50 cursor-pointer"
              >
                <div
                  key={objective.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg"
                      style={{ backgroundColor: objective.color }}
                    />
                    <span className="font-medium">{objective.title}</span>
                  </div>
                  <div className="w-20">
                    <Progress value={objective.progress} className="h-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddObjectiveDialog
        open={isAddObjectiveOpen}
        onOpenChange={setIsAddObjectiveOpen}
      />
    </>
  );
}
