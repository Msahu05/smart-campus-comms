import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const professorId = searchParams.get("professor");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (professorId && date) {
      loadAvailableSlots();
    }
  }, [professorId, date]);

  const loadAvailableSlots = async () => {
    if (!date) return;
    
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    
    const { data } = await supabase
      .from("office_hours")
      .select("*")
      .eq("professor_id", professorId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_available", true);

    setAvailableSlots(data || []);
  };

  const handleBookAppointment = async () => {
    if (!date || !selectedSlot || !professorId) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const slot = availableSlots.find((s) => s.id === selectedSlot);
      
      const { error } = await supabase.from("appointments").insert({
        student_id: session.user.id,
        professor_id: professorId,
        appointment_date: date.toISOString().split("T")[0],
        start_time: slot.start_time,
        end_time: slot.end_time,
        notes,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      navigate("/student/my-appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Book Appointment</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableSlots.length === 0 ? (
                <p className="text-muted-foreground">No available slots for this date</p>
              ) : (
                <div className="grid gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {slot.start_time} - {slot.end_time}
                    </Button>
                  ))}
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for the professor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleBookAppointment}
                disabled={loading || !selectedSlot}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
