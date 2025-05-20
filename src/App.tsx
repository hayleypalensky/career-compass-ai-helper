
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import TailorPage from "./pages/TailorPage";
import JobsPage from "./pages/JobsPage";
import AuthPage from "./pages/AuthPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/help" element={
                <RequireAuth>
                  <HelpPage />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              } />
              <Route path="/tailor" element={
                <RequireAuth>
                  <TailorPage />
                </RequireAuth>
              } />
              <Route path="/jobs" element={
                <RequireAuth>
                  <JobsPage />
                </RequireAuth>
              } />
              {/* Redirect from /auth to /jobs if already authenticated */}
              <Route path="/auth/redirect" element={
                <RequireAuth>
                  <Navigate to="/jobs" replace />
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
