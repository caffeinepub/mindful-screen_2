import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  feature: string;
}

export default function AuthGate({ feature }: AuthGateProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Sign in required</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Please sign in to access {feature}. Your data will be securely stored and synced across devices.
        </p>
        <Button onClick={login} disabled={isLoggingIn}>
          {isLoggingIn ? 'Signing in...' : 'Sign in to continue'}
        </Button>
      </CardContent>
    </Card>
  );
}
