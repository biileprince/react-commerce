import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice';
import authReducer from '@/features/auth/authSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import uiReducer from '@/features/ui/uiSlice';

// Load persisted state from localStorage
function loadState() {
  try {
    const serialized = localStorage.getItem('rc_state');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
}

// Save specific slices to localStorage
function saveState(state: RootState) {
  try {
    const toSave = {
      cart: state.cart,
      auth: state.auth,
      wishlist: state.wishlist,
    };
    localStorage.setItem('rc_state', JSON.stringify(toSave));
  } catch {
    // Ignore write errors
  }
}

const preloadedState = loadState();

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState as any,
});

// Subscribe to store changes and persist
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
