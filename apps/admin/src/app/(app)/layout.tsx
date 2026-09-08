import { AuthGate } from '@/components/auth-gate';
import { Sidebar } from '@/components/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="flex min-h-dvh">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-6 lg:p-8">{children}</main>
      </div>
    </AuthGate>
  );
}
