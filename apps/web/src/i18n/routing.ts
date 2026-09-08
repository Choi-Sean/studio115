import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  // Korean URLs stay clean ("/projects"); English is prefixed ("/en/projects").
  localePrefix: 'as-needed',
});

export type AppLocale = (typeof routing.locales)[number];
