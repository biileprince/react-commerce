import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { registerSchema, type RegisterFormValues } from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mockRegister, selectAuthLoading, clearError } from '@/store/slices/auth/authSlice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Full Name" error={errors.name?.message}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('name')}
            type="text"
            id="register-name"
            placeholder="Kofi Mensah"
            autoComplete="name"
            className={cn('pl-9', errors.name && 'border-destructive')}
          />
        </div>
      </FormField>

      <FormField label="Email Address" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('email')}
            type="email"
            id="register-email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn('pl-9', errors.email && 'border-destructive')}
          />
        </div>
      </FormField>

      <FormField
        label="Password"
        error={errors.password?.message}
        hint="Min. 8 chars, one uppercase, one number"
      >
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            placeholder="••••••••"
            autoComplete="new-password"
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

      <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="register-confirm-password"
            placeholder="••••••••"
            autoComplete="new-password"
            className={cn('pl-9 pr-9', errors.confirmPassword && 'border-destructive')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
  );
}
