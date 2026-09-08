import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">Studio115</p>
          <p className="text-sm text-neutral-400">관리자 로그인</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
