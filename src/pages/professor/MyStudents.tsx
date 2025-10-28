import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Profile { id: string; user_id: string; full_name: string; email: string; }

const MyStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "student");

        const ids = (roles || []).map((r: any) => r.user_id);
        if (ids.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name, email, id")
            .in("user_id", ids);
          setStudents(profiles || []);
        } else {
          setStudents([]);
        }
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
          <h1 className="text-2xl font-bold">My Students</h1>
          <button className="text-sm text-muted-foreground" onClick={() => navigate("/professor-dashboard")}>Back</button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : students.length === 0 ? (
              <div className="text-muted-foreground">No students found.</div>
            ) : (
              <ul className="divide-y divide-border/50">
                {students.map((s) => (
                  <li key={s.id} className="py-3">
                    <div className="font-medium">{s.full_name}</div>
                    <div className="text-sm text-muted-foreground">{s.email}</div>
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

export default MyStudents;
