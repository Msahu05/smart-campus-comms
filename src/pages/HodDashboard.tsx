import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users, BarChart3, Brain, Award, Settings, LogOut } from "lucide-react";

const HodDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/hod-auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "hod") {
        toast({
          title: "Access Denied",
          description: "You don't have HOD/Admin access.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/hod-auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setUserName(profileData.full_name);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/hod-auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage students, professors, and their roles",
      color: "from-primary to-primary-light",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "View institution-wide metrics and statistics",
      color: "from-accent to-accent-light",
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Get AI-powered insights and recommendations",
      color: "from-primary-light to-accent",
    },
    {
      icon: Award,
      title: "Reputation Panel",
      description: "Monitor and manage reputation scores",
      color: "from-primary to-accent",
    },
    {
      icon: BarChart3,
      title: "Engagement Stats",
      description: "Track overall engagement and participation",
      color: "from-accent to-primary-light",
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure institution-wide settings",
      color: "from-primary-light to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-light via-accent to-primary bg-clip-text text-transparent">
              HOD / Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {userName}!</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;
