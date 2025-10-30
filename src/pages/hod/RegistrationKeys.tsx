import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Key } from "lucide-react";

interface RegistrationKey {
  id: string;
  registration_key: string;
  college: string;
  department: string | null;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

const RegistrationKeys = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [keys, setKeys] = useState<RegistrationKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userCollege, setUserCollege] = useState("");
  const [newKeyDepartment, setNewKeyDepartment] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadKeys();
    }
  }, []);

  const loadKeys = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("college")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.college) {
        setUserCollege(profile.college);
        
        const { data: keysData } = await supabase
          .from("professor_registration_keys")
          .select("*")
          .eq("college", profile.college)
          .order("created_at", { ascending: false });

        setKeys(keysData || []);
      }
    } catch (error) {
      console.error("Error loading keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!newKeyDepartment) {
      toast({
        title: "Department required",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Generate a random key
      const key = `PROF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const { error } = await supabase
        .from("professor_registration_keys")
        .insert({
          registration_key: key,
          college: userCollege,
          department: newKeyDepartment,
          created_by: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Registration key generated",
        description: "New professor registration key created successfully",
      });

      setNewKeyDepartment("");
      loadKeys();
    } catch (error: any) {
      toast({
        title: "Failed to generate key",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: "Copied!",
      description: "Registration key copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-9 w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Professor Registration Keys</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Generate New Registration Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select value={newKeyDepartment} onValueChange={setNewKeyDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateKey} disabled={generating}>
              {generating ? "Generating..." : "Generate Key"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Registration Keys</h2>
          {keys.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No registration keys generated yet</p>
              </CardContent>
            </Card>
          ) : (
            keys.map((key) => (
              <Card key={key.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <code className="px-3 py-1 bg-muted rounded-md font-mono text-sm">
                          {key.registration_key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.registration_key)}
                        >
                          {copiedKey === key.registration_key ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        {key.is_used ? (
                          <Badge variant="secondary">Used</Badge>
                        ) : new Date(key.expires_at) < new Date() ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : (
                          <Badge>Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Department: {key.department || "All"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(key.expires_at).toLocaleDateString()}
                      </p>
                      {key.is_used && key.used_at && (
                        <p className="text-xs text-muted-foreground">
                          Used: {new Date(key.used_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationKeys;
