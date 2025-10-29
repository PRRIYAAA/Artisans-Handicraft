import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Different navigation based on user role
  const getNavigation = () => {
    if (!user) {
      // Not logged in - show public pages
      return [
        { name: 'Home', key: 'home' },
        { name: 'Classes', key: 'classes' },
        { name: 'Marketplace', key: 'marketplace' },
        { name: 'About', key: 'about' },
        { name: 'Contact', key: 'contact' }
      ];
    } else if (user.role === 'learner') {
      // Learner view
      return [
        { name: 'Home', key: 'home' },
        { name: 'Classes', key: 'classes' },
        { name: 'Marketplace', key: 'marketplace' },
        { name: 'My Learning', key: 'dashboard' },
        { name: 'About', key: 'about' },
        { name: 'Contact', key: 'contact' }
      ];
    } else {
      // Artisan view
      return [
        { name: 'Home', key: 'home' },
        { name: 'Dashboard', key: 'dashboard' },
        { name: 'Marketplace', key: 'marketplace' },
        { name: 'About', key: 'about' },
        { name: 'Contact', key: 'contact' }
      ];
    }
  };

  const navigation = getNavigation();

  const handleNavClick = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onPageChange('home');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">HA</span>
              </div>
              <span className="font-semibold text-lg text-foreground">Handicraft Artisans</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'learner' && (
                  <div className="text-sm text-muted-foreground">
                    Credits: <span className="font-semibold">{user.credits}</span>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavClick('dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.role === 'artisan' ? 'Dashboard' : 'My Learning'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavClick('profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => handleNavClick('login')}>
                  Sign In
                </Button>
                <Button onClick={() => handleNavClick('register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  currentPage === item.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </button>
            ))}
            {user ? (
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.role === 'learner' && (
                      <div className="text-xs text-muted-foreground">Credits: {user.credits}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  {user.role === 'artisan' ? 'Dashboard' : 'My Learning'}
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-border space-y-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}