import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model</h1>
        <p className="mt-1 text-gray-500">
          YOLO perception model performance
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Confidence banding, distribution charts, uncertain rate, and fallback
            analysis will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
