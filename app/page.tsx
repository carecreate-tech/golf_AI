"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClubList from "@/components/ClubList";
import DistanceChart from "@/components/DistanceChart";
import AiAnalysisCard from "@/components/AiAnalysisCard";
import { useClubs } from "@/hooks/useClubs";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { clubs, loading, error, deleteClub } = useClubs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-green-800">⛳ Golf Club AI</h1>
            <p className="text-xs text-muted-foreground">クラブ構成を最適化する</p>
          </div>
          <Link href="/clubs/new">
            <Button className="bg-green-700 hover:bg-green-800">
              <PlusCircle className="h-4 w-4 mr-2" />
              クラブを追加
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">登録クラブ数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700">
                {loading ? "..." : clubs.length}
                <span className="text-lg font-normal text-muted-foreground ml-1">/ 14本</span>
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">飛距離レンジ</CardTitle>
            </CardHeader>
            <CardContent>
              {!loading && clubs.length >= 2 ? (
                <p className="text-2xl font-bold text-green-700">
                  {Math.min(...clubs.map((c) => c.distance))}y
                  <span className="text-muted-foreground mx-2">〜</span>
                  {Math.max(...clubs.map((c) => c.distance))}y
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  クラブを登録すると表示されます
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>距離グラフ</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                読み込み中...
              </div>
            ) : clubs.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <p>クラブを登録するとグラフが表示されます</p>
                <Link href="/clubs/new">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    最初のクラブを登録
                  </Button>
                </Link>
              </div>
            ) : (
              <DistanceChart clubs={clubs} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>登録クラブ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">読み込み中...</div>
            ) : (
              <ClubList clubs={clubs} onDelete={deleteClub} />
            )}
          </CardContent>
        </Card>

        <AiAnalysisCard clubs={clubs} />
      </main>
    </div>
  );
}
