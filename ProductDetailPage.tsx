import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star,
  Package,
  Truck,
  Shield,
  Plus,
  Minus,
  Heart
} from 'lucide-react';
import { getProductById, createOrder } from '../lib/dataService';
import { Product } from '../lib/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onArtisanClick: (artisanId: string) => void;
}

export function ProductDetailPage({ productId, onBack, onArtisanClick }: ProductDetailPageProps) {
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [customizationNote, setCustomizationNote] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    const productData = getProductById(productId);
    setProduct(productData);
  }, [productId]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && product && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast.error('Please sign in to make a purchase');
      return;
    }

    if (!product) return;

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    const order = createOrder({
      userId: user.id,
      productId: product.id,
      quantity,
      totalAmount: product.price * quantity,
      status: 'pending',
      shippingAddress
    });

    if (order) {
      toast.success('Order placed successfully!');
      setQuantity(1);
      setShippingAddress('');
    } else {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Product not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-artisan-neutral">
      <div className="artisan-content-overlay">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-4">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl">{product.title}</h1>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    {product.reviews && (
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-3xl mb-4">${product.price}</div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="text-sm">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.materials && (
                  <div>
                    <div className="text-muted-foreground mb-1">Materials</div>
                    <div>{product.materials.join(', ')}</div>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <div className="text-muted-foreground mb-1">Dimensions</div>
                    <div>{product.dimensions}</div>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <div className="text-muted-foreground mb-1">Weight</div>
                    <div>{product.weight}</div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground mb-1">Stock</div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {product.stockQuantity} available
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div>
              <Label className="mb-2 block">Quantity</Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= product.stockQuantity) {
                      setQuantity(val);
                    }
                  }}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="text-xl">
                  Total: ${totalPrice}
                </div>
              </div>
            </div>

            {/* Customization */}
            {product.customizable && (
              <div>
                <Label htmlFor="customization" className="mb-2 block">
                  Customization Request (Optional)
                </Label>
                <Textarea
                  id="customization"
                  placeholder="Tell the artisan about any customizations you'd like..."
                  value={customizationNote}
                  onChange={(e) => setCustomizationNote(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Shipping Address */}
            <div>
              <Label htmlFor="address" className="mb-2 block">
                Shipping Address *
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your complete shipping address..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
              />
            </div>

            {/* Purchase Button */}
            <Button 
              size="lg" 
              className="w-full"
              onClick={handlePurchase}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stockQuantity > 0 ? 'Place Order' : 'Out of Stock'}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">Free Shipping</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">Secure Payment</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">Handcrafted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-4">About the Artisan</h3>
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product.artisan?.avatarUrl} alt={product.artisan?.name} />
                <AvatarFallback>
                  {product.artisan?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="mb-1">{product.artisan?.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{product.artisan?.bio}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => product.artisan && onArtisanClick(product.artisan.id)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}