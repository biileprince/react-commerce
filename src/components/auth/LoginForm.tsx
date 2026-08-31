import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mockLogin, selectAuthLoading, clearError } from '@/store/slices/auth/authSlice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearError());
    const result = await (dispatch as unknown as (fn: unknown) => Promise<{ success: boolean; error?: string }>)(
      mockLogin(values.email, values.password)
    );
    if (result.success) {
      toast.success('Welcome back!');
      onSuccess?.();
    } else {
      toast.error(result.error ?? 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Email Address" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('email')}
            type="email"
            id="login-email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn('pl-9', errors.email && 'border-destructive')}
          />
        </div>
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn('pl-9 pr-9', errors.password && 'border-destructive')}
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
  );
}
