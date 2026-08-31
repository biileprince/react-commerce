import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/lib/productHelpers';
import { CURRENCY_SYMBOL } from '@/lib/constants';

/**
 * ThreeItemHero — Featured hero grid layout
 * Large product on left, two stacked products on right
 * Inspired by the reference Next.js project's ThreeItemGrid
 */
export function ThreeItemHero() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 3);

  // Fallback to first 3 if not enough featured
  const [first, second, third] = featured.length >= 3
    ? featured
    : PRODUCTS.slice(0, 3);

  if (!first || !second || !third) return null;

  return (
    <section
      aria-label="Featured products"
      className="mx-auto max-w-screen-2xl px-4 lg:px-6 pt-6 pb-4"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-2 md:min-h-[520px] lg:min-h-[600px]">
        {/* Large item — left, takes full height */}
        <HeroItem product={first} size="full" priority />

        {/* Two smaller items — right column, each half height */}
        <HeroItem product={second} size="half" priority />
        <HeroItem product={third} size="half" />
      </div>
    </section>
  );
}

interface HeroItemProps {
  product: (typeof PRODUCTS)[number];
  size: 'full' | 'half';
  priority?: boolean;
}

function HeroItem({ product, size, priority }: HeroItemProps) {
  return (
    <div
      className={
        size === 'full'
          ? 'md:col-span-4 md:row-span-2'
          : 'md:col-span-2 md:row-span-1'
      }
    >
      <Link
        to={`/products/${product.slug}`}
        className="group relative block h-full min-h-[260px] overflow-hidden rounded-xl bg-muted"
      >
        {/* Product image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent ${
            size === 'full' ? 'from-black/60' : 'from-black/70'
          }`}
        />

        {/* Label */}
        <div
          className={`absolute left-0 right-0 p-4 text-white ${
            size === 'full' ? 'bottom-0 sm:p-6' : 'bottom-0 sm:p-4'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">
            {product.categoryName}
          </p>
          <h2
            className={`font-bold line-clamp-2 leading-tight transition-colors group-hover:text-white/90 ${
              size === 'full' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'
            }`}
          >
            {product.name}
          </h2>
          <p
            className={`mt-1 font-semibold text-white/90 ${
              size === 'full' ? 'text-lg sm:text-xl' : 'text-base'
            }`}
          >
            {CURRENCY_SYMBOL}{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
