import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ProfessorStats {
  id: string;
  full_name: string;
  email: string;
  totalQueries: number;
  resolvedQueries: number;
  totalAppointments: number;
  reputationScore: number;
}

const ReputationPanel = () => {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState<ProfessorStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessorStats();
  }, []);

  const loadProfessorStats = async () => {
    try {
      const { data: profRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "professor");

      const profIds = profRoles?.map((r) => r.user_id) || [];
      
      if (profIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", profIds);

      const statsPromises = (profiles || []).map(async (prof) => {
        const [queriesRes, appointmentsRes] = await Promise.all([
          supabase.from("queries").select("*").eq("professor_id", prof.user_id),
          supabase.from("appointments").select("*", { count: "exact" }).eq("professor_id", prof.user_id),
        ]);

        const queries = queriesRes.data || [];
        const resolved = queries.filter((q) => q.status === "resolved").length;
        const total = queries.length;
        const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

        return {
          id: prof.id,
          full_name: prof.full_name,
          email: prof.email,
          totalQueries: total,
          resolvedQueries: resolved,
          totalAppointments: appointmentsRes.count || 0,
          reputationScore: Math.round(resolutionRate),
        };
      });

      const stats = await Promise.all(statsPromises);
      setProfessors(stats.sort((a, b) => b.reputationScore - a.reputationScore));
    } catch (error) {
      console.error("Error loading professor stats:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Reputation Panel</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-4">
          {professors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No professors found
              </CardContent>
            </Card>
          ) : (
            professors.map((prof, index) => (
              <Card
                key={prof.id}
                className="animate-fade-in hover:shadow-large transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {prof.full_name}
                        {index < 3 && <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{prof.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{prof.reputationScore}%</div>
                      <div className="text-sm text-muted-foreground">Reputation Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Query Resolution Rate</span>
                      <span className="text-muted-foreground">
                        {prof.resolvedQueries}/{prof.totalQueries}
                      </span>
                    </div>
                    <Progress value={prof.reputationScore} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{prof.totalQueries}</div>
                      <div className="text-xs text-muted-foreground">Total Queries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{prof.resolvedQueries}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{prof.totalAppointments}</div>
                      <div className="text-xs text-muted-foreground">Appointments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReputationPanel;
