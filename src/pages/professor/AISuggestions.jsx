import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AISuggestions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">AI Suggestions</h1>
          <Button variant="outline" onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Smart Replies</CardTitle>
            <CardDescription>Coming soon. For now, manage queries from your inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/professor/queries-inbox")}>Go to Queries Inbox</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AISuggestions;
