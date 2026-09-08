type Props = { name: string | null; className?: string };

// Minimal line-icon set keyed by the `icon` field on a Service.
const PATHS: Record<string, string> = {
  home: 'M3 10.5 12 4l9 6.5M5 9.5V20h14V9.5',
  store: 'M4 9h16l-1-5H5L4 9Zm0 0v11h16V9M9 20v-6h6v6',
  briefcase: 'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
  ruler: 'M4 14 14 4l6 6L10 20zM8 10l2 2m1-5 2 2m-7 6 2 2',
  sofa: 'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3m-18 0a2 2 0 0 0-2 2v4h22v-4a2 2 0 0 0-2-2m-18 0h18M5 17v2m14-2v2',
};

export function ServiceIcon({ name, className }: Props) {
  const d = (name && PATHS[name]) || PATHS.home;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
