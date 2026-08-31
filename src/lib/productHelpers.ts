import type { Product } from '@/types';
import productsData from '@/data/products.json';

export const PRODUCTS: Product[] = productsData as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4
): Product[] {
  return PRODUCTS.filter(
    (p) => p.categorySlug === categorySlug && p.id !== productId
  ).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.categoryName.toLowerCase().includes(q)
  );
}
