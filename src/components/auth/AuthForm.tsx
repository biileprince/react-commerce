import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthFormProps {
  onSuccess?: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthForm({ onSuccess, defaultTab = 'login' }: AuthFormProps) {
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

      <TabsContent value="login">
        <LoginForm onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm onSuccess={onSuccess} />
      </TabsContent>
    </Tabs>
  );
}
