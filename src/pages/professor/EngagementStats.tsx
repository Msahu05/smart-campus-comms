import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const EngagementStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ queries: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { count: queries } = await supabase
          .from("queries")
          .select("*", { count: "exact", head: true });
        const { count: appointments } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true });
        setStats({ queries: queries || 0, appointments: appointments || 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Engagement Stats</h1>
          <button className="text-sm text-muted-foreground" onClick={() => navigate("/professor-dashboard")}>Back</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "—" : stats.queries}</div>
              <div className="text-sm text-muted-foreground">All-time queries submitted</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "—" : stats.appointments}</div>
              <div className="text-sm text-muted-foreground">All-time scheduled meetings</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngagementStats;
