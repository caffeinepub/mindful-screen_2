import { useState } from 'react';
import { getRandomSuggestion } from '../../features/suggestions/suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function MindfulSuggestionCard() {
  const [suggestion, setSuggestion] = useState(getRandomSuggestion());

  const handleNewSuggestion = () => {
    setSuggestion(getRandomSuggestion(suggestion));
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Time for a Mindful Break</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleNewSuggestion}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Suggestion
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{suggestion}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          You've reached your daily limit. Take a break and try this activity!
        </p>
      </CardContent>
    </Card>
  );
}
