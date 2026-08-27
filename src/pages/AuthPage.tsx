import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { SITE_NAME } from '@/lib/constants';
import { useEffect } from 'react';

export function AuthPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <title>Sign In — {SITE_NAME}</title>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-black text-lg">RC</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to {SITE_NAME}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <AuthForm onSuccess={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
}
