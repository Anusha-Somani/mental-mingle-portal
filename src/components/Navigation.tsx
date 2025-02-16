import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  const navItems = isAuthenticated ? [{
    name: "Dashboard",
    path: "/dashboard"
  }, {
    name: "Chat Support",
    path: "/chat"
  }] : [{
    name: "Home",
    path: "/"
  }, {
    name: "Login",
    path: "/auth"
  }];
  return <nav className="bg-white/80 backdrop-blur-md shadow-sm font-poppins sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="font-bold transition-colors text-slate-900 text-3xl">
                Mevincible
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <Link key={item.name} to={item.path} className="text-gray-600 hover:text-primary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-primary/5">
                {item.name}
              </Link>)}
            {isAuthenticated && <Button variant="ghost" className="text-gray-600 hover:text-primary" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && <div className="md:hidden animate-fade-in bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => <Link key={item.name} to={item.path} className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary/5" onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>)}
            {isAuthenticated && <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-primary" onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>}
          </div>
        </div>}
    </nav>;
};
export default Navigation;