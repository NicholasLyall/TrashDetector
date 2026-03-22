"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, WifiOff, Clock, Server } from "lucide-react";
import type { DeviceData } from "@/lib/types";

interface DeviceCardProps {
  readonly device: DeviceData;
  readonly isSelected: boolean;
  readonly onSelect: (deviceId: string) => void;
}

/** Status badge styling per device status value. */
function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        className: "bg-green-100 text-green-700 hover:bg-green-100",
      };
    case "inactive":
      return {
        label: "Inactive",
        className: "bg-gray-100 text-gray-500 hover:bg-gray-100",
      };
    case "maintenance":
      return {
        label: "Maintenance",
        className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      };
    default:
      return {
        label: status,
        className: "bg-gray-100 text-gray-500 hover:bg-gray-100",
      };
  }
}

/**
 * Card displaying a single device's metadata.
 * Shows name, status badge, location, connection icon, created date, and device ID.
 * (STNG-01)
 */
export function DeviceCard({ device, isSelected, onSelect }: DeviceCardProps) {
  const statusBadge = getStatusBadge(device.status);
  const isActive = device.status === "active";

  const formattedDate = new Date(device.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-emerald-500" : ""
      }`}
      onClick={() => onSelect(device.id)}
    >
      <CardContent className="p-4">
        {/* Header: name + status badge */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{device.name}</span>
          <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
        </div>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{device.location_name ?? "No location set"}</span>
        </div>

        {/* Connection icon + created date row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {isActive ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {/* Device ID */}
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Server className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono">{device.id.slice(0, 8)}...</span>
        </div>
      </CardContent>
    </Card>
  );
}
