
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsResettingPassword(true);
      await resetPassword(forgotPasswordEmail);
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      onBack();
      setForgotPasswordEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your email to receive password reset instructions</CardDescription>
      </CardHeader>
      <form onSubmit={handleForgotPassword}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input 
              id="forgot-email" 
              type="email" 
              placeholder="you@example.com" 
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" type="submit" disabled={isResettingPassword}>
            {isResettingPassword ? "Sending..." : "Send Reset Instructions"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full" 
            onClick={onBack}
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
