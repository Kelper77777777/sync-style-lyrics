import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between animate-fade-up opacity-0 stagger-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Zyphrus</h1>
          <p className="text-xs text-muted-foreground -mt-0.5">LRC Lyric Generator</p>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="btn-ghost text-sm"
      >
        New Project
      </button>
    </header>
  );
}
