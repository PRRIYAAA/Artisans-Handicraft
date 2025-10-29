import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ClassCard } from '../components/ClassCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Users, Award, Clock, Shield, Sparkles } from 'lucide-react';
import { categories } from '../lib/mockData';
import { getAllClasses } from '../lib/dataService';
import { Class } from '../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedClasses } from '../lib/recommendationEngine';

interface HomePageProps {
  onPageChange: (page: string) => void;
  onClassSelect: (classId: string) => void;
}

export function HomePage({ onPageChange, onClassSelect }: HomePageProps) {
  const { user } = useAuth();
  const [featuredClasses, setFeaturedClasses] = useState<Class[]>([]);
  const [recommendedClasses, setRecommendedClasses] = useState<Class[]>([]);

  useEffect(() => {
    const allClasses = getAllClasses();
    
    // Get personalized recommendations for learners with preferences
    if (user?.role === 'learner' && user.preferences) {
      const recommended = getRecommendedClasses(allClasses, user.preferences);
      setRecommendedClasses(recommended.slice(0, 3));
    } else {
      // Get featured classes (first 3) for non-logged in users or users without preferences
      setFeaturedClasses(allClasses.slice(0, 3));
    }
  }, [user]);

  const features = [
    {
      icon: Users,
      title: 'Expert Artisans',
      description: 'Learn from master craftspeople with years of experience'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All classes are carefully curated for the best learning experience'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Choose from various time slots that fit your schedule'
    },
    {
      icon: Shield,
      title: 'Satisfaction Guaranteed',
      description: 'Full refund if you\'re not completely satisfied'
    }
  ];

  return (
    <div className="bg-artisan-home min-h-screen">
      <div className="artisan-content-overlay">
      {/* Hero Section */}
      <Hero onPageChange={onPageChange} />

      {/* Spacer for search bar */}
      <div className="h-20" />

      {/* Preference Banner for Learners */}
      {user?.role === 'learner' && !user.hasCompletedOnboarding && (
        <section className="py-8 bg-white/80 backdrop-blur-sm border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Get Personalized Class Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Take a quick 2-minute questionnaire to help us suggest the perfect classes for your interests and skill level.
                  </p>
                </div>
              </div>
              <Button onClick={() => onPageChange('preferences')} size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Handicraft Artisans?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We connect passionate learners with skilled artisans, creating meaningful 
              experiences that preserve traditional crafts for future generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured/Recommended Classes */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              {user?.role === 'learner' && user.preferences && recommendedClasses.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">Recommended for You</h2>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Classes handpicked based on your interests and skill level
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Featured Classes</h2>
                  <p className="text-lg text-muted-foreground">
                    Discover popular classes taught by our most experienced artisans
                  </p>
                </>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={() => onPageChange('classes')}
              className="hidden md:flex"
            >
              View All Classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(user?.role === 'learner' && user.preferences && recommendedClasses.length > 0 
              ? recommendedClasses 
              : featuredClasses
            ).map((classData) => (
              <ClassCard 
                key={classData.id} 
                class={classData} 
                onViewDetails={onClassSelect}
              />
            ))}
          </div>

          <div className="text-center md:hidden">
            <Button onClick={() => onPageChange('classes')}>
              View All Classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Categories</h2>
            <p className="text-lg text-muted-foreground">
              Find classes in your favorite craft category
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.slice(1).map((category) => (
              <Badge 
                key={category}
                variant="outline" 
                className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                onClick={() => onPageChange('classes')}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#6B4423] to-[#8B5A3C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Craft Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of learners who have discovered their passion for traditional crafts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onPageChange('classes')}
              className="text-lg px-8 py-3"
            >
              Browse Classes
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onPageChange('register')}
              className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Sign Up Today
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}