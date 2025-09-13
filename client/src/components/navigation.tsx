import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/ocean-data", label: "Ocean Data" },
    { path: "/fisheries-data", label: "Fisheries Data" },
    { path: "/molecular-data", label: "Molecular Data" },
    { path: "/ai-predictions", label: "AI Predictions" },
    { path: "/about", label: "About" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="glass-effect border-b border-border sticky top-0 z-50 wave-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 ocean-gradient rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
                </svg>
              </div>
<<<<<<< HEAD
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OceanAI Platform
              </span>
=======
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-cyan-300 group-hover:to-blue-300 transition-all duration-300 truncate">
                  OceanAI
                </span>
                <span className="text-xs text-cyan-300/70 font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 whitespace-nowrap hidden sm:block">
                  NEURAL OCEAN ENGINE
                </span>
              </div>
>>>>>>> e65db4f (API Integrated)
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <span
                  className={`font-medium transition-colors duration-200 border-b-2 ${
                    isActive(item.path)
                      ? "text-foreground border-primary"
                      : "text-muted-foreground hover:text-primary border-transparent"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            
            {/* Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="user-menu-trigger">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect border-primary/20">
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive" data-testid="logout-button">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="ocean-gradient text-primary-foreground hover:scale-105 transition-transform duration-200" data-testid="login-button">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <span
                    className={`text-left py-2 font-medium transition-colors border-l-2 pl-3 ${
                      isActive(item.path)
                        ? "text-foreground border-primary"
                        : "text-muted-foreground hover:text-primary border-transparent"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground px-3">
                      {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={signOut}
                      className="w-full justify-start text-destructive"
                      data-testid="mobile-logout-button"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full ocean-gradient text-primary-foreground" data-testid="mobile-login-button">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
