
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MFAVerification from '@/components/auth/MFAVerification';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [enableMFA, setEnableMFA] = useState(true);
  const { signIn, signUp, mfaEnabled, requestMFAOTP } = useAuth();
  const navigate = useNavigate();
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
        setShowMFA(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleMFAVerified = () => {
    setShowMFA(false);
    navigate('/');
  };

  const handleCancelMFA = () => {
    setShowMFA(false);
    // User canceled MFA, but they are already logged in at this point,
    // so we'll let them proceed
    navigate('/');
  };

  if (showMFA) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <MFAVerification 
          email={email} 
          onVerified={handleMFAVerified}
          onCancel={handleCancelMFA}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to ResumeAI</CardTitle>
          <CardDescription>Sign in or create an account to get started</CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-mfa" 
                    checked={enableMFA}
                    onCheckedChange={setEnableMFA}
                  />
                  <Label htmlFor="enable-mfa">Use two-factor authentication</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
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
                  <Label htmlFor="enable-mfa-signup">Enable two-factor authentication</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
