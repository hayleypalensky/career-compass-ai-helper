
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableMFA, setEnableMFA] = useState(true);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await signUp(email, password);
      
      if (enableMFA) {
        toast({
          title: "MFA Enabled",
          description: "Two-factor authentication has been enabled for your account.",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input 
            id="signup-password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Password must be at least 6 characters.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="enable-mfa-signup" 
            checked={enableMFA}
            onCheckedChange={setEnableMFA}
          />
          <Label htmlFor="enable-mfa-signup">Enable multi-factor authentication</Label>
        </div>
        <div className="rounded-md bg-blue-50 p-3">
          <div className="flex">
            <div className="text-blue-800 text-sm">
              <p className="font-medium">Enhanced Security</p>
              <p>Multi-factor authentication adds an extra layer of security to your account by requiring a second verification step.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
