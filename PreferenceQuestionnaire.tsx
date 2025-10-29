import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { UserPreferences } from '../lib/types';
import { Sparkles, Target, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface PreferenceQuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip?: () => void;
}

export function PreferenceQuestionnaire({ onComplete, onSkip }: PreferenceQuestionnaireProps) {
  const { user, updateUserProfile } = useAuth() as any;
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredCategories: [],
    skillLevel: '',
    learningStyle: '',
    timeCommitment: '',
    goals: []
  });

  const categories = [
    'pottery',
    'woodworking',
    'jewelry',
    'textiles',
    'painting',
    'metalwork',
    'glasswork',
    'leatherwork'
  ];

  const goals = [
    'Learn a new hobby',
    'Start a creative business',
    'Create personalized gifts',
    'Professional development',
    'Stress relief and mindfulness',
    'Connect with artisan community'
  ];

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save preferences to user profile
      if (updateUserProfile) {
        await updateUserProfile({
          preferences,
          hasCompletedOnboarding: true
        });
        toast.success('Preferences saved! Finding perfect classes for you...');
      }
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.preferredCategories.length > 0;
      case 2:
        return preferences.skillLevel !== '';
      case 3:
        return preferences.learningStyle !== '';
      case 4:
        return preferences.timeCommitment !== '' && preferences.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Personalize Your Learning Journey</CardTitle>
          <CardDescription>
            Answer a few quick questions so we can recommend classes tailored to your interests, skill level, and goals
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Preferred Categories */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    What crafts interest you?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all the categories you'd like to explore
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      preferences.preferredCategories.includes(category)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium capitalize">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skill Level */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    What's your current skill level?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This helps us match you with the right difficulty level
                  </p>
                </div>
              </div>

              <RadioGroup 
                value={preferences.skillLevel} 
                onValueChange={(value: any) => setPreferences(prev => ({ ...prev, skillLevel: value }))}
                className="space-y-3"
              >
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.skillLevel === 'beginner' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="beginner" id="beginner" className="mt-1" />
                  <Label htmlFor="beginner" className="cursor-pointer flex-1">
                    <div className="font-medium">Beginner</div>
                    <div className="text-sm text-muted-foreground">I'm new to handicrafts</div>
                  </Label>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.skillLevel === 'intermediate' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="intermediate" id="intermediate" className="mt-1" />
                  <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                    <div className="font-medium">Intermediate</div>
                    <div className="text-sm text-muted-foreground">I have some experience</div>
                  </Label>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.skillLevel === 'advanced' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
                  <Label htmlFor="advanced" className="cursor-pointer flex-1">
                    <div className="font-medium">Advanced</div>
                    <div className="text-sm text-muted-foreground">I'm looking to master my craft</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Learning Style */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    How do you learn best?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred learning approach
                  </p>
                </div>
              </div>

              <RadioGroup 
                value={preferences.learningStyle} 
                onValueChange={(value: any) => setPreferences(prev => ({ ...prev, learningStyle: value }))}
                className="space-y-3"
              >
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.learningStyle === 'visual' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="visual" id="visual" className="mt-1" />
                  <Label htmlFor="visual" className="cursor-pointer flex-1">
                    <div className="font-medium">Visual Learning</div>
                    <div className="text-sm text-muted-foreground">I learn by watching demonstrations</div>
                  </Label>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.learningStyle === 'hands-on' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="hands-on" id="hands-on" className="mt-1" />
                  <Label htmlFor="hands-on" className="cursor-pointer flex-1">
                    <div className="font-medium">Hands-On Practice</div>
                    <div className="text-sm text-muted-foreground">I learn by doing and experimenting</div>
                  </Label>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.learningStyle === 'theoretical' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="theoretical" id="theoretical" className="mt-1" />
                  <Label htmlFor="theoretical" className="cursor-pointer flex-1">
                    <div className="font-medium">Theoretical Understanding</div>
                    <div className="text-sm text-muted-foreground">I like to understand the concepts first</div>
                  </Label>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.learningStyle === 'mixed' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="mixed" id="mixed" className="mt-1" />
                  <Label htmlFor="mixed" className="cursor-pointer flex-1">
                    <div className="font-medium">Mixed Approach</div>
                    <div className="text-sm text-muted-foreground">I enjoy a combination of methods</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Time Commitment & Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      How much time can you commit weekly?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This helps us suggest classes that fit your schedule
                    </p>
                  </div>
                </div>

                <RadioGroup 
                  value={preferences.timeCommitment} 
                  onValueChange={(value: any) => setPreferences(prev => ({ ...prev, timeCommitment: value }))}
                  className="space-y-2"
                >
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    preferences.timeCommitment === 'flexible' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible" className="cursor-pointer">Flexible schedule</Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    preferences.timeCommitment === '1-2hrs' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="1-2hrs" id="1-2hrs" />
                    <Label htmlFor="1-2hrs" className="cursor-pointer">1-2 hours per week</Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    preferences.timeCommitment === '3-5hrs' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="3-5hrs" id="3-5hrs" />
                    <Label htmlFor="3-5hrs" className="cursor-pointer">3-5 hours per week</Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    preferences.timeCommitment === '5+hrs' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="5+hrs" id="5+hrs" />
                    <Label htmlFor="5+hrs" className="cursor-pointer">5+ hours per week</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  What are your learning goals?
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {goals.map(goal => (
                    <button
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        preferences.goals.includes(goal)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {step === 4 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
