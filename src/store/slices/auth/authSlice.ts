import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';
import type { RootState } from '@/store/store';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Mock users for simulation
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'user-1',
    name: 'Kofi Mensah',
    email: 'kofi@example.com',
    password: 'password123',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Ama Owusu',
    email: 'ama@example.com',
    password: 'password123',
    role: 'customer',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateUser } =
  authSlice.actions;

// ============================================================
// Mock async thunks (replace these with real API calls later)
// Pattern: export async function loginUser(credentials) {
//   const res = await api.post('/auth/login', credentials);
//   dispatch(loginSuccess(res.data));
// }
// ============================================================
export function mockLogin(email: string, password: string) {
  return async (dispatch: (action: ReturnType<typeof loginStart | typeof loginSuccess | typeof loginFailure>) => void) => {
    dispatch(loginStart());
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      dispatch(
        loginSuccess({
          user,
          token: `mock-jwt-token-${user.id}-${Date.now()}`,
        })
      );
      return { success: true };
    } else {
      dispatch(loginFailure('Invalid email or password.'));
      return { success: false, error: 'Invalid email or password.' };
    }
  };
}

export function mockRegister(name: string, email: string, _password: string) {
  return async (dispatch: (action: ReturnType<typeof loginStart | typeof loginSuccess | typeof loginFailure>) => void) => {
    dispatch(loginStart());
    await new Promise((r) => setTimeout(r, 1000));
    // Check if already exists
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      dispatch(loginFailure('An account with this email already exists.'));
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    dispatch(loginSuccess({ user: newUser, token: `mock-jwt-token-${newUser.id}` }));
    return { success: true };
  };
}

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
