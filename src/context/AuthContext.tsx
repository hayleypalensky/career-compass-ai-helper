
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
  setupTOTP: (email: string) => Promise<{ secret: string, qrCode: string }>;
  verifyTOTP: (email: string, token: string) => Promise<void>;
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

  // New function to set up TOTP (Time-based One-Time Password)
  const setupTOTP = async (email: string) => {
    try {
      // Note: This is a mock implementation since Supabase doesn't directly support TOTP
      // In a real implementation, you would use a third-party library like otplib
      // or make a request to your backend to generate a TOTP secret
      
      // Simulate TOTP setup
      const mockSecret = "JBSWY3DPEHPK3PXP"; // Example secret
      const mockQrCode = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
          <path d="M0,0 h100v100h-100z" fill="#FFFFFF"/>
          <path d="M10,10 h10v10h-10z M30,10 h10v10h-10z M50,10 h10v10h-10z M70,10 h10v10h-10z M20,20 h10v10h-10z M40,20 h10v10h-10z M60,20 h10v10h-10z M80,20 h10v10h-10z" fill="#000000"/>
          <text x="30" y="80" font-family="Arial" font-size="8" fill="#000000">Scan with Auth App</text>
        </svg>`;
      
      // In a real implementation, you would store the association between the user and their TOTP secret
      // in your database
      
      return { 
        secret: mockSecret,
        qrCode: mockQrCode
      };
    } catch (error: any) {
      toast({
        title: "Error setting up authenticator",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to verify TOTP codes
  const verifyTOTP = async (email: string, token: string) => {
    try {
      // Note: This is a mock implementation
      // In a real implementation, you would verify against the stored secret
      
      // Mock verification - accepts any 6-digit code for demo purposes
      if (token.length === 6 && /^\d{6}$/.test(token)) {
        toast({
          title: "TOTP Verification successful",
          description: "You have successfully verified using your authenticator app.",
        });
        return;
      }
      
      throw new Error("Invalid TOTP code");
    } catch (error: any) {
      toast({
        title: "TOTP Verification failed",
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
      setupTOTP,
      verifyTOTP,
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
