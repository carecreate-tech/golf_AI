"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubInput, MissTendency } from "@/types/club";

interface Props {
  onSubmit: (input: ClubInput) => Promise<void>;
}

const PRESET_CLUBS = [
  "Driver", "3W", "5W", "7W",
  "2UT", "3UT", "4UT", "5UT",
  "4I", "5I", "6I", "7I", "8I", "9I",
  "PW", "AW", "SW", "LW",
];

export default function ClubForm({ onSubmit }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [distance, setDistance] = useState("");
  const [loft, setLoft] = useState("");
  const [missTendency, setMissTendency] = useState<string>("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clubName = name === "custom" ? customName : name;
    if (!clubName) { setError("番手を入力してください"); return; }
    if (!distance || Number(distance) <= 0) { setError("飛距離を入力してください"); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        name: clubName,
        distance: Number(distance),
        loft: loft ? Number(loft) : null,
        miss_tendency: missTendency ? (missTendency as MissTendency) : null,
        memo: memo || null,
      });
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>クラブを登録する</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">番手 *</Label>
            <Select value={name} onValueChange={(v) => setName(v ?? "")}>
              <SelectTrigger id="name">
                <SelectValue placeholder="番手を選択" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_CLUBS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
                <SelectItem value="custom">その他（手入力）</SelectItem>
              </SelectContent>
            </Select>
            {name === "custom" && (
              <Input
                placeholder="例: 6W"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance">飛距離（yard） *</Label>
            <Input
              id="distance"
              type="number"
              placeholder="例: 220"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min={1}
              max={400}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loft">ロフト角（°）任意</Label>
            <Input
              id="loft"
              type="number"
              placeholder="例: 10.5"
              value={loft}
              onChange={(e) => setLoft(e.target.value)}
              step="0.5"
              min={1}
              max={70}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="miss">ミス傾向　任意</Label>
            <Select
              value={missTendency}
              onValueChange={(v) => setMissTendency(v ?? "")}
            >
              <SelectTrigger id="miss">
                <SelectValue placeholder="選択（任意）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">特になし</SelectItem>
                <SelectItem value="slice">スライス</SelectItem>
                <SelectItem value="hook">フック</SelectItem>
                <SelectItem value="topped">トップ</SelectItem>
                <SelectItem value="fat">ダフリ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">メモ　任意</Label>
            <Textarea
              id="memo"
              placeholder="例: コースでは使いにくい、冬は距離落ちる"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "登録中..." : "登録する"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
