import { createBrowserRouter, RouterProvider, Navigate, useRouteError } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AuthPage } from '@/pages/AuthPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function GlobalError() {
  const error = useRouteError() as any;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-destructive">Oops!</h1>
        <p className="text-lg text-muted-foreground">Sorry, an unexpected error has occurred.</p>
        <div className="p-4 bg-muted rounded-lg text-sm text-left overflow-auto border border-border">
          <p className="font-mono text-destructive font-medium break-words">
            {error?.statusText || error?.message || 'Unknown Error'}
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      // Placeholder routes for future implementation
      { path: 'orders', element: <Navigate to="/auth" replace /> },
      { path: 'account', element: <Navigate to="/auth" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
