import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AskQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfessors();
  }, []);

  const loadProfessors = async () => {
    const { data: profilesData } = await supabase.from("profiles").select("*");
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "professor");

    const professorIds = rolesData?.map((r) => r.user_id) || [];
    const professorProfiles = profilesData?.filter((p) => professorIds.includes(p.user_id)) || [];
    setProfessors(professorProfiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from("queries").insert({
        student_id: session?.user?.id || "anonymous",
        professor_id: selectedProfessor,
        subject,
        question,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your question has been submitted successfully.",
      });
      navigate("/student/my-queries");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">Ask a Question</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Query</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Professor</label>
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((prof) => (
                      <SelectItem key={prof.user_id} value={prof.user_id}>
                        {prof.full_name} - {prof.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Question"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AskQuestion;
