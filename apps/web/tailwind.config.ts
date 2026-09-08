import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 보통공간-style: near-white ground, near-black ink, hairline rules.
        ink: {
          DEFAULT: '#111111',
          soft: '#4a4a4a',
          muted: '#8a8a8a',
        },
        paper: '#ffffff',
        line: '#e6e6e6',
        accent: '#111111',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
        wide2: '0.24em',
      },
      maxWidth: {
        prose: '64ch',
      },
    },
  },
  plugins: [],
};

export default config;
