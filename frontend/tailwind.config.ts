import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand / Primary (from UX-Mockup)
        brand: {
          primary: '#4F46E5',       // --color-primary-500 — primary CTAs, active nav
          'primary-hover': '#4338CA', // --color-primary-600 — hover
          'primary-active': '#3730A3', // --color-primary-700 — pressed
          'primary-light': '#EEF2FF', // --color-primary-50 — selected rows, focus fills
        },

        // Surface & Backgrounds (from UX-Mockup)
        surface: {
          base: '#FFFFFF',          // --color-surface-0 — card surfaces, modal backgrounds
          page: '#F8FAFC',          // --color-surface-50 — page background
          subtle: '#F1F5F9',        // --color-surface-100 — sidebar bg, input fills
          border: '#E2E8F0',        // --color-surface-200 — dividers, skeleton base
          muted: '#CBD5E1',         // --color-surface-300 — skeleton shimmer, disabled borders
        },

        // Text (from UX-Mockup)
        text: {
          primary: '#0F172A',       // --color-text-900 — headings, primary body
          secondary: '#334155',     // --color-text-700 — secondary body, labels
          tertiary: '#64748B',      // --color-text-500 — captions, placeholders, timestamps
          disabled: '#94A3B8',      // --color-text-300 — disabled text
          inverse: '#FFFFFF',       // text on dark/primary backgrounds
        },

        // Borders (from UX-Mockup)
        border: {
          default: '#E2E8F0',
          focus: '#4F46E5',
          error: '#DC2626',
          success: '#059669',
        },

        // Status Colors — semantic (from UX-Mockup)
        status: {
          draft: '#64748B',
          'draft-bg': '#F1F5F9',
          submitted: '#2563EB',
          'submitted-bg': '#EFF6FF',
          review: '#D97706',
          'review-bg': '#FFFBEB',
          info: '#EA580C',
          'info-bg': '#FFF7ED',
          approved: '#059669',
          'approved-bg': '#ECFDF5',
          rejected: '#DC2626',
          'rejected-bg': '#FEF2F2',
        },

        // Feedback (from TechArch token spec)
        feedback: {
          error: '#DC2626',
          warning: '#D97706',
          success: '#059669',
          'error-bg': '#FEF2F2',
          'warning-bg': '#FFFBEB',
          'success-bg': '#ECFDF5',
        },
      },

      // Typography (from UX-Mockup)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      fontSize: {
        // Display: 36px/40px/700/-0.02em
        'display': ['36px', { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.02em' }],
        // H1: 28px/34px/700/-0.01em
        'heading-xl': ['28px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '-0.01em' }],
        // H2: 22px/28px/600/-0.01em
        'heading-lg': ['22px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' }],
        // H3: 18px/24px/600
        'heading-md': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        // H4: 15px/20px/600
        'heading-sm': ['15px', { lineHeight: '20px', fontWeight: '600' }],
        // Body-lg: 16px/24px/400
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        // Body: 14px/20px/400
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        // Body-sm: 13px/18px/400
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        // Label: 13px/16px/500/0.01em
        'label': ['13px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.01em' }],
        // Caption: 12px/16px/400
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        // Code: 13px/18px/mono
        'code': ['13px', { lineHeight: '18px' }],
      },

      // Spacing — 4px base unit (from TechArch + UX-Mockup)
      // Tailwind's default already uses 4px base; extend with named aliases
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        'sidebar': '256px',
        'header': '64px',
      },

      // Box Shadow (from UX-Mockup)
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
      },

      // Border Radius (from UX-Mockup)
      borderRadius: {
        'none': '0',
        'sm': '2px',      // form inputs, tight elements
        'md': '6px',      // buttons, badges
        'lg': '8px',      // cards, panels
        'xl': '12px',     // modals, drawers
        'full': '9999px', // avatar, pill badge
      },

      // Max-width
      maxWidth: {
        'content': '1280px',
      },

      // Transition timing
      transitionTimingFunction: {
        'smooth': 'ease-in-out',
      },
      transitionDuration: {
        'hover': '150ms',
        'active': '75ms',
      },

      // Animation for skeleton screens
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
