import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <title>404 Not Found — {SITE_NAME}</title>
      <div className="text-8xl mb-6 select-none">🛍️</div>
      <h1 className="text-4xl font-black mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        Oops! The page you're looking for has been moved or doesn't exist.
      </p>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link to="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
