
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage, AvatarWithBorder } from "@/components/ui/avatar";
import { skillLevelColors, getSkillLevelColor } from "@/lib/constants/skill-levels";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Get the appropriate color based on DUPR or skill level
  const borderColor = getSkillLevelColor(profile?.dupr_rating, profile?.skill_level);

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full bg-background border-b border-border py-3">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pickle-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">PN</span>
          </div>
          <span className="font-bold text-xl">Pickle Ninja</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <Link 
              to="/dashboard" 
              className={`relative transition-colors ${isActive('/dashboard') 
                ? 'text-primary font-medium after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-primary after:bottom-[-8px] after:left-0' 
                : 'text-foreground hover:text-primary'}`}
            >
              Dashboard
            </Link>
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-full ${isActive('/profile') ? 'bg-accent' : ''}`}
                >
                  <AvatarWithBorder className="h-8 w-8" borderColor={borderColor} borderWidth={2}>
                    <AvatarImage 
                      src={profile?.avatar_url || ""} 
                      alt="Profile" 
                      className="rounded-full"
                    />
                    <AvatarFallback className="rounded-full">{getInitials()}</AvatarFallback>
                  </AvatarWithBorder>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isActive('/login') ? "default" : "outline"}>Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant={isActive('/signup') ? "secondary" : "default"}>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu with improved transitions */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 transform ${
          isMenuOpen 
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-end p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className={`justify-start w-full ${isActive('/dashboard') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className={`justify-start w-full ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive('/login') ? "default" : "outline"} className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive('/signup') ? "secondary" : "default"} className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
