import React, { useState, useMemo, useEffect } from 'react';
import { ClassCard } from '../components/ClassCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { categories, levels, locations } from '../lib/mockData';
import { getAllClasses } from '../lib/dataService';
import { Class } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedClasses } from '../lib/recommendationEngine';

interface ClassesPageProps {
  onClassSelect: (classId: string) => void;
}

export function ClassesPage({ onClassSelect }: ClassesPageProps) {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [recommendedClasses, setRecommendedClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const allClasses = getAllClasses();
    setClasses(allClasses);

    // Get personalized recommendations for learners
    if (user?.role === 'learner' && user.preferences) {
      const recommended = getRecommendedClasses(allClasses, user.preferences);
      setRecommendedClasses(recommended);
    }
  }, [user]);

  const priceRanges = [
    'All',
    'Under $50',
    '$50 - $100', 
    '$100 - $150',
    'Over $150'
  ];

  const filteredAndSortedClasses = useMemo(() => {
    let filtered = classes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(cls => 
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.artisan?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cls => cls.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(cls => cls.level === selectedLevel);
    }

    // Location filter
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(cls => cls.location === selectedLocation);
    }

    // Price range filter
    if (priceRange !== 'All') {
      filtered = filtered.filter(cls => {
        switch (priceRange) {
          case 'Under $50':
            return cls.price < 50;
          case '$50 - $100':
            return cls.price >= 50 && cls.price <= 100;
          case '$100 - $150':
            return cls.price >= 100 && cls.price <= 150;
          case 'Over $150':
            return cls.price > 150;
          default:
            return true;
        }
      });
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          // Mock popularity based on remaining seats (less available = more popular)
          return (a.seats - a.availableSeats) - (b.seats - b.availableSeats);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [classes, searchQuery, selectedCategory, selectedLevel, selectedLocation, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedLocation('All');
    setPriceRange('All');
    setSortBy('newest');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All' ? 1 : 0,
    selectedLevel !== 'All' ? 1 : 0,
    selectedLocation !== 'All' ? 1 : 0,
    priceRange !== 'All' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-artisan-classes">
      <div className="artisan-content-overlay">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Discover Classes</h1>
          <p className="text-lg text-muted-foreground">
            Learn traditional handicrafts from expert artisans
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-foreground">Filters</h2>
                <div className="flex items-center space-x-2">
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search classes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level} className="capitalize">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location} className="capitalize">
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="flex-1">
            {/* Personalized Recommendations */}
            {user?.role === 'learner' && user.preferences && recommendedClasses.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Recommended for You
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Based on your learning preferences and interests
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {recommendedClasses.map((classData) => (
                    <ClassCard 
                      key={classData.id} 
                      class={classData} 
                      onViewDetails={onClassSelect}
                    />
                  ))}
                </div>
                <div className="border-t border-border my-8" />
              </div>
            )}

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {user?.preferences ? 'All Classes' : 'Browse All Classes'}
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredAndSortedClasses.length} of {classes.length} classes
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Classes Grid */}
            {filteredAndSortedClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedClasses.map((classData) => (
                  <ClassCard 
                    key={classData.id} 
                    class={classData} 
                    onViewDetails={onClassSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No classes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}