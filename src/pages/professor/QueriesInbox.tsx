import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const QueriesInbox = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: profilesData } = await supabase.from("profiles").select("*");
      
      const enrichedQueries = data?.map((query) => {
        const student = profilesData?.find((p) => p.user_id === query.student_id);
        return { ...query, studentName: student?.full_name || "Unknown" };
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

  const handleRespond = async () => {
    if (!response.trim() || !selectedQuery) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("queries")
        .update({ response, status: "answered" })
        .eq("id", selectedQuery.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response sent successfully.",
      });

      setSelectedQuery(null);
      setResponse("");
      loadQueries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
          <Button variant="ghost" size="sm" onClick={() => navigate("/professor-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">Queries Inbox</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Queries</h2>
            {queries.map((query) => (
              <Card
                key={query.id}
                className={`cursor-pointer transition-all ${
                  selectedQuery?.id === query.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedQuery(query);
                  setResponse(query.response || "");
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{query.subject}</CardTitle>
                      <CardDescription>
                        From: {query.studentName} • {new Date(query.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={query.status === "answered" ? "default" : "secondary"}>
                      {query.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div>
            {selectedQuery ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedQuery.subject}</CardTitle>
                  <CardDescription>From: {selectedQuery.studentName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Question:</p>
                    <p className="text-sm text-muted-foreground">{selectedQuery.question}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Response:</label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response..."
                      rows={6}
                    />
                  </div>
                  <Button onClick={handleRespond} disabled={submitting} className="w-full">
                    {submitting ? "Sending..." : "Send Response"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a query to respond</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueriesInbox;
