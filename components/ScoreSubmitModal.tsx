"use client";

import { useState } from "react";

interface ScoreSubmitModalProps {
  isOpen: boolean;
  score: number;
  formattedTime: string;
  onClose: () => void;
  onSubmit: (nickname: string) => Promise<boolean>;
  onViewRankings: () => void;
  loading: boolean;
  userRank: number | null;
}

export default function ScoreSubmitModal({
  isOpen,
  score,
  formattedTime,
  onClose,
  onSubmit,
  onViewRankings,
  loading,
  userRank,
}: ScoreSubmitModalProps) {
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (nickname.length < 2 || nickname.length > 10) {
      setError("닉네임은 2-10자로 입력해주세요");
      return;
    }

    const success = await onSubmit(nickname);
    if (success) {
      setSubmitted(true);
      setError("");
    } else {
      setError("점수 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleClose = () => {
    setNickname("");
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-sm w-full mx-4 text-center modal-animate">
        {!submitted ? (
          <>
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">월드랭킹 등록</h3>
            <p className="text-zinc-400 mb-2">
              당신의 기록: <span className="text-white font-semibold">{formattedTime}</span>
            </p>

            <div className="my-6">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력 (2-10자)"
                maxLength={10}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-center"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || nickname.length < 2}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "등록 중..." : "랭킹 등록하기"}
              </button>
              <button onClick={handleClose} className="btn-secondary w-full">
                나중에 하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">등록 완료!</h3>
            {userRank && (
              <p className="text-zinc-400 mb-4">
                당신의 순위: <span className="text-2xl font-bold text-yellow-400">#{userRank}</span>
              </p>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  handleClose();
                  onViewRankings();
                }}
                className="btn-primary w-full"
              >
                🏆 랭킹 보기
              </button>
              <button onClick={handleClose} className="btn-secondary w-full">
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
