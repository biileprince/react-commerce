// App constants — easy to swap for environment variables when integrating backend
export const SITE_NAME = 'ReactCommerce';
export const SITE_DESCRIPTION =
  'Premium African e-commerce store — Electronics, Fashion, Home & Living and more.';

export const CURRENCY = 'GHS';
export const CURRENCY_SYMBOL = '₵';

export const SHIPPING_FEE = 20; // GHS
export const FREE_SHIPPING_THRESHOLD = 500; // GHS — orders above this get free shipping

export const MENU_ITEMS = [
  { title: 'Products', path: '/products' },
  { title: 'Electronics', path: '/products?category=electronics' },
  { title: 'Fashion', path: '/products?category=fashion' },
  { title: 'Home & Living', path: '/products?category=home' },
];

export const ITEMS_PER_PAGE = 12;
