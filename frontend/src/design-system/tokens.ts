/**
 * Design System Tokens
 * Mirror of tailwind.config.ts theme values.
 * Use these in JS/TS logic where Tailwind class names cannot be used.
 * All values sourced from UX-Mockup 00-overview.md and TechArch §Design System Token Spec.
 */

export const colors = {
  brand: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    primaryActive: '#3730A3',
    primaryLight: '#EEF2FF',
  },
  surface: {
    base: '#FFFFFF',
    page: '#F8FAFC',
    subtle: '#F1F5F9',
    border: '#E2E8F0',
    muted: '#CBD5E1',
  },
  text: {
    primary: '#0F172A',
    secondary: '#334155',
    tertiary: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
  },
  border: {
    default: '#E2E8F0',
    focus: '#4F46E5',
    error: '#DC2626',
    success: '#059669',
  },
  status: {
    draft: { text: '#64748B', bg: '#F1F5F9' },
    submitted: { text: '#2563EB', bg: '#EFF6FF' },
    review: { text: '#D97706', bg: '#FFFBEB' },
    info: { text: '#EA580C', bg: '#FFF7ED' },
    approved: { text: '#059669', bg: '#ECFDF5' },
    rejected: { text: '#DC2626', bg: '#FEF2F2' },
  },
  feedback: {
    error: { text: '#DC2626', bg: '#FEF2F2' },
    warning: { text: '#D97706', bg: '#FFFBEB' },
    success: { text: '#059669', bg: '#ECFDF5' },
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  fontSize: {
    display: '36px',
    headingXl: '28px',
    headingLg: '22px',
    headingMd: '18px',
    headingSm: '15px',
    bodyLg: '16px',
    body: '14px',
    bodySm: '13px',
    label: '13px',
    caption: '12px',
    code: '13px',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  sidebar: '256px',
  header: '64px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
} as const;

export const radii = {
  none: '0',
  sm: '2px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;
