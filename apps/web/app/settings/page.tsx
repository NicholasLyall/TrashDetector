"use client";

import { useEffect, useState } from "react";
import { useDevices } from "@/hooks/use-devices";
import { DeviceCard } from "@/components/settings/device-card";
import { DeviceConfigPanel } from "@/components/settings/device-config-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { Settings } from "lucide-react";

/** Skeleton placeholder for the device list column. */
function DeviceListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Skeleton placeholder for the config panel column. */
function ConfigPanelSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { devices, error, isLoading } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // 5s delayed empty state (same pattern as hero-impact-section.tsx)
  useEffect(() => {
    if (error && !devices) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, devices]);

  // Auto-select first device when data loads
  useEffect(() => {
    if (devices && devices.length > 0 && selectedDeviceId === null) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  const selectedDevice = devices?.find((d) => d.id === selectedDeviceId);

  // Loading state: skeleton cards
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="mt-1 text-gray-500">
            Device configuration and system preferences
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DeviceListSkeleton />
          </div>
          <div className="lg:col-span-2">
            <ConfigPanelSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state with delayed empty state
  if (error && !devices) {
    if (!showEmptyState) {
      return (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="mt-1 text-gray-500">
              Device configuration and system preferences
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DeviceListSkeleton />
            </div>
            <div className="lg:col-span-2">
              <ConfigPanelSkeleton />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="mt-1 text-gray-500">
            Device configuration and system preferences
          </p>
        </div>
        <Card>
          <CardContent className="py-8">
            <BackendEmptyState />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="mt-1 text-gray-500">
          Device configuration and system preferences
        </p>
      </div>

      {/* Two-column layout: device list + config panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Device list */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold">Registered Devices</h2>
          {devices?.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isSelected={device.id === selectedDeviceId}
              onSelect={setSelectedDeviceId}
            />
          ))}
          {devices?.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No devices registered yet
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Config panel */}
        <div className="lg:col-span-2">
          <DeviceConfigPanel device={selectedDevice} />
        </div>
      </div>
    </div>
  );
}
