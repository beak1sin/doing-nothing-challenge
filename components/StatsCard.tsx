"use client";

interface StatsCardProps {
  totalParticipants: number;
  averageTime: number;
  myPercentile: number | null;
  formatTime: (ms: number) => string;
}

export default function StatsCard({
  totalParticipants,
  averageTime,
  myPercentile,
  formatTime,
}: StatsCardProps) {
  return (
    <div className="glass-card p-4 mb-4">
      <h4 className="text-sm font-medium text-zinc-400 mb-3 text-center">📊 통계</h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* 전체 참가자 */}
        <div className="bg-zinc-800/30 rounded-lg p-2">
          <p className="text-2xl font-bold text-white">{totalParticipants.toLocaleString()}</p>
          <p className="text-xs text-zinc-500">참가자</p>
        </div>

        {/* 평균 시간 */}
        <div className="bg-zinc-800/30 rounded-lg p-2">
          <p className="text-lg font-bold text-white">{formatTime(averageTime)}</p>
          <p className="text-xs text-zinc-500">평균</p>
        </div>

        {/* 상위 % */}
        <div className="bg-zinc-800/30 rounded-lg p-2">
          {myPercentile !== null ? (
            <>
              <p className="text-2xl font-bold text-yellow-400">
                {myPercentile === 0 ? "TOP" : `${100 - myPercentile}%`}
              </p>
              <p className="text-xs text-zinc-500">내 순위</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-zinc-600">-</p>
              <p className="text-xs text-zinc-500">내 순위</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
