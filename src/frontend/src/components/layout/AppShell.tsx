import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Gamepad2, BookOpen, Settings, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';
import { useAudioPreferences } from '../../hooks/useAudioPreferences';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export default function AppShell() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useAudioPreferences();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/notes', label: 'Notes', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/mindful-screen-logo.dim_512x512.png"
              alt="Mindful Screen"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-semibold tracking-tight">Mindful Screen</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Audio Controls */}
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9"
                title={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-9 w-9"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(val) => setVolume(val[0])}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
            <Separator orientation="vertical" className="h-6" />
            <LoginButton />
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-border/40">
          <div className="container flex items-center gap-1 px-4 md:px-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-foreground ${
                    isActive
                      ? 'border-b-2 border-primary text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 md:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground md:px-8">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Profile Setup Dialog */}
      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
