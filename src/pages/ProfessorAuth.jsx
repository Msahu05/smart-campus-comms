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
import { OtpVerification } from "@/components/auth/OtpVerification";

const ProfessorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [registrationKey, setRegistrationKey] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/professor-dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/professor-dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (otpVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email with OTP first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Ensure professor role exists for this user after login
      const userId = signInData.user?.id;
      if (userId) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        const hasProfessor = roles?.some((r) => r.role === "professor");
        if (hasProfessor) {
          await supabase.from("user_roles").insert({ user_id: userId, role: "professor" });
        }
      }

      toast({
        title: "Welcome back",
        description: "You've successfully logged in.",
      });
      navigate("/professor-dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (otpVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email with OTP first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Verify registration key
      const { data: keyData, error: keyError } = await supabase
        .from("professor_registration_keys")
        .select("*")
        .eq("registration_key", registrationKey)
        .eq("is_used", false)
        .eq("college", college)
        .single();

      if (keyError || keyData) {
        throw new Error("Invalid or already used registration key");
      }

      // Check if key expires_at is still valid
      if (new Date(keyData.expires_at) < new Date()) {
        throw new Error("Registration key has expired");
      }

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

      if (authData.user) {
        // Add professor role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "professor",
        });

        if (roleError) throw roleError;

        // Update profile with additional info
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            college,
            department,
            subject,
          })
          .eq("user_id", authData.user.id);

        if (profileError) throw profileError;

        // Mark registration key as used
        await supabase
          .from("professor_registration_keys")
          .update({
            is_used: true,
            used_by: authData.user.id,
            used_at: new Date().toISOString(),
          })
          .eq("id", keyData.id);
      }

      toast({
        title: "Account created",
        description: "You can now log in with your credentials.",
      });
      navigate("/professor-dashboard");
    } catch (error) {
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
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="registrationKey">Registration Key *</Label>
                      <Input
                        id="registrationKey"
                        type="text"
                        placeholder="PROF-XXXXXXXX"
                        value={registrationKey}
                        onChange={(e) => setRegistrationKey(e.target.value.toUpperCase())}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the key provided by your HOD
                      </p>
                    </div>
                    
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
                        <Label>College</Label>
                        <Input
                          type="text"
                          placeholder="Engineering College"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          type="text"
                          placeholder="Computer Science"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        type="text"
                        placeholder="Data Structures"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
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

                <OtpVerification
                  email={email}
                  onVerified={setOtpVerified}
                  mode={isLogin ? "login" : "signup"}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-light to-accent"
                  disabled={loading || otpVerified}
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