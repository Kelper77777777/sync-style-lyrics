import { FileText } from 'lucide-react';

interface LyricsInputProps {
  lyrics: string;
  onLyricsChange: (lyrics: string) => void;
  onParseLyrics: () => void;
  hasWords: boolean;
}

export function LyricsInput({ lyrics, onLyricsChange, onParseLyrics, hasWords }: LyricsInputProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <h3 className="font-display font-semibold text-base sm:text-lg">Lyrics</h3>
        </div>
        <button 
          onClick={onParseLyrics}
          disabled={!lyrics.trim()}
          className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto"
        >
          {hasWords ? 'Re-parse' : 'Parse Lyrics'}
        </button>
      </div>
      
      <textarea
        value={lyrics}
        onChange={(e) => onLyricsChange(e.target.value)}
        placeholder="Paste your lyrics here...&#10;&#10;Each line will be split into words&#10;for word-by-word timestamping."
        className="textarea-field flex-1 min-h-[150px] sm:min-h-[200px]"
      />
      
      <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
        Supports UTF-8: English, 日本語, हिंदी, العربية, emoji 🎵
      </p>
    </div>
  );
}
