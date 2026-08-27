import { ThreeItemHero } from '@/components/product/ThreeItemHero';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { CategoriesSection } from '@/components/product/CategoriesSection';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export function HomePage() {
  return (
    <>
      <title>{SITE_NAME} — {SITE_DESCRIPTION}</title>
      <ThreeItemHero />
      <ProductCarousel />
      <CategoriesSection />
    </>
  );
}
