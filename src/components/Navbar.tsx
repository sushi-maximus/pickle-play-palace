
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url && (
                      <AvatarImage src={profile.avatar_url} alt="Profile" />
                    )}
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-background border-b border-border">
          <div className="flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
