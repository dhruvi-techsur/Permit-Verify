import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [succeeded, setSucceeded] = useState(false);
  const [expiredLink, setExpiredLink] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const { resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: 'onBlur',
  });

  const newPassword = watch('newPassword', '');
  React.useEffect(() => setPasswordValue(newPassword), [newPassword]);

  const onSubmit = async (data: ResetFormData) => {
    if (!token) { setExpiredLink(true); return; }
    try {
      await resetPassword({ token, newPassword: data.newPassword, confirmPassword: data.confirmPassword });
      setSucceeded(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setExpiredLink(true);
    }
  };

  if (!token || expiredLink) {
    // Expired link state from Screen-02b
    return (
      <AuthCard>
        <Alert variant="error">
          <p className="font-medium">This link has expired or already been used.</p>
          <p className="mt-2">
            <Link to="/forgot-password" className="text-feedback-error underline">
              Request a new reset link →
            </Link>
          </p>
        </Alert>
      </AuthCard>
    );
  }

  if (succeeded) {
    return (
      <AuthCard>
        <Alert variant="success">
          <p className="font-medium">Password updated successfully.</p>
          <p className="mt-2">
            <Link to="/login" className="text-feedback-success underline">
              Sign in with your new password →
            </Link>
          </p>
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h2 className="text-heading-lg font-semibold text-text-primary mb-xl">
        Set a new password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg" noValidate>
        <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <Input
            id="newPassword"
            showPasswordToggle
            autoComplete="new-password"
            autoFocus
            error={!!errors.newPassword}
            {...register('newPassword')}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </FormField>

        <FormField
          label="Confirm new password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            showPasswordToggle
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </AuthCard>
  );
}
