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
    markCurrentWord,
  } = useLrcGenerator();

  const lrcContent = words.length > 0 ? generateLrc() : '';

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12">
        <Header onReset={resetAll} />

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-6 mt-4">
          {/* Left Column - Audio & Lyrics Input */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6 animate-fade-up opacity-0 stagger-2">
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
              onSync={markCurrentWord}
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
        <div className="mt-6 sm:mt-8 text-center animate-fade-up opacity-0 stagger-5 px-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Play audio → Click a word to select → Press <kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded border border-border font-mono text-[10px] sm:text-xs mx-0.5 sm:mx-1">Space</kbd> to sync
          </p>
        </div>

        {/* Credits */}
        <div className="mt-8 sm:mt-12 text-center animate-fade-up opacity-0 stagger-5">
          <p className="text-xs text-muted-foreground/60">
            Made with ❤️ by Ash
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
