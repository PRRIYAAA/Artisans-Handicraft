import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, 
  Play, 
  Video, 
  Clock, 
  CheckCircle2, 
  Lock,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getClassById, getBookingsByUser } from '../lib/dataService';
import { Class, Booking, Discussion } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { LearnerQueriesSummary } from '../components/LearnerQueriesSummary';
import { VideoPlayer } from '../components/VideoPlayer';

interface LearningModulePageProps {
  classId: string;
  bookingId?: string;
  onBack: () => void;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export function LearningModulePage({ classId, bookingId, onBack }: LearningModulePageProps) {
  const { user } = useAuth();
  const [classData, setClassData] = useState<Class | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const cls = getClassById(classId);
    setClassData(cls);

    if (user) {
      const userBookings = getBookingsByUser(user.id);
      const userBooking = userBookings.find(b => b.classId === classId && b.status !== 'cancelled');
      setBooking(userBooking || null);
    }

    // Initialize lessons based on class category
    if (cls) {
      const categoryLessons = generateLessonsForClass(cls);
      setLessons(categoryLessons);
    }

    // Initialize sample chat messages
    initializeChatMessages();
  }, [classId, user]);

  const generateLessonsForClass = (cls: Class): Lesson[] => {
    const baseLessons = [
      {
        id: 1,
        title: `Welcome to ${cls.title}`,
        duration: '8:45',
        description: 'Introduction and course overview',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 2,
        title: 'Tools and Materials',
        duration: '12:30',
        description: 'Essential tools and materials you\'ll need',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 3,
        title: 'Basic Techniques - Part 1',
        duration: '18:15',
        description: 'Fundamental techniques and methods',
        isCompleted: false,
        isLocked: true
      },
      {
        id: 4,
        title: 'Basic Techniques - Part 2',
        duration: '15:45',
        description: 'Continuing with core techniques',
        isCompleted: false,
        isLocked: true
      },
      {
        id: 5,
        title: 'Your First Project',
        duration: '22:30',
        description: 'Hands-on project to apply what you\'ve learned',
        isCompleted: false,
        isLocked: true
      },
      {
        id: 6,
        title: 'Advanced Tips and Tricks',
        duration: '16:20',
        description: 'Professional tips to improve your craft',
        isCompleted: false,
        isLocked: true
      },
      {
        id: 7,
        title: 'Common Mistakes to Avoid',
        duration: '11:40',
        description: 'Learn from common pitfalls',
        isCompleted: false,
        isLocked: true
      },
      {
        id: 8,
        title: 'Final Project and Next Steps',
        duration: '25:10',
        description: 'Complete your final project and continue learning',
        isCompleted: false,
        isLocked: true
      }
    ];

    return baseLessons;
  };

  const initializeChatMessages = () => {
    const sampleMessages: ChatMessage[] = [
      {
        id: '1',
        userId: '2',
        userName: 'David Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        content: 'Welcome everyone! Feel free to ask any questions as you go through the lessons.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        userId: '5',
        userName: 'John Smith',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        content: 'Hi! What type of wood is best for beginners?',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '3',
        userId: '2',
        userName: 'David Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        content: 'Great question! I recommend starting with pine or basswood - they\'re soft and easy to work with.',
        createdAt: new Date(Date.now() - 1200000).toISOString()
      }
    ];
    setChatMessages(sampleMessages);
  };

  const handleLessonComplete = () => {
    const updatedLessons = [...lessons];
    updatedLessons[currentLesson].isCompleted = true;
    
    // Unlock next lesson
    if (currentLesson + 1 < lessons.length) {
      updatedLessons[currentLesson + 1].isLocked = false;
    }
    
    setLessons(updatedLessons);
    toast.success('Lesson completed!');
  };

  const handleLessonSelect = (index: number) => {
    if (!lessons[index].isLocked) {
      setCurrentLesson(index);
      setIsPlaying(false);
    } else {
      toast.error('Complete previous lessons to unlock this one');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Class not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const progress = (completedCount / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-artisan-neutral">
      <div className="artisan-content-overlay">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Progress: {completedCount}/{lessons.length}
              </div>
              <Progress value={progress} className="w-24 h-2" />
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar - Lessons List */}
        <div className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 border-r bg-card flex-shrink-0 overflow-hidden`}>
          <div className="h-full flex flex-col">
            {/* Course Title */}
            <div className="p-4 border-b">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm line-clamp-2 pr-2">{classData.title}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => setIsSidebarCollapsed(true)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                by {classData.artisan?.name}
              </p>
            </div>

            {/* Lessons List */}
            <ScrollArea className="flex-1 h-0">
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-2 py-2">
                  CONTENTS
                </div>
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`
                      flex items-start p-3 mb-1 rounded-md cursor-pointer transition-colors
                      ${currentLesson === index 
                        ? 'bg-primary text-primary-foreground' 
                        : lesson.isLocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-muted'
                      }
                    `}
                    onClick={() => handleLessonSelect(index)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : lesson.isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm mb-1 ${currentLesson === index ? 'font-medium' : ''}`}>
                        {lesson.title}
                      </div>
                      <div className={`text-xs flex items-center ${currentLesson === index ? 'opacity-90' : 'text-muted-foreground'}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration}
                      </div>
                    </div>
                    {currentLesson === index && !lesson.isLocked && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-1 h-8 bg-primary-foreground rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Instructor Info */}
            <div className="p-4 border-t">
              <div className="text-xs text-muted-foreground mb-2">INSTRUCTOR</div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={classData.artisan?.avatarUrl} alt={classData.artisan?.name} />
                  <AvatarFallback className="text-xs">
                    {classData.artisan?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{classData.artisan?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {classData.category} Expert
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsed Sidebar Toggle */}
        {isSidebarCollapsed && (
          <div className="w-12 border-r bg-card flex-shrink-0 flex items-start justify-center pt-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsSidebarCollapsed(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player with Language Translation */}
          <div className="flex-shrink-0 bg-black">
            <VideoPlayer 
              title={lessons[currentLesson]?.title || 'Loading...'}
              category={classData.category}
            />
          </div>

          {/* Lesson Actions */}
          <div className="flex-shrink-0 bg-card border-b px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              {!lessons[currentLesson]?.isCompleted && (
                <Button 
                  variant="secondary"
                  onClick={handleLessonComplete}
                  size="sm"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              )}
              {currentLesson < lessons.length - 1 && !lessons[currentLesson + 1].isLocked && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCurrentLesson(currentLesson + 1);
                    setIsPlaying(false);
                  }}
                  size="sm"
                >
                  Next Lesson
                </Button>
              )}
            </div>
          </div>

          {/* Video Title Bar */}
          <div className="flex-shrink-0 bg-card border-b px-6 py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg mb-1">{lessons[currentLesson]?.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{lessons[currentLesson]?.duration}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Lesson {currentLesson + 1} of {lessons.length}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {lessons[currentLesson]?.isCompleted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {classData.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Learner Queries Summary Section */}
          <LearnerQueriesSummary classCategory={classData.category} />

          {/* Chat/Discussion Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <div className="px-6 py-3 border-b bg-card">
              <h3 className="text-sm">Discussion & Questions</h3>
              <p className="text-xs text-muted-foreground">
                Ask questions and interact with your instructor and fellow learners
              </p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 h-0 px-6 py-4">
              <div className="space-y-4 max-w-4xl">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.userAvatar} alt={message.userName} />
                      <AvatarFallback className="text-xs">
                        {message.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2 mb-1">
                        <span className="text-sm">{message.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(message.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2 inline-block">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex-shrink-0 border-t bg-card px-6 py-4">
              <div className="max-w-4xl flex items-end space-x-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-xs">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your question or comment..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[60px] resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}