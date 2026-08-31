import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AppRouter } from '@/router';
import './index.css';

// Apply initial theme before render to avoid flash
const storedTheme = localStorage.getItem('rc_theme') || 'system';
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark =
  storedTheme === 'dark' || (storedTheme === 'system' && systemDark);
if (isDark) document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <TooltipProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
            }}
          />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
