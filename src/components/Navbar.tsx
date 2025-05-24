import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              PicklePlay
            </Link>
            
            {user && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/dashboard"
                  className={`${
                    location.pathname === "/dashboard"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  } px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/groups"
                  className={`${
                    location.pathname.startsWith("/groups")
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  } px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors`}
                >
                  Groups
                </Link>
                <Link
                  to="/training"
                  className={`${
                    location.pathname === "/training"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  } px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors`}
                >
                  Training
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User Avatar"} />
                      <AvatarFallback>{profile?.full_name?.charAt(0).toUpperCase() || "PP"}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-dark transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
