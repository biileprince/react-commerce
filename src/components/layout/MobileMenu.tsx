import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, ShoppingBag, Heart, User, LogIn, Monitor, Moon, Sun } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectUser, logout } from '@/features/auth/authSlice';
import { selectTheme, setTheme, selectMobileMenuOpen, closeMobileMenu, toggleMobileMenu } from '@/features/ui/uiSlice';
import { CATEGORIES } from '@/data/categories';
import { MENU_ITEMS } from '@/lib/constants';
import { toast } from 'sonner';

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const theme = useAppSelector(selectTheme);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeMobileMenu());
    toast.success('Signed out successfully');
    navigate('/');
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    dispatch(setTheme(next));
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={(open) => open ? dispatch(toggleMobileMenu()) : dispatch(closeMobileMenu())}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      } />
      <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left">
              <Link
                to="/"
                className="flex items-center gap-2 font-bold text-lg"
                onClick={() => dispatch(closeMobileMenu())}
              >
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-black">RC</span>
                </div>
                ReactCommerce
              </Link>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Main nav */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Menu</p>
            <nav className="space-y-1">
              <SheetClose render={
                <Link
                  to="/"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Home
                </Link>
              } />
              {MENU_ITEMS.map((item) => (
                <SheetClose key={item.title} render={
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    {item.title}
                  </Link>
                } />
              ))}
            </nav>
          </div>

          <Separator />

          {/* Categories */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Categories</p>
            <div className="space-y-1">
              {CATEGORIES.filter((c) => c.isActive).map((cat) => (
                <SheetClose key={cat.id} render={
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="ml-auto text-xs text-muted-foreground">{cat.productCount}</span>
                    )}
                  </Link>
                } />
              ))}
            </div>
          </div>

          <Separator />

          {/* Account */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Account</p>
            <div className="space-y-1">
              {isAuthenticated && user ? (
                <>
                  <div className="px-2 py-2 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <SheetClose render={
                    <Link
                      to="/account"
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My Account
                    </Link>
                  } />
                  <SheetClose render={
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      Wishlist
                    </Link>
                  } />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <SheetClose render={
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    Sign In / Sign Up
                  </Link>
                } />
              )}
            </div>
          </div>
        </div>

        {/* Theme toggle at bottom */}
        <div className="border-t border-border px-6 py-4">
          <Button variant="ghost" size="sm" onClick={cycleTheme} className="w-full justify-start gap-2">
            <ThemeIcon className="h-4 w-4" />
            {theme === 'dark' ? 'Dark Mode' : theme === 'light' ? 'Light Mode' : 'System Theme'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
