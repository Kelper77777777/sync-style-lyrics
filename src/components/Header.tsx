import logoImage from '@/assets/logo.png';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="w-full py-4 sm:py-6 px-4 sm:px-8 flex items-center justify-between animate-fade-up opacity-0 stagger-1">
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={logoImage} alt="Zyphrus Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain" />
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">Zyphrus</h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5">LRC Lyric Generator</p>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="btn-ghost text-xs sm:text-sm px-2 sm:px-4"
      >
        New Project
      </button>
    </header>
  );
}
