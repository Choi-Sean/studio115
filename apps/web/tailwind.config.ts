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
        sans: ['var(--font-orbit)', 'var(--font-noto)', 'system-ui', 'sans-serif'],
        // JetBrains Mono has no Hangul either — without a Korean fallback here,
        // any Korean text styled with font-mono (labels, breadcrumbs, nav)
        // skipped straight to the OS default instead of Orbit.
        mono: [
          'var(--font-mono)',
          'var(--font-orbit)',
          'var(--font-noto)',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
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
