import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Check } from "lucide-react";

interface OtpVerificationProps {
  email: string;
  onVerified: (verified: boolean) => void;
  mode?: "signup" | "login";
}

export const OtpVerification = ({ email, onVerified, mode = "signup" }: OtpVerificationProps) => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      // Generate OTP
      const { data: otpData } = await supabase.rpc('generate_otp');
      const otpCode = otpData as string;

      // Store OTP in database
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minute expiry

      await supabase.from("otp_verifications").insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_verified: false,
      });

      // TODO: Send email via edge function
      // For demo purposes, show OTP in console and toast
      console.log("OTP Code:", otpCode);
      
      toast({
        title: "OTP Sent!",
        description: `Check your email (Demo: ${otpCode})`,
      });
      
      setOtpSent(true);
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

  const verifyOtp = async () => {
    setLoading(true);
    try {
      // Clean expired OTPs first
      await supabase.rpc('clean_expired_otps');

      // Verify OTP
      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("email", email)
        .eq("otp_code", otp)
        .eq("is_verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        throw new Error("Invalid or expired OTP");
      }

      // Mark as verified
      await supabase
        .from("otp_verifications")
        .update({ is_verified: true })
        .eq("id", data.id);

      setVerified(true);
      onVerified(true);
      
      toast({
        title: "Verified!",
        description: "OTP verified successfully",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      onVerified(false);
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Check className="w-4 h-4" />
        <span>Email verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Mail className="w-4 h-4" />
        <span>Email Verification Required</span>
      </div>
      
      {!otpSent ? (
        <Button
          type="button"
          variant="outline"
          onClick={sendOtp}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="otp">Enter 6-digit OTP</Label>
          <div className="flex gap-2">
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={sendOtp}
            disabled={loading}
            className="w-full text-xs"
          >
            Resend OTP
          </Button>
        </div>
      )}
    </div>
  );
};
