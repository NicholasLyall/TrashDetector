"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DeviceData } from "@/lib/types";
import { Cpu, Settings, MapPin, Wifi, Calendar } from "lucide-react";

interface DeviceConfigPanelProps {
  readonly device: DeviceData | undefined;
}

/** Consistent key-value row layout for configuration sections. */
function ConfigRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

/** Section header with icon. */
function SectionHeader({
  icon: Icon,
  title,
}: {
  readonly icon: React.ElementType;
  readonly title: string;
}) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {title}
    </h3>
  );
}

/**
 * Expandable panel showing full device configuration details.
 * Displays device info, location, and model configuration.
 * (STNG-02)
 */
export function DeviceConfigPanel({ device }: DeviceConfigPanelProps) {
  if (!device) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <Settings className="h-10 w-10 mb-3 opacity-40" />
          <p>Select a device to view its configuration</p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(device.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const capitalizedStatus =
    device.status.charAt(0).toUpperCase() + device.status.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{device.name} Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info Section */}
        <SectionHeader icon={Cpu} title="Device Info" />
        <div>
          <ConfigRow label="Device ID" value={device.id} />
          <ConfigRow label="Name" value={device.name} />
          <ConfigRow label="Status" value={capitalizedStatus} />
          <ConfigRow label="Registered" value={formattedDate} />
        </div>

        <Separator />

        {/* Location Section */}
        <SectionHeader icon={MapPin} title="Location" />
        <div>
          <ConfigRow
            label="Location"
            value={device.location_name ?? "Not configured"}
          />
        </div>

        <Separator />

        {/* Model Configuration Section */}
        <SectionHeader icon={Wifi} title="Model Configuration" />
        <div>
          <ConfigRow label="Model" value="YOLOv8n (Ultralytics)" />
          <ConfigRow label="Inference" value="On-device (Raspberry Pi)" />
          <ConfigRow label="Confidence Threshold" value="0.70" />
          <ConfigRow label="Fallback Bin" value="Trash (Landfill)" />
          <ConfigRow label="Camera" value="Pi Camera Module v2" />
        </div>
      </CardContent>
    </Card>
  );
}
