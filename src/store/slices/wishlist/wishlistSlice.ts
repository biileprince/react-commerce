import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WishlistState } from '@/types';
import type { RootState } from '@/store/store';

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((id) => id !== action.payload);
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.items.indexOf(action.payload);
      if (idx === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(idx, 1);
      }
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectIsWishlisted = (productId: string) => (state: RootState) =>
  state.wishlist.items.includes(productId);
export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;

export default wishlistSlice.reducer;
