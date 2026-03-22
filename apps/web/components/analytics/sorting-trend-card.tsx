"use client";

import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/hooks/use-events";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import {
  groupEventsByTime,
  computeTrendSummary,
  type TimeRange,
} from "@/lib/compute-analytics";

export function SortingTrendCard() {
  const { events, error, isLoading } = useEvents(50);
  const [range, setRange] = useState<TimeRange>("24h");
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    if (error && !events) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, events]);

  const trendData = useMemo(
    () => groupEventsByTime(events ?? [], range),
    [events, range]
  );

  const summary = useMemo(
    () => computeTrendSummary(trendData),
    [trendData]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[220px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error && !events) {
    if (!showEmptyState) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent className="py-8">
          <BackendEmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sorting Trends</CardTitle>
          <Select
            value={range}
            onValueChange={(value: TimeRange | null) => {
              if (value !== null) {
                setRange(value);
              }
            }}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div aria-label="Area chart showing sorting volume over time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData as { time: string; count: number }[]}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                allowDecimals={false}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(174 62% 47%)"
                strokeWidth={2}
                fill="hsl(174 62% 47% / 0.1)"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: "hsl(174 62% 47%)",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary row */}
        <div className="flex justify-between text-sm text-muted-foreground mt-3">
          <span>Peak: {summary.peak} items</span>
          <span>
            Avg: {summary.average} items/{range === "24h" ? "hr" : "day"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
