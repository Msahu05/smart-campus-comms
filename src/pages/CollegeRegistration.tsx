import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft, Upload } from "lucide-react";

const CollegeRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: "",
    emailDomain: "",
    registrarName: "",
    officialEmail: "",
    designation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email domain format
      if (!formData.emailDomain.match(/^@[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/)) {
        throw new Error("Invalid email domain format (e.g., @university.edu)");
      }

      // Validate official email matches domain
      if (!formData.officialEmail.endsWith(formData.emailDomain)) {
        throw new Error("Official email must belong to the specified domain");
      }

      // Submit registration request
      const { error } = await supabase
        .from("college_registration_requests")
        .insert({
          college_name: formData.collegeName,
          email_domain: formData.emailDomain,
          registrar_name: formData.registrarName,
          official_email: formData.officialEmail,
          designation: formData.designation,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Registration Submitted!",
        description: "Your college registration request has been submitted for verification. You will receive an email once approved.",
      });

      navigate("/");
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
      <div className="w-full max-w-2xl">
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-large">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Register Your College</CardTitle>
            <CardDescription>
              Submit a request to register your institution on EduLink.AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College/University Name *</Label>
                <Input
                  id="collegeName"
                  type="text"
                  placeholder="ABC University"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailDomain">Institutional Email Domain *</Label>
                <Input
                  id="emailDomain"
                  type="text"
                  placeholder="@university.edu or @institution.ac.in"
                  value={formData.emailDomain}
                  onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be a verified institutional domain (.edu, .ac.in, etc.)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrarName">Your Full Name *</Label>
                  <Input
                    id="registrarName"
                    type="text"
                    placeholder="Dr. John Doe"
                    value={formData.registrarName}
                    onChange={(e) => setFormData({ ...formData, registrarName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="Registrar / Principal / Admin"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officialEmail">Official Email Address *</Label>
                <Input
                  id="officialEmail"
                  type="email"
                  placeholder="admin@university.edu"
                  value={formData.officialEmail}
                  onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must match the institutional domain above
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification">
                  Verification Document (Optional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload college letterhead, logo, or official document
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, or JPG (Max 5MB)
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Registration Request"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your request will be verified by our team (usually 24-48 hours)</li>
                <li>• We'll verify the email domain and institutional authenticity</li>
                <li>• Upon approval, you'll receive login credentials via email</li>
                <li>• You can then set up departments and invite HODs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollegeRegistration;
