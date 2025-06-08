
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const AuthPage = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to jobs page if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/jobs');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/jobs');
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

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
