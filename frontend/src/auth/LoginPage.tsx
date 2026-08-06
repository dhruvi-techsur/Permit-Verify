import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard } from './components/AuthCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { Alert } from '../components/ui/Alert';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Inline validation on blur (UX-Mockup Pattern-03)
  });

  const onSubmit = async (_data: LoginFormData) => {
    setServerError(null);
    // TODO 01-05: wire to useAuthStore().login(data)
    // On 401: setServerError('Email or password is incorrect')
  };

  return (
    <AuthCard>
      <h2 className="text-heading-lg font-semibold text-text-primary mb-xs">
        Sign in to your account
      </h2>
      <p className="text-body text-text-secondary mb-xl">
        New here?{' '}
        {/* Navigation: /login → /register (UX-Mockup Navigation Map) */}
        <Link to="/register" className="text-brand-primary hover:underline font-medium">
          Create an account →
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg" noValidate>
        {serverError && (
          <Alert variant="error">{serverError}</Alert>
        )}

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            showPasswordToggle
            autoComplete="current-password"
            error={!!errors.password}
            {...register('password')}
          />
          {/* Forgot password link — right-aligned per Screen-00 */}
          <div className="flex justify-end -mt-1">
            {/* Navigation: /login → /forgot-password (UX-Mockup Navigation Map) */}
            <Link to="/forgot-password" className="text-body-sm text-brand-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </FormField>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full h-11"
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </AuthCard>
  );
}
