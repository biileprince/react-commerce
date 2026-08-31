import { Link } from 'react-router-dom';
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartIsOpen,
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/store/slices/cart/cartSlice';
import { CURRENCY_SYMBOL, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

export function CartSheet() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const isOpen = useAppSelector(selectCartIsOpen);

  const shippingFee = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const orderTotal = total + shippingFee;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - total;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-5 w-5" />
              Cart
              {count > 0 && (
                <Badge variant="secondary" className="text-xs">{count}</Badge>
              )}
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearCart())}
                className="text-xs text-muted-foreground hover:text-destructive h-7"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Start shopping and add items to your cart.
              </p>
            </div>
            <SheetClose render={
              <Button asChild className="mt-2">
                <Link to="/products">Browse Products</Link>
              </Button>
            } />
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {amountToFreeShipping > 0 && (
              <div className="px-6 py-3 bg-primary/5 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  Add{' '}
                  <span className="font-semibold text-foreground">
                    {CURRENCY_SYMBOL}{amountToFreeShipping.toLocaleString()}
                  </span>{' '}
                  more for free shipping
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {shippingFee === 0 && (
              <div className="px-6 py-2 bg-green-500/10 border-b border-border">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  You qualify for free shipping!
                </p>
              </div>
            )}

            {/* Cart items */}
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    {/* Product image */}
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={() => dispatch(closeCart())}
                      className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-muted border border-border"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        onClick={() => dispatch(closeCart())}
                        className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.product.categoryName}</p>
                      <p className="text-sm font-semibold mt-1">
                        {CURRENCY_SYMBOL}{(item.product.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border border-border rounded-md">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.product.id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="h-7 w-7 flex items-center justify-center hover:bg-accent rounded-l-md transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.product.id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            disabled={item.quantity >= item.product.stockQuantity}
                            className="h-7 w-7 flex items-center justify-center hover:bg-accent rounded-r-md transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="flex-col px-6 py-4 border-t border-border gap-3">
              {/* Totals */}
              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{CURRENCY_SYMBOL}{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                    {shippingFee === 0 ? 'Free' : `${CURRENCY_SYMBOL}${shippingFee}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{CURRENCY_SYMBOL}{orderTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2 w-full">
                <SheetClose render={
                  <Button asChild size="lg" className="w-full gap-2">
                    <Link to="/checkout">
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                } />
                <SheetClose render={
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/cart">View Full Cart</Link>
                  </Button>
                } />
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
