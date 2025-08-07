/**
 * @file This file is for rendering a Card component, representing a widget, displaying all the user's objectives
 * @todo Make a cut-off point, 2+?. Allow objectives to be clicked, this will possibly be a objective objet, extracting some code here and calling
 *  on the objective, insteaf of making one here.
 */

// -- Imports --
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useAppStore } from '@/store/appStore';

/**
 * React function displays user's objectives in a Card component. It is a widget in the dashboard
 * @returns
 */
export function ObjectivesWidget() {
  // get all the user's objectives
  const { objectives } = useAppStore();

  return (
    <Card className="hover:translate-y-[-3px] transition-transform duration-200">
      <CardHeader>
        <CardTitle>my objectives:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {objectives.map((objective) => (
            <div
              key={objective.id}
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg"
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
