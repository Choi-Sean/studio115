import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#3d3d3d',
          muted: '#767676',
        },
        paper: '#f6f4f0',
        line: '#e4e0d8',
        accent: {
          DEFAULT: '#b1543a',
          soft: '#c9805f',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'serif'],
      },
      maxWidth: { prose: '68ch' },
      letterSpacing: { tightish: '-0.01em' },
    },
  },
  plugins: [],
};

export default config;
