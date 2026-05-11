"use client";

import { useState, useEffect, useCallback } from "react";
import { Club, ClubInput } from "@/types/club";

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clubs");
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setClubs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const addClub = async (input: ClubInput) => {
    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "登録に失敗しました");
    }
    await fetchClubs();
  };

  const deleteClub = async (id: string) => {
    const res = await fetch(`/api/clubs?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("削除に失敗しました");
    await fetchClubs();
  };

  return { clubs, loading, error, addClub, deleteClub, refetch: fetchClubs };
}
