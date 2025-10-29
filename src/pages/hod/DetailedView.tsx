import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailedViewData {
  id: string;
  [key: string]: any;
}

const DetailedView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewType = searchParams.get("type");
  const [data, setData] = useState<DetailedViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCollege, setFilterCollege] = useState<string>("all");
  const [colleges, setColleges] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [viewType]);

  const loadData = async () => {
    try {
      switch (viewType) {
        case "students": {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("user_id")
            .eq("role", "student");
          
          if (roles) {
            const userIds = roles.map((r) => r.user_id);
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .in("user_id", userIds);
            setData(profiles || []);
            
            // Extract unique colleges
            const uniqueColleges = [...new Set(profiles?.map(p => p.college).filter(Boolean))] as string[];
            setColleges(uniqueColleges);
          }
          break;
        }
        case "professors": {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("user_id")
            .eq("role", "professor");
          
          if (roles) {
            const userIds = roles.map((r) => r.user_id);
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .in("user_id", userIds);
            setData(profiles || []);
            
            const uniqueColleges = [...new Set(profiles?.map(p => p.college).filter(Boolean))] as string[];
            setColleges(uniqueColleges);
          }
          break;
        }
        case "queries": {
          const { data: queries } = await supabase
            .from("queries")
            .select("*")
            .order("created_at", { ascending: false });
          setData(queries || []);
          
          const uniqueColleges = [...new Set(queries?.map(q => q.college).filter(Boolean))] as string[];
          setColleges(uniqueColleges);
          break;
        }
        case "resolved-queries": {
          const { data: queries } = await supabase
            .from("queries")
            .select("*")
            .eq("status", "resolved")
            .order("created_at", { ascending: false });
          setData(queries || []);
          
          const uniqueColleges = [...new Set(queries?.map(q => q.college).filter(Boolean))] as string[];
          setColleges(uniqueColleges);
          break;
        }
        case "pending-queries": {
          const { data: queries } = await supabase
            .from("queries")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false });
          setData(queries || []);
          
          const uniqueColleges = [...new Set(queries?.map(q => q.college).filter(Boolean))] as string[];
          setColleges(uniqueColleges);
          break;
        }
        case "appointments": {
          const { data: appointments } = await supabase
            .from("appointments")
            .select("*")
            .order("appointment_date", { ascending: false });
          setData(appointments || []);
          
          const uniqueColleges = [...new Set(appointments?.map(a => a.college).filter(Boolean))] as string[];
          setColleges(uniqueColleges);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (viewType) {
      case "students": return "All Students";
      case "professors": return "All Professors";
      case "queries": return "All Queries";
      case "resolved-queries": return "Resolved Queries";
      case "pending-queries": return "Pending Queries";
      case "appointments": return "All Appointments";
      default: return "Details";
    }
  };

  const filteredData = filterCollege === "all" 
    ? data 
    : data.filter(item => item.college === filterCollege);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{getTitle()}</h1>
          <Button variant="outline" onClick={() => navigate("/hod/analytics-dashboard")}>
            Back to Analytics
          </Button>
        </div>

        {colleges.length > 0 && (
          <Tabs value={filterCollege} onValueChange={setFilterCollege} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Colleges</TabsTrigger>
              {colleges.map(college => (
                <TabsTrigger key={college} value={college}>{college}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
          ) : (
            filteredData.map((item, index) => (
              <Card key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-6">
                  {(viewType === "students" || viewType === "professors") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{item.full_name}</h3>
                        {item.college && <Badge variant="secondary">{item.college}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                      {item.department && (
                        <p className="text-sm text-muted-foreground">
                          Department: {item.department}
                          {item.subject && ` • Subject: ${item.subject}`}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(viewType === "queries" || viewType === "resolved-queries" || viewType === "pending-queries") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={item.status === "resolved" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                        {item.college && <Badge variant="outline">{item.college}</Badge>}
                      </div>
                      <p className="font-semibold">{item.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.question}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {viewType === "appointments" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={item.status === "confirmed" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                        {item.college && <Badge variant="outline">{item.college}</Badge>}
                      </div>
                      <p className="text-sm">
                        <span className="font-semibold">Date:</span> {item.appointment_date}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Time:</span> {item.start_time} - {item.end_time}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedView;
