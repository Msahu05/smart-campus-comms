import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfessorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setTimeout(() => {
          checkUserRole();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasProfessor = roles?.some((r) => r.role === "professor");
      if (hasProfessor) {
        navigate("/professor-dashboard");
      } else if (roles && roles.length > 0) {
        toast({
          title: "Access Denied",
          description: "You don't have professor access.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        const redirectUrl = `${window.location.origin}/professor-dashboard`;
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // Add professor role
        if (authData.user) {
          const { error: roleError } = await supabase.from("user_roles").insert({
            user_id: authData.user.id,
            role: "professor",
          });

          if (roleError) throw roleError;
        }

        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        });
        setIsLogin(true);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-border/50 shadow-large">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-large">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Professor Login" : "Professor Sign Up"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Create an account to manage your classes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Dr. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select College</Label>
                      <Select onValueChange={() => {}}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose college" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering College</SelectItem>
                          <SelectItem value="science">Science College</SelectItem>
                          <SelectItem value="arts">Arts College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Department</Label>
                      <Select onValueChange={() => {}}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cse">Computer Science</SelectItem>
                          <SelectItem value="ece">Electronics</SelectItem>
                          <SelectItem value="mech">Mechanical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    <Select onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ds">Data Structures</SelectItem>
                        <SelectItem value="os">Operating Systems</SelectItem>
                        <SelectItem value="dbms">DBMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="professor@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorAuth;
