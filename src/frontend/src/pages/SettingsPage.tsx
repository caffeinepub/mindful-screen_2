import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useDailyTimeLimit, useSetDailyTimeLimit } from '../hooks/useDailyTimeLimit';
import { useAudioPreferences } from '../hooks/useAudioPreferences';
import AuthGate from '../components/auth/AuthGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Clock, Volume2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { dailyLimitMinutes, isLoading: limitLoading } = useDailyTimeLimit();
  const { mutate: setLimit, isPending: isSaving } = useSetDailyTimeLimit();
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useAudioPreferences();

  const [limitInput, setLimitInput] = useState<string>(dailyLimitMinutes?.toString() || '');

  const handleSaveLimit = () => {
    const minutes = parseInt(limitInput, 10);
    if (isNaN(minutes) || minutes < 1) {
      toast.error('Please enter a valid time limit (minimum 1 minute)');
      return;
    }
    setLimit(minutes, {
      onSuccess: () => {
        toast.success('Daily time limit saved');
      },
      onError: () => {
        toast.error('Failed to save time limit');
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Customize your mindful experience</p>
      </div>

      {/* Time Limit Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Daily Time Limit</CardTitle>
          </div>
          <CardDescription>Set your daily screen time goal in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <AuthGate feature="time limit settings" />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <div className="flex gap-2">
                  <Input
                    id="time-limit"
                    type="number"
                    min="1"
                    placeholder="e.g., 60"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                    disabled={limitLoading || isSaving}
                  />
                  <Button onClick={handleSaveLimit} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
              {dailyLimitMinutes && (
                <p className="text-sm text-muted-foreground">
                  Current limit: {dailyLimitMinutes} minutes per day
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <CardTitle>Audio Preferences</CardTitle>
          </div>
          <CardDescription>Control background music and sound effects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Background Music</Label>
              <p className="text-sm text-muted-foreground">
                Calming ambient sounds for focus
              </p>
            </div>
            <Switch checked={isPlaying} onCheckedChange={togglePlay} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mute Audio</Label>
              <p className="text-sm text-muted-foreground">Silence all sounds</p>
            </div>
            <Switch checked={isMuted} onCheckedChange={toggleMute} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Volume: {volume}%</Label>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(val) => setVolume(val[0])}
              max={100}
              step={1}
              disabled={isMuted}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Note: Audio starts muted by default. Click play to begin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
