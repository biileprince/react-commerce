import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, selectIsInCart } from '@/store/slices/cart/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@/store/slices/wishlist/wishlistSlice';
import type { Product } from '@/types';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector(selectIsInCart(product.id));
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product }));
    toast.success(`${product.name} added to cart!`, {
      action: { label: 'View Cart', onClick: () => {} },
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'
    );
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden',
        'hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20',
        'transition-all duration-300 hover:-translate-y-0.5',
        className
      )}
    >
      {/* Image container */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden aspect-square bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && !isOutOfStock && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center',
            'border border-border bg-background/90 backdrop-blur-sm',
            'opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110',
            isWishlisted && 'opacity-100'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            )}
          />
        </button>

        {/* Quick add — appears on hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={handleAddToCart}
              variant={isInCart ? 'secondary' : 'default'}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart ? 'In Cart' : 'Quick Add'}
            </Button>
          </div>
        )}
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link to={`/products/${product.slug}`} className="group/link">
          <p className="text-xs text-muted-foreground mb-0.5">{product.categoryName}</p>
          <h3 className="text-sm font-semibold line-clamp-2 group-hover/link:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-3 w-3',
                  star <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted-foreground'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price & cart */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-base font-bold text-foreground">
            {CURRENCY_SYMBOL}{product.price.toLocaleString()}
          </span>
          {!isOutOfStock && (
            <Button
              size="sm"
              variant={isInCart ? 'secondary' : 'default'}
              onClick={handleAddToCart}
              className="h-8 px-3 text-xs gap-1.5 sm:hidden"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {isInCart ? '✓' : 'Add'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
