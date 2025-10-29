import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AuthPagesProps {
  page: 'login' | 'register';
  onPageChange: (page: string) => void;
}

export function AuthPages({ page, onPageChange }: AuthPagesProps) {
  const { login, register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'learner' as 'artisan' | 'learner',
    bio: '',
    expertise: [] as string[]
  });

  const [expertiseInput, setExpertiseInput] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      toast.success('Welcome back!');
      onPageChange('dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        ...registerData,
        expertise: registerData.expertise.length > 0 ? registerData.expertise : undefined,
        hasCompletedOnboarding: false
      });
      toast.success('Account created successfully!');
      
      // If learner, always redirect to preference questionnaire for personalized recommendations
      if (registerData.role === 'learner') {
        toast.info('Let\'s personalize your learning experience!');
        onPageChange('preferences');
      } else {
        onPageChange('dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !registerData.expertise.includes(expertiseInput.trim())) {
      setRegisterData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (skill: string) => {
    setRegisterData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(s => s !== skill)
    }));
  };

  const demoUsers = [
    { email: 'sarah@example.com', role: 'Artisan (Pottery)' },
    { email: 'david@example.com', role: 'Artisan (Woodworking)' },
    { email: 'emma@example.com', role: 'Artisan (Jewelry)' },
    { email: 'maya@example.com', role: 'Artisan (Textiles)' },
    { email: 'john@example.com', role: 'Learner' }
  ];

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => onPageChange('home')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Welcome back to Handicraft Artisans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Demo Users</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {demoUsers.map((user) => (
                    <button
                      key={user.email}
                      onClick={() => setLoginData({ email: user.email, password: 'demo' })}
                      className="w-full text-left p-2 rounded border border-border hover:bg-accent text-sm"
                    >
                      <div className="font-medium">{user.email}</div>
                      <div className="text-muted-foreground text-xs">{user.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => onPageChange('register')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Button 
          variant="ghost" 
          onClick={() => onPageChange('home')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join our community of artisans and learners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I want to be a *</Label>
                <Select 
                  value={registerData.role} 
                  onValueChange={(value: 'artisan' | 'learner') => 
                    setRegisterData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learner">
                      <div>
                        <div className="font-medium">Learner</div>
                        <div className="text-xs text-muted-foreground">Take classes and learn new skills</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="artisan">
                      <div>
                        <div className="font-medium">Artisan</div>
                        <div className="text-xs text-muted-foreground">Teach classes and share your expertise</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {registerData.role === 'learner' && (
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 inline" />
                    <span>Next: We'll ask a few questions to personalize your course recommendations</span>
                  </p>
                )}
              </div>

              {registerData.role === 'artisan' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={registerData.bio}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about your background and experience..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Areas of Expertise</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        placeholder="e.g., pottery, woodworking..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                      />
                      <Button type="button" onClick={addExpertise} variant="outline">
                        Add
                      </Button>
                    </div>
                    {registerData.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {registerData.expertise.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => removeExpertise(skill)}
                          >
                            {skill} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => onPageChange('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}