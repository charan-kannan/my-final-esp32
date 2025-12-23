'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

export function DeviceStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate connection status toggling for demonstration purposes
    const interval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 8000); // Toggles every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-md border border-cyber-subtle bg-cyber-gray/50 px-3 py-1 backdrop-blur-sm">
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full transition-colors',
          isConnected ? 'bg-neon-green animate-pulse-fast' : 'bg-neon-red'
        )}
        style={{
            boxShadow: isConnected ? '0 0 5px hsl(var(--chart-1))' : '0 0 5px hsl(var(--chart-3))'
        }}
      />
      <span className={cn('text-xs font-mono uppercase tracking-wider', isConnected ? 'text-neon-green' : 'text-neon-red')}>
        {isConnected ? 'ESP32 Connected' : 'ESP32 Disconnected'}
      </span>
      {isConnected ? <Wifi className="h-4 w-4 text-neon-green" /> : <WifiOff className="h-4 w-4 text-neon-red" />}
    </div>
  );
}
