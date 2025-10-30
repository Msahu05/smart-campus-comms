import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock } from "lucide-react";

interface Appointment {
  id: string;
  student_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  status: string;
  created_at: string;
  student_profile?: {
    full_name: string;
    email: string;
    roll_number: string | null;
  };
}

const AppointmentApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadAppointments();
    }
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(full_name, email, roll_number)
        `)
        .eq("professor_id", session.user.id)
        .eq("status", "pending")
        .order("appointment_date", { ascending: true });

      setAppointments((appointmentsData || []) as any);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId: string) => {
    setProcessing(appointmentId);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment approved",
        description: "The student has been notified",
      });

      loadAppointments();
    } catch (error: any) {
      toast({
        title: "Failed to approve",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (appointmentId: string) => {
    setProcessing(appointmentId);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "rejected" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment rejected",
        description: "The student has been notified",
      });

      loadAppointments();
    } catch (error: any) {
      toast({
        title: "Failed to reject",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-9 w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Pending Appointment Requests</h1>
          <Button variant="outline" onClick={() => navigate("/professor-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending appointment requests</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((apt) => (
              <Card key={apt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {apt.student_profile?.full_name}
                    </CardTitle>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student Email</p>
                      <p className="text-sm">{apt.student_profile?.email}</p>
                    </div>
                    {apt.student_profile?.roll_number && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Roll Number</p>
                        <p className="text-sm">{apt.student_profile.roll_number}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p className="text-sm">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Time</p>
                      <p className="text-sm">{apt.start_time} - {apt.end_time}</p>
                    </div>
                  </div>
                  
                  {apt.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{apt.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleApprove(apt.id)}
                      disabled={processing === apt.id}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(apt.id)}
                      disabled={processing === apt.id}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
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

export default AppointmentApproval;
