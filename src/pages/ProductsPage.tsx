import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PRODUCTS, searchProducts, getProductsByCategory } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { useDebounce } from '@/hooks/useDebounce';
import { SITE_NAME, ITEMS_PER_PAGE } from '@/lib/constants';
import type { Product } from '@/types';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]['value'];

function sortProducts(products: Product[], sort: SortOption): Product[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync search input with URL param
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryParam, minPrice, maxPrice, sort]);

  const filteredProducts = useMemo(() => {
    let products = debouncedSearch
      ? searchProducts(debouncedSearch)
      : categoryParam
      ? getProductsByCategory(categoryParam)
      : PRODUCTS;

    // Apply price filter
    if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

    return sortProducts(products, sort);
  }, [debouncedSearch, categoryParam, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const selectedCategory = CATEGORIES.find((c) => c.slug === categoryParam);
  const activeFiltersCount = [categoryParam, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    setSearchInput('');
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort';

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSearchParams({})}
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
              !categoryParam ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.filter((c) => c.isActive).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.slug })}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                categoryParam === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">{cat.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range (GHS)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8 text-sm"
            min={0}
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 text-sm"
            min={0}
          />
        </div>
      </div>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-6">
      <title>{selectedCategory ? `${selectedCategory.name} — ` : ''}Products — {SITE_NAME}</title>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Products</span>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-foreground">{selectedCategory.name}</span>
            </>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              {selectedCategory ? selectedCategory.name : debouncedSearch ? `Search: "${debouncedSearch}"` : 'All Products'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Active category badge */}
          {selectedCategory && (
            <Badge variant="secondary" className="flex-shrink-0 gap-1">
              {selectedCategory.icon} {selectedCategory.name}
              <button onClick={() => setSearchParams({})} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        {/* Mobile filter button */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger render={
            <Button variant="outline" size="sm" className="lg:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          } />
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="h-9"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="sm" className="gap-2 ml-auto flex-shrink-0">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSort(option.value)}
                className={sort === option.value ? 'text-primary font-medium' : ''}
              >
                {option.label}
                {sort === option.value && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">Filters</h2>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
                  Clear all
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ProductGrid products={paginatedProducts} />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 mb-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
