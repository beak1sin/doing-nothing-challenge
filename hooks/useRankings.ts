import { useState, useCallback } from "react";
import { supabase, Ranking } from "@/lib/supabase";

export function useRankings() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  // TOP 100 랭킹 조회
  const fetchRankings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("rankings")
      .select("*")
      .order("score", { ascending: false })
      .limit(100);

    if (error) {
      setError(error.message);
    } else {
      setRankings(data || []);
    }
    setLoading(false);
  }, []);

  // 점수 제출
  const submitScore = useCallback(async (nickname: string, score: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("rankings").insert({ nickname, score });

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
    setLoading(false);
    return true;
  }, []);

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
    fetchRankings,
    submitScore,
    formatTime,
  };
}
