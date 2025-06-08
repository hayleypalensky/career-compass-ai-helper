
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignInFormProps {
  onShowForgotPassword: () => void;
  onMFARequired: (email: string) => void;
  onSuccess: () => void;
}

const SignInForm = ({ onShowForgotPassword, onMFARequired, onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableMFA, setEnableMFA] = useState(true);
  const { signIn, requestMFAOTP } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(email, password);
      
      if (enableMFA) {
        await requestMFAOTP(email);
        onMFARequired(email);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-mfa" 
              checked={enableMFA}
              onCheckedChange={setEnableMFA}
            />
            <Label htmlFor="enable-mfa">Use multi-factor authentication</Label>
          </div>
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={onShowForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
