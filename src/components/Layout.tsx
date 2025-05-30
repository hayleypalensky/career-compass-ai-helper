
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Menu, User, Briefcase, FileText, HelpCircle, LogOut } from "lucide-react";

const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current pathname:", location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to:", path);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Material 3 App Bar */}
      <header className="material-surface-elevated sticky top-0 z-50 border-b border-outline/12">
        <div className="container mx-auto py-4 px-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 material-ripple rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-headline-small font-medium text-foreground">ResumeAI</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`material-ripple flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive('/profile') 
                        ? 'bg-primary-container text-on-primary-container font-medium' 
                        : 'text-foreground hover:bg-surface-container'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-label-large">Profile</span>
                  </Link>
                  
                  <Link 
                    to="/tailor" 
                    className={`material-ripple flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive('/tailor') 
                        ? 'bg-primary-container text-on-primary-container font-medium' 
                        : 'text-foreground hover:bg-surface-container'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-label-large">Tailor Resume</span>
                  </Link>
                  
                  <Link 
                    to="/jobs" 
                    className={`material-ripple flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive('/jobs') 
                        ? 'bg-primary-container text-on-primary-container font-medium' 
                        : 'text-foreground hover:bg-surface-container'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="text-label-large">Job Tracker</span>
                  </Link>
                  
                  <Link 
                    to="/help" 
                    className={`material-ripple flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive('/help') 
                        ? 'bg-primary-container text-on-primary-container font-medium' 
                        : 'text-foreground hover:bg-surface-container'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-label-large">Help</span>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="material-ripple flex items-center space-x-2 text-foreground hover:bg-surface-container rounded-xl px-4 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-label-large">Sign Out</span>
                  </Button>
                  
                  <div className="ml-4 flex items-center space-x-2 px-3 py-2 bg-surface-container rounded-xl">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-body-small text-muted-foreground">{user.email}</span>
                  </div>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <Outlet />
      </main>
      
      {/* Material 3 Footer */}
      <footer className="material-surface border-t border-outline/12 py-8 mt-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-body-medium text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
