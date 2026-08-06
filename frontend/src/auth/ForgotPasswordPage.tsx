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

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (_data: ForgotFormData) => {
    // TODO 01-05: wire to API POST /auth/forgot-password
    // Always show success (enumeration-safe per TechArch + Screen-02)
    setSubmitted(true);
  };

  return (
    <AuthCard>
      <h2 className="text-heading-lg font-semibold text-text-primary mb-sm">
        Reset your password
      </h2>

      {!submitted ? (
        <>
          <p className="text-body text-text-secondary mb-xl">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg" noValidate>
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

            <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </Button>

            {/* Navigation: /forgot-password → /login (UX-Mockup Navigation Map) */}
            <Link to="/login" className="text-body-sm text-brand-primary hover:underline text-center">
              ← Back to sign in
            </Link>
          </form>
        </>
      ) : (
        // Success state from Screen-02 (enumeration-safe wording)
        <Alert variant="success">
          <p className="font-medium">Check your email</p>
          <p className="mt-1">A reset link is on its way if that email exists in our system.</p>
        </Alert>
      )}
    </AuthCard>
  );
}
