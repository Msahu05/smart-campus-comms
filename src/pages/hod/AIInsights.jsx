import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, Users } from "lucide-react";

const AIInsights = () => {
  const navigate = useNavigate();

  const insights = [
    {
      title: "Student Engagement Trends",
      description: "Average query response time has decreased by 23% this month",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Professor Performance",
      description: "Top 3 professors have 95% query resolution rate",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "AI Recommendations",
      description: "Consider adding more office hours during peak query times (2-4 PM)",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Insights</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {insights.map((insight, index) => (
            <Card
              key={insight.title}
              className="animate-fade-in hover:shadow-large transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.color}`}>
                    <insight.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{insight.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
