
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smartphone, Mail, Key, Phone } from "lucide-react";

interface MFAVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

type MFAMethod = "email" | "totp" | "sms" | "hardware";

const MFAVerification = ({ email, onVerified, onCancel }: MFAVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<MFAMethod>("email");
  const { verifyOTP, requestMFAOTP, verifyTOTP, setupTOTP } = useAuth();
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpQrCode, setTotpQrCode] = useState<string | null>(null);
  const [isSetup, setIsSetup] = useState(false);

  const handleMFAMethodChange = async (value: MFAMethod) => {
    setMfaMethod(value);
    setOtp("");
    
    if (value === "totp" && !isSetup) {
      try {
        setIsLoading(true);
        const { secret, qrCode } = await setupTOTP(email);
        setTotpSecret(secret);
        setTotpQrCode(qrCode);
      } catch (error) {
        console.error("Error setting up TOTP:", error);
        toast({
          title: "Setup error",
          description: "Failed to set up authenticator app. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (value === "email") {
      try {
        setIsLoading(true);
        await requestMFAOTP(email);
      } catch (error) {
        console.error("Error requesting email code:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      
      if (mfaMethod === "email") {
        await verifyOTP(email, otp);
      } else if (mfaMethod === "totp") {
        await verifyTOTP(email, otp);
        setIsSetup(true);
      }
      
      onVerified();
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      if (mfaMethod === "email") {
        await requestMFAOTP(email);
        setOtp("");
        toast({
          title: "Code sent",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error) {
      console.error("Error resending code:", error);
      toast({
        title: "Error",
        description: "Failed to send a new code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Verify your identity with one of these authentication methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={mfaMethod} onValueChange={(value) => handleMFAMethodChange(value as MFAMethod)} className="space-y-3">
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="flex items-center cursor-pointer w-full">
              <Mail className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Receive a code via email</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="totp" id="totp" />
            <Label htmlFor="totp" className="flex items-center cursor-pointer w-full">
              <Smartphone className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 opacity-50">
            <RadioGroupItem value="sms" id="sms" disabled />
            <Label htmlFor="sms" className="flex items-center cursor-not-allowed w-full">
              <Phone className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">SMS Authentication</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 opacity-50">
            <RadioGroupItem value="hardware" id="hardware" disabled />
            <Label htmlFor="hardware" className="flex items-center cursor-not-allowed w-full">
              <Key className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Hardware Key</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {mfaMethod === "totp" && totpQrCode && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-center mb-3">Scan this QR code with your authenticator app</p>
              <div 
                className="bg-white p-2 rounded-md"
                dangerouslySetInnerHTML={{ __html: totpQrCode }}
              />
            </div>
            {totpSecret && (
              <div className="space-y-2 border rounded-md p-3">
                <p className="text-sm">Or enter this code manually:</p>
                <p className="font-mono bg-muted p-2 rounded text-center select-all">{totpSecret}</p>
              </div>
            )}
          </div>
        )}

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
          {mfaMethod === "email" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MFAVerification;
