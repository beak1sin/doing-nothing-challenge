"use client";

import { useEffect } from "react";
import { Ranking, getFlag, countryNames } from "@/lib/supabase";

type RankingFilter = "world" | "country";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: Ranking[];
  loading: boolean;
  error: string | null;
  filter: RankingFilter;
  userCountry: string;
  onFilterChange: (filter: RankingFilter) => void;
  onRefresh: () => void;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

export default function RankingModal({
  isOpen,
  onClose,
  rankings,
  loading,
  error,
  filter,
  userCountry,
  onFilterChange,
  onRefresh,
  onSubscribe,
  onUnsubscribe,
}: RankingModalProps) {
  useEffect(() => {
    if (isOpen) {
      onRefresh();
      onSubscribe();
    } else {
      onUnsubscribe();
    }
  }, [isOpen, onRefresh, onSubscribe, onUnsubscribe]);

  if (!isOpen) return null;

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-card p-6 max-w-md w-full mx-4 modal-animate max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-xl font-bold text-white">월드랭킹 TOP 100</h3>
          <p className="text-zinc-500 text-sm flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            실시간
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onFilterChange("world")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filter === "world"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
            }`}
          >
            🌍 월드
          </button>
          <button
            onClick={() => onFilterChange("country")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filter === "country"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
            }`}
          >
            {getFlag(userCountry)} {countryNames[userCountry] || userCountry}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-zinc-400">로딩 중...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={onRefresh} className="btn-secondary">
              다시 시도
            </button>
          </div>
        )}

        {/* Rankings List */}
        {!loading && !error && (
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-2">
            {rankings.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                아직 등록된 기록이 없습니다.
                <br />첫 번째 챔피언이 되어보세요!
              </div>
            ) : (
              rankings.map((ranking, index) => (
                <div
                  key={ranking.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-700/30"
                      : "bg-zinc-800/30 border border-zinc-700/30"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    {index < 3 ? (
                      <span className="text-xl">{getMedal(index + 1)}</span>
                    ) : (
                      <span className="text-zinc-500 font-mono text-sm">{index + 1}</span>
                    )}
                  </div>

                  {/* Country Flag */}
                  <div className="w-6 text-center">
                    <span className="text-lg">{getFlag(ranking.country)}</span>
                  </div>

                  {/* Nickname */}
                  <div className="flex-1 truncate">
                    <span className={`font-medium ${index < 3 ? "text-yellow-300" : "text-white"}`}>
                      {ranking.nickname}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className="text-zinc-300 font-mono text-sm">
                      {formatTime(ranking.score)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <button onClick={onClose} className="btn-secondary w-full">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
