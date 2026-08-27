import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

function ProductSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false, className }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
