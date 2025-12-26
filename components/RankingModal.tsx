"use client";

import { useEffect } from "react";
import { Ranking } from "@/lib/supabase";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: Ranking[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function RankingModal({
  isOpen,
  onClose,
  rankings,
  loading,
  error,
  onRefresh,
}: RankingModalProps) {
  useEffect(() => {
    if (isOpen) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

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
          <p className="text-zinc-500 text-sm">전 세계 멍때리기 챔피언들</p>
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
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-700/30"
                      : "bg-zinc-800/30 border border-zinc-700/30"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center">
                    {index < 3 ? (
                      <span className="text-2xl">{getMedal(index + 1)}</span>
                    ) : (
                      <span className="text-zinc-500 font-mono">{index + 1}</span>
                    )}
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
