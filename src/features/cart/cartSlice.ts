import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState, Product } from '@/types';
import type { RootState } from '@/app/store';

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stockQuantity);
      } else {
        state.items.push({ product, quantity });
      }
      state.isOpen = true; // auto-open cart
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },

    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product.id !== productId);
        } else {
          item.quantity = Math.min(quantity, item.product.stockQuantity);
        }
      }
    },

    clearCart(state) {
      state.items = [];
    },

    openCart(state) {
      state.isOpen = true;
    },

    closeCart(state) {
      state.isOpen = false;
    },

    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;
export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export const selectCartIsOpen = (state: RootState): boolean => state.cart.isOpen;
export const selectIsInCart = (productId: string) => (state: RootState): boolean =>
  state.cart.items.some((item) => item.product.id === productId);

export default cartSlice.reducer;
