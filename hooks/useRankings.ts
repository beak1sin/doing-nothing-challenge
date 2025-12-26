import { useState, useCallback, useEffect, useRef } from "react";
import { supabase, Ranking } from "@/lib/supabase";

type RankingFilter = "world" | "country";

export function useRankings() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filter, setFilter] = useState<RankingFilter>("world");
  const [userCountry, setUserCountry] = useState<string>("KR");
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // 사용자 국가 감지
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // 브라우저 언어 기반 국가 추정 (간단한 방법)
        const lang = navigator.language || "ko-KR";
        const countryCode = lang.split("-")[1] || "KR";
        setUserCountry(countryCode.toUpperCase());
      } catch {
        setUserCountry("KR");
      }
    };
    detectCountry();
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
    },
    [filter, userCountry]
  );

  // 필터 변경 시 다시 조회
  useEffect(() => {
    if (filter) {
      fetchRankings(filter);
    }
  }, [filter, fetchRankings]);

  // 실시간 구독 설정
  const subscribeToRankings = useCallback(() => {
    // 이미 구독 중이면 스킵
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
            // 이미 존재하는 ID면 스킵
            if (prev.some((r) => r.id === newRanking.id)) {
              return prev;
            }
            // 새 랭킹 추가 후 정렬
            const updated = [...prev, newRanking].sort((a, b) => b.score - a.score).slice(0, 100);
            return updated;
          });
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

      // 제출 후 내 순위 조회 (전체 랭킹 기준)
      const { count } = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true })
        .gt("score", score);

      setUserRank((count || 0) + 1);
      setLoading(false);
      return true;
    },
    [userCountry]
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
    setFilter,
    fetchRankings,
    submitScore,
    formatTime,
    subscribeToRankings,
    unsubscribeFromRankings,
  };
}
