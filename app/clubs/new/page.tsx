"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClubForm from "@/components/ClubForm";
import { useClubs } from "@/hooks/useClubs";

export default function NewClubPage() {
  const { addClub } = useClubs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="ダッシュボードに戻る"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-green-800">⛳ Golf Club AI</h1>
            <p className="text-xs text-muted-foreground">クラブを登録する</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ClubForm onSubmit={addClub} />
      </main>
    </div>
  );
}
