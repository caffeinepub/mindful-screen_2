import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shuffle } from 'lucide-react';

export default function SlidingPuzzleGame() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initializePuzzle = () => {
    const ordered = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    setTiles(ordered);
    setMoves(0);
    setIsComplete(false);
  };

  const shufflePuzzle = () => {
    const shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTiles(shuffled);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  const checkComplete = (currentTiles: number[]) => {
    return currentTiles.every((tile, index) => tile === (index === 8 ? 0 : index + 1));
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 3,
      emptyIndex + 3,
    ].filter((i) => {
      if (i < 0 || i > 8) return false;
      if (emptyIndex % 3 === 0 && i === emptyIndex - 1) return false;
      if (emptyIndex % 3 === 2 && i === emptyIndex + 1) return false;
      return true;
    });

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (checkComplete(newTiles)) {
        setIsComplete(true);
      }
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sliding Puzzle</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shufflePuzzle}>
              <Shuffle className="mr-2 h-4 w-4" />
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={initializePuzzle}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {isComplete ? (
            <p className="text-lg font-semibold text-primary">
              Puzzle Complete! 🎉 ({moves} moves)
            </p>
          ) : (
            <p className="text-lg font-semibold">Moves: {moves}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              className={`flex h-20 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-colors ${
                tile === 0
                  ? 'border-dashed border-border bg-muted/30'
                  : 'border-border bg-card hover:bg-accent'
              }`}
              disabled={tile === 0 || isComplete}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Click tiles adjacent to the empty space to move them
        </p>
      </CardContent>
    </Card>
  );
}
