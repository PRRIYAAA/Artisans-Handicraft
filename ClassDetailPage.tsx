import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { BookingModal } from '../components/BookingModal';
import { DiscussionSection } from '../components/DiscussionSection';
import { ArrowLeft, Clock, MapPin, Users, Calendar, Star, Shield, Award, MessageCircle, Play, Video } from 'lucide-react';
import { getClassById, getBookingsByUser } from '../lib/dataService';
import { Class, Booking } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ClassDetailPageProps {
  classId: string;
  onBack: () => void;
  onPageChange: (page: string) => void;
  onStartLearning?: (classId: string, bookingId: string) => void;
}

export function ClassDetailPage({ classId, onBack, onPageChange, onStartLearning }: ClassDetailPageProps) {
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [classData, setClassData] = useState<Class | null>(null);
  const [hasBooked, setHasBooked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const cls = getClassById(classId);
    setClassData(cls);

    // Check if user has booked this class
    if (user) {
      const userBookings = getBookingsByUser(user.id);
      const booking = userBookings.find(b => b.classId === classId && b.status !== 'cancelled');
      setHasBooked(!!booking);
    }
  }, [classId, user]);

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Class not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (bookingData: Booking) => {
    // Reload class data to get updated seat count
    const updatedClass = getClassById(classId);
    setClassData(updatedClass);
    setIsBookingModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const features = [
    {
      icon: Award,
      title: 'Expert Instruction',
      description: 'Learn from a master artisan with years of experience'
    },
    {
      icon: Shield,
      title: 'Quality Materials',
      description: 'All materials and tools provided for the class'
    },
    {
      icon: MessageCircle,
      title: 'Small Groups',
      description: 'Personal attention with limited class sizes'
    }
  ];

  return (
    <div className="min-h-screen bg-artisan-neutral">
      <div className="artisan-content-overlay">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video/Image Section */}
            {hasBooked && showVideo ? (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                  {/* Placeholder Video Player */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary ml-1" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-xl mb-2">Sample Lesson: Introduction to {classData.category}</h3>
                        <p className="text-sm text-gray-400">This is a preview lesson for practice</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Lesson 1: Getting Started</p>
                      <p className="text-sm text-muted-foreground">Duration: 15:30</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowVideo(false)}>
                    View Class Info
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden relative">
                  <ImageWithFallback 
                    src={classData.images[0]}
                    alt={classData.title}
                    className="w-full h-full object-cover"
                  />
                  {hasBooked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Button
                        size="lg"
                        onClick={() => setShowVideo(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Watch Sample Lesson
                      </Button>
                    </div>
                  )}
                </div>
                {hasBooked && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Video className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">You're enrolled in this class!</p>
                        <p className="text-sm text-muted-foreground">Access your sample lesson and join the discussion below</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Title and Basic Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {classData.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {classData.level}
                </Badge>
                <Badge variant={classData.location === 'online' ? 'secondary' : 'default'}>
                  {classData.location}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {classData.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{classData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{classData.availableSeats}/{classData.seats} spots available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span className="capitalize">{classData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (127 reviews)</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Meet Your Instructor</h3>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={classData.artisan?.avatarUrl} alt={classData.artisan?.name} />
                  <AvatarFallback>
                    {classData.artisan?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{classData.artisan?.name}</h4>
                  <p className="text-muted-foreground mb-2">{classData.artisan?.bio}</p>
                  {classData.artisan?.expertise && (
                    <div className="flex flex-wrap gap-2">
                      {classData.artisan.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs capitalize">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">About This Class</h3>
              <p className="text-muted-foreground leading-relaxed">
                {classData.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">What You'll Learn</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Fundamental techniques and safety practices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Hands-on creation of your own piece</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Tips for continuing your craft journey</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Take home your completed project</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Dates */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Available Dates</h3>
              <div className="space-y-3">
                {classData.dates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">{formatDate(date)}</span>
                    </div>
                    <Badge variant="outline">Available</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Section - Only show if user has booked */}
            {hasBooked && (
              <div>
                <DiscussionSection classId={classId} />
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  ${classData.price}
                </div>
                <p className="text-muted-foreground">per person</p>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{classData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Spots</span>
                  <span className="font-medium">{classData.availableSeats}/{classData.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium capitalize">{classData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium capitalize">{classData.level}</span>
                </div>
              </div>

              <Separator className="mb-6" />

              {user ? (
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full mb-4"
                  size="lg"
                  disabled={classData.availableSeats === 0}
                >
                  {classData.availableSeats === 0 ? 'Fully Booked' : 'Book This Class'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={() => onPageChange('login')}
                    className="w-full"
                    size="lg"
                  >
                    Sign In to Book
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    New here?{' '}
                    <button 
                      onClick={() => onPageChange('register')}
                      className="text-primary hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center">
                🔒 Secure booking • Free cancellation up to 24 hours before class
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        classData={classData}
        onBookingComplete={handleBookingComplete}
        onStartLearning={onStartLearning}
      />
      </div>
    </div>
  );
}