import { Header } from '@/components/Header';
import { AudioUploader } from '@/components/AudioUploader';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LyricsInput } from '@/components/LyricsInput';
import { WordEditor } from '@/components/WordEditor';
import { LrcPreview } from '@/components/LrcPreview';
import { useLrcGenerator } from '@/hooks/useLrcGenerator';

const Index = () => {
  const {
    lyrics,
    words,
    currentWordIndex,
    audioFile,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    audioRef,
    setLyrics,
    parseLyrics,
    handleAudioUpload,
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
  } = useLrcGenerator();

  const lrcContent = words.length > 0 ? generateLrc() : '';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Header onReset={resetAll} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Left Column - Audio & Lyrics Input */}
          <div className="lg:col-span-4 space-y-6 animate-fade-up opacity-0 stagger-2">
            <AudioUploader 
              onUpload={handleAudioUpload} 
              audioFile={audioFile} 
            />
            
            {audioUrl && (
              <div className="animate-scale-in">
                <AudioPlayer
                  audioUrl={audioUrl}
                  audioRef={audioRef as React.RefObject<HTMLAudioElement>}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  onPlayPause={togglePlayPause}
                  onTimeUpdate={setCurrentTime}
                  onDurationChange={setDuration}
                  onSeek={seekAudio}
                  onPlayingChange={setIsPlaying}
                />
              </div>
            )}

            <LyricsInput
              lyrics={lyrics}
              onLyricsChange={setLyrics}
              onParseLyrics={() => parseLyrics(lyrics)}
              hasWords={words.length > 0}
            />
          </div>

          {/* Middle Column - Word Editor */}
          <div className="lg:col-span-4 animate-fade-up opacity-0 stagger-3">
            <WordEditor
              words={words}
              currentWordIndex={currentWordIndex}
              onWordClick={jumpToWord}
              onWordClear={clearWordTimestamp}
              isPlaying={isPlaying}
            />
          </div>

          {/* Right Column - LRC Preview */}
          <div className="lg:col-span-4 animate-fade-up opacity-0 stagger-4">
            <LrcPreview
              lrcContent={lrcContent}
              onDownload={downloadLrc}
              hasContent={words.some(w => w.timestamp !== null)}
            />
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-8 text-center animate-fade-up opacity-0 stagger-5">
          <p className="text-sm text-muted-foreground">
            Play audio → Click a word to select → Press <kbd className="px-1.5 py-0.5 bg-card rounded border border-border font-mono text-xs mx-1">Space</kbd> to sync
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
