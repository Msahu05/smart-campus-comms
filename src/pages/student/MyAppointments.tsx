import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  professor: {
    full_name: string;
    email: string;
  };
}

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("appointments")
        .select(`
          *,
          professor:profiles!appointments_professor_id_fkey(full_name, email)
        `)
        .eq("student_id", session.user.id)
        .order("appointment_date", { ascending: true });

      setAppointments(data as any || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
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
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No appointments found
              </CardContent>
            </Card>
          ) : (
            appointments.map((apt, index) => (
              <Card
                key={apt.id}
                className="animate-fade-in hover:shadow-large transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {apt.professor?.full_name || "Professor"}
                    </CardTitle>
                    <Badge variant={apt.status === "pending" ? "secondary" : "default"}>
                      {apt.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(apt.appointment_date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {apt.start_time} - {apt.end_time}
                    </p>
                    {apt.notes && (
                      <p>
                        <span className="font-medium">Notes:</span> {apt.notes}
                      </p>
                    )}
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

export default MyAppointments;
