import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OtpVerification } from "@/components/auth/OtpVerification";

const StudentAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [signupData, setSignupData] = useState({
    fullName: "",
    rollNumber: "",
    college: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    // Fetch email when enrollment number changes in login mode
    const fetchEmailFromEnrollment = async () => {
      if (isLogin && enrollmentNumber && enrollmentNumber.length > 3) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("roll_number", enrollmentNumber)
            .single();

          if (profile) {
            setEmail(profile.email);
          }
        } catch (error) {
          // Silent fail - will show error on form submit if invalid
        }
      }
    };

    fetchEmailFromEnrollment();
  }, [enrollmentNumber, isLogin]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/student-dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/student-dashboard");
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
      // Verify enrollment number exists
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, email")
        .eq("roll_number", enrollmentNumber)
        .single();

      if (profileError || profiles) {
        throw new Error("Invalid enrollment number");
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: profiles.email,
        password,
      });

      if (error) throw error;

      // Ensure student role exists for this user after login
      const userId = signInData.user?.id;
      if (userId) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        const hasStudent = roles?.some((r) => r.role === "student");
        if (hasStudent) {
          await supabase.from("user_roles").insert({ user_id: userId, role: "student" });
        }
      }

      toast({
        title: "Welcome back",
        description: "You've successfully logged in.",
      });
      navigate("/student-dashboard");
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
      const redirectUrl = `${window.location.origin}/student-dashboard`;
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupData.fullName,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        // Add student role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "student",
        });

        if (roleError) throw roleError;

        // Update profile with additional info
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            roll_number: signupData.rollNumber,
            college: signupData.college,
            department: signupData.department,
          })
          .eq("user_id", authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created",
        description: "You can now log in with your credentials.",
      });
      navigate("/student-dashboard");
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center shadow-large">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Student Login" : "Student Sign Up"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Create an account to connect with professors"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number / Enrollment Number</Label>
                      <Input
                        id="rollNumber"
                        type="text"
                        placeholder="STU2024001"
                        value={signupData.rollNumber}
                        onChange={(e) => setSignupData({ ...signupData, rollNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>College</Label>
                        <Input
                          type="text"
                          placeholder="Engineering College"
                          value={signupData.college}
                          onChange={(e) => setSignupData({ ...signupData, college: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          type="text"
                          placeholder="Computer Science"
                          value={signupData.department}
                          onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {isLogin ? (
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                    <Input
                      id="enrollmentNumber"
                      type="text"
                      placeholder="STU2024001"
                      value={enrollmentNumber}
                      onChange={(e) => setEnrollmentNumber(e.target.value)}
                      required
                    />
                  </div>
                ) : null}
                
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
                  email={isLogin ? email : email}
                  onVerified={setOtpVerified}
                  mode={isLogin ? "login" : "signup"}
                />
                
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light"
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

export default StudentAuth;