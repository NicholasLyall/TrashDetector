"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/** Confidence thresholds for color banding. */
const LOW_THRESHOLD = 0.5;
const HIGH_THRESHOLD = 0.8;

/** HSL colors matching existing palette. */
const COLORS = {
  red: "hsl(0 72% 45%)",
  amber: "hsl(38 92% 45%)",
  green: "hsl(142 71% 45%)",
} as const;

/** Determine which color zone the confidence falls into. */
function getConfidenceColor(value: number): string {
  if (value >= HIGH_THRESHOLD) return COLORS.green;
  if (value >= LOW_THRESHOLD) return COLORS.amber;
  return COLORS.red;
}

/** Determine zone label. */
function getConfidenceLabel(value: number): string {
  if (value >= HIGH_THRESHOLD) return "High";
  if (value >= LOW_THRESHOLD) return "Medium";
  return "Low";
}

interface ConfidenceGaugeProps {
  readonly avgConfidence: number;
}

/**
 * Semi-circular gauge visualization for average model confidence.
 * Uses SVG arcs with three color-coded bands (red/amber/green)
 * and a needle indicator showing where the value falls.
 * (MDTL-01)
 */
export function ConfidenceGauge({ avgConfidence }: ConfidenceGaugeProps) {
  const percentage = Math.round(avgConfidence * 100);
  const activeColor = getConfidenceColor(avgConfidence);
  const zoneLabel = getConfidenceLabel(avgConfidence);

  // SVG gauge configuration
  const cx = 120;
  const cy = 110;
  const radius = 80;
  const strokeWidth = 16;

  // Arc goes from 180deg (left) to 0deg (right) -- a semi-circle
  // Total arc length for a semi-circle
  const semiCircumference = Math.PI * radius;

  // Each zone segment
  const lowEnd = LOW_THRESHOLD; // 0 to 50%
  const midEnd = HIGH_THRESHOLD; // 50% to 80%
  // highEnd = 1.0 -- 80% to 100%

  const lowLength = lowEnd * semiCircumference;
  const midLength = (midEnd - lowEnd) * semiCircumference;
  const highLength = (1 - midEnd) * semiCircumference;

  // Needle angle: 180deg (left, 0%) to 0deg (right, 100%)
  const needleAngle = Math.PI * (1 - avgConfidence);
  const needleLength = radius - strokeWidth / 2 - 4;
  const needleX = cx + needleLength * Math.cos(needleAngle);
  const needleY = cy - needleLength * Math.sin(needleAngle);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Banding</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 240 140"
            className="w-full max-w-[280px]"
            aria-label={`Confidence gauge showing ${percentage}%`}
          >
            {/* Background track */}
            <path
              d={describeArc(cx, cy, radius, 180, 0)}
              fill="none"
              stroke="hsl(0 0% 90%)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Red zone: 0% to 50% (180deg to 90deg) */}
            <path
              d={describeArc(cx, cy, radius, 180, 180 - LOW_THRESHOLD * 180)}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={0.3}
            />

            {/* Amber zone: 50% to 80% (90deg to 36deg) */}
            <path
              d={describeArc(
                cx,
                cy,
                radius,
                180 - LOW_THRESHOLD * 180,
                180 - HIGH_THRESHOLD * 180
              )}
              fill="none"
              stroke={COLORS.amber}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={0.3}
            />

            {/* Green zone: 80% to 100% (36deg to 0deg) */}
            <path
              d={describeArc(cx, cy, radius, 180 - HIGH_THRESHOLD * 180, 0)}
              fill="none"
              stroke={COLORS.green}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={0.3}
            />

            {/* Active arc: filled portion up to current value */}
            {avgConfidence > 0 && (
              <path
                d={describeArc(
                  cx,
                  cy,
                  radius,
                  180,
                  180 - avgConfidence * 180
                )}
                fill="none"
                stroke={activeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}

            {/* Needle indicator */}
            <line
              x1={cx}
              y1={cy}
              x2={needleX}
              y2={needleY}
              stroke={activeColor}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r={4} fill={activeColor} />

            {/* Center text */}
            <text
              x={cx}
              y={cy - 20}
              textAnchor="middle"
              className="fill-current text-gray-900"
              fontSize="28"
              fontWeight="700"
            >
              {percentage}%
            </text>
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="fill-current text-gray-500"
              fontSize="11"
            >
              Average Confidence
            </text>

            {/* Zone labels along the bottom */}
            <text
              x={cx - radius + 10}
              y={cy + 20}
              textAnchor="start"
              fontSize="9"
              className="fill-current text-gray-400"
            >
              0%
            </text>
            <text
              x={cx}
              y={cy + 20}
              textAnchor="middle"
              fontSize="9"
              className="fill-current text-gray-400"
            >
              50%
            </text>
            <text
              x={cx + radius - 10}
              y={cy + 20}
              textAnchor="end"
              fontSize="9"
              className="fill-current text-gray-400"
            >
              100%
            </text>
          </svg>

          {/* Zone badge */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
            <span className="text-sm font-medium text-gray-700">
              {zoneLabel} Confidence Zone
            </span>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS.red }}
              />
              <span>Low &lt;50%</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS.amber }}
              />
              <span>Med 50-80%</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS.green }}
              />
              <span>High &gt;80%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compute an SVG arc path from startAngle to endAngle (in degrees).
 * Angles measured counter-clockwise from the positive X-axis.
 * 180 = left, 0 = right for a semi-circle.
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  const startRad = (startAngleDeg * Math.PI) / 180;
  const endRad = (endAngleDeg * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy - r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy - r * Math.sin(endRad);

  // Determine sweep: if the arc spans > 180deg, use large-arc flag
  const angleDiff = startAngleDeg - endAngleDeg;
  const largeArcFlag = angleDiff > 180 ? 1 : 0;

  // Sweep direction: clockwise (1) since we go from higher angle to lower
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}
