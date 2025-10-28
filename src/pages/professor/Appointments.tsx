import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  student_id: string;
  professor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string | null;
  notes: string | null;
}

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let query = supabase.from("appointments").select("*").order("appointment_date", { ascending: true });
        if (session) {
          // Show professor's appointments by default; open access allows all if no session
          query = query.eq("professor_id", session.user.id);
        }
        const { data } = await query;
        setAppointments(data || []);
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
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Button variant="outline" onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-muted-foreground">No appointments found.</div>
            ) : (
              <ul className="space-y-3">
                {appointments.map((a) => (
                  <li key={a.id} className="p-4 rounded-lg border border-border/50">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-medium">{new Date(a.appointment_date).toDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.start_time} - {a.end_time} • Status: {a.status || "pending"}
                        </div>
                      </div>
                      {a.notes && <div className="text-sm text-muted-foreground">{a.notes}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
