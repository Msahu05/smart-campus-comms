import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Mail, Building2, BookOpen } from "lucide-react";

interface Professor {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  college?: string;
  department?: string;
  subject?: string;
}

const MyProfessors = () => {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCollege, setUserCollege] = useState<string>("");

  useEffect(() => {
    loadProfessors();
  }, []);

  const loadProfessors = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get current user's college
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("college")
        .eq("user_id", session.user.id)
        .single();

      if (userProfile?.college) {
        setUserCollege(userProfile.college);
      }

      // Get all professor user_ids
      const { data: professorRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "professor");

      if (professorRoles) {
        const professorIds = professorRoles.map((r) => r.user_id);

        // Get professor profiles
        let query = supabase
          .from("profiles")
          .select("*")
          .in("user_id", professorIds);

        // Filter by college if user has one
        if (userProfile?.college) {
          query = query.eq("college", userProfile.college);
        }

        const { data: professorProfiles } = await query;
        setProfessors(professorProfiles || []);
      }
    } catch (error) {
      console.error("Error loading professors:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Professors</h1>
            {userCollege && (
              <p className="text-muted-foreground mt-1">
                {userCollege} - {professors.length} professor(s)
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No professors found in your college.</p>
            </div>
          ) : (
            professors.map((professor) => (
              <Card key={professor.id} className="animate-fade-in hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{professor.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{professor.email}</span>
                  </div>
                  {professor.department && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{professor.department}</span>
                    </div>
                  )}
                  {professor.subject && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>{professor.subject}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate("/student/professor-availability")}
                  >
                    View Availability
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfessors;
