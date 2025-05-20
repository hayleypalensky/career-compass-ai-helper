
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Layout = () => {
  const { user, signOut } = useAuth();

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
                  <Link to="/profile" className="text-navy-600 hover:text-navy-800">Profile</Link>
                  <Link to="/tailor" className="text-navy-600 hover:text-navy-800">Tailor Resume</Link>
                  <Link to="/jobs" className="text-navy-600 hover:text-navy-800">Job Tracker</Link>
                  <Link to="/help" className="text-navy-600 hover:text-navy-800">
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
