import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, TrendingUp, Users } from "lucide-react";

const EngagementStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQueries: 0,
    resolvedQueries: 0,
    pendingQueries: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get queries assigned to this professor
      const { data: queries } = await supabase
        .from("queries")
        .select("*")
        .eq("professor_id", session.user.id);

      const totalQueries = queries?.length || 0;
      const resolvedQueries = queries?.filter(q => q.status === "resolved").length || 0;
      const pendingQueries = queries?.filter(q => q.status === "pending").length || 0;

      // Get appointments for this professor
      const { data: appointments } = await supabase
        .from("appointments")
        .select("*")
        .eq("professor_id", session.user.id);

      const totalAppointments = appointments?.length || 0;
      const today = new Date().toISOString().split('T')[0];
      const upcomingAppointments = appointments?.filter(a => a.appointment_date >= today).length || 0;

      // Get unique students who have queries or appointments with this professor
      const studentIds = new Set([
        ...(queries?.map(q => q.student_id) || []),
        ...(appointments?.map(a => a.student_id) || [])
      ]);
      const totalStudents = studentIds.size;

      setStats({
        totalQueries,
        resolvedQueries,
        pendingQueries,
        totalAppointments,
        upcomingAppointments,
        totalStudents,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Queries",
      value: stats.totalQueries,
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Resolved Queries",
      value: stats.resolvedQueries,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Engagement Statistics</h1>
          <Button variant="outline" onClick={() => navigate("/professor-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="animate-fade-in hover:shadow-lg transition-all"
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

export default EngagementStats;
