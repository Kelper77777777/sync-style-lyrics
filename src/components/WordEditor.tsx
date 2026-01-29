import { useMemo, useRef, useEffect } from 'react';
import { Word } from '@/types/lrc';
import { Keyboard, MousePointer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordEditorProps {
  words: Word[];
  currentWordIndex: number;
  onWordClick: (index: number) => void;
  onWordClear: (index: number) => void;
  onSync: () => void;
  isPlaying: boolean;
}

export function WordEditor({ 
  words, 
  currentWordIndex, 
  onWordClick, 
  onWordClear,
  onSync,
  isPlaying 
}: WordEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Group words by line
  const lines = useMemo(() => {
    const grouped: { lineIndex: number; words: { word: Word; globalIndex: number }[] }[] = [];
    
    words.forEach((word, globalIndex) => {
      const existingLine = grouped.find(l => l.lineIndex === word.lineIndex);
      if (existingLine) {
        existingLine.words.push({ word, globalIndex });
      } else {
        grouped.push({ lineIndex: word.lineIndex, words: [{ word, globalIndex }] });
      }
    });
    
    return grouped.sort((a, b) => a.lineIndex - b.lineIndex);
  }, [words]);

  // Find which line the current word is on
  const currentLineIndex = useMemo(() => {
    if (currentWordIndex >= 0 && currentWordIndex < words.length) {
      return words[currentWordIndex].lineIndex;
    }
    return -1;
  }, [currentWordIndex, words]);

  // Auto-scroll to keep active word in view with smooth animation
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const wordRect = activeWord.getBoundingClientRect();
      
      const relativeTop = wordRect.top - containerRect.top + container.scrollTop;
      const targetScroll = relativeTop - containerRect.height / 3;
      
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [currentWordIndex]);

  const syncedCount = words.filter(w => w.timestamp !== null).length;
  const progress = words.length > 0 ? (syncedCount / words.length) * 100 : 0;

  if (words.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center 
                      min-h-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <MousePointer className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Parse your lyrics to start word-by-word syncing
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col min-h-[280px] h-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <h3 className="font-display font-semibold text-base sm:text-lg">Word Editor</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {syncedCount}/{words.length} synced
          </span>
          <div className="w-20 sm:w-24 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-word-synced transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Instructions with Sync Button */}
      <div className="bg-secondary/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary text-primary-foreground flex items-center 
                          justify-center font-mono text-xs sm:text-sm font-bold shrink-0">
            ␣
          </div>
          <p className="text-xs sm:text-sm text-foreground/80">
            Press <kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded border border-border font-mono text-[10px] sm:text-xs">Space</kbd> or click Sync
          </p>
        </div>
        <Button
          onClick={onSync}
          size="sm"
          className="sync-button gap-1.5 px-3 sm:px-4"
          disabled={currentWordIndex >= words.length}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sync</span>
        </Button>
      </div>

      {/* Words grid with Apple Music style animations */}
      <div 
        ref={containerRef}
        className="overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2 max-h-[200px] sm:max-h-[350px] lyrics-container"
      >
        {lines.map((line) => {
          const isActiveLine = line.lineIndex === currentLineIndex;
          const lineDistance = Math.abs(line.lineIndex - currentLineIndex);
          
          return (
            <div 
              key={line.lineIndex} 
              className={`lyrics-line flex flex-wrap gap-1.5 sm:gap-2 py-2 sm:py-3 border-b border-border/30 last:border-0
                         transition-all duration-500 ease-out
                         ${isActiveLine ? 'lyrics-line-active' : 'lyrics-line-inactive'}
                         ${lineDistance > 2 ? 'lyrics-line-far' : ''}`}
              style={{
                transform: isActiveLine ? 'scale(1.02)' : 'scale(1)',
                opacity: isActiveLine ? 1 : Math.max(0.4, 1 - lineDistance * 0.15),
              }}
            >
              {line.words.map(({ word, globalIndex }) => {
                const isActiveWord = globalIndex === currentWordIndex;
                return (
                  <span
                    key={word.id}
                    ref={isActiveWord ? activeWordRef : null}
                    onClick={() => onWordClick(globalIndex)}
                    onDoubleClick={() => onWordClear(globalIndex)}
                    className={`word-span-enhanced text-sm sm:text-base ${
                      isActiveWord
                        ? 'word-active'
                        : word.timestamp !== null
                        ? 'word-synced'
                        : 'word-pending'
                    } ${isPlaying && isActiveWord ? 'word-pulsing' : ''}`}
                  >
                    {word.text}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
