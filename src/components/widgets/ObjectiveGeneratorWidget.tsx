/**
 * @file Renders a widget allowing the user to type in an objective they want to generate, opening a modal
 */

// -- Imports --
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';

// -- Type Definitions --
interface ObjectiveGeneratorWidgetProps {
  onGenerateClick: () => void;
}

/**
 * Card component, allowing a user to input a objective. This is the main widget in the dashboard
 * @param onGenerateClick - Callback function called when user clicks generate
 * @returns
 */
export function ObjectiveGeneratorWidget({
  onGenerateClick,
}: ObjectiveGeneratorWidgetProps) {
  // get the states to track user input, used in API call.
  const { mainObjective, setMainObjective } = useAppStore();
  return (
    <Card className="bg-primary/10  hover:translate-y-[-3px] transition-transform duration-200">
      <CardHeader>
        <CardTitle className="text-xl">what is your main objective?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            value={mainObjective}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMainObjective(e.target.value)
            }
            placeholder="e.g., learn french....."
            className="flex-1 border-input bg-card border-2"
          />
          <Button onClick={onGenerateClick} className="whitespace-nowrap">
            generate tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
