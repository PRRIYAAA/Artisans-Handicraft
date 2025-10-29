import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../lib/types';
import { getCurrentUser, setCurrentUser, getUserByEmail, createUser, updateUser } from '../lib/dataService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Find user by email
    const foundUser = getUserByEmail(email);
    
    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
    } else {
      throw new Error('User not found. Try: sarah@example.com, david@example.com, emma@example.com, maya@example.com, or john@example.com');
    }
    setLoading(false);
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    // Create new user
    const newUser = createUser({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone,
      role: userData.role || 'learner',
      credits: userData.role === 'learner' ? 100 : 0,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio,
      expertise: userData.expertise
    });
    
    setUser(newUser);
    setCurrentUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };
  
  // Update context to also expose updateUser
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = updateUser(user.id, updates);
    if (updated) {
      setUser(updated);
      setCurrentUser(updated);
    }
  };

  const value: AuthContextType & { updateUserProfile: (updates: Partial<User>) => Promise<void> } = {
    user,
    login,
    register,
    logout,
    loading,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}