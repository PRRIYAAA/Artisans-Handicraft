import React from 'react';
import { Button } from './ui/button';
import { Search, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface HeroProps {
  onPageChange: (page: string) => void;
}

export function Hero({ onPageChange }: HeroProps) {
  const { user } = useAuth();

  const handleBrowseClasses = () => {
    if (!user) {
      toast.info('Please sign in to browse personalized classes');
      onPageChange('login');
    } else if (user.role === 'artisan') {
      onPageChange('dashboard');
    } else {
      onPageChange('classes');
    }
  };

  const handleSecondaryAction = () => {
    if (!user || user.role === 'learner') {
      onPageChange('marketplace');
    } else {
      onPageChange('create-class');
    }
  };
  return (
    <section className="relative bg-gradient-to-br from-[#D35400]/10 via-[#FF9505]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center py-12 lg:py-20">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Learn Traditional{' '}
              <span className="text-primary">Handicrafts</span>{' '}
              from Master Artisans
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover the art of pottery, woodworking, jewelry making, and more through 
              hands-on classes taught by experienced craftspeople. Join our community of 
              makers and create something beautiful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                onClick={handleBrowseClasses}
                className="text-lg px-8 py-3"
              >
                {user?.role === 'artisan' ? 'Go to Dashboard' : 'Browse Classes'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleSecondaryAction}
                className="text-lg px-8 py-3"
              >
                {user?.role === 'artisan' ? 'Create Class' : user ? 'Shop Marketplace' : 'Become an Artisan'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Active Classes</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Expert Artisans</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </div>
            </div>
          </div>

          {/* Hero Image - Beautiful Artisan Workshop */}
          <div className="flex-1 mt-12 lg:mt-0">
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1589051079002-b140a970f568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwd29ya3Nob3AlMjBjcmFmdHMlMjBwb3R0ZXJ5fGVufDF8fHx8MTc2MTQ2MjgxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Artisan crafting in workshop - pottery, weaving, and handmade crafts"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-2xl" />
              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF9505] via-[#FFC30B] to-[#D35400] rounded-2xl opacity-20 blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#D35400]/10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for pottery, woodworking, jewelry..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleBrowseClasses}
                className="px-8"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}