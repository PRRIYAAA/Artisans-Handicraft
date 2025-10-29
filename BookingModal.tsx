import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calendar, Clock, MapPin, User, CreditCard, Check } from 'lucide-react';
import { Class, User as UserType } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { PaymentModal } from './PaymentModal';
import { createBooking } from '../lib/dataService';
import { toast } from 'sonner@2.0.3';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class;
  onBookingComplete: (bookingData: any) => void;
  onStartLearning?: (classId: string, bookingId: string) => void;
}

export function BookingModal({ isOpen, onClose, classData, onBookingComplete, onStartLearning }: BookingModalProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'booking' | 'payment' | 'success'>('booking');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState<string>('');

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!user) {
      toast.error('Please log in to book a class');
      return;
    }

    if (paymentMethod === 'credits' && user.credits < classData.price) {
      toast.error('Insufficient credits. Please choose another payment method.');
      return;
    }

    if (paymentMethod === 'card') {
      setShowPaymentModal(true);
    } else {
      setStep('payment');
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      const booking = createBooking({
        userId: user!.id,
        classId: classData.id,
        amountPaid: classData.price,
        status: 'confirmed',
        selectedDate: selectedDate
      });

      if (booking) {
        onBookingComplete(booking);
        setCompletedBookingId(booking.id);
        toast.success('Booking confirmed!');
        setStep('success');
      } else {
        toast.error('Class is fully booked or unavailable');
      }
    } catch (error) {
      toast.error('Failed to create booking');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    processPayment();
  };

  const resetModal = () => {
    setSelectedDate('');
    setPaymentMethod('credits');
    setStep('booking');
    onClose();
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

  return (
    <>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={classData.price}
        onPaymentSuccess={handlePaymentSuccess}
        classTitle={classData.title}
      />
      
      <Dialog open={isOpen} onOpenChange={resetModal}>
        <DialogContent className="sm:max-w-[500px]">
        {step === 'booking' && (
          <>
            <DialogHeader>
              <DialogTitle>Book Your Class</DialogTitle>
              <DialogDescription>
                Complete your booking for {classData.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Class Summary */}
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{classData.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{classData.artisan?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{classData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{classData.location} • {classData.category}</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Select a Date</Label>
                <Select onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your preferred date" />
                  </SelectTrigger>
                  <SelectContent>
                    {classData.dates.map((date) => (
                      <SelectItem key={date} value={date}>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(date)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select onValueChange={setPaymentMethod} defaultValue="credits">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credits">
                      <div className="flex items-center justify-between w-full">
                        <span>Credits</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({user?.credits || 0} available)
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
                {paymentMethod === 'credits' && user && user.credits < classData.price && (
                  <p className="text-sm text-destructive">
                    Insufficient credits. You need {classData.price - user.credits} more credits.
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Class Price</span>
                  <span className="font-semibold">${classData.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>$0</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${classData.price}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleBooking} className="flex-1">
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Confirm your payment details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-secondary p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-semibold">Payment Summary</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span>{classData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${classData.price}</span>
                  </div>
                </div>
              </div>

              {/* Mock Payment Form */}
              {paymentMethod !== 'credits' && (
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    🔒 This is a demo. In production, this would integrate with:
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stripe, PayPal, or other payment gateways
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep('booking')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={processPayment} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Processing...' : `Pay $${classData.price}`}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">You're all set!</h3>
                <p className="text-muted-foreground">
                  Your booking for <strong>{classData.title}</strong> on{' '}
                  <strong>{formatDate(selectedDate)}</strong> has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email with class details and location information.
                </p>
              </div>

              <div className="space-y-2">
                {onStartLearning && (
                  <Button 
                    onClick={() => {
                      resetModal();
                      onStartLearning(classData.id, completedBookingId);
                    }} 
                    className="w-full"
                  >
                    Start Learning Now
                  </Button>
                )}
                <Button 
                  onClick={resetModal} 
                  variant="outline"
                  className="w-full"
                >
                  {onStartLearning ? 'View Later' : 'Done'}
                </Button>
              </div>
            </div>
          </>
        )}
        </DialogContent>
      </Dialog>
    </>
  );
}