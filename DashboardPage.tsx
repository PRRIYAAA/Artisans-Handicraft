import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  BookOpen, 
  TrendingUp, 
  Star,
  Edit,
  Trash2,
  Eye,
  Video,
  PlayCircle,
  ShoppingBag,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllClasses, getBookingsByUser, deleteClass, getClassesByArtisan, getProductsByArtisan, deleteProduct, getOrdersByArtisan } from '../lib/dataService';
import { Class, Booking, Product, Order } from '../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface DashboardPageProps {
  onPageChange: (page: string) => void;
  onClassSelect: (classId: string) => void;
  onEditClass?: (classId: string) => void;
  onStartLearning?: (classId: string, bookingId: string) => void;
  onProductSelect?: (productId: string) => void;
}

export function DashboardPage({ onPageChange, onClassSelect, onEditClass, onStartLearning, onProductSelect }: DashboardPageProps) {
  const { user } = useAuth();
  const [userClasses, setUserClasses] = useState<Class[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [productDeleteDialogOpen, setProductDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    if (user.role === 'artisan') {
      const classes = getClassesByArtisan(user.id);
      setUserClasses(classes);
      const products = getProductsByArtisan(user.id);
      setUserProducts(products);
      const orders = getOrdersByArtisan(user.id);
      setUserOrders(orders);
    } else {
      const bookings = getBookingsByUser(user.id);
      setUserBookings(bookings);
    }
    
    const classes = getAllClasses();
    setAllClasses(classes);
  };

  const handleDeleteClass = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      const success = deleteClass(classToDelete);
      if (success) {
        toast.success('Class deleted successfully');
        loadData();
      } else {
        toast.error('Failed to delete class');
      }
    }
    setDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setProductDeleteDialogOpen(true);
  };

  const confirmProductDelete = () => {
    if (productToDelete) {
      const success = deleteProduct(productToDelete);
      if (success) {
        toast.success('Product deleted successfully');
        loadData();
      } else {
        toast.error('Failed to delete product');
      }
    }
    setProductDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2>Please sign in to view your dashboard</h2>
          <Button onClick={() => onPageChange('login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  const isArtisan = user.role === 'artisan';

  // Calculate stats
  const stats = isArtisan ? {
    totalClasses: userClasses.length,
    totalStudents: userClasses.reduce((sum, cls) => sum + (cls.seats - cls.availableSeats), 0),
    totalEarnings: userClasses.reduce((sum, cls) => sum + (cls.price * (cls.seats - cls.availableSeats)), 0) + userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    avgRating: 4.8,
    totalProducts: userProducts.length,
    totalSales: userOrders.length
  } : {
    totalBookings: userBookings.length,
    totalSpent: userBookings.reduce((sum, booking) => sum + booking.amountPaid, 0),
    completedClasses: userBookings.filter(b => b.status === 'confirmed').length,
    availableCredits: user.credits
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Find classes with videos for learners
  const classesWithVideos = allClasses.filter(cls => cls.videoUrl);

  return (
    <div className="min-h-screen bg-artisan-neutral">
      <div className="artisan-content-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1>
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground">
                {isArtisan ? 'Manage your classes and students' : 'Track your learning journey'}
              </p>
            </div>
            <div className="flex gap-2">
              {isArtisan && (
                <Button onClick={() => onPageChange('create-class')}>
                  Create New Class
                </Button>
              )}
              <Button variant="outline" onClick={() => onPageChange('profile')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isArtisan ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Classes</p>
                      <p className="text-2xl">{stats.totalClasses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl">{stats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl">${stats.totalEarnings}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <p className="text-2xl">{stats.avgRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Classes</p>
                      <p className="text-2xl">{stats.completedClasses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl">${stats.totalSpent}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Credits</p>
                      <p className="text-2xl">{stats.availableCredits}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue={isArtisan ? "classes" : "bookings"} className="space-y-6">
          <TabsList className={`grid w-full ${isArtisan ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value={isArtisan ? "classes" : "bookings"}>
              {isArtisan ? "My Classes" : "My Bookings"}
            </TabsTrigger>
            {isArtisan && (
              <TabsTrigger value="products">
                My Products
              </TabsTrigger>
            )}
            <TabsTrigger value={isArtisan ? "students" : "videos"}>
              {isArtisan ? "Orders" : "Video Library"}
            </TabsTrigger>
          </TabsList>

          {isArtisan ? (
            <>
              <TabsContent value="classes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                    <CardDescription>
                      Manage your classes and track their performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userClasses.length > 0 ? (
                      <div className="space-y-4">
                        {userClasses.map((classData) => (
                          <div key={classData.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                            <ImageWithFallback 
                              src={classData.images[0]}
                              alt={classData.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4>{classData.title}</h4>
                                {classData.videoUrl && (
                                  <Video className="h-4 w-4 text-primary" title="Has video" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ${classData.price} • {classData.duration} • {classData.seats - classData.availableSeats}/{classData.seats} students
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">{classData.level}</Badge>
                                <Badge variant="secondary" className="capitalize">{classData.category}</Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onClassSelect(classData.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onEditClass ? onEditClass(classData.id) : null}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteClass(classData.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">You haven't created any classes yet</p>
                        <Button onClick={() => onPageChange('create-class')}>
                          Create Your First Class
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>
                      Manage your products for sale in the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userProducts.length > 0 ? (
                      <div className="space-y-4">
                        {userProducts.map((product) => (
                          <div key={product.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                            <ImageWithFallback 
                              src={product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4>{product.title}</h4>
                                {product.customizable && (
                                  <Badge variant="secondary">Customizable</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ${product.price} • {product.stockQuantity} in stock
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">{product.category}</Badge>
                                {product.rating && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {product.rating}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onProductSelect && onProductSelect(product.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">You haven't listed any products yet</p>
                        <Button onClick={() => onPageChange('marketplace')}>
                          Browse Marketplace for Ideas
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales & Orders</CardTitle>
                    <CardDescription>
                      Track orders for your products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userOrders.length > 0 ? (
                      <div className="space-y-4">
                        {userOrders.map((order) => (
                          <div key={order.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                            <ImageWithFallback 
                              src={order.product?.images[0] || ''}
                              alt={order.product?.title || 'Product'}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4>{order.product?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Qty: {order.quantity} • ${order.totalAmount}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Customer</p>
                              <p className="text-sm">{order.user?.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p>No orders yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>
                      View and manage your class bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userBookings.length > 0 ? (
                      <div className="space-y-4">
                        {userBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                            <ImageWithFallback 
                              src={booking.class?.images[0] || ''}
                              alt={booking.class?.title || 'Class'}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4>{booking.class?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {booking.selectedDate && formatDate(booking.selectedDate)} • ${booking.amountPaid}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {booking.status === 'confirmed' && onStartLearning && (
                                <Button
                                  size="sm"
                                  onClick={() => booking.classId && onStartLearning(booking.classId, booking.id)}
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Start Learning
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => booking.classId && onClassSelect(booking.classId)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No bookings yet</p>
                        <Button onClick={() => onPageChange('classes')}>
                          Browse Classes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Library</CardTitle>
                    <CardDescription>
                      Watch promotional videos and previews from artisans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {classesWithVideos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {classesWithVideos.map((classData) => (
                          <div key={classData.id} className="border border-border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-secondary relative">
                              {classData.videoUrl && (
                                <iframe
                                  src={classData.videoUrl.replace('watch?v=', 'embed/')}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="line-clamp-1">{classData.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    by {classData.artisan?.name}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => onClassSelect(classData.id)}
                                >
                                  View Class
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No videos available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class and all associated bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Delete Confirmation Dialog */}
      <AlertDialog open={productDeleteDialogOpen} onOpenChange={setProductDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmProductDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
