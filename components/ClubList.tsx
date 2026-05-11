"use client";

import { Club } from "@/types/club";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  clubs: Club[];
  onDelete: (id: string) => Promise<void>;
}

const MISS_LABEL: Record<string, string> = {
  slice: "スライス",
  hook: "フック",
  topped: "トップ",
  fat: "ダフリ",
  none: "",
};

export default function ClubList({ clubs, onDelete }: Props) {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        クラブがまだ登録されていません。<br />
        「クラブを追加」から登録してください。
      </div>
    );
  }

  const sorted = [...clubs].sort((a, b) => b.distance - a.distance);

  return (
    <div className="space-y-2">
      {sorted.map((club) => (
        <div
          key={club.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-semibold w-16 shrink-0">{club.name}</span>
            <span className="text-lg font-bold text-green-600">
              {club.distance}y
            </span>
            {club.loft && (
              <Badge variant="secondary">{club.loft}°</Badge>
            )}
            {club.miss_tendency && club.miss_tendency !== "none" && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                {MISS_LABEL[club.miss_tendency]}
              </Badge>
            )}
            {club.memo && (
              <span className="text-xs text-muted-foreground truncate hidden sm:block">
                {club.memo}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(club.id)}
            aria-label={`${club.name}を削除`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
