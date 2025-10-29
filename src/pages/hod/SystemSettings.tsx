import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoAssignQueries: false,
    allowAnonymousQueries: false,
    requireAppointmentApproval: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Settings Updated",
      description: "Your changes have been saved",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button variant="outline" onClick={() => navigate("/hod-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Management</CardTitle>
              <CardDescription>Configure how queries are handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-assign">Auto-assign Queries to Professors</Label>
                <Switch
                  id="auto-assign"
                  checked={settings.autoAssignQueries}
                  onCheckedChange={() => handleToggle("autoAssignQueries")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="anonymous">Allow Anonymous Queries</Label>
                <Switch
                  id="anonymous"
                  checked={settings.allowAnonymousQueries}
                  onCheckedChange={() => handleToggle("allowAnonymousQueries")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Settings</CardTitle>
              <CardDescription>Configure appointment management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="approval">Require Appointment Approval</Label>
                <Switch
                  id="approval"
                  checked={settings.requireAppointmentApproval}
                  onCheckedChange={() => handleToggle("requireAppointmentApproval")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
