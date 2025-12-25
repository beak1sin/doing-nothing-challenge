"use client";

import { useEffect, useCallback, useRef } from "react";
import { GameState } from "./useGameLogic";

interface UseAntiCheatProps {
  gameState: GameState;
  onFail: (reason: string) => void;
  movementThreshold?: number;
}

export function useAntiCheat({
  gameState,
  onFail,
  movementThreshold = 10,
}: UseAntiCheatProps) {
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // Mouse movement detection
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (gameState !== "playing") return;

      if (lastMousePos.current) {
        const deltaX = Math.abs(e.clientX - lastMousePos.current.x);
        const deltaY = Math.abs(e.clientY - lastMousePos.current.y);

        if (deltaX > movementThreshold || deltaY > movementThreshold) {
          onFail("🖱️ 마우스를 움직였습니다!");
          return;
        }
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [gameState, onFail, movementThreshold]
  );

  // Keyboard detection
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      // Allow spacebar for survival check
      if (e.code === "Space" || e.key === " ") {
        return;
      }

      onFail("⌨️ 키보드를 눌렀습니다!");
    },
    [gameState, onFail]
  );

  // Scroll detection
  const handleScroll = useCallback(() => {
    if (gameState !== "playing") return;
    onFail("📜 스크롤을 했습니다!");
  }, [gameState, onFail]);

  // Tab visibility detection (critical anti-cheat)
  const handleVisibilityChange = useCallback(() => {
    if (gameState !== "playing") return;

    if (document.hidden) {
      onFail("👀 한눈을 팔았습니다! (탭 전환 감지)");
    }
  }, [gameState, onFail]);

  // Window blur detection
  const handleWindowBlur = useCallback(() => {
    if (gameState !== "playing") return;
    onFail("🪟 다른 창으로 이동했습니다!");
  }, [gameState, onFail]);

  useEffect(() => {
    if (gameState === "playing") {
      // Reset mouse position when game starts
      lastMousePos.current = null;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("scroll", handleScroll, true);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("scroll", handleScroll, true);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleWindowBlur);
      };
    }
  }, [
    gameState,
    handleMouseMove,
    handleKeyDown,
    handleScroll,
    handleVisibilityChange,
    handleWindowBlur,
  ]);

  return null;
}
