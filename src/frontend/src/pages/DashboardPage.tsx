import { useInAppTimer } from '../hooks/useInAppTimer';
import { useDailyTimeLimit } from '../hooks/useDailyTimeLimit';
import { formatTime } from '../lib/time';
import MindfulSuggestionCard from '../components/dashboard/MindfulSuggestionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target } from 'lucide-react';

export default function DashboardPage() {
  const { todayElapsedSeconds } = useInAppTimer();
  const { dailyLimitMinutes, isLoading: limitLoading } = useDailyTimeLimit();

  const limitSeconds = dailyLimitMinutes ? dailyLimitMinutes * 60 : null;
  const isLimitExceeded = limitSeconds !== null && todayElapsedSeconds >= limitSeconds;

  return (
    <div className="relative mx-auto max-w-5xl space-y-8">
      {/* Background Illustration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/assets/generated/mindful-background.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Track your mindful screen time</p>
      </div>

      {/* Time Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{formatTime(todayElapsedSeconds)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Active time in app today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {limitLoading ? '...' : dailyLimitMinutes ? `${dailyLimitMinutes} min` : 'Not set'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {limitSeconds !== null
                ? `${Math.max(0, Math.floor((limitSeconds - todayElapsedSeconds) / 60))} min remaining`
                : 'Configure in Settings'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mindful Suggestion */}
      {isLimitExceeded && <MindfulSuggestionCard />}

      {/* Welcome Message */}
      {!isLimitExceeded && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Welcome to Mindful Screen</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your mindful companion for balanced screen time. Set a daily limit in Settings to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
