import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        <Link
          to="/products"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          All Categories →
        </Link>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {CATEGORIES.filter((c) => c.isActive).map((category) => {
          const products = getProductsByCategory(category.slug);
          const previewImages = products.slice(0, 1).map((p) => p.images[0]);

          return (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-border bg-card p-4 text-center hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Category image or emoji background */}
              {previewImages[0] ? (
                <div className="relative mb-3 h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={previewImages[0]}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-3 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">{category.icon}</span>
                </div>
              )}

              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
