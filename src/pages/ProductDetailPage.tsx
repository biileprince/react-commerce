import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, Share2, Package, Shield, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart, selectIsInCart } from '@/features/cart/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@/features/wishlist/wishlistSlice';
import { CURRENCY_SYMBOL, SITE_NAME } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = slug ? getProductBySlug(slug) : null;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isInCart = useAppSelector(selectIsInCart(product?.id ?? ''));
  const isWishlisted = useAppSelector(selectIsWishlisted(product?.id ?? ''));

  if (!product) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.categorySlug, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const prevImage = () => setSelectedImageIndex((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () => setSelectedImageIndex((i) => (i + 1) % product.images.length);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      <title>{product.name} — {SITE_NAME}</title>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.categorySlug}`} className="hover:text-foreground transition-colors">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-12">
        {/* Image gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
            <img
              src={product.images[selectedImageIndex]}
              alt={`${product.name} — image ${selectedImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation arrows (only if multiple images) */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === selectedImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                      )}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    'relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                    i === selectedImageIndex
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground'
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.categoryName}</Badge>
              {product.isFeatured && <Badge>Featured</Badge>}
              {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                <Badge variant="destructive">Only {product.stockQuantity} left!</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {CURRENCY_SYMBOL}{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{product.currency}</span>
          </div>

          <Separator />

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Quantity selector */}
          {product.stockQuantity > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label="Increase quantity"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.stockQuantity} in stock
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  variant={isInCart ? 'secondary' : 'default'}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlist}
                  className="w-12 flex-shrink-0"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
                    )}
                  />
                </Button>
              </div>

              <Button size="lg" variant="outline" onClick={handleBuyNow} className="w-full">
                Buy Now — {CURRENCY_SYMBOL}{(product.price * quantity).toLocaleString()}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive font-medium">Out of Stock</p>
                <p className="text-xs text-muted-foreground mt-0.5">This item is currently unavailable.</p>
              </div>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className="w-full gap-2"
              >
                <Heart className={cn('h-4 w-4', isWishlisted && 'fill-red-500 text-red-500')} />
                {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </Button>
            </div>
          )}

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: Package, label: 'Fast Delivery', sub: '2–5 days' },
              { icon: Shield, label: 'Secure Payment', sub: '100% safe' },
              { icon: RefreshCw, label: 'Easy Returns', sub: '30-day policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg border border-border">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">{label}</span>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold">Related Products</h2>
            <Link
              to={`/products?category=${product.categorySlug}`}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all in {product.categoryName} →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
