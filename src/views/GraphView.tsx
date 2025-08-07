import { Card, CardContent } from '@/components/ui/card';
import { Network } from 'lucide-react';

export function GraphView() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Network size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Knowledge Graph</h2>
      </CardContent>
    </Card>
  );
}
