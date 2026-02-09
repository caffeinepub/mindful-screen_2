import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
}

export default function MathGame() {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateProblem = (): MathProblem => {
    const operators: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1: number, num2: number, answer: number;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        break;
    }

    return { num1, num2, operator, answer };
  };

  useEffect(() => {
    setProblem(generateProblem());
  }, []);

  const handleSubmit = () => {
    if (!problem || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer, 10) === problem.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore({
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    });

    setTimeout(() => {
      setProblem(generateProblem());
      setUserAnswer('');
      setFeedback(null);
    }, 1500);
  };

  const handleReset = () => {
    setScore({ correct: 0, total: 0 });
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback(null);
  };

  if (!problem) return null;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Math Problems</CardTitle>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Score: {score.correct} / {score.total}
          </p>
        </div>

        <div className="rounded-lg border-2 border-border bg-muted/30 p-8 text-center">
          <p className="text-4xl font-bold tabular-nums">
            {problem.num1} {problem.operator} {problem.num2} = ?
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="number"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={feedback !== null}
            className="text-center text-lg"
          />
          <Button onClick={handleSubmit} disabled={!userAnswer || feedback !== null} className="w-full">
            Submit Answer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {feedback && (
          <div
            className={`rounded-lg border-2 p-4 text-center font-semibold ${
              feedback === 'correct'
                ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400'
                : 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400'
            }`}
          >
            {feedback === 'correct' ? '✓ Correct!' : `✗ Incorrect. The answer was ${problem.answer}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
