import { API_BASE_URL } from "@/lib/api";

/**
 * Friendly empty state shown when the backend has never been reachable (D-04).
 * Displays the configured API URL to help developers diagnose connection issues.
 */
export function BackendEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">Waiting for backend connection...</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Make sure the API is running at{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
          {API_BASE_URL}
        </code>
      </p>
    </div>
  );
}
