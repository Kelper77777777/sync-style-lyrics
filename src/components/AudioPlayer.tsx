import { useEffect, RefObject } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  audioRef: RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onSeek: (time: number) => void;
  onPlayingChange: (playing: boolean) => void;
}

export function AudioPlayer({
  audioUrl,
  audioRef,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onTimeUpdate,
  onDurationChange,
  onSeek,
  onPlayingChange,
}: AudioPlayerProps) {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => onTimeUpdate(audio.currentTime);
    const handleDurationChange = () => onDurationChange(audio.duration);
    const handleEnded = () => onPlayingChange(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, onTimeUpdate, onDurationChange, onPlayingChange]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const skipForward = () => onSeek(Math.min(currentTime + 5, duration));
  const skipBackward = () => onSeek(Math.max(currentTime - 5, 0));
  const restart = () => onSeek(0);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Progress bar */}
      <div 
        className="h-2 bg-secondary rounded-full overflow-hidden mb-4 group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          onSeek(percent * duration);
        }}
      >
        <div 
          className="h-full bg-primary transition-all duration-100 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary 
                          rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span className="font-mono">{formatTime(currentTime)}</span>
        <span className="font-mono">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={restart} className="btn-ghost p-3">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={skipBackward} className="btn-ghost p-3">
          <Rewind className="w-5 h-5" />
        </button>
        <button 
          onClick={onPlayPause}
          className="btn-primary w-14 h-14 rounded-full p-0 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        <button onClick={skipForward} className="btn-ghost p-3">
          <FastForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
