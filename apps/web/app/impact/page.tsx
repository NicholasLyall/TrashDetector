import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImpactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Impact</h1>
        <p className="mt-1 text-gray-500">
          Environmental impact and equivalents
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            CO2 savings, trees equivalent, waste diversion metrics, and tangible
            comparisons will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
