import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartSheet } from '@/components/cart/CartSheet';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Cart drawer — rendered at root level so it's always available */}
      <CartSheet />
    </div>
  );
}
