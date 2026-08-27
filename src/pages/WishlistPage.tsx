import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { useAppSelector } from '@/app/hooks';
import { selectWishlistItems } from '@/features/wishlist/wishlistSlice';
import { PRODUCTS } from '@/data/products';
import { SITE_NAME } from '@/lib/constants';

export function WishlistPage() {
  const wishlistIds = useAppSelector(selectWishlistItems);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      <title>Wishlist — {SITE_NAME}</title>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          My Wishlist
          {wishlistProducts.length > 0 && (
            <span className="text-muted-foreground text-lg font-normal">({wishlistProducts.length})</span>
          )}
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Button asChild size="lg">
            <Link to="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
