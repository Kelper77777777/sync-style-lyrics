import { FileText } from 'lucide-react';

interface LyricsInputProps {
  lyrics: string;
  onLyricsChange: (lyrics: string) => void;
  onParseLyrics: () => void;
  hasWords: boolean;
}

export function LyricsInput({ lyrics, onLyricsChange, onParseLyrics, hasWords }: LyricsInputProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-display font-semibold text-lg">Lyrics</h3>
        </div>
        <button 
          onClick={onParseLyrics}
          disabled={!lyrics.trim()}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {hasWords ? 'Re-parse' : 'Parse Lyrics'}
        </button>
      </div>
      
      <textarea
        value={lyrics}
        onChange={(e) => onLyricsChange(e.target.value)}
        placeholder="Paste your lyrics here...&#10;&#10;Each line will be split into words&#10;for word-by-word timestamping."
        className="textarea-field flex-1 min-h-[200px]"
      />
      
      <p className="text-xs text-muted-foreground mt-3">
        Supports UTF-8: English, 日本語, हिंदी, العربية, emoji 🎵
      </p>
    </div>
  );
}
