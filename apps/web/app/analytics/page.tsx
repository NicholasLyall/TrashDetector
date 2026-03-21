import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-500">
          Detailed sorting trends and category breakdowns
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Category breakdown charts, time-based trends, and filterable event
            lists will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
