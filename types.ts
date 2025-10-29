export interface UserPreferences {
  preferredCategories: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  learningStyle: 'visual' | 'hands-on' | 'theoretical' | 'mixed' | '';
  timeCommitment: 'flexible' | '1-2hrs' | '3-5hrs' | '5+hrs' | '';
  goals: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'artisan' | 'learner';
  credits: number;
  avatarUrl?: string;
  bio?: string;
  expertise?: string[];
  preferences?: UserPreferences;
  hasCompletedOnboarding?: boolean;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  price: number;
  artisanId: string;
  artisan?: User;
  seats: number;
  availableSeats: number;
  dates: string[];
  images: string[];
  videoUrl?: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  location: 'online' | 'offline';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  classId: string;
  class?: Class;
  amountPaid: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  selectedDate?: string;
}

export interface Discussion {
  id: string;
  classId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
  parentId?: string; // For replies
  replies?: Discussion[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  artisanId: string;
  artisan?: User;
  images: string[];
  category: string;
  stockQuantity: number;
  materials?: string[];
  dimensions?: string;
  weight?: string;
  customizable: boolean;
  createdAt: string;
  rating?: number;
  reviews?: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  deliveryDate?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}