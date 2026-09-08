import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthCard } from './components/AuthCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { Alert } from '../components/ui/Alert';
import { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
import { useAuthStore } from '../store/auth.store';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState('');
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  // Watch password field for strength meter
  const password = watch('password', '');
  React.useEffect(() => setPasswordValue(password), [password]);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message || '';
      setServerError(msg.includes('exists') ? 'An account with this email already exists' : 'Registration failed');
    }
  };

  return (
    <AuthCard>
      <h2 className="text-heading-lg font-semibold text-text-primary mb-xs">
        Create your account
      </h2>
      <p className="text-body text-text-secondary mb-xl">
        Already have one?{' '}
        {/* Navigation: /register → /login (UX-Mockup Navigation Map) */}
        <Link to="/login" className="text-brand-primary hover:underline font-medium">
          Sign in →
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg" noValidate>
        {serverError && <Alert variant="error">{serverError}</Alert>}

        <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            autoFocus
            error={!!errors.fullName}
            {...register('fullName')}
          />
        </FormField>

        <FormField label="Work email address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          helper="Min 8 characters, one uppercase letter"
        >
          <Input
            id="password"
            showPasswordToggle
            autoComplete="new-password"
            error={!!errors.password}
            {...register('password')}
          />
          {/* Password strength meter from Screen-01 */}
          <PasswordStrengthMeter password={passwordValue} />
        </FormField>

        <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="text-caption text-text-tertiary text-center">
          By continuing, you agree to the{' '}
          <a href="#" className="text-brand-primary hover:underline">Terms of Service</a>
          {' '}& {' '}
          <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a>
        </p>
      </form>
    </AuthCard>
  );
}
