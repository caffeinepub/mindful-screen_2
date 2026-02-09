import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3x3, Puzzle, Lightbulb, Calculator } from 'lucide-react';

interface GamesLandingProps {
  onGameSelect: (game: 'tictactoe' | 'puzzle' | 'riddles' | 'math') => void;
}

export default function GamesLanding({ onGameSelect }: GamesLandingProps) {
  const games = [
    {
      id: 'tictactoe' as const,
      title: 'Tic Tac Toe',
      description: 'Classic strategy game for two players',
      icon: Grid3x3,
    },
    {
      id: 'puzzle' as const,
      title: 'Sliding Puzzle',
      description: 'Arrange tiles in the correct order',
      icon: Puzzle,
    },
    {
      id: 'riddles' as const,
      title: 'Riddles',
      description: 'Challenge your mind with brain teasers',
      icon: Lightbulb,
    },
    {
      id: 'math' as const,
      title: 'Math Problems',
      description: 'Practice arithmetic skills',
      icon: Calculator,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {games.map((game) => {
        const Icon = game.icon;
        return (
          <Card key={game.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onGameSelect(game.id)} className="w-full">
                Play Now
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
