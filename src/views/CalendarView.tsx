import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

export function CalendarView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Calendar: August 2025
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowRight size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground py-12">
        <Calendar size={64} className="mx-auto mb-4" />
        <p>Calendar view coming soon...</p>
      </CardContent>
    </Card>
  );
}
