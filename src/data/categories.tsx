import type { Category } from '@/types';
import { FiSmartphone, FiShoppingBag, FiHome, FiHeart, FiActivity, FiSmile } from 'react-icons/fi';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, TVs, and electronic accessories',
    icon: <FiSmartphone className="text-xl" />,
    productCount: 8,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, bags, and fashion accessories',
    icon: <FiShoppingBag className="text-xl" />,
    productCount: 5,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'Home & Living',
    slug: 'home',
    description: 'Furniture, home decor, kitchen, and appliances',
    icon: <FiHome className="text-xl" />,
    productCount: 4,
    isActive: true,
  },
  {
    id: 'cat-4',
    name: 'Beauty & Health',
    slug: 'beauty',
    description: 'Skincare, makeup, fragrances, and health products',
    icon: <FiHeart className="text-xl" />,
    productCount: 4,
    isActive: true,
  },
  {
    id: 'cat-5',
    name: 'Sports & Outdoors',
    slug: 'sports',
    description: 'Sporting equipment, fitness gear, and outdoor activities',
    icon: <FiActivity className="text-xl" />,
    productCount: 3,
    isActive: true,
  },
  {
    id: 'cat-6',
    name: 'Toys & Games',
    slug: 'toys',
    description: 'Toys, games, and entertainment for kids',
    icon: <FiSmile className="text-xl" />,
    productCount: 2,
    isActive: true,
  },
];
