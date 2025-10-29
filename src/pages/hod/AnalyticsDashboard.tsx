import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    totalQueries: 0,
    totalAppointments: 0,
    resolvedQueries: 0,
    pendingQueries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [studentsRes, profsRes, queriesRes, appointmentsRes] = await Promise.all([
        supabase.from("user_roles").select("*", { count: "exact" }).eq("role", "student"),
        supabase.from("user_roles").select("*", { count: "exact" }).eq("role", "professor"),
        supabase.from("queries").select("*"),
        supabase.from("appointments").select("*", { count: "exact" }),
      ]);

      const queries = queriesRes.data || [];
      setStats({
        totalStudents: studentsRes.count || 0,
        totalProfessors: profsRes.count || 0,
        totalQueries: queries.length,
        totalAppointments: appointmentsRes.count || 0,
        resolvedQueries: queries.filter((q) => q.status === "resolved").length,
        pendingQueries: queries.filter((q) => q.status === "pending").length,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Professors",
      value: stats.totalProfessors,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Queries",
      value: stats.totalQueries,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Resolved Queries",
      value: stats.resolvedQueries,
      icon: TrendingUp,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: MessageSquare,
      color: "from-red-500 to-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="animate-fade-in hover:shadow-large transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
