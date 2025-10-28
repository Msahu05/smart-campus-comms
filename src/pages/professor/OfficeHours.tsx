import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const OfficeHours = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [officeHours, setOfficeHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    loadOfficeHours();
  }, []);

  const loadOfficeHours = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from("office_hours")
        .select("*")
        .order("day_of_week");

      if (error) throw error;
      setOfficeHours(data || []);
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

  const handleAddSlot = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("office_hours").insert({
        professor_id: session?.user?.id || "anonymous",
        ...newSlot,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Office hours added successfully.",
      });

      setShowAddForm(false);
      setNewSlot({ day_of_week: "", start_time: "", end_time: "" });
      loadOfficeHours();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("office_hours").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Office hours deleted.",
      });
      loadOfficeHours();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/professor-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">Office Hours</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slot
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Office Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Day of Week</label>
                <Select value={newSlot.day_of_week} onValueChange={(val) => setNewSlot({ ...newSlot, day_of_week: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time</label>
                  <Input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Time</label>
                  <Input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSlot} className="flex-1">Add</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {officeHours.map((slot) => (
            <Card key={slot.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{slot.day_of_week}</p>
                  <p className="text-sm text-muted-foreground">
                    {slot.start_time} - {slot.end_time}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(slot.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OfficeHours;
