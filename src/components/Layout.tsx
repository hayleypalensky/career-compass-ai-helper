
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug the current route
  useEffect(() => {
    console.log("Current pathname:", location.pathname);
  }, [location.pathname]);

  // Handle navigation explicitly to ensure routes work
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-navy-800 font-bold text-xl">ResumeAI</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={handleNavigation('/profile')}
                    className={`${location.pathname === '/profile' ? 'text-navy-800 font-medium' : 'text-navy-600 hover:text-navy-800'}`}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/tailor" 
                    onClick={handleNavigation('/tailor')}
                    className={`${location.pathname === '/tailor' ? 'text-navy-800 font-medium' : 'text-navy-600 hover:text-navy-800'}`}
                  >
                    Tailor Resume
                  </Link>
                  <Link 
                    to="/jobs" 
                    onClick={handleNavigation('/jobs')}
                    className={`${location.pathname === '/jobs' ? 'text-navy-800 font-medium' : 'text-navy-600 hover:text-navy-800'}`}
                  >
                    Job Tracker
                  </Link>
                  <Link 
                    to="/help" 
                    onClick={handleNavigation('/help')}
                    className={`${location.pathname === '/help' ? 'text-navy-800 font-medium' : 'text-navy-600 hover:text-navy-800'}`}
                  >
                    Help
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="text-navy-600 hover:text-navy-800"
                  >
                    Sign Out
                  </Button>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
