import { useState } from 'react';
import GamesLanding from '../features/games/GamesLanding';
import TicTacToeGame from '../features/games/tictactoe/TicTacToeGame';
import SlidingPuzzleGame from '../features/games/puzzle/SlidingPuzzleGame';
import RiddlesGame from '../features/games/riddles/RiddlesGame';
import MathGame from '../features/games/math/MathGame';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type GameMode = 'landing' | 'tictactoe' | 'puzzle' | 'riddles' | 'math';

export default function GamesPage() {
  const [currentGame, setCurrentGame] = useState<GameMode>('landing');

  const handleGameSelect = (game: GameMode) => {
    setCurrentGame(game);
  };

  const handleBackToLanding = () => {
    setCurrentGame('landing');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          <p className="text-muted-foreground">Take a mindful break with these activities</p>
        </div>
        {currentGame !== 'landing' && (
          <Button variant="outline" onClick={handleBackToLanding}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        )}
      </div>

      {currentGame === 'landing' && <GamesLanding onGameSelect={handleGameSelect} />}
      {currentGame === 'tictactoe' && <TicTacToeGame />}
      {currentGame === 'puzzle' && <SlidingPuzzleGame />}
      {currentGame === 'riddles' && <RiddlesGame />}
      {currentGame === 'math' && <MathGame />}
    </div>
  );
}
