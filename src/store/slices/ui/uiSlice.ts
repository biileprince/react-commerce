import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  mobileMenuOpen: boolean;
  searchQuery: string;
}

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// Initialize theme from localStorage or system preference
const storedTheme = (localStorage.getItem('rc_theme') as 'light' | 'dark' | 'system') || 'system';

const initialState: UiState = {
  theme: storedTheme,
  mobileMenuOpen: false,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.theme = action.payload;
      localStorage.setItem('rc_theme', action.payload);
      // Apply theme to document
      const resolved = action.payload === 'system' ? getSystemTheme() : action.payload;
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setTheme, toggleMobileMenu, closeMobileMenu, setSearchQuery } = uiSlice.actions;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;

export default uiSlice.reducer;
