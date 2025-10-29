import { User, Class, Booking, Discussion, Product, Order } from './types';
import { mockUsers, mockClasses, mockBookings, mockProducts, mockOrders } from './mockData';

const STORAGE_KEYS = {
  USERS: 'handicraft_users',
  CLASSES: 'handicraft_classes',
  BOOKINGS: 'handicraft_bookings',
  CURRENT_USER: 'handicraft_current_user',
  DISCUSSIONS: 'handicraft_discussions',
  PRODUCTS: 'handicraft_products',
  ORDERS: 'handicraft_orders'
};

// Initialize localStorage with mock data if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(mockClasses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(mockBookings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISCUSSIONS)) {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
}

initializeStorage();

// User operations
export function getAllUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
}

export function getUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.email === email) || null;
}

export function createUser(userData: Omit<User, 'id'>): User {
  const users = getAllUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[index];
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Class operations
export function getAllClasses(): Class[] {
  const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
  const classes = data ? JSON.parse(data) : [];
  
  // Populate artisan info
  const users = getAllUsers();
  return classes.map((cls: Class) => ({
    ...cls,
    artisan: users.find(user => user.id === cls.artisanId)
  }));
}

export function getClassById(id: string): Class | null {
  const classes = getAllClasses();
  return classes.find(cls => cls.id === id) || null;
}

export function getClassesByArtisan(artisanId: string): Class[] {
  const classes = getAllClasses();
  return classes.filter(cls => cls.artisanId === artisanId);
}

export function createClass(classData: Omit<Class, 'id' | 'createdAt' | 'artisan'>): Class {
  const classes = getAllClasses();
  const newClass: Class = {
    ...classData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    availableSeats: classData.availableSeats || classData.seats
  };
  
  classes.push(newClass);
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  return newClass;
}

export function updateClass(id: string, updates: Partial<Class>): Class | null {
  const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
  const classes = data ? JSON.parse(data) : [];
  const index = classes.findIndex((cls: Class) => cls.id === id);
  
  if (index === -1) return null;
  
  classes[index] = { ...classes[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  
  // Return with artisan info
  const users = getAllUsers();
  return {
    ...classes[index],
    artisan: users.find(user => user.id === classes[index].artisanId)
  };
}

export function deleteClass(id: string): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
  const classes = data ? JSON.parse(data) : [];
  const filtered = classes.filter((cls: Class) => cls.id !== id);
  
  if (filtered.length === classes.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(filtered));
  
  // Also delete related bookings
  const bookings = getAllBookings();
  const filteredBookings = bookings.filter(b => b.classId !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filteredBookings));
  
  return true;
}

// Booking operations
export function getAllBookings(): Booking[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const bookings = data ? JSON.parse(data) : [];
  
  // Populate user and class info
  const users = getAllUsers();
  const classes = getAllClasses();
  
  return bookings.map((booking: Booking) => ({
    ...booking,
    user: users.find(user => user.id === booking.userId),
    class: classes.find(cls => cls.id === booking.classId)
  }));
}

export function getBookingsByUser(userId: string): Booking[] {
  const bookings = getAllBookings();
  return bookings.filter(booking => booking.userId === userId);
}

export function getBookingsByClass(classId: string): Booking[] {
  const bookings = getAllBookings();
  return bookings.filter(booking => booking.classId === classId);
}

export function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking | null {
  const bookings = getAllBookings();
  const cls = getClassById(bookingData.classId);
  
  if (!cls || cls.availableSeats <= 0) {
    return null;
  }
  
  const newBooking: Booking = {
    ...bookingData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Update available seats
  updateClass(bookingData.classId, {
    availableSeats: cls.availableSeats - 1
  });
  
  return newBooking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | null {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const bookings = data ? JSON.parse(data) : [];
  const index = bookings.findIndex((booking: Booking) => booking.id === id);
  
  if (index === -1) return null;
  
  bookings[index] = { ...bookings[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Return with user and class info
  const users = getAllUsers();
  const classes = getAllClasses();
  
  return {
    ...bookings[index],
    user: users.find(user => user.id === bookings[index].userId),
    class: classes.find(cls => cls.id === bookings[index].classId)
  };
}

export function deleteBooking(id: string): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const bookings = data ? JSON.parse(data) : [];
  const booking = bookings.find((b: Booking) => b.id === id);
  
  if (!booking) return false;
  
  const filtered = bookings.filter((b: Booking) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filtered));
  
  // Restore available seat
  const cls = getClassById(booking.classId);
  if (cls) {
    updateClass(booking.classId, {
      availableSeats: cls.availableSeats + 1
    });
  }
  
  return true;
}

// Discussion operations
export function getAllDiscussions(): Discussion[] {
  const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
  const discussions = data ? JSON.parse(data) : [];
  
  // Populate user info
  const users = getAllUsers();
  return discussions.map((disc: Discussion) => ({
    ...disc,
    user: users.find(user => user.id === disc.userId)
  }));
}

export function getDiscussionsByClass(classId: string): Discussion[] {
  const discussions = getAllDiscussions();
  const classDiscussions = discussions.filter(d => d.classId === classId && !d.parentId);
  
  // Attach replies to each discussion
  return classDiscussions.map(disc => ({
    ...disc,
    replies: discussions.filter(d => d.parentId === disc.id)
  }));
}

export function createDiscussion(discussionData: Omit<Discussion, 'id' | 'createdAt'>): Discussion {
  const discussions = getAllDiscussions();
  const newDiscussion: Discussion = {
    ...discussionData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  discussions.push(newDiscussion);
  localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));
  
  // Return with user info
  const users = getAllUsers();
  return {
    ...newDiscussion,
    user: users.find(user => user.id === newDiscussion.userId)
  };
}

export function deleteDiscussion(id: string): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
  const discussions = data ? JSON.parse(data) : [];
  
  // Also delete all replies
  const filtered = discussions.filter((d: Discussion) => d.id !== id && d.parentId !== id);
  
  if (filtered.length === discussions.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(filtered));
  return true;
}

// Product operations
export function getAllProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products = data ? JSON.parse(data) : [];
  
  // Populate artisan info
  const users = getAllUsers();
  return products.map((product: Product) => ({
    ...product,
    artisan: users.find(user => user.id === product.artisanId)
  }));
}

export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find(product => product.id === id) || null;
}

export function getProductsByArtisan(artisanId: string): Product[] {
  const products = getAllProducts();
  return products.filter(product => product.artisanId === artisanId);
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'artisan'>): Product {
  const products = getAllProducts();
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products = data ? JSON.parse(data) : [];
  const index = products.findIndex((product: Product) => product.id === id);
  
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  
  // Return with artisan info
  const users = getAllUsers();
  return {
    ...products[index],
    artisan: users.find(user => user.id === products[index].artisanId)
  };
}

export function deleteProduct(id: string): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products = data ? JSON.parse(data) : [];
  const filtered = products.filter((product: Product) => product.id !== id);
  
  if (filtered.length === products.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
}

// Order operations
export function getAllOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders = data ? JSON.parse(data) : [];
  
  // Populate user and product info
  const users = getAllUsers();
  const products = getAllProducts();
  
  return orders.map((order: Order) => ({
    ...order,
    user: users.find(user => user.id === order.userId),
    product: products.find(product => product.id === order.productId)
  }));
}

export function getOrdersByUser(userId: string): Order[] {
  const orders = getAllOrders();
  return orders.filter(order => order.userId === userId);
}

export function getOrdersByArtisan(artisanId: string): Order[] {
  const orders = getAllOrders();
  return orders.filter(order => order.product?.artisanId === artisanId);
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order | null {
  const orders = getAllOrders();
  const product = getProductById(orderData.productId);
  
  if (!product || product.stockQuantity < orderData.quantity) {
    return null;
  }
  
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  // Update stock quantity
  updateProduct(orderData.productId, {
    stockQuantity: product.stockQuantity - orderData.quantity
  });
  
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders = data ? JSON.parse(data) : [];
  const index = orders.findIndex((order: Order) => order.id === id);
  
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  // Return with user and product info
  const users = getAllUsers();
  const products = getAllProducts();
  
  return {
    ...orders[index],
    user: users.find(user => user.id === orders[index].userId),
    product: products.find(product => product.id === orders[index].productId)
  };
}
