import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AddressForm } from '@/components/checkout/AddressForm';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCartItems, selectCartTotal, clearCart } from '@/features/cart/cartSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { CURRENCY_SYMBOL, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, SITE_NAME } from '@/lib/constants';
import type { AddressFormValues } from '@/lib/validations';
import { toast } from 'sonner';

type Step = 'address' | 'review' | 'success';

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [step, setStep] = useState<Step>('address');
  const [savedAddress, setSavedAddress] = useState<AddressFormValues | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-12 text-center">
        <title>Checkout — {SITE_NAME}</title>
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddressSubmit = (data: AddressFormValues) => {
    setSavedAddress(data);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    dispatch(clearCart());
    setStep('success');
    setIsPlacingOrder(false);
    toast.success('Order placed successfully!');
  };

  // Step indicator
  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Delivery' },
    { key: 'review', label: 'Review' },
    { key: 'success', label: 'Confirmed' },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <title>Order Confirmed — {SITE_NAME}</title>
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You will receive a confirmation message shortly.
        </p>

        {savedAddress && (
          <div className="text-left bg-card border border-border rounded-xl p-4 mb-8 text-sm">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </p>
            <p>{savedAddress.fullName}</p>
            <p className="text-muted-foreground">{savedAddress.addressLine1}</p>
            {savedAddress.addressLine2 && <p className="text-muted-foreground">{savedAddress.addressLine2}</p>}
            <p className="text-muted-foreground">{savedAddress.city}, {savedAddress.region}</p>
            <p className="text-muted-foreground">{savedAddress.phoneNumber}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button asChild size="lg">
            <Link to="/products">Continue Shopping</Link>
          </Button>
          {isAuthenticated && (
            <Button asChild variant="outline">
              <Link to="/orders">View My Orders</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 lg:px-6 py-6">
      <title>Checkout — {SITE_NAME}</title>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.slice(0, -1).map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold border-2 transition-colors ${
                i <= stepIndex
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground'
              }`}
            >
              {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium hidden sm:block ${
                i === stepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 2 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 ${i < stepIndex ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Main content */}
        <div className="lg:col-span-3">
          {step === 'address' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </h2>
              {!isAuthenticated && (
                <div className="mb-4 rounded-lg bg-muted/50 border border-border p-3 text-sm">
                  <span className="text-muted-foreground">Have an account? </span>
                  <Link to="/auth" className="text-primary hover:underline font-medium">Sign in</Link>
                  <span className="text-muted-foreground"> to use saved addresses.</span>
                </div>
              )}
              <AddressForm
                onSubmit={handleAddressSubmit}
                submitLabel="Continue to Review"
              />
            </div>
          )}

          {step === 'review' && savedAddress && (
            <div className="space-y-4">
              {/* Address summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Delivery Address
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep('address')} className="text-xs h-7">
                    Edit
                  </Button>
                </div>
                <div className="text-sm space-y-0.5 text-muted-foreground">
                  <p className="text-foreground font-medium">{savedAddress.fullName}</p>
                  <p>{savedAddress.addressLine1}</p>
                  {savedAddress.addressLine2 && <p>{savedAddress.addressLine2}</p>}
                  <p>{savedAddress.city}, {savedAddress.region}</p>
                  {savedAddress.landmark && <p>Landmark: {savedAddress.landmark}</p>}
                  <p className="text-foreground">{savedAddress.phoneNumber}</p>
                </div>
              </div>

              {/* Items review */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Order Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold flex-shrink-0">
                        {CURRENCY_SYMBOL}{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <><span className="animate-spin">⏳</span> Placing Order...</>
                ) : (
                  <>Place Order — {CURRENCY_SYMBOL}{total.toLocaleString()} <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground line-clamp-1 flex-1">{item.product.name} ×{item.quantity}</span>
                  <span className="flex-shrink-0">{CURRENCY_SYMBOL}{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shippingFee === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                  {shippingFee === 0 ? 'Free' : `${CURRENCY_SYMBOL}${shippingFee}`}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{CURRENCY_SYMBOL}{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
