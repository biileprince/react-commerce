import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { mockLogin, mockRegister, selectAuthLoading, clearError } from '@/features/auth/authSlice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  onSuccess?: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthForm({ onSuccess, defaultTab = 'login' }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (values: LoginFormValues) => {
    dispatch(clearError());
    const result = await (dispatch as unknown as (fn: unknown) => Promise<{ success: boolean; error?: string }>)(
      mockLogin(values.email, values.password)
    );
    if (result.success) {
      toast.success('Welcome back! 👋');
      onSuccess?.();
    } else {
      toast.error(result.error ?? 'Login failed');
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    dispatch(clearError());
    const result = await (dispatch as unknown as (fn: unknown) => Promise<{ success: boolean; error?: string }>)(
      mockRegister(values.name, values.email, values.password)
    );
    if (result.success) {
      toast.success('Account created! Welcome aboard');
      onSuccess?.();
    } else {
      toast.error(result.error ?? 'Registration failed');
    }
  };

  const FormField = ({
    label,
    error,
    children,
    hint,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    hint?: string;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </TabsTrigger>
        <TabsTrigger value="register" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Sign Up
        </TabsTrigger>
      </TabsList>

      {/* LOGIN TAB */}
      <TabsContent value="login">
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" noValidate>
          <FormField label="Email Address" error={loginForm.formState.errors.email?.message}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...loginForm.register('email')}
                type="email"
                id="login-email"
                placeholder="you@example.com"
                autoComplete="email"
                className={cn('pl-9', loginForm.formState.errors.email && 'border-destructive')}
              />
            </div>
          </FormField>

          <FormField label="Password" error={loginForm.formState.errors.password?.message}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...loginForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn('pl-9 pr-9', loginForm.formState.errors.password && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          {/* Demo credentials hint */}
          <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Demo credentials:</p>
            <p>Email: <span className="font-mono">kofi@example.com</span></p>
            <p>Password: <span className="font-mono">password123</span></p>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isLoading} size="lg">
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              <><LogIn className="h-4 w-4" /> Sign In</>
            )}
          </Button>
        </form>
      </TabsContent>

      {/* REGISTER TAB */}
      <TabsContent value="register">
        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4" noValidate>
          <FormField label="Full Name" error={registerForm.formState.errors.name?.message}>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...registerForm.register('name')}
                type="text"
                id="register-name"
                placeholder="Kofi Mensah"
                autoComplete="name"
                className={cn('pl-9', registerForm.formState.errors.name && 'border-destructive')}
              />
            </div>
          </FormField>

          <FormField label="Email Address" error={registerForm.formState.errors.email?.message}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...registerForm.register('email')}
                type="email"
                id="register-email"
                placeholder="you@example.com"
                autoComplete="email"
                className={cn('pl-9', registerForm.formState.errors.email && 'border-destructive')}
              />
            </div>
          </FormField>

          <FormField
            label="Password"
            error={registerForm.formState.errors.password?.message}
            hint="Min. 8 chars, one uppercase, one number"
          >
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...registerForm.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                placeholder="••••••••"
                autoComplete="new-password"
                className={cn('pl-9 pr-9', registerForm.formState.errors.password && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password" error={registerForm.formState.errors.confirmPassword?.message}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...registerForm.register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="register-confirm-password"
                placeholder="••••••••"
                autoComplete="new-password"
                className={cn('pl-9 pr-9', registerForm.formState.errors.confirmPassword && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <Button type="submit" className="w-full gap-2" disabled={isLoading} size="lg">
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
            ) : (
              <><UserPlus className="h-4 w-4" /> Create Account</>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </TabsContent>
    </Tabs>
  );
}
