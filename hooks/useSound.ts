import { useCallback, useRef, useState, useEffect } from "react";

interface UseSoundOptions {
  volume?: number;
}

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // 클라이언트 사이드에서만 Audio 생성
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 배경음악 초기화
      bgmRef.current = new Audio("/sounds/meditation.mp3");
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.3;
    }

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  // 효과음 재생
  const playSound = useCallback(
    (soundName: "start" | "fail" | "success" | "click", options?: UseSoundOptions) => {
      if (isMuted || typeof window === "undefined") return;

      const soundMap: Record<string, string> = {
        start: "/sounds/start.mp3",
        fail: "/sounds/fail.mp3",
        success: "/sounds/success.mp3",
        click: "/sounds/click.mp3",
      };

      const audio = new Audio(soundMap[soundName]);
      audio.volume = options?.volume ?? 0.5;
      audio.play().catch(() => {
        // 자동재생 정책으로 인한 에러 무시
      });
    },
    [isMuted]
  );

  // 배경음악 토글
  const toggleBgm = useCallback(() => {
    if (!bgmRef.current) return;

    if (isBgmPlaying) {
      bgmRef.current.pause();
      setIsBgmPlaying(false);
    } else {
      bgmRef.current.play().catch(() => {
        // 자동재생 정책으로 인한 에러 무시
      });
      setIsBgmPlaying(true);
    }
  }, [isBgmPlaying]);

  // 배경음악 시작
  const startBgm = useCallback(() => {
    if (!bgmRef.current || isBgmPlaying) return;
    bgmRef.current.play().catch(() => {});
    setIsBgmPlaying(true);
  }, [isBgmPlaying]);

  // 배경음악 정지
  const stopBgm = useCallback(() => {
    if (!bgmRef.current) return;
    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
    setIsBgmPlaying(false);
  }, []);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (bgmRef.current) {
      bgmRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  return {
    isMuted,
    isBgmPlaying,
    playSound,
    toggleBgm,
    startBgm,
    stopBgm,
    toggleMute,
  };
}
