import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const MyQueries = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: profilesData } = await supabase.from("profiles").select("*");
      
      const enrichedQueries = data?.map((query) => {
        const professor = profilesData?.find((p) => p.user_id === query.professor_id);
        return { ...query, professorName: professor?.full_name || "Unknown" };
      });

      setQueries(enrichedQueries || []);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">My Queries</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="space-y-4">
          {queries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No queries yet. Ask your first question!</p>
                <Button className="mt-4" onClick={() => navigate("/student/ask-question")}>
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            queries.map((query) => (
              <Card key={query.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{query.subject}</CardTitle>
                      <CardDescription>
                        To: {query.professorName} • {new Date(query.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Question:</p>
                      <p className="text-sm text-muted-foreground">{query.question}</p>
                    </div>
                    {query.response && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">Response:</p>
                        <p className="text-sm">{query.response}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyQueries;
