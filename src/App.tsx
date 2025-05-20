
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import TailorPage from "./pages/TailorPage";
import JobsPage from "./pages/JobsPage";
import AuthPage from "./pages/AuthPage";
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
