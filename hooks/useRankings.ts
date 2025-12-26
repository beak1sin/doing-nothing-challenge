import { useState, useCallback, useEffect, useRef } from "react";
import { supabase, Ranking } from "@/lib/supabase";

type RankingFilter = "world" | "country";

interface Stats {
  totalParticipants: number;
  averageTime: number;
  myPercentile: number | null;
}

export function useRankings() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filter, setFilter] = useState<RankingFilter>("world");
  const [userCountry, setUserCountry] = useState<string>("KR");
  const [stats, setStats] = useState<Stats>({
    totalParticipants: 0,
    averageTime: 0,
    myPercentile: null,
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // 사용자 국가 감지
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const lang = navigator.language || "ko-KR";
        const countryCode = lang.split("-")[1] || "KR";
        setUserCountry(countryCode.toUpperCase());
      } catch {
        setUserCountry("KR");
      }
    };
    detectCountry();
  }, []);

  // 통계 조회
  const fetchStats = useCallback(async (myScore?: number) => {
    // 전체 참가자 수
    const { count: totalCount } = await supabase
      .from("rankings")
      .select("*", { count: "exact", head: true });

    // 평균 점수 계산을 위한 모든 점수 조회
    const { data: allScores } = await supabase.from("rankings").select("score");

    let averageTime = 0;
    if (allScores && allScores.length > 0) {
      const total = allScores.reduce((sum, r) => sum + r.score, 0);
      averageTime = Math.round(total / allScores.length);
    }

    // 내 상위 퍼센트
    let myPercentile: number | null = null;
    if (myScore && totalCount && totalCount > 0) {
      const { count: betterCount } = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true })
        .gt("score", myScore);

      myPercentile = Math.round(((betterCount || 0) / totalCount) * 100);
    }

    setStats({
      totalParticipants: totalCount || 0,
      averageTime,
      myPercentile,
    });
  }, []);

  // TOP 100 랭킹 조회
  const fetchRankings = useCallback(
    async (filterType?: RankingFilter) => {
      setLoading(true);
      setError(null);

      const currentFilter = filterType || filter;

      let query = supabase
        .from("rankings")
        .select("*")
        .order("score", { ascending: false })
        .limit(100);

      if (currentFilter === "country" && userCountry) {
        query = query.eq("country", userCountry);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setRankings(data || []);
      }
      setLoading(false);

      // 통계도 함께 조회
      fetchStats();
    },
    [filter, userCountry, fetchStats]
  );

  // 필터 변경 시 다시 조회
  useEffect(() => {
    if (filter) {
      fetchRankings(filter);
    }
  }, [filter, fetchRankings]);

  // 실시간 구독 설정
  const subscribeToRankings = useCallback(() => {
    if (channelRef.current) return;

    const channel = supabase
      .channel("rankings-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rankings",
        },
        (payload) => {
          const newRanking = payload.new as Ranking;
          setRankings((prev) => {
            if (prev.some((r) => r.id === newRanking.id)) {
              return prev;
            }
            const updated = [...prev, newRanking].sort((a, b) => b.score - a.score).slice(0, 100);
            return updated;
          });

          // 통계 업데이트
          setStats((prev) => ({
            ...prev,
            totalParticipants: prev.totalParticipants + 1,
          }));
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  // 구독 해제
  const unsubscribeFromRankings = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    return () => {
      unsubscribeFromRankings();
    };
  }, [unsubscribeFromRankings]);

  // 점수 제출
  const submitScore = useCallback(
    async (nickname: string, score: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("rankings")
        .insert({ nickname, score, country: userCountry });

      if (error) {
        setError(error.message);
        setLoading(false);
        return false;
      }

      // 제출 후 내 순위 조회
      const { count } = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true })
        .gt("score", score);

      setUserRank((count || 0) + 1);

      // 통계 업데이트 (내 점수 포함)
      await fetchStats(score);

      setLoading(false);
      return true;
    },
    [userCountry, fetchStats]
  );

  // 시간 포맷 (밀리초 -> 분:초)
  const formatTime = useCallback((ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  }, []);

  return {
    rankings,
    loading,
    error,
    userRank,
    filter,
    userCountry,
    stats,
    setFilter,
    fetchRankings,
    fetchStats,
    submitScore,
    formatTime,
    subscribeToRankings,
    unsubscribeFromRankings,
  };
}
