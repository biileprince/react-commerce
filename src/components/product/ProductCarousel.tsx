import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/lib/productHelpers';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ProductCarousel — Infinite horizontal scroll strip
 * Duplicates products for seamless loop animation
 */
export function ProductCarousel() {
  // Use all products, duplicate for seamless loop
  const products = [...PRODUCTS, ...PRODUCTS];

  return (
    <section className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
        <Link
          to="/products"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Carousel wrapper with overflow hidden */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-carousel gap-4">
          {products.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              to={`/products/${product.slug}`}
              className={cn(
                'flex-none w-[200px] sm:w-[240px] group',
                'rounded-xl overflow-hidden border border-border bg-card',
                'hover:shadow-md hover:shadow-black/5 transition-all duration-300 hover:-translate-y-0.5'
              )}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                  {product.categoryName}
                </p>
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">
                    {CURRENCY_SYMBOL}{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
