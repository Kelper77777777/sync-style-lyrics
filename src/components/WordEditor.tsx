import { useMemo } from 'react';
import { Word } from '@/types/lrc';
import { Keyboard, MousePointer } from 'lucide-react';

interface WordEditorProps {
  words: Word[];
  currentWordIndex: number;
  onWordClick: (index: number) => void;
  onWordClear: (index: number) => void;
  isPlaying: boolean;
}

export function WordEditor({ 
  words, 
  currentWordIndex, 
  onWordClick, 
  onWordClear,
  isPlaying 
}: WordEditorProps) {
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
    <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col h-full min-h-[300px]">
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

      {/* Instructions */}
      <div className="bg-secondary/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary text-primary-foreground flex items-center 
                        justify-center font-mono text-xs sm:text-sm font-bold shrink-0">
          ␣
        </div>
        <p className="text-xs sm:text-sm text-foreground/80">
          Press <kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded border border-border font-mono text-[10px] sm:text-xs">Space</kbd> to 
          sync • Click to select • Double-click to clear
        </p>
      </div>

      {/* Words grid */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2 max-h-[300px] sm:max-h-[400px]">
        {lines.map((line) => (
          <div key={line.lineIndex} className="flex flex-wrap gap-1.5 sm:gap-2 py-1.5 sm:py-2 border-b border-border/30 last:border-0">
            {line.words.map(({ word, globalIndex }) => (
              <span
                key={word.id}
                onClick={() => onWordClick(globalIndex)}
                onDoubleClick={() => onWordClear(globalIndex)}
                className={`word-span text-sm sm:text-base ${
                  globalIndex === currentWordIndex
                    ? 'active'
                    : word.timestamp !== null
                    ? 'synced'
                    : ''
                } ${isPlaying && globalIndex === currentWordIndex ? 'animate-pulse' : ''}`}
              >
                {word.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
