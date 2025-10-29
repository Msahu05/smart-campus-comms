import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  college?: string;
  department?: string;
  subject?: string;
}

interface UserWithRole extends Profile {
  roles: string[];
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<UserWithRole[]>([]);
  const [professors, setProfessors] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: profiles } = await supabase.from("profiles").select("*");
      const { data: roles } = await supabase.from("user_roles").select("*");

      const userMap = new Map<string, UserWithRole>();
      
      profiles?.forEach((profile) => {
        userMap.set(profile.user_id, {
          ...profile,
          roles: []
        });
      });

      roles?.forEach((role) => {
        const user = userMap.get(role.user_id);
        if (user) {
          user.roles.push(role.role);
        }
      });

      const allUsers = Array.from(userMap.values());
      setStudents(allUsers.filter((u) => u.roles.includes("student")));
      setProfessors(allUsers.filter((u) => u.roles.includes("professor")));
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await supabase.from("user_roles").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("user_id", userId);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const UserList = ({ users, type }: { users: UserWithRole[]; type: string }) => (
    <div className="space-y-3">
      {users.length === 0 ? (
        <div className="text-muted-foreground">No {type}s found.</div>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{user.full_name}</h4>
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.college && (
                    <p className="text-sm text-muted-foreground">
                      {user.college} • {user.department}
                      {user.subject && ` • ${user.subject}`}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.user_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
            <TabsTrigger value="professors">Professors ({professors.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students">
            <UserList users={students} type="student" />
          </TabsContent>
          
          <TabsContent value="professors">
            <UserList users={professors} type="professor" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;
