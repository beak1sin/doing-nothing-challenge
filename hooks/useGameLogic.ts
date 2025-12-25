"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type GameState = "idle" | "playing" | "failed" | "paused";

export interface GameResult {
  duration: number;
  reason: string;
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [failReason, setFailReason] = useState<string>("");
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Format time as HH:MM:SS.ms
  const formatTime = useCallback((ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  }, []);

  // Timer loop
  const updateTimer = useCallback(() => {
    if (gameState === "playing") {
      setElapsedTime(Date.now() - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, updateTimer]);

  const startGame = useCallback(() => {
    setGameState("playing");
    setElapsedTime(0);
    setFailReason("");
    startTimeRef.current = Date.now();
  }, []);

  const failGame = useCallback((reason: string) => {
    setGameState("failed");
    setFailReason(reason);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameState("idle");
    setElapsedTime(0);
    setFailReason("");
  }, []);

  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  const resumeGame = useCallback(() => {
    startTimeRef.current = Date.now() - elapsedTime;
    setGameState("playing");
  }, [elapsedTime]);

  return {
    gameState,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    failReason,
    startGame,
    failGame,
    resetGame,
    pauseGame,
    resumeGame,
  };
}
