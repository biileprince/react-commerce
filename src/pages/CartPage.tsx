import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/store/slices/cart/cartSlice';
import { CURRENCY_SYMBOL, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, SITE_NAME } from '@/lib/constants';

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-12 text-center">
        <title>Cart — {SITE_NAME}</title>
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      <title>Cart ({items.length}) — {SITE_NAME}</title>

      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Clear cart */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearCart())} className="text-destructive hover:text-destructive text-xs">
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear Cart
            </Button>
          </div>

          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
              {/* Image */}
              <Link to={`/products/${item.product.slug}`} className="flex-shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden bg-muted">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.product.categoryName}</p>
                    <Link to={`/products/${item.product.slug}`} className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                      disabled={item.quantity >= item.product.stockQuantity}
                      className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-base font-bold">
                    {CURRENCY_SYMBOL}{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {CURRENCY_SYMBOL}{item.product.price.toLocaleString()} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shippingFee === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                  {shippingFee === 0 ? 'Free' : `${CURRENCY_SYMBOL}${shippingFee}`}
                </span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                  Add {CURRENCY_SYMBOL}{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{CURRENCY_SYMBOL}{total.toLocaleString()}</span>
            </div>

            <Button size="lg" className="w-full gap-2" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
