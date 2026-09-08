// The real layout (html/body, providers) lives in app/[locale]/layout.tsx.
// This pass-through exists only so Next has a root layout for the global
// not-found route. See next-intl App Router i18n-routing setup.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
