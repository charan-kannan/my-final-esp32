'use client';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { NovaChat } from '@/components/nova-chat';
import { SettingsPanel } from '@/components/settings-panel';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';
import { DeviceStatus } from './device-status';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    auth.signOut();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-cyber-subtle/50 bg-cyber-gray/50 px-4 backdrop-blur-lg md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            <h1 className="text-2xl font-bold text-glow font-display uppercase tracking-widest">
            HAZARDAVERT AI
            </h1>
        </div>
        {user && <DeviceStatus />}
      </div>
      <div className="flex items-center gap-2">
        {!isUserLoading && user ? (
          <>
            <NovaChat />
            <SettingsPanel />
          </>
        ) : !isUserLoading && !user ? (
          <Button variant="outline" onClick={handleLoginClick} className="gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        ): null}
      </div>
    </header>
  );
}
