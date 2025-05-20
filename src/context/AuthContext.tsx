
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  requestMFAOTP: (email: string) => Promise<void>;
  mfaEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Only update localStorage if we have a session
        if (currentSession) {
          localStorage.setItem('authSession', JSON.stringify(currentSession));
        } else {
          localStorage.removeItem('authSession');
        }

        // Handle auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in",
            description: "You have successfully signed in.",
          });
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
          navigate('/auth');
        }
      }
    );

    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Using the correct options format supported by the current Supabase version
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Set security-related data even though we can't use passwordProtection directly
          data: {
            security_preference: "high", // Custom metadata to indicate security preference
            mfa_enabled: true // Indicate that MFA should be enabled for this account
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for a confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const requestMFAOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          shouldCreateUser: false // Don't create a new user if they don't exist
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      
      setMfaEnabled(true);
    } catch (error: any) {
      toast({
        title: "Error sending verification code",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification successful",
        description: "You have successfully verified your identity.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      verifyOTP,
      requestMFAOTP,
      mfaEnabled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
