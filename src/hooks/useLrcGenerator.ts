import { useState, useCallback, useRef, useEffect } from 'react';
import { Word } from '@/types/lrc';

export function useLrcGenerator() {
  const [lyrics, setLyrics] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse lyrics into words
  const parseLyrics = useCallback((text: string) => {
    const lines = text.split('\n');
    const parsedWords: Word[] = [];
    
    lines.forEach((line, lineIndex) => {
      const lineWords = line.trim().split(/\s+/).filter(w => w.length > 0);
      lineWords.forEach((word, wordIndex) => {
        parsedWords.push({
          id: `${lineIndex}-${wordIndex}`,
          text: word,
          timestamp: null,
          lineIndex,
          wordIndex,
        });
      });
    });
    
    setWords(parsedWords);
    setCurrentWordIndex(0);
  }, []);

  // Handle audio file upload
  const handleAudioUpload = useCallback((file: File) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioUrl]);

  // Mark current word with timestamp
  const markCurrentWord = useCallback(() => {
    if (currentWordIndex >= words.length) return;
    
    const time = audioRef.current?.currentTime ?? 0;
    
    setWords(prev => prev.map((word, index) => 
      index === currentWordIndex 
        ? { ...word, timestamp: time }
        : word
    ));
    
    setCurrentWordIndex(prev => Math.min(prev + 1, words.length));
  }, [currentWordIndex, words.length]);

  // Jump to specific word
  const jumpToWord = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  // Clear timestamp for a word
  const clearWordTimestamp = useCallback((index: number) => {
    setWords(prev => prev.map((word, i) => 
      i === index ? { ...word, timestamp: null } : word
    ));
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Seek audio
  const seekAudio = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Generate LRC content
  const generateLrc = useCallback(() => {
    const lines: { lineIndex: number; words: Word[] }[] = [];
    
    words.forEach(word => {
      const existingLine = lines.find(l => l.lineIndex === word.lineIndex);
      if (existingLine) {
        existingLine.words.push(word);
      } else {
        lines.push({ lineIndex: word.lineIndex, words: [word] });
      }
    });
    
    lines.sort((a, b) => a.lineIndex - b.lineIndex);
    
    const lrcLines = lines.map(line => {
      const firstWord = line.words.find(w => w.timestamp !== null);
      const lineStartTime = firstWord?.timestamp ?? 0;
      
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
      };
      
      const wordTags = line.words.map(word => {
        if (word.timestamp !== null) {
          return `<${formatTime(word.timestamp)}> ${word.text}`;
        }
        return word.text;
      }).join(' ');
      
      return `[${formatTime(lineStartTime)}] ${wordTags}`;
    });
    
    return lrcLines.join('\n');
  }, [words]);

  // Download LRC file
  const downloadLrc = useCallback(() => {
    const lrcContent = generateLrc();
    const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = audioFile ? `${audioFile.name.replace(/\.[^/.]+$/, '')}.lrc` : 'lyrics.lrc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateLrc, audioFile]);

  // Reset all
  const resetAll = useCallback(() => {
    setLyrics('');
    setWords([]);
    setCurrentWordIndex(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && audioUrl && words.length > 0) {
        // Prevent default only if we're not in an input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
          e.preventDefault();
          markCurrentWord();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markCurrentWord, audioUrl, words.length]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    // State
    lyrics,
    words,
    currentWordIndex,
    audioFile,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    audioRef,
    
    // Actions
    setLyrics,
    parseLyrics,
    handleAudioUpload,
    markCurrentWord,
    jumpToWord,
    clearWordTimestamp,
    togglePlayPause,
    seekAudio,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    generateLrc,
    downloadLrc,
    resetAll,
  };
}
