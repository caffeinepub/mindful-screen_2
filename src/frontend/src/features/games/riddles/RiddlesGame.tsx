import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const RIDDLES = [
  {
    question: 'What has keys but no locks, space but no room, and you can enter but not go inside?',
    answer: 'A keyboard',
  },
  {
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'An echo',
  },
  {
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'Footsteps',
  },
  {
    question: 'What can travel around the world while staying in a corner?',
    answer: 'A stamp',
  },
  {
    question: 'What has a head and a tail but no body?',
    answer: 'A coin',
  },
  {
    question: 'What gets wet while drying?',
    answer: 'A towel',
  },
  {
    question: 'What can you catch but not throw?',
    answer: 'A cold',
  },
  {
    question: 'What has hands but cannot clap?',
    answer: 'A clock',
  },
  {
    question: 'What goes up but never comes down?',
    answer: 'Your age',
  },
  {
    question: 'What has many teeth but cannot bite?',
    answer: 'A comb',
  },
];

export default function RiddlesGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentRiddle = RIDDLES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % RIDDLES.length);
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Riddles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Riddle {currentIndex + 1} of {RIDDLES.length}
          </p>
        </div>

        <div className="rounded-lg border-2 border-border bg-muted/30 p-6">
          <p className="text-lg font-medium">{currentRiddle.question}</p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={toggleAnswer}>
            {showAnswer ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Answer
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Answer
              </>
            )}
          </Button>
          <Button onClick={handleNext}>
            Next Riddle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {showAnswer && (
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground">Answer:</p>
            <p className="mt-2 text-xl font-bold">{currentRiddle.answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
