"use client";

interface SoundControlProps {
  isMuted: boolean;
  isBgmPlaying: boolean;
  onToggleMute: () => void;
  onToggleBgm: () => void;
}

export default function SoundControl({
  isMuted,
  isBgmPlaying,
  onToggleMute,
  onToggleBgm,
}: SoundControlProps) {
  return (
    <div className="fixed top-4 right-4 z-30 flex gap-2">
      {/* 음소거 버튼 */}
      <button
        onClick={onToggleMute}
        className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center text-lg hover:bg-zinc-800 transition-colors"
        title={isMuted ? "음소거 해제" : "음소거"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* 배경음악 버튼 */}
      <button
        onClick={onToggleBgm}
        className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg transition-colors ${
          isBgmPlaying
            ? "bg-purple-900/80 border-purple-500 text-purple-300"
            : "bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800"
        }`}
        title={isBgmPlaying ? "음악 끄기" : "명상 음악"}
      >
        🎵
      </button>
    </div>
  );
}
