import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const ProfessorAvailability = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [professors, setProfessors] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*");

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "professor");

      const professorIds = rolesData?.map((r) => r.user_id) || [];
      const professorProfiles = profilesData?.filter((p) => professorIds.includes(p.user_id)) || [];

      const { data: availabilityData } = await supabase
        .from("office_hours")
        .select("*");

      setProfessors(professorProfiles);
      setAvailability(availabilityData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProfessorAvailability = (professorId: string) => {
    return availability.filter((a) => a.professor_id === professorId && a.is_available);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">Professor Availability</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((professor) => {
            const professorAvailability = getProfessorAvailability(professor.user_id);
            return (
              <Card key={professor.id}>
                <CardHeader>
                  <CardTitle>{professor.full_name}</CardTitle>
                  <CardDescription>
                    {professor.department} - {professor.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {professorAvailability.length > 0 ? (
                    <div className="space-y-2">
                      {professorAvailability.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">{slot.day_of_week}</span>
                          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                      ))}
                      <Button
                        className="w-full mt-4"
                        onClick={() => navigate(`/student/book-appointment?professor=${professor.user_id}`)}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No availability set</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProfessorAvailability;
