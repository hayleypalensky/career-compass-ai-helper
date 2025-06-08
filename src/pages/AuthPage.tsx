
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MFAVerification from '@/components/auth/MFAVerification';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const AuthPage = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [mfaEmail, setMfaEmail] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to jobs page if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/jobs');
    }
  }, [user, navigate]);

  const handleMFARequired = (email: string) => {
    setMfaEmail(email);
    setShowMFA(true);
  };

  const handleAuthSuccess = () => {
    navigate('/jobs');
  };

  const handleMFAVerified = () => {
    setShowMFA(false);
    navigate('/jobs');
    toast({
      title: "Secure login successful",
      description: "Multi-factor authentication complete.",
    });
  };

  const handleCancelMFA = () => {
    setShowMFA(false);
    // User canceled MFA, but they are already logged in at this point,
    // so we'll let them proceed
    navigate('/jobs');
    toast({
      title: "MFA skipped",
      description: "You can enable MFA later in your profile settings.",
      variant: "default",
    });
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  if (showMFA) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <MFAVerification 
          email={mfaEmail} 
          onVerified={handleMFAVerified}
          onCancel={handleCancelMFA}
        />
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <ForgotPasswordForm onBack={handleBackToSignIn} />
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
            <SignInForm 
              onShowForgotPassword={handleShowForgotPassword}
              onMFARequired={handleMFARequired}
              onSuccess={handleAuthSuccess}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
