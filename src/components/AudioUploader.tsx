import { useCallback, useRef } from 'react';
import { Upload, Music } from 'lucide-react';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  audioFile: File | null;
}

export function AudioUploader({ onUpload, audioFile }: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      onUpload(file);
    }
  }, [onUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  }, [onUpload]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="glass-panel rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 
                 min-h-[120px] sm:min-h-[160px] transition-all duration-300 hover:border-primary/50 
                 hover:shadow-xl group"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,audio/mpeg,audio/wav"
        onChange={handleChange}
        className="hidden"
      />
      
      {audioFile ? (
        <>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-word-synced/10 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 sm:w-7 sm:h-7 text-word-synced" />
          </div>
          <div className="text-center w-full max-w-full px-2 overflow-hidden">
            <p className="font-medium text-foreground text-sm sm:text-base truncate" title={audioFile.name}>
              {audioFile.name}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Click to change file</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center 
                          group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Upload className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground text-sm sm:text-base">Drop audio file here</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">or click to browse • MP3, WAV</p>
          </div>
        </>
      )}
    </div>
  );
}
