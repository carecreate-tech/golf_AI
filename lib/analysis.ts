import { Club, DistanceGap } from "@/types/club";

const GAP_THRESHOLD = 15;
const OVERLAP_THRESHOLD = 7;

export function analyzeDistances(clubs: Club[]): {
  gaps: DistanceGap[];
  overlaps: DistanceGap[];
} {
  const sorted = [...clubs].sort((a, b) => b.distance - a.distance);
  const gaps: DistanceGap[] = [];
  const overlaps: DistanceGap[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = sorted[i].distance - sorted[i + 1].distance;
    if (diff >= GAP_THRESHOLD) {
      gaps.push({ from: sorted[i], to: sorted[i + 1], gap: diff, type: "gap" });
    } else if (diff <= OVERLAP_THRESHOLD) {
      overlaps.push({ from: sorted[i], to: sorted[i + 1], gap: diff, type: "overlap" });
    }
  }

  return { gaps, overlaps };
}

export function buildAnalysisPrompt(clubs: Club[]): string {
  const sorted = [...clubs].sort((a, b) => b.distance - a.distance);
  const { gaps, overlaps } = analyzeDistances(clubs);

  const clubList = sorted
    .map((c) => `${c.name}: ${c.distance}yard${c.loft ? ` (ロフト${c.loft}°)` : ""}${c.miss_tendency && c.miss_tendency !== "none" ? ` [ミス傾向: ${c.miss_tendency}]` : ""}${c.memo ? ` メモ: ${c.memo}` : ""}`)
    .join("\n");

  const gapList = gaps.length
    ? gaps.map((g) => `${g.from.name}(${g.from.distance}y) → ${g.to.name}(${g.to.distance}y): ${g.gap}yard空き`).join("\n")
    : "なし";

  const overlapList = overlaps.length
    ? overlaps.map((o) => `${o.from.name}(${o.from.distance}y) と ${o.to.name}(${o.to.distance}y): ${o.gap}yard差`).join("\n")
    : "なし";

  return `あなたはゴルフクラブ構成の専門アドバイザーです。
以下のゴルファーのクラブ構成を分析し、日本語で具体的なアドバイスをしてください。

## クラブ構成
${clubList}

## 検出された距離ギャップ（15yard以上）
${gapList}

## 検出されたクラブ被り（7yard以下）
${overlapList}

## 分析してほしいこと
1. 距離ギャップの問題点と補うべきクラブの提案
2. クラブ被りがあれば役割の重複についてのアドバイス
3. 苦手距離の推測
4. 全体的なクラブ構成の評価と改善提案

対象は平均スコア90〜110のアマチュアゴルファーです。
専門用語を避け、わかりやすい言葉で200〜300字程度でまとめてください。`;
}
