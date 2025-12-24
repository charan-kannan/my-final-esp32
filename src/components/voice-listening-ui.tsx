'use client';

import { Mic } from 'lucide-react';

export function VoiceListeningUI({ stopListening }: { stopListening: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-cyber-gray/80 backdrop-blur-xl flex flex-col items-center justify-center">
      <div className="text-primary uppercase tracking-widest text-lg font-display mb-8 animate-pulse-fast">
        Listening...
      </div>
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Particle Ring */}
        <div className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-particles scale-150"></div>

        {/* Outer Pulsing Ring */}
        <div className="absolute w-[110%] h-[110%] border-t-2 border-primary rounded-full animate-spin-slow"></div>

        {/* Inner Rings */}
        <div className="absolute w-full h-full rounded-full animate-ring-pulse border-2 border-primary/30"></div>
        <div className="absolute w-[85%] h-[85%] rounded-full animate-ring-pulse animation-delay-200 border border-primary/30"></div>
        <div className="absolute w-[70%] h-[70%] rounded-full animate-ring-pulse animation-delay-400 border border-primary/30"></div>
        
        {/* Central Sphere */}
        <div className="relative w-48 h-48 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center animate-sphere-pulse overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-primary/30 to-transparent"></div>
        </div>

        {/* Microphone Button */}
        <button
          onClick={stopListening}
          className="absolute z-10 w-24 h-24 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center animate-float hover:bg-primary transition-all"
        >
          <Mic className="w-12 h-12" />
          <span className="sr-only">Stop Listening</span>
        </button>
      </div>
    </div>
  );
}

// Add this to your globals.css or tailwind.config.ts if you can
const gridPatternStyle = {
  backgroundImage:
    'linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};
