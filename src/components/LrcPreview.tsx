import { Eye, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface LrcPreviewProps {
  lrcContent: string;
  onDownload: () => void;
  hasContent: boolean;
}

export function LrcPreview({ lrcContent, onDownload, hasContent }: LrcPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lrcContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <h3 className="font-display font-semibold text-base sm:text-lg">LRC Preview</h3>
        </div>
        {hasContent && (
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="btn-ghost text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
            >
              {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button 
              onClick={onDownload}
              className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Download .lrc</span>
              <span className="sm:hidden">.lrc</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden max-h-[300px] sm:max-h-[400px]">
        <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-auto h-full whitespace-pre-wrap break-all">
          {lrcContent || (
            <span className="text-muted-foreground italic">
              Your synced LRC output will appear here...
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
