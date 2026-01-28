export interface Word {
  id: string;
  text: string;
  timestamp: number | null;
  lineIndex: number;
  wordIndex: number;
}

export interface LrcLine {
  lineIndex: number;
  words: Word[];
  startTime: number | null;
}

export interface SyncState {
  currentWordIndex: number;
  words: Word[];
  isPlaying: boolean;
  audioCurrentTime: number;
}
