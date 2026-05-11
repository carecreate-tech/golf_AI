"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Club } from "@/types/club";
import { Sparkles, RefreshCw } from "lucide-react";

interface Props {
  clubs: Club[];
}

export default function AiAnalysisCard({ clubs }: Props) {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (clubs.length < 2) {
      setError("クラブを2本以上登録してから分析してください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubs }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "分析に失敗しました");
      }
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Sparkles className="h-5 w-5" />
          AI クラブ構成分析
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report && !loading && (
          <p className="text-sm text-muted-foreground">
            あなたのクラブ構成をAIが分析します。距離ギャップ、クラブ被り、苦手距離を踏まえた改善提案を生成します。
          </p>
        )}

        {report && (
          <div className="text-sm leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-4 border border-green-100">
            {report}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          onClick={analyze}
          disabled={loading || clubs.length < 2}
          className="w-full bg-green-700 hover:bg-green-800"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : report ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              再分析する
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              AIで分析する
            </>
          )}
        </Button>

        {clubs.length < 2 && (
          <p className="text-xs text-center text-muted-foreground">
            クラブを2本以上登録すると分析できます（現在: {clubs.length}本）
          </p>
        )}
      </CardContent>
    </Card>
  );
}
