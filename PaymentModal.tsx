import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
  classTitle: string;
}

export function PaymentModal({ isOpen, onClose, amount, onPaymentSuccess, classTitle }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success('Payment successful!');
      onPaymentSuccess();
      setLoading(false);
      onClose();
      
      // Reset form
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Secure payment for: {classTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">${amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name *</Label>
              <Input
                id="cardName"
                value={paymentData.cardName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                placeholder="JOHN DOE"
                required
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    cardNumber: formatCardNumber(e.target.value) 
                  }))}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                For testing, use: 4242 4242 4242 4242
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    expiryDate: formatExpiryDate(e.target.value) 
                  }))}
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    cvv: e.target.value.replace(/\D/g, '').substring(0, 4) 
                  }))}
                  placeholder="123"
                  required
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-md">
            <Lock className="h-4 w-4" />
            <span>
              Your payment information is secure. This is a demo - no real charges will be made.
            </span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p><strong>Integration Notes:</strong></p>
          <p>• Replace with Stripe, PayPal, or your preferred payment gateway</p>
          <p>• Add proper API keys and webhook handlers for production</p>
          <p>• Implement PCI-compliant payment processing</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
