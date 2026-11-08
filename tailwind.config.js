/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter Tight',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        background: '#0E0C0A',
        foreground: '#F4EFE6',
        card: '#14100D',
        surface: '#1C1612',
        muted: '#A39686',
        border: '#3A2C1D',
        'border-inner': '#261D14',
        bronze: {
          DEFAULT: '#C88A32',
          light: '#E5B869',
          dark: '#8F5E1A',
        },
        patina: {
          DEFAULT: '#3E6B5C',
          light: '#7CC4AC',
          surface: '#162621',
        },
        coral: {
          DEFAULT: '#A8382B',
          light: '#F29B8E',
          surface: '#2A120F',
        },
      },
      boxShadow: {
        'soft-xl': '0 20px 45px rgba(0, 0, 0, 0.6)',
        plaque:
          'inset 0 0 0 1px #261D14, 0 14px 34px -10px rgba(0, 0, 0, 0.65)',
      },
    },
  },
  plugins: [],
}
