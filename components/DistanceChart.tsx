"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Club } from "@/types/club";
import { analyzeDistances } from "@/lib/analysis";
import { Badge } from "@/components/ui/badge";

interface Props {
  clubs: Club[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
}

interface ChartEntry {
  name: string;
  distance: number;
  gapToNext: number | null;
  status: "gap" | "overlap" | "normal";
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background border rounded-lg p-3 shadow-md text-sm">
      <p className="font-bold">{d.name}</p>
      <p className="text-green-600">{d.distance} yard</p>
      {d.gapToNext !== null && (
        <p className={d.status === "gap" ? "text-red-500" : d.status === "overlap" ? "text-orange-500" : "text-muted-foreground"}>
          次との差: {d.gapToNext}y
          {d.status === "gap" && " ⚠ ギャップ"}
          {d.status === "overlap" && " ⚠ 被り"}
        </p>
      )}
    </div>
  );
}

export default function DistanceChart({ clubs }: Props) {
  if (clubs.length === 0) return null;

  const sorted = [...clubs].sort((a, b) => b.distance - a.distance);
  const { gaps, overlaps } = analyzeDistances(clubs);

  const gapIds = new Set(gaps.map((g) => g.from.id));
  const overlapIds = new Set(overlaps.map((o) => o.from.id));

  const chartData: ChartEntry[] = sorted.map((club, i) => {
    const next = sorted[i + 1];
    const gapToNext = next ? club.distance - next.distance : null;
    const status = gapIds.has(club.id)
      ? "gap"
      : overlapIds.has(club.id)
      ? "overlap"
      : "normal";
    return { name: club.name, distance: club.distance, gapToNext, status };
  });

  const colorMap: Record<ChartEntry["status"], string> = {
    gap: "#ef4444",
    overlap: "#f97316",
    normal: "#22c55e",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> 通常
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> 距離ギャップ（15y以上）
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" /> クラブ被り（7y以下）
        </span>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(300, clubs.length * 40)}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, "auto"]}
            tickCount={6}
            unit="y"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={55}
            tick={{ fontSize: 13, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="distance" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={colorMap[entry.status]} />
            ))}
            <LabelList
              dataKey="distance"
              position="right"
              formatter={(v: unknown) => `${v}y`}
              style={{ fontSize: 12, fill: "#555" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {(gaps.length > 0 || overlaps.length > 0) && (
        <div className="space-y-2">
          {gaps.map((g, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Badge variant="destructive">ギャップ</Badge>
              <span>
                {g.from.name} ({g.from.distance}y) → {g.to.name} ({g.to.distance}y)：
                <strong> {g.gap}yard空いています</strong>
              </span>
            </div>
          ))}
          {overlaps.map((o, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Badge className="bg-orange-500 hover:bg-orange-600">被り</Badge>
              <span>
                {o.from.name} ({o.from.distance}y) と {o.to.name} ({o.to.distance}y)：
                <strong> {o.gap}yardしか差がありません</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
