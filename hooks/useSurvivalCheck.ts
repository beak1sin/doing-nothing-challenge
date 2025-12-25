"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { GameState } from "./useGameLogic";

interface UseSurvivalCheckProps {
  gameState: GameState;
  onFail: (reason: string) => void;
  minInterval?: number; // minimum seconds between checks
  maxInterval?: number; // maximum seconds between checks
  responseTime?: number; // seconds to respond
}

export function useSurvivalCheck({
  gameState,
  onFail,
  minInterval = 30,
  maxInterval = 60,
  responseTime = 5,
}: UseSurvivalCheckProps) {
  const [showCheck, setShowCheck] = useState(false);
  const [timeLeft, setTimeLeft] = useState(responseTime);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomInterval = useCallback(() => {
    return (minInterval + Math.random() * (maxInterval - minInterval)) * 1000;
  }, [minInterval, maxInterval]);

  const scheduleNextCheck = useCallback(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    const interval = getRandomInterval();
    checkTimeoutRef.current = setTimeout(() => {
      if (gameState === "playing") {
        setShowCheck(true);
        setTimeLeft(responseTime);
      }
    }, interval);
  }, [gameState, getRandomInterval, responseTime]);

  // Start countdown when check appears
  useEffect(() => {
    if (showCheck && gameState === "playing") {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowCheck(false);
            onFail("⏰ 생존 신고에 실패했습니다! (자리 비움)");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [showCheck, gameState, onFail]);

  // Handle spacebar press for survival check
  const handleSurvivalResponse = useCallback(() => {
    if (showCheck) {
      setShowCheck(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      scheduleNextCheck();
    }
  }, [showCheck, scheduleNextCheck]);

  // Listen for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === " ") && showCheck) {
        e.preventDefault();
        handleSurvivalResponse();
      }
    };

    if (showCheck) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showCheck, handleSurvivalResponse]);

  // Start check scheduler when game starts
  useEffect(() => {
    if (gameState === "playing") {
      scheduleNextCheck();
    } else {
      setShowCheck(false);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [gameState, scheduleNextCheck]);

  return {
    showCheck,
    timeLeft,
    handleSurvivalResponse,
  };
}
