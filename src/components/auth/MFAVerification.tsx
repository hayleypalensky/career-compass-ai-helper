
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

interface MFAVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

const MFAVerification = ({ email, onVerified, onCancel }: MFAVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP, requestMFAOTP } = useAuth();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(email, otp);
      onVerified();
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await requestMFAOTP(email);
      setOtp("");
    } catch (error) {
      console.error("Error resending code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full" 
          onClick={handleVerify}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MFAVerification;
