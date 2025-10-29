import { User, Class, Booking, Product, Order } from './types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    role: 'artisan',
    credits: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612db8e?w=400',
    bio: 'Professional pottery instructor with 15 years of experience.',
    expertise: ['pottery', 'ceramics', 'glazing']
  },
  {
    id: '2',
    name: 'David Chen',
    email: 'david@example.com',
    role: 'artisan',
    credits: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Master woodworker specializing in furniture and decorative pieces.',
    expertise: ['woodworking', 'carving', 'furniture']
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    role: 'artisan',
    credits: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Jewelry designer and metalsmith with passion for unique designs.',
    expertise: ['jewelry', 'metalwork', 'design']
  },
  {
    id: '4',
    name: 'Maya Patel',
    email: 'maya@example.com',
    role: 'artisan',
    credits: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    bio: 'Textile artist specializing in traditional and modern weaving.',
    expertise: ['weaving', 'textiles', 'traditional crafts']
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'learner',
    credits: 150,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  }
];

// Mock classes data
export const mockClasses: Class[] = [
  {
    id: '1',
    title: 'Beginner Pottery Workshop',
    description: 'Learn the basics of pottery making in this hands-on workshop. Perfect for beginners who want to explore the art of ceramics.',
    price: 85,
    artisanId: '1',
    seats: 12,
    availableSeats: 8,
    dates: ['2024-01-15', '2024-01-22', '2024-01-29'],
    images: ['https://images.unsplash.com/photo-1676125105159-517d135a6cc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3R0ZXJ5JTIwY2VyYW1pY3MlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTc0MDgyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    category: 'pottery',
    duration: '3 hours',
    level: 'beginner',
    location: 'offline',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Advanced Wood Carving Techniques',
    description: 'Master advanced wood carving techniques including relief carving, chip carving, and tool maintenance.',
    price: 120,
    artisanId: '2',
    seats: 8,
    availableSeats: 3,
    dates: ['2024-01-20', '2024-01-27'],
    images: ['https://images.unsplash.com/photo-1497218770144-3fea6dbc33fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGNyYWZ0JTIwY2xhc3N8ZW58MXx8fHwxNzU3NDA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    category: 'woodworking',
    duration: '4 hours',
    level: 'advanced',
    location: 'offline',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    title: 'Silver Jewelry Making Online',
    description: 'Create beautiful silver jewelry from home with guided online instruction and a starter kit delivered to your door.',
    price: 95,
    artisanId: '3',
    seats: 15,
    availableSeats: 12,
    dates: ['2024-01-18', '2024-01-25'],
    images: ['https://images.unsplash.com/photo-1715374033196-0ff662284a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1NzQwODI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'jewelry',
    duration: '2.5 hours',
    level: 'intermediate',
    location: 'online',
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    title: 'Traditional Weaving Workshop',
    description: 'Explore traditional weaving techniques and create your own textile masterpiece using authentic looms and materials.',
    price: 110,
    artisanId: '4',
    seats: 10,
    availableSeats: 6,
    dates: ['2024-01-16', '2024-01-23', '2024-01-30'],
    images: ['https://images.unsplash.com/photo-1746737198844-b9c9f4189352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwd2VhdmluZyUyMGhhbmRjcmFmdHxlbnwxfHx8fDE3NTc0MDgyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    category: 'textiles',
    duration: '3.5 hours',
    level: 'beginner',
    location: 'offline',
    createdAt: '2024-01-04'
  },
  {
    id: '5',
    title: 'Ceramic Glazing Masterclass',
    description: 'Advanced techniques for glazing ceramic pieces, including color mixing, application methods, and firing processes.',
    price: 75,
    artisanId: '1',
    seats: 8,
    availableSeats: 4,
    dates: ['2024-02-01', '2024-02-08'],
    images: ['https://images.unsplash.com/photo-1676125105159-517d135a6cc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3R0ZXJ5JTIwY2VyYW1pY3MlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTc0MDgyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    category: 'pottery',
    duration: '2 hours',
    level: 'intermediate',
    location: 'offline',
    createdAt: '2024-01-05'
  },
  {
    id: '6',
    title: 'Furniture Restoration Workshop',
    description: 'Learn to restore and refinish vintage furniture pieces. Bring new life to old treasures with professional techniques.',
    price: 140,
    artisanId: '2',
    seats: 6,
    availableSeats: 2,
    dates: ['2024-02-05', '2024-02-12'],
    images: ['https://images.unsplash.com/photo-1497218770144-3fea6dbc33fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGNyYWZ0JTIwY2xhc3N8ZW58MXx8fHwxNzU3NDA4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    category: 'woodworking',
    duration: '5 hours',
    level: 'intermediate',
    location: 'offline',
    createdAt: '2024-01-06'
  }
];

// Add artisan references to classes
mockClasses.forEach(cls => {
  cls.artisan = mockUsers.find(user => user.id === cls.artisanId);
});

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '5',
    classId: '1',
    amountPaid: 85,
    status: 'confirmed',
    createdAt: '2024-01-10',
    selectedDate: '2024-01-15'
  },
  {
    id: '2',
    userId: '5',
    classId: '3',
    amountPaid: 95,
    status: 'pending',
    createdAt: '2024-01-12',
    selectedDate: '2024-01-18'
  }
];

// Add references
mockBookings.forEach(booking => {
  booking.user = mockUsers.find(user => user.id === booking.userId);
  booking.class = mockClasses.find(cls => cls.id === booking.classId);
});

export const categories = [
  'All',
  'pottery',
  'woodworking', 
  'jewelry',
  'textiles',
  'painting',
  'sculpture',
  'glasswork',
  'metalwork'
];

export const levels = [
  'All',
  'beginner',
  'intermediate', 
  'advanced'
];

export const locations = [
  'All',
  'online',
  'offline'
];

// Mock products data
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Handcrafted Ceramic Mug Set',
    description: 'Beautiful set of 4 handmade ceramic mugs with unique glazing. Each mug is wheel-thrown and features a comfortable handle. Perfect for your morning coffee or tea.',
    price: 65,
    artisanId: '1',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800'],
    category: 'pottery',
    stockQuantity: 15,
    materials: ['Stoneware clay', 'Food-safe glaze'],
    dimensions: '3.5" diameter x 4" height',
    weight: '12 oz per mug',
    customizable: true,
    createdAt: '2024-01-10',
    rating: 4.8,
    reviews: 24
  },
  {
    id: '2',
    title: 'Carved Wooden Serving Board',
    description: 'Elegant walnut serving board with intricate carved details. Perfect for entertaining guests or as a centerpiece. Each board is hand-carved and finished with food-safe oil.',
    price: 95,
    artisanId: '2',
    images: ['https://images.unsplash.com/photo-1565183928294-7d22f6a49f93?w=800'],
    category: 'woodworking',
    stockQuantity: 8,
    materials: ['Walnut wood', 'Food-safe mineral oil'],
    dimensions: '18" x 12" x 0.75"',
    weight: '3 lbs',
    customizable: false,
    createdAt: '2024-01-12',
    rating: 5.0,
    reviews: 18
  },
  {
    id: '3',
    title: 'Sterling Silver Pendant Necklace',
    description: 'Delicate handmade pendant featuring a unique organic design. Made from sterling silver and polished to perfection. Comes with an 18" silver chain.',
    price: 120,
    artisanId: '3',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    category: 'jewelry',
    stockQuantity: 12,
    materials: ['Sterling silver 925', 'Rhodium plating'],
    dimensions: 'Pendant: 1" x 0.75"',
    weight: '0.3 oz',
    customizable: true,
    createdAt: '2024-01-14',
    rating: 4.9,
    reviews: 31
  },
  {
    id: '4',
    title: 'Handwoven Wool Throw Blanket',
    description: 'Luxurious throw blanket handwoven with premium merino wool. Features a traditional pattern with modern color palette. Perfect for adding warmth and style to any room.',
    price: 185,
    artisanId: '4',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800'],
    category: 'textiles',
    stockQuantity: 6,
    materials: ['100% Merino wool', 'Natural dyes'],
    dimensions: '60" x 50"',
    weight: '2.5 lbs',
    customizable: true,
    createdAt: '2024-01-16',
    rating: 4.7,
    reviews: 15
  },
  {
    id: '5',
    title: 'Ceramic Plant Pot Collection',
    description: 'Set of 3 handmade ceramic plant pots in graduated sizes. Each pot features drainage holes and a matching saucer. Beautiful matte finish in earth tones.',
    price: 48,
    artisanId: '1',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'],
    category: 'pottery',
    stockQuantity: 20,
    materials: ['Terracotta clay', 'Matte glaze'],
    dimensions: 'Small: 4", Medium: 6", Large: 8"',
    weight: '5 lbs total',
    customizable: false,
    createdAt: '2024-01-18',
    rating: 4.6,
    reviews: 42
  },
  {
    id: '6',
    title: 'Wooden Jewelry Box',
    description: 'Beautifully crafted wooden jewelry box with compartments and a mirror. Features dovetail joints and a smooth finish. Perfect for organizing your precious items.',
    price: 145,
    artisanId: '2',
    images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800'],
    category: 'woodworking',
    stockQuantity: 5,
    materials: ['Cherry wood', 'Brass hardware', 'Velvet lining'],
    dimensions: '10" x 7" x 5"',
    weight: '2 lbs',
    customizable: true,
    createdAt: '2024-01-20',
    rating: 5.0,
    reviews: 12
  }
];

// Add artisan references to products
mockProducts.forEach(product => {
  product.artisan = mockUsers.find(user => user.id === product.artisanId);
});

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '5',
    productId: '1',
    quantity: 1,
    totalAmount: 65,
    status: 'delivered',
    shippingAddress: '123 Main St, Apt 4B, New York, NY 10001',
    createdAt: '2024-01-08',
    deliveryDate: '2024-01-15'
  }
];

// Add references
mockOrders.forEach(order => {
  order.user = mockUsers.find(user => user.id === order.userId);
  order.product = mockProducts.find(product => product.id === order.productId);
});