import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Sun, Moon, Monitor, Menu, Search, Heart, LogOut, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCartCount, toggleCart } from '@/features/cart/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '@/features/auth/authSlice';
import { selectTheme, setTheme, toggleMobileMenu } from '@/features/ui/uiSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';
import { MENU_ITEMS, SITE_NAME } from '@/lib/constants';
import { MobileMenu } from './MobileMenu';
import { toast } from 'sonner';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const theme = useAppSelector(selectTheme);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
    navigate('/');
  };

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    dispatch(setTheme(next));
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left — Mobile menu + Logo + Desktop nav */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Mobile hamburger */}
            <div className="block lg:hidden">
              <MobileMenu />
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors"
            >
              <img src="/logo.png" alt="React Commerce" className="h-10 w-10 rounded-full object-cover" />
              <span className="hidden sm:block">{SITE_NAME}</span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center — Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-md lg:flex items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-4 bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all"
              />
            </div>
          </form>

          {/* Right — actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="hidden sm:flex"
            >
              <ThemeIcon className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative hidden sm:flex"
            >
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleCart())}
              className="relative"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
            </Button>

            {/* User menu or Sign In */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  } />
                  <DropdownMenuItem render={
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  } />
                  <DropdownMenuItem render={
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  } />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden sm:flex">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search bar — slides in */}
        {searchOpen && (
          <div className="pb-3 lg:hidden animate-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>
              <Button type="submit" size="sm">Search</Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
