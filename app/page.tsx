"use client";

import { useMemo, useState } from "react";
import { useGameLogic, useAntiCheat, useSurvivalCheck, useRankings } from "@/hooks";
import ScoreSubmitModal from "@/components/ScoreSubmitModal";
import RankingModal from "@/components/RankingModal";

// Zen quotes for atmosphere
const ZEN_QUOTES = [
  "고요함 속에서 진정한 자아를 발견하라.",
  "아무것도 하지 않는 것도 하나의 기술이다.",
  "멈춤 속에 움직임이 있다.",
  "생각을 멈추고, 그저 존재하라.",
  "지금 이 순간에 머물러라.",
];

export default function Home() {
  const { gameState, formattedTime, elapsedTime, failReason, startGame, failGame, resetGame } =
    useGameLogic();

  useAntiCheat({
    gameState,
    onFail: failGame,
    movementThreshold: 15,
  });

  const { showCheck, timeLeft, handleSurvivalResponse } = useSurvivalCheck({
    gameState,
    onFail: failGame,
    minInterval: 30,
    maxInterval: 60,
    responseTime: 5,
  });

  // Ranking hooks and states
  const {
    rankings,
    loading: rankingLoading,
    error: rankingError,
    userRank,
    filter,
    userCountry,
    setFilter,
    fetchRankings,
    submitScore,
    subscribeToRankings,
    unsubscribeFromRankings,
  } = useRankings();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);

  // Get random quote (memoized to avoid impure function during render)
  const randomQuote = useMemo(() => ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)], []);

  // Save best score to localStorage
  const saveBestScore = () => {
    if (typeof window !== "undefined") {
      const currentBest = localStorage.getItem("bestScore");
      if (!currentBest || elapsedTime > parseInt(currentBest)) {
        localStorage.setItem("bestScore", elapsedTime.toString());
      }
    }
  };

  // Get best score
  const getBestScore = () => {
    if (typeof window !== "undefined") {
      const best = localStorage.getItem("bestScore");
      if (best) {
        const ms = parseInt(best);
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}분 ${seconds}초`;
      }
    }
    return "기록 없음";
  };

  // Effect to save score when game fails
  if (gameState === "failed" && elapsedTime > 0) {
    saveBestScore();
  }

  // Handle score submission
  const handleSubmitScore = async (nickname: string): Promise<boolean> => {
    return await submitScore(nickname, elapsedTime);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-10px`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
        />
      ))}

      {/* Concentric Ripple Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="ripple-circle"
            style={{
              width: "300px",
              height: "300px",
              animationDelay: `${i * 1.3}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient Glow */}
      <div
        className="ambient-glow"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-widest text-zinc-500 uppercase">
            The Art of
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent pb-1">
            Doing Nothing
          </h2>
          <p className="mt-3 text-zinc-500 text-sm">멍때리기 대회</p>
        </div>

        {/* Game Area */}
        {gameState === "idle" && (
          <div className="flex flex-col items-center gap-8 mt-8">
            {/* Instructions Card */}
            <div className="glass-card p-8 max-w-md text-center">
              <h3 className="text-xl font-semibold text-white mb-4">🧘 규칙</h3>
              <ul className="text-zinc-400 text-left space-y-2 text-sm">
                <li>• 마우스를 움직이면 탈락</li>
                <li>• 키보드를 누르면 탈락</li>
                <li>• 다른 탭으로 이동하면 탈락</li>
                <li>
                  • 가끔 나오는 <span className="text-blue-400">생존 신고</span>에 응답하세요
                </li>
              </ul>
              <p className="mt-4 text-zinc-500 text-xs">
                최고 기록: <span className="text-white">{getBestScore()}</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button onClick={startGame} className="btn-primary text-lg px-12 py-4">
                시작하기
              </button>
              <button
                onClick={() => setShowRankingModal(true)}
                className="btn-secondary px-12 py-3"
              >
                🏆 월드랭킹
              </button>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === "playing" && (
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Timer Circle */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full glass-card pulse-ring flex items-center justify-center">
                <div className="text-center">
                  <p className="timer-display">{formattedTime}</p>
                  <p className="text-zinc-500 text-sm mt-2">화면을 응시하세요</p>
                </div>
              </div>
            </div>

            {/* Zen Quote */}
            <p className="text-zinc-600 text-sm italic max-w-xs text-center">
              &ldquo;{randomQuote}&rdquo;
            </p>
          </div>
        )}

        {/* Failed State */}
        {gameState === "failed" && (
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Result Card */}
            <div className="glass-card p-8 max-w-md text-center modal-animate">
              <div className="text-6xl mb-4">😵</div>
              <h3 className="text-2xl font-bold text-white mb-2">탈락!</h3>
              <p className="text-zinc-400 mb-4">{failReason}</p>

              <div className="my-6 py-4 border-y border-zinc-800">
                <p className="text-zinc-500 text-sm">버틴 시간</p>
                <p className="text-4xl font-light text-white">{formattedTime}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="btn-primary w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500"
                >
                  🏆 월드랭킹 등록
                </button>
                <button onClick={resetGame} className="btn-primary w-full">
                  다시 도전
                </button>
                <button
                  onClick={() => {
                    const text = `나 ${formattedTime} 멍때림 ㅋㅋㅋ 너도 도전해봐!`;
                    if (navigator.share) {
                      navigator.share({ text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text + " " + window.location.href);
                      alert("클립보드에 복사되었습니다!");
                    }
                  }}
                  className="btn-secondary w-full"
                >
                  친구한테 자랑하기 📤
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survival Check Modal */}
        {showCheck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass-card p-8 max-w-sm text-center modal-animate">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">생존 신고!</h3>
              <p className="text-zinc-400 mb-4">
                아직 화면을 보고 있다면
                <br />
                <span className="text-blue-400 font-semibold">스페이스바</span>를 누르세요
              </p>

              {/* Countdown */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-red-500">{timeLeft}</span>
                <span className="text-zinc-500 ml-1">초</span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 countdown-bar"
                  style={{ animationDuration: `${5}s` }}
                />
              </div>

              {/* Mobile tap button */}
              <button onClick={handleSurvivalResponse} className="btn-primary w-full mt-6">
                여기 있어요! 👋
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ad Placeholder */}
      {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-6 py-2 text-zinc-600 text-xs">
          광고 영역 (AdSense)
        </div>
      </div> */}

      {/* Score Submit Modal */}
      <ScoreSubmitModal
        isOpen={showSubmitModal}
        score={elapsedTime}
        formattedTime={formattedTime}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitScore}
        onViewRankings={() => setShowRankingModal(true)}
        loading={rankingLoading}
        userRank={userRank}
      />

      {/* Ranking Modal */}
      <RankingModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
        rankings={rankings}
        loading={rankingLoading}
        error={rankingError}
        filter={filter}
        userCountry={userCountry}
        onFilterChange={setFilter}
        onRefresh={fetchRankings}
        onSubscribe={subscribeToRankings}
        onUnsubscribe={unsubscribeFromRankings}
      />
    </main>
  );
}
